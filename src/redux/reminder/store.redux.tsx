import { IReminder } from "../../entties/reminder.entity";
import moment from "moment";

type ReminderGroup = { [key: string]: IReminder[] };

export interface IReminderStore {
    reminder: IReminder;
    reminders: IReminder[];
    remindersForDate: IReminder[];
    remindersForDateYearAndMonth: IReminder[];
    remindersGroupedByDate: ReminderGroup;
    createdSuccessful?: boolean;
    updatedSuccessful?: boolean;
    deletedSuccessful?: boolean;
}

export const ReminderStoreInitialState: IReminderStore = {
    reminder: {
        title: "",
        fromDateStr: moment().format(process.env.REACT_APP_DATE_FORMAT),
        toDateStr: moment().format(process.env.REACT_APP_DATE_FORMAT),
        fromTimeStr: process.env.REACT_APP_INPUT_DEFAULT_TIME_FROM,
        toTimeStr: process.env.REACT_APP_INPUT_DEFAULT_TIME_TO,
        city: "",
        color: "",
        recurrenceForAYear: false
    },
    reminders: [],
    remindersForDate: [],
    remindersForDateYearAndMonth: [],
    remindersGroupedByDate: {}
};