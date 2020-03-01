import {
    ISetReminderAction, ISetRemindersAction, ISetRemindersForDateAction,
    ISetValidationFlagAction, IResetReminderFlagsAction,
    ISetRemindersForDateYearAndMonthAction,
    ISetRemindersGroupedByDateAction
} from "./actions.redux";
import { IReminderStore, ReminderStoreInitialState } from "./store.redux";
import { ActionTypes } from "./action-types.redux";

type ReminderActions = ISetReminderAction | ISetRemindersAction | ISetRemindersForDateAction |
    ISetRemindersForDateYearAndMonthAction | ISetRemindersGroupedByDateAction |
    ISetValidationFlagAction | IResetReminderFlagsAction;

export default function (state: IReminderStore = ReminderStoreInitialState, action: ReminderActions): IReminderStore {
    switch (action.type) {
        case ActionTypes.SET_REMINDER:
            return {
                ...state,
                reminder: action.payload
            };
        case ActionTypes.SET_REMINDERS:
            return {
                ...state,
                reminders: action.payload
            };
        case ActionTypes.SET_REMINDERS_FOR_DATE:
            return {
                ...state,
                remindersForDate: action.payload
            };
        case ActionTypes.SET_REMINDERS_FOR_DATE_YEAR_AND_MONTH:
            return {
                ...state,
                remindersForDateYearAndMonth: action.payload
            };
        case ActionTypes.SET_REMINDERS_GROUPED_BY_DATE:
            return {
                ...state,
                remindersGroupedByDate: action.payload
            };
        case ActionTypes.SET_REMINDER_CREATED_FLAG:
            return {
                ...state,
                createdSuccessful: action.payload
            };
        case ActionTypes.SET_REMINDER_UPDATED_FLAG:
            return {
                ...state,
                updatedSuccessful: action.payload
            };
        case ActionTypes.SET_REMINDER_DELETED_FLAG:
            return {
                ...state,
                deletedSuccessful: action.payload
            };
        case ActionTypes.RESET_REMINDER_FLAGS:
            return {
                ...state,
                createdSuccessful: undefined,
                updatedSuccessful: undefined,
                deletedSuccessful: undefined,
            };
        default:
            return state;
    }
}