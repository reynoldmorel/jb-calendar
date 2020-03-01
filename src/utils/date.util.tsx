import { IReminder } from "../entties";
import moment from "moment";

export class DateUtil {

    static generateReminderDateKeys(reminder: IReminder): string[] {
        let { fromAsDate, toAsDate } = DateUtil.getReminderFromAndToAsDate(reminder);
        const { recurrentForAYear } = reminder;

        if (recurrentForAYear) {
            let result: string[] = [];
            let currentYear = fromAsDate.getFullYear();
            const nextYear = currentYear + 1;

            while (currentYear < nextYear) {
                result = result.concat(DateUtil.generateDateKeysFromDateRange(fromAsDate, toAsDate));
                fromAsDate = moment(fromAsDate).add(1, 'months').toDate();
                toAsDate = moment(toAsDate).add(1, 'months').toDate();
                currentYear = fromAsDate.getFullYear();
            }

            return result;
        } else {
            return DateUtil.generateDateKeysFromDateRange(fromAsDate, toAsDate);
        }
    }

    static generateDateKeysFromDateRange(from: Date, to: Date): string[] {
        let result: string[] = [];
        let date = moment(from);
        let totalDays = date.diff(to, 'days');

        for (let i = 0; i < totalDays; i++) {
            const dateKey = date.format(process.env.REACT_APP_DATE_FORMAT);
            const dateKeyParts = dateKey.split("-");
            const dateYearMonthKey = `${dateKeyParts[0]}-${dateKeyParts[1]}`;
            result = [dateKey, dateYearMonthKey].concat(result);
            date = date.add(1, 'days');
        }

        return result;
    }

    static reminderDateRangeInReminderFilter(reminderToCheck: IReminder): (reminder: IReminder) => boolean {
        const { fromInMillis, toInMillis } = DateUtil.getReminderFromAndToAsMillis(reminderToCheck);
        return (reminder: IReminder) => {
            return reminder.id !== reminderToCheck.id
                && DateUtil.dateInReminder(fromInMillis, reminder)
                && DateUtil.dateInReminder(toInMillis, reminder)
        };
    }

    static dateInReminder(dateInMillis?: number, reminder?: IReminder): boolean {
        if (dateInMillis !== undefined && reminder) {
            const { fromInMillis, toInMillis } =
                DateUtil.getReminderFromAndToAsMillis(reminder);

            return DateUtil.dateBetween(
                dateInMillis,
                fromInMillis,
                toInMillis
            )
        }

        return false;
    }

    static dateBetween(dateInMillis: number, fromInMillis: number, toInMillis: number): boolean {
        return fromInMillis <= dateInMillis && toInMillis >= dateInMillis
    }

    static getReminderFromAndToAsMillis(reminder: IReminder) {
        const dateObject = DateUtil.getReminderFromAndToAsDate(reminder);

        return {
            fromInMillis: dateObject.fromAsDate.getTime(),
            toInMillis: dateObject.toAsDate.getTime()
        };
    }

    static getReminderFromAndToAsDate(reminder: IReminder) {
        const { fromDateStr, toDateStr, fromTimeStr, toTimeStr } = reminder;
        const dateTimeFormat = `${process.env.REACT_APP_INPUT_DATE_FORMAT} ${process.env.REACT_APP_INPUT_TIME_FORMAT}`;

        const fromAsDate = moment(`${fromDateStr} ${fromTimeStr}`, dateTimeFormat)
            .toDate();

        const toAsDate = moment(`${toDateStr} ${toTimeStr}`, dateTimeFormat)
            .toDate();

        return { fromAsDate, toAsDate };
    }
}