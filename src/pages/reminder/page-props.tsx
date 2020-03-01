import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";

import { IReminderStore } from "../../redux/reminder/store.redux";
import {
    validateForm,
    validateTitle,
    validateDescription,
    validateDateTime,
    validateDateTimeOverlap,
    validateRecurrenceForAYear
} from "./page-validations";

export interface IReminderPageProps { }

export const MapStateToProps = (reminderStore: IReminderStore) => (
    {
        ...reminderStore,
        formValid: validateForm(reminderStore),
        titleValid: validateTitle(reminderStore),
        descriptionValid: validateDescription(reminderStore),
        dateTimeValid: validateDateTime(reminderStore),
        dateTimeOverlapValid: validateDateTimeOverlap(reminderStore),
        recurrenceForAYearValid: validateRecurrenceForAYear(reminderStore)
    }
);

export const MapDispatchToProps = (dispatch: ThunkDispatch<IReminderStore, void, Action>) => ({});