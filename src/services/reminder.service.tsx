import { Dispatch } from "redux";
import moment from "moment";

import { IReminder } from "../entties/reminder.entity";
import {
    setReminder, setReminders, setRemindersForDate,
    setRemindersForDateYearAndMonth, setRemindersGroupedByDate, resetReminderFlags
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
            const newReminders = [reminder].concat(reminders);
            const dateKeys = DateUtil.generateReminderDateKeys(reminder);
            const newRemindersGroupedByDate = ReminderService.groupReminder(reminder, dateKeys, remindersGroupedByDate);

            dispatch(setReminders(newReminders));
            dispatch(setRemindersGroupedByDate(newRemindersGroupedByDate));
        }
    }

    static update(reminder: IReminder, reminders: IReminder[], remindersGroupedByDate: ReminderGroup) {
        return (dispatch: Dispatch) => {
            const oldReminder = reminders.find(r => r.id === reminder.id);
            let newReminders: IReminder[] = Object.assign([], reminders);
            let newRemindersGroupedByDate: ReminderGroup = Object.assign({}, remindersGroupedByDate);

            if (oldReminder) {
                newReminders = reminders.filter(r => r.id !== reminder.id);
                const oldDateKeys = DateUtil.generateReminderDateKeys(oldReminder);
                newRemindersGroupedByDate = ReminderService.removeGroupReminder(reminder, oldDateKeys, remindersGroupedByDate);
            }

            newReminders = [reminder].concat(newReminders);
            const dateKeys = DateUtil.generateReminderDateKeys(reminder);
            newRemindersGroupedByDate = ReminderService.groupReminder(reminder, dateKeys, remindersGroupedByDate);

            dispatch(setReminders(newReminders));
            dispatch(setRemindersGroupedByDate(newRemindersGroupedByDate));
        }
    }

    static deleteById(reminders: IReminder[], remindersGroupedByDate: ReminderGroup, id?: number) {
        return (dispatch: Dispatch) => {
            const reminder = reminders.find(r => r.id === id);

            if (reminder) {
                const newReminders = reminders.filter(r => r.id !== id);
                const dateKeys = DateUtil.generateReminderDateKeys(reminder);
                const newRemindersGroupedByDate = ReminderService.removeGroupReminder(reminder, dateKeys, remindersGroupedByDate);

                dispatch(setReminders(newReminders));
                dispatch(setRemindersGroupedByDate(newRemindersGroupedByDate));
            }
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

    private static groupReminder(reminder: IReminder, dateKeys: string[], remindersGroupedByDate: ReminderGroup) {
        for (let i = 0; i < dateKeys.length; i++) {
            const dateKey = dateKeys[i];
            remindersGroupedByDate = ReminderService.putReminder(reminder, dateKey, remindersGroupedByDate);
        }

        return remindersGroupedByDate;
    }

    private static putReminder(reminder: IReminder, dateKey: string, remindersGroupedByDate: ReminderGroup): ReminderGroup {
        return {
            ...remindersGroupedByDate,
            [dateKey]: [reminder].concat(remindersGroupedByDate[dateKey] || [])
        };
    }

    private static removeGroupReminder(reminder: IReminder, dateKeys: string[], remindersGroupedByDate: ReminderGroup) {
        for (let i = 0; i < dateKeys.length; i++) {
            const dateKey = dateKeys[i];
            remindersGroupedByDate = ReminderService.removeReminder(reminder, dateKey, remindersGroupedByDate);
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