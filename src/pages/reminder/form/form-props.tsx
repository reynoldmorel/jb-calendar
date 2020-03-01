import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";

import { IReminderStore } from "../../../redux/reminder/store.redux";
import {
    validateTitle,
    validateDescription,
    validateDateTime,
    validateDateTimeOverlap,
    validateRecurrenceForAYear
} from "./form-validations";
import { IReminder } from "../../../entties/reminder.entity";
import { ReminderService } from "../../../services/reminder.service";

type Store = { reminderStore: IReminderStore };

export interface IReminderFormProps {
    reminder: IReminder;
    titleValid?: boolean;
    descriptionValid?: boolean;
    dateTimeValid?: boolean;
    dateTimeOverlapValid?: boolean;
    recurrenceForAYearValid?: boolean;
    setReminder: (reminder: IReminder) => void;
}

export const MapStateToProps = ({ reminderStore }: Store) => (
    {
        ...reminderStore,
        titleValid: validateTitle(reminderStore),
        descriptionValid: validateDescription(reminderStore),
        dateTimeValid: validateDateTime(reminderStore),
        dateTimeOverlapValid: validateDateTimeOverlap(reminderStore),
        recurrenceForAYearValid: validateRecurrenceForAYear(reminderStore)
    }
);

export const MapDispatchToProps = (dispatch: ThunkDispatch<IReminderStore, void, Action>) => ({
    setReminder: (reminder: IReminder) => dispatch(ReminderService.setReminder(reminder))
});