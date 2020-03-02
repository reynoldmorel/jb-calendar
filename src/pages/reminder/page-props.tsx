import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";
import { RouteComponentProps } from "react-router-dom";

import { IReminderStore } from "../../redux/reminder/store.redux";
import { validateForm } from "./form/form-validations";
import { IReminder } from "../../entties/reminder.entity";
import { ReminderService } from "../../services/reminder.service";
import { ICalendarItem } from "../../components/calendar";
import { ReminderUtil } from "../../utils/reminder.util";

type ReminderGroup = { [key: string]: IReminder[] };
type Store = { reminderStore: IReminderStore };

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
    deleteById: (reminders: IReminder[], remindersGroupedByDate: ReminderGroup, id?: number) => void;
}

export const MapStateToProps = ({ reminderStore }: Store) => (
    {
        ...reminderStore,
        calendarItems: reminderStore.remindersForDateYearAndMonth.map(ReminderUtil.calendarItemMapper),
        formValid: validateForm(reminderStore)
    }
);

export const MapDispatchToProps = (dispatch: ThunkDispatch<IReminderStore, void, Action>) => ({
    setReminder: (reminder: IReminder) => dispatch(ReminderService.setReminder(reminder)),
    resetReminderFlags: () => dispatch(ReminderService.resetReminderFlags()),
    setRemindersForDate: (remindersForDate: IReminder[]) => dispatch(ReminderService.setRemindersForDate(remindersForDate)),
    getAllRemindersByYearAndMonthWithWeather: (date: Date, remindersGroupedByDate: ReminderGroup) => dispatch(ReminderService.getAllRemindersByYearAndMonthWithWeather(date, remindersGroupedByDate)),
    create: (reminder: IReminder, reminders: IReminder[], remindersGroupedByDate: ReminderGroup) => dispatch(ReminderService.create(reminder, reminders, remindersGroupedByDate)),
    update: (reminder: IReminder, reminders: IReminder[], remindersGroupedByDate: ReminderGroup) => dispatch(ReminderService.update(reminder, reminders, remindersGroupedByDate)),
    deleteById: (reminders: IReminder[], remindersGroupedByDate: ReminderGroup, id?: number) => dispatch(ReminderService.deleteById(reminders, remindersGroupedByDate, id))
});