import { Dispatch } from "redux";
import moment from "moment";

import { IReminder } from "../entties/reminder.entity";
import {
    setReminder, setReminders, setRemindersForDate,
    setRemindersForDateYearAndMonth, setRemindersGroupedByDate, resetReminderFlags,
    setReminderCreatedFlag, setReminderUpdatedFlag, setReminderDeletedFlag
} from "../redux/reminder/actions.redux";
import { ReminderUtil } from "../utils/reminder.util";

type ReminderGroup = { [key: string]: IReminder[] };

export class ReminderService {

    static setReminder(reminder: IReminder) {
        return (dispatch: Dispatch) => {
            dispatch(setReminder(reminder));
        }
    }

    static setRemindersForDate(remindersForDate: IReminder[]) {
        return (dispatch: Dispatch) => {
            dispatch(setRemindersForDate(remindersForDate));
        }
    }


    static resetReminderFlags() {
        return (dispatch: Dispatch) => {
            dispatch(resetReminderFlags());
        }
    }

    static getAllRemindersByYearAndMonthWithWeather(date: Date, remindersGroupedByDate: ReminderGroup) {
        return async (dispatch: Dispatch) => {
            const dateStr = moment(date).format(process.env.REACT_APP_DATE_YEAR_MONTH_FORMAT);
            const remindersForDateYearAndMonth = await ReminderUtil.populateWeather(remindersGroupedByDate[dateStr]);

            dispatch(setRemindersForDateYearAndMonth(remindersForDateYearAndMonth));
        }
    }

    static create(reminder: IReminder, reminders: IReminder[], remindersGroupedByDate: ReminderGroup) {
        return (dispatch: Dispatch) => {
            const dateKeys = ReminderUtil.generateReminderDateKeys(reminder);

            if (dateKeys.length > 0) {
                const id = new Date().getTime();
                reminder = { ...reminder, id, dateKeys };

                const newReminders = [reminder].concat(reminders);
                const newRemindersGroupedByDate = ReminderUtil.groupReminder(reminder, remindersGroupedByDate);

                dispatch(setReminderCreatedFlag(true));
                dispatch(setReminders(newReminders));
                dispatch(setRemindersGroupedByDate(newRemindersGroupedByDate));
            } else {
                dispatch(setReminderCreatedFlag(false));
            }
        }
    }

    static update(reminder: IReminder, reminders: IReminder[], remindersGroupedByDate: ReminderGroup) {
        return (dispatch: Dispatch) => {
            const oldReminder = reminders.find(r => r.id === reminder.id);
            const dateKeys = ReminderUtil.generateReminderDateKeys(reminder);
            let newReminders: IReminder[] = Object.assign([], reminders);
            let newRemindersGroupedByDate: ReminderGroup = Object.assign({}, remindersGroupedByDate);

            if (oldReminder && oldReminder.dateKeys && dateKeys.length > 0) {
                newReminders = reminders.filter(r => r.id !== reminder.id);
                newRemindersGroupedByDate = ReminderUtil.removeGroupReminder(oldReminder, remindersGroupedByDate);

                reminder = { ...reminder, dateKeys };
                newReminders = [reminder].concat(newReminders);
                newRemindersGroupedByDate = ReminderUtil.groupReminder(reminder, newRemindersGroupedByDate);

                dispatch(setReminderUpdatedFlag(true));
                dispatch(setReminders(newReminders));
                dispatch(setRemindersGroupedByDate(newRemindersGroupedByDate));
            } else {
                dispatch(setReminderUpdatedFlag(false));
            }
        }
    }

    static deleteById(reminders: IReminder[], remindersGroupedByDate: ReminderGroup, id?: number) {
        return (dispatch: Dispatch) => {
            const reminder = reminders.find(r => r.id === id);

            if (reminder) {
                const dateKeys = ReminderUtil.generateReminderDateKeys(reminder);

                if (dateKeys.length > 0) {
                    const newReminders = reminders.filter(r => r.id !== id);
                    const newRemindersGroupedByDate = ReminderUtil.removeGroupReminder(reminder, remindersGroupedByDate);

                    dispatch(setReminderDeletedFlag(true));
                    dispatch(setReminders(newReminders));
                    dispatch(setRemindersGroupedByDate(newRemindersGroupedByDate));
                } else {
                    dispatch(setReminderDeletedFlag(false));
                }
            } else {
                dispatch(setReminderDeletedFlag(false));
            }
        }
    }
}