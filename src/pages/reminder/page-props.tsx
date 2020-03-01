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
import { IReminder } from "../../entties/reminder.entity";
import { ReminderService } from "../../services/reminder.service";

type ReminderGroup = { [key: string]: IReminder[] };

export interface IReminderPageProps {
    reminder: IReminder;
    reminders: IReminder[];
    remindersForDate: IReminder[];
    remindersForDateYearAndMonth: IReminder[];
    remindersGroupedByDate: ReminderGroup;
    createdSuccessful?: boolean;
    updatedSuccessful?: boolean;
    deletedSuccessful?: boolean;
    formValid?: boolean;
    titleValid?: boolean;
    descriptionValid?: boolean;
    dateTimeValid?: boolean;
    dateTimeOverlapValid?: boolean;
    recurrenceForAYearValid?: boolean;
    setReminder: (reminder: IReminder) => void;
    getAllRemindersByDate: (date: Date, remindersGroupedByDate: ReminderGroup) => void;
    getAllRemindersByYearAndMonthWithWeather: (date: Date, remindersGroupedByDate: ReminderGroup) => void;
    create: (reminder: IReminder, reminders: IReminder[], remindersGroupedByDate: ReminderGroup) => void;
    update: (reminder: IReminder, reminders: IReminder[], remindersGroupedByDate: ReminderGroup) => void;
    deleteById: (reminders: IReminder[], remindersGroupedByDate: ReminderGroup, id?: number) => void;
}

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

export const MapDispatchToProps = (dispatch: ThunkDispatch<IReminderStore, void, Action>) => ({
    setReminder: (reminder: IReminder) => dispatch(ReminderService.setReminder(reminder)),
    getAllRemindersByDate: (date: Date, remindersGroupedByDate: ReminderGroup) => dispatch(ReminderService.getAllRemindersByDate(date, remindersGroupedByDate)),
    getAllRemindersByYearAndMonthWithWeather: (date: Date, remindersGroupedByDate: ReminderGroup) => dispatch(ReminderService.getAllRemindersByYearAndMonthWithWeather(date, remindersGroupedByDate)),
    create: (reminder: IReminder, reminders: IReminder[], remindersGroupedByDate: ReminderGroup) => dispatch(ReminderService.create(reminder, reminders, remindersGroupedByDate)),
    update: (reminder: IReminder, reminders: IReminder[], remindersGroupedByDate: ReminderGroup) => dispatch(ReminderService.update(reminder, reminders, remindersGroupedByDate)),
    deleteById: (reminders: IReminder[], remindersGroupedByDate: ReminderGroup, id?: number) => dispatch(ReminderService.deleteById(reminders, remindersGroupedByDate, id))
});