import { IReminderStore } from "../../redux/reminder/store.redux";
import { DateUtil } from "../../utils/date.util";
import moment from "moment";

export const validateForm = (reminderStore: IReminderStore): boolean =>
    validateTitle(reminderStore) && validateDescription(reminderStore)
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

export const validateDateTime = (reminderStore: IReminderStore): boolean => {
    const { reminder } = reminderStore;
    const { fromInMillis, toInMillis } = DateUtil.getReminderFromAndToAsMillis(reminder);
    return fromInMillis < toInMillis;
}

export const validateDateTimeOverlap = (reminderStore: IReminderStore): boolean => {
    const { reminder, reminders } = reminderStore;

    const firstElement =
        reminders
            .find(DateUtil.reminderDateRangeInReminderFilter(reminder));

    return !firstElement;
}

export const validateRecurrenceForAYear = (reminderStore: IReminderStore): boolean => {
    const { reminder } = reminderStore;

    if (reminder.recurrentForAYear) {
        const { fromAsDate, toAsDate } = DateUtil.getReminderFromAndToAsDate(reminder);
        return moment(toAsDate).diff(fromAsDate, "months") === 0;
    }

    return true;
}