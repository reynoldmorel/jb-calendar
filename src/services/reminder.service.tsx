import { Dispatch } from "redux";
import moment from "moment";

import { IReminder } from "../entties/reminder.entity";
import {
    setReminder, setReminders, setRemindersForDate,
    setRemindersForDateYearAndMonth, setRemindersGroupedByDate, resetReminderFlags, setReminderCreatedFlag, setReminderUpdatedFlag, setReminderDeletedFlag
} from "../redux/reminder/actions.redux";
import { DateUtil } from "../utils/date.util";
import { WeatherService } from "./weather.service";

type ReminderGroup = { [key: string]: IReminder[] };
type CityWeather = { [key: string]: string }

export class ReminderService {

    static setReminder(reminder: IReminder) {
        return (dispatch: Dispatch) => {
            dispatch(setReminder(reminder));
        }
    }

    static resetReminderFlags() {
        return (dispatch: Dispatch) => {
            dispatch(resetReminderFlags());
        }
    }

    static getAllRemindersByDate(date: Date, remindersGroupedByDate: ReminderGroup) {
        return (dispatch: Dispatch) => {
            const dateStr = moment(date).format(process.env.REACT_APP_DATE_FORMAT);
            const remindersForDate = remindersGroupedByDate[dateStr];

            dispatch(setRemindersForDate(remindersForDate));
        }
    }

    static getAllRemindersByYearAndMonthWithWeather(date: Date, remindersGroupedByDate: ReminderGroup) {
        return async (dispatch: Dispatch) => {
            const dateStr = moment(date).format(process.env.REACT_APP_DATE_YEAR_MONTH_FORMAT);
            const remindersForDateYearAndMonth = await ReminderService.populateWeather(remindersGroupedByDate[dateStr]);

            dispatch(setRemindersForDateYearAndMonth(remindersForDateYearAndMonth));
        }
    }

    static create(reminder: IReminder, reminders: IReminder[], remindersGroupedByDate: ReminderGroup) {
        return (dispatch: Dispatch) => {
            const dateKeys = DateUtil.generateReminderDateKeys(reminder);

            if (dateKeys.length > 0) {
                reminder = { ...reminder, dateKeys: dateKeys };

                const newReminders = [reminder].concat(reminders);
                const newRemindersGroupedByDate = ReminderService.groupReminder(reminder, remindersGroupedByDate);

                dispatch(setReminderCreatedFlag(true));
                dispatch(setReminders(newReminders));
                dispatch(setRemindersGroupedByDate(newRemindersGroupedByDate));
            }
            dispatch(setReminderCreatedFlag(false));
        }
    }

    static update(reminder: IReminder, reminders: IReminder[], remindersGroupedByDate: ReminderGroup) {
        return (dispatch: Dispatch) => {
            const oldReminder = reminders.find(r => r.id === reminder.id);
            const dateKeys = DateUtil.generateReminderDateKeys(reminder);
            let newReminders: IReminder[] = Object.assign([], reminders);
            let newRemindersGroupedByDate: ReminderGroup = Object.assign({}, remindersGroupedByDate);

            if (oldReminder && oldReminder.dateKeys && dateKeys.length > 0) {
                newReminders = reminders.filter(r => r.id !== reminder.id);
                newRemindersGroupedByDate = ReminderService.removeGroupReminder(oldReminder, remindersGroupedByDate);

                reminder = { ...reminder, dateKeys: dateKeys };
                newReminders = [reminder].concat(newReminders);
                newRemindersGroupedByDate = ReminderService.groupReminder(reminder, remindersGroupedByDate);

                dispatch(setReminderUpdatedFlag(true));
                dispatch(setReminders(newReminders));
                dispatch(setRemindersGroupedByDate(newRemindersGroupedByDate));
            }
            dispatch(setReminderUpdatedFlag(false));
        }
    }

    static deleteById(reminders: IReminder[], remindersGroupedByDate: ReminderGroup, id?: number) {
        return (dispatch: Dispatch) => {
            const reminder = reminders.find(r => r.id === id);

            if (reminder) {
                const dateKeys = DateUtil.generateReminderDateKeys(reminder);

                if (dateKeys.length > 0) {
                    const newReminders = reminders.filter(r => r.id !== id);
                    const newRemindersGroupedByDate = ReminderService.removeGroupReminder(reminder, remindersGroupedByDate);

                    dispatch(setReminderDeletedFlag(true));
                    dispatch(setReminders(newReminders));
                    dispatch(setRemindersGroupedByDate(newRemindersGroupedByDate));
                }
            }

            dispatch(setReminderDeletedFlag(false));
        }
    }

    private static async populateWeather(reminders: IReminder[]): Promise<IReminder[]> {
        let result: IReminder[] = [];
        const cityWeatherMap: CityWeather = {};

        for (let i = 0; i < reminders.length; i++) {
            const reminder = reminders[i];

            if (reminder.city) {
                let weather = cityWeatherMap[reminder.city];

                if (!weather) {
                    const { data } = await WeatherService.getWeatherInfoByCity(reminder.city);
                    weather = data.weather.description;
                }

                result.push({ ...reminder, weather });
            } else {
                result.push({ ...reminder });
            }
        }

        return result;
    }

    private static groupReminder(reminder: IReminder, remindersGroupedByDate: ReminderGroup) {
        if (reminder.dateKeys) {
            for (let i = 0; i < reminder.dateKeys.length; i++) {
                const dateKey = reminder.dateKeys[i];
                remindersGroupedByDate = ReminderService.putReminder(reminder, dateKey, remindersGroupedByDate);
            }
        }

        return remindersGroupedByDate;
    }

    private static putReminder(reminder: IReminder, dateKey: string, remindersGroupedByDate: ReminderGroup): ReminderGroup {
        return {
            ...remindersGroupedByDate,
            [dateKey]: [reminder].concat(remindersGroupedByDate[dateKey] || [])
        };
    }

    private static removeGroupReminder(reminder: IReminder, remindersGroupedByDate: ReminderGroup) {
        if (reminder.dateKeys) {
            for (let i = 0; i < reminder.dateKeys.length; i++) {
                const dateKey = reminder.dateKeys[i];
                remindersGroupedByDate = ReminderService.removeReminder(reminder, dateKey, remindersGroupedByDate);
            }
        }

        return remindersGroupedByDate;
    }

    private static removeReminder(reminder: IReminder, dateKey: string, remindersGroupedByDate: ReminderGroup): ReminderGroup {
        return {
            ...remindersGroupedByDate,
            [dateKey]: remindersGroupedByDate[dateKey].filter(r => r.id !== reminder.id)
        };
    }
}