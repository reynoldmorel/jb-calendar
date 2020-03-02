import { IReminderStore } from "../../../redux/reminder/store.redux";
import moment from "moment";
import { ReminderUtil } from "../../../utils/reminder.util";

export const validateForm = (reminderStore: IReminderStore): boolean =>
    validateTitle(reminderStore) && validateDescription(reminderStore) && validateCity(reminderStore)
    && validateDateTime(reminderStore) && validateDateTimeOverlap(reminderStore)
    && validateRecurrenceForAYear(reminderStore);

export const validateTitle = (reminderStore: IReminderStore): boolean => {
    const { reminder } = reminderStore;
    return !!reminder.title
        && reminder.title.length >= Number(process.env.REACT_APP_REMINDER_TITLE_MIN_LENGTH)
        && reminder.title.length <= Number(process.env.REACT_APP_REMINDER_TITLE_MAX_LENGTH);
}

export const validateDescription = (reminderStore: IReminderStore): boolean => {
    const { reminder } = reminderStore;
    return !reminder.description
        || reminder.description.length <= Number(process.env.REACT_APP_REMINDER_DESCRIPTION_MAX_LENGTH);
}

export const validateCity = (reminderStore: IReminderStore): boolean => {
    const { reminder } = reminderStore;
    return !reminder.city
        || reminder.city.length <= Number(process.env.REACT_APP_REMINDER_CITY_MAX_LENGTH);
}

export const validateDateTime = (reminderStore: IReminderStore): boolean => {
    const { reminder } = reminderStore;
    const { fromInMillis, toInMillis } = ReminderUtil.getReminderFromAndToAsMillis(reminder);
    return fromInMillis < toInMillis;
}

export const validateDateTimeOverlap = (reminderStore: IReminderStore): boolean => {
    const { reminder, reminders } = reminderStore;

    const firstElement =
        reminders
            .find(ReminderUtil.reminderDateRangeInReminderFilter(reminder));

    return !firstElement;
}

export const validateRecurrenceForAYear = (reminderStore: IReminderStore): boolean => {
    const { reminder } = reminderStore;

    if (reminder.recurrenceForAYear) {
        const { fromAsDate, toAsDate } = ReminderUtil.getReminderFromAndToAsDate(reminder);
        const monsthsDiff = moment(toAsDate).diff(fromAsDate, "months");
        return monsthsDiff === 0;
    }

    return true;
}