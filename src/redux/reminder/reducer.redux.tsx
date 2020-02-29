import {
    ISetReminderAction, ISetRemindersAction, ISetRemindersForDateAction,
    ISetValidationFlagAction, IResetReminderFlagsAction
} from "./actions.redux";
import { IReminderStore, ReminderStoreInitialState } from "./store.redux";
import { ActionTypes } from "./action-types.redux";

type ReminderActions = ISetReminderAction | ISetRemindersAction | ISetRemindersForDateAction |
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
        case ActionTypes.SET_REMINDER_TITLE_VALIDATION_FLAG:
            return {
                ...state,
                titleValidationSuccessful: action.payload
            };
        case ActionTypes.SET_REMINDER_DATE_TIME_VALIDATION_FLAG:
            return {
                ...state,
                dateTimeValidationSuccessful: action.payload
            };
        case ActionTypes.SET_REMINDER_DATE_TIME_OVERLAP_VALIDATION_FLAG:
            return {
                ...state,
                dateTimeOverlapValidationSuccessful: action.payload
            };
        case ActionTypes.SET_REMINDER_CITY_VALIDATION_FLAG:
            return {
                ...state,
                cityValidationSuccessful: action.payload
            };
        case ActionTypes.RESET_REMINDER_FLAGS:
            return {
                ...state,
                createdSuccessful: undefined,
                updatedSuccessful: undefined,
                deletedSuccessful: undefined,
                titleValidationSuccessful: undefined,
                dateTimeValidationSuccessful: undefined,
                dateTimeOverlapValidationSuccessful: undefined,
                cityValidationSuccessful: undefined
            };
        default:
            return state;
    }
}