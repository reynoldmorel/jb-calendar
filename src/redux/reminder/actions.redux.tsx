import { ActionTypes } from "./action-types.redux";
import { IReminder } from "../../entties/reminder.entity";

type ReminderValidationFlagActions = ActionTypes.SET_REMINDER_CREATED_FLAG |
    ActionTypes.SET_REMINDER_UPDATED_FLAG | ActionTypes.SET_REMINDER_DELETED_FLAG |
    ActionTypes.SET_REMINDER_TITLE_VALIDATION_FLAG | ActionTypes.SET_REMINDER_DATE_TIME_VALIDATION_FLAG |
    ActionTypes.SET_REMINDER_DATE_TIME_OVERLAP_VALIDATION_FLAG | ActionTypes.SET_REMINDER_CITY_VALIDATION_FLAG;

export interface ISetReminderAction {
    type: ActionTypes.SET_REMINDER;
    payload: IReminder;
}

export interface ISetRemindersAction {
    type: ActionTypes.SET_REMINDERS;
    payload: IReminder[];
}

export interface ISetRemindersForDateAction {
    type: ActionTypes.SET_REMINDERS_FOR_DATE;
    payload: IReminder[];
}

export interface ISetValidationFlagAction {
    type: ReminderValidationFlagActions;
    payload: boolean;
}

export interface IResetReminderFlagsAction {
    type: ActionTypes.RESET_REMINDER_FLAGS
}

export const setReminder = (reminder: IReminder): ISetReminderAction => (
    {
        type: ActionTypes.SET_REMINDER,
        payload: reminder
    }
);

export const setReminders = (reminders: IReminder[]): ISetRemindersAction => (
    {
        type: ActionTypes.SET_REMINDERS,
        payload: reminders
    }
);

export const setRemindersForDate = (remindersForDate: IReminder[]): ISetRemindersForDateAction => (
    {
        type: ActionTypes.SET_REMINDERS_FOR_DATE,
        payload: remindersForDate
    }
);

export const setReminderCreatedFlag = (createdSuccessful: boolean): ISetValidationFlagAction => (
    {
        type: ActionTypes.SET_REMINDER_CREATED_FLAG,
        payload: createdSuccessful
    }
);

export const setReminderUpdatedFlag = (updatedSuccessful: boolean): ISetValidationFlagAction => (
    {
        type: ActionTypes.SET_REMINDER_UPDATED_FLAG,
        payload: updatedSuccessful
    }
);

export const setReminderDeletedFlag = (deletedSuccessful: boolean): ISetValidationFlagAction => (
    {
        type: ActionTypes.SET_REMINDER_DELETED_FLAG,
        payload: deletedSuccessful
    }
);

export const setReminderTitleValidationFlag = (titleValidationSuccessful: boolean): ISetValidationFlagAction => (
    {
        type: ActionTypes.SET_REMINDER_DATE_TIME_VALIDATION_FLAG,
        payload: titleValidationSuccessful
    }
);

export const setReminderDateTimeValidationFlag = (dateTimeValidationSuccessful: boolean): ISetValidationFlagAction => (
    {
        type: ActionTypes.SET_REMINDER_DATE_TIME_VALIDATION_FLAG,
        payload: dateTimeValidationSuccessful
    }
);

export const setReminderDateTimeOverlapValidationFlag = (dateTimeOverlapValidationSuccessful: boolean): ISetValidationFlagAction => (
    {
        type: ActionTypes.SET_REMINDER_DATE_TIME_OVERLAP_VALIDATION_FLAG,
        payload: dateTimeOverlapValidationSuccessful
    }
);

export const setReminderCityValidationFlag = (cityValidationSuccessful: boolean): ISetValidationFlagAction => (
    {
        type: ActionTypes.SET_REMINDER_CITY_VALIDATION_FLAG,
        payload: cityValidationSuccessful
    }
);

export const resetReminderFlags = (): IResetReminderFlagsAction => (
    {
        type: ActionTypes.RESET_REMINDER_FLAGS
    }
);