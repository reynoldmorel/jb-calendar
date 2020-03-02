import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";

import { IReminderStore, Store } from "../../../redux/reminder/store.redux";
import {
    validateTitle,
    validateDescription,
    validateDateTime,
    validateDateTimeOverlap,
    validateRecurrenceForAYear,
    validateCity
} from "./form-validations";
import { IReminder } from "../../../entties/reminder.entity";
import { ReminderService } from "../../../services/reminder.service";

export interface IReminderFormProps {
    reminder: IReminder;
    titleValid?: boolean;
    descriptionValid?: boolean;
    cityValid?: boolean;
    dateTimeValid?: boolean;
    dateTimeOverlapValid?: boolean;
    recurrenceForAYearValid?: boolean;
    setReminder: (reminder: IReminder) => void;
    setFirstInput?: (input: HTMLInputElement) => void;
}

export const MapStateToProps = ({ reminderStore }: Store) => (
    {
        ...reminderStore,
        titleValid: validateTitle(reminderStore),
        descriptionValid: validateDescription(reminderStore),
        cityValid: validateCity(reminderStore),
        dateTimeValid: validateDateTime(reminderStore),
        dateTimeOverlapValid: validateDateTimeOverlap(reminderStore),
        recurrenceForAYearValid: validateRecurrenceForAYear(reminderStore)
    }
);

export const MapDispatchToProps = (dispatch: ThunkDispatch<IReminderStore, void, Action>) => ({
    setReminder: (reminder: IReminder) => dispatch(ReminderService.setReminder(reminder))
});