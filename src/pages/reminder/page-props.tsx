import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";
import { RouteComponentProps } from "react-router-dom";

import { IReminderStore, Store } from "../../redux/reminder/store.redux";
import { validateForm } from "./form/form-validations";
import { IReminder, ReminderGroup } from "../../entties/reminder.entity";
import { ReminderService } from "../../services/reminder.service";
import { ICalendarItem } from "../../components/calendar";
import { ReminderUtil } from "../../utils/reminder.util";

export interface IReminderPageProps extends RouteComponentProps<{}> {
    reminder: IReminder;
    reminders: IReminder[];
    remindersForDate: IReminder[];
    remindersForDateYearAndMonth: IReminder[];
    remindersGroupedByDate: ReminderGroup;
    createdSuccessful?: boolean;
    updatedSuccessful?: boolean;
    deletedSuccessful?: boolean;
    formValid?: boolean;
    calendarItems: ICalendarItem[];
    setReminder: (reminder: IReminder) => void;
    resetReminderFlags: () => void;
    setRemindersForDate: (remindersForDate: IReminder[]) => void;
    getAllRemindersByYearAndMonthWithWeather: (date: Date, remindersGroupedByDate: ReminderGroup) => void;
    create: (reminder: IReminder, reminders: IReminder[], remindersGroupedByDate: ReminderGroup) => void;
    update: (reminder: IReminder, reminders: IReminder[], remindersGroupedByDate: ReminderGroup) => void;
    deleteById: (id: number, reminders: IReminder[], remindersGroupedByDate: ReminderGroup) => void;
    deleteAll: (ids: number[], reminders: IReminder[], remindersGroupedByDate: ReminderGroup) => void;
}

export const MapStateToProps = ({ reminderStore }: Store) => (
    {
        ...reminderStore,
        formValid: validateForm(reminderStore),
        calendarItems: reminderStore.remindersForDateYearAndMonth.map(ReminderUtil.calendarItemMapper),
    }
);

export const MapDispatchToProps = (dispatch: ThunkDispatch<IReminderStore, void, Action>) => ({
    setReminder: (reminder: IReminder) => dispatch(ReminderService.setReminder(reminder)),
    resetReminderFlags: () => dispatch(ReminderService.resetReminderFlags()),
    setRemindersForDate: (remindersForDate: IReminder[]) => dispatch(ReminderService.setRemindersForDate(remindersForDate)),
    getAllRemindersByYearAndMonthWithWeather: (date: Date, remindersGroupedByDate: ReminderGroup) => dispatch(ReminderService.getAllRemindersByYearAndMonthWithWeather(date, remindersGroupedByDate)),
    create: (reminder: IReminder, reminders: IReminder[], remindersGroupedByDate: ReminderGroup) => dispatch(ReminderService.create(reminder, reminders, remindersGroupedByDate)),
    update: (reminder: IReminder, reminders: IReminder[], remindersGroupedByDate: ReminderGroup) => dispatch(ReminderService.update(reminder, reminders, remindersGroupedByDate)),
    deleteById: (id: number, reminders: IReminder[], remindersGroupedByDate: ReminderGroup) => dispatch(ReminderService.deleteById(id, reminders, remindersGroupedByDate)),
    deleteAll: (ids: number[], reminders: IReminder[], remindersGroupedByDate: ReminderGroup) => dispatch(ReminderService.deleteAll(ids, reminders, remindersGroupedByDate))
});