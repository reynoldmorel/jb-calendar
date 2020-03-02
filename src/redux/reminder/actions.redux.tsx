import { ActionTypes } from "./action-types.redux";
import { IReminder, ReminderGroup } from "../../entties/reminder.entity";

type ReminderValidationFlagActions = ActionTypes.SET_REMINDER_CREATED_FLAG |
    ActionTypes.SET_REMINDER_UPDATED_FLAG | ActionTypes.SET_REMINDER_DELETED_FLAG;

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

export interface ISetRemindersForDateYearAndMonthAction {
    type: ActionTypes.SET_REMINDERS_FOR_DATE_YEAR_AND_MONTH;
    payload: IReminder[];
}

export interface ISetRemindersGroupedByDateAction {
    type: ActionTypes.SET_REMINDERS_GROUPED_BY_DATE;
    payload: ReminderGroup;
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

export const setRemindersForDateYearAndMonth = (remindersForDateYearAndMonth: IReminder[]): ISetRemindersForDateYearAndMonthAction => (
    {
        type: ActionTypes.SET_REMINDERS_FOR_DATE_YEAR_AND_MONTH,
        payload: remindersForDateYearAndMonth
    }
);

export const setRemindersGroupedByDate = (remindersGroupedByDate: ReminderGroup): ISetRemindersGroupedByDateAction => (
    {
        type: ActionTypes.SET_REMINDERS_GROUPED_BY_DATE,
        payload: remindersGroupedByDate
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

export const resetReminderFlags = (): IResetReminderFlagsAction => (
    {
        type: ActionTypes.RESET_REMINDER_FLAGS
    }
);