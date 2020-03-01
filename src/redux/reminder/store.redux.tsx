import { IReminder } from "../../entties/reminder.entity";

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
        fromTimeStr: process.env.REACT_APP_INPUT_DEFAULT_TIME_FROM,
        toTimeStr: process.env.REACT_APP_INPUT_DEFAULT_TIME_TO,
        city: "",
        color: ""
    },
    reminders: [],
    remindersForDate: [],
    remindersForDateYearAndMonth: [],
    remindersGroupedByDate: {}
};