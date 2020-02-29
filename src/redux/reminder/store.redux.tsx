import { IReminder } from "../../entties/reminder.entity";

export interface IReminderStore {
    reminder: IReminder;
    reminders: IReminder[];
    remindersForDate: IReminder[];
    createdSuccessful?: boolean;
    updatedSuccessful?: boolean;
    deletedSuccessful?: boolean;
    titleValidationSuccessful?: boolean;
    dateTimeValidationSuccessful?: boolean;
    dateTimeOverlapValidationSuccessful?: boolean;
    cityValidationSuccessful?: boolean;
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
    remindersForDate: []
};