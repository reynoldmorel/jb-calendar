import { IReminder } from "../entties";
import moment from "moment";

export class DateUtil {

    static generateReminderDateKeys(reminder: IReminder): string[] {
        let { fromAsDate, toAsDate } = DateUtil.getReminderFromAndToAsDate(reminder);
        const { recurrenceForAYear } = reminder;

        if (recurrenceForAYear) {
            let result: string[] = [];
            const currentMonth = fromAsDate.getMonth();
            const currentYear = fromAsDate.getFullYear();

            for (let month = currentMonth; month < 12; month++) {
                const fromDate = moment([currentYear, month, fromAsDate.getDate()]);
                const toDate = moment([currentYear, month, toAsDate.getDate()]);

                if (fromDate.get("months") === month) {
                    if (toDate.get("months") === month) {
                        result = result.concat(DateUtil.generateDateKeysFromDateRange(fromDate.toDate(), toDate.toDate()));
                    } else {
                        result = result.concat(DateUtil.generateDateKeysFromDateRange(fromDate.toDate(), fromDate.endOf("month").toDate()));
                    }
                }
            }

            return result;
        } else {
            return DateUtil.generateDateKeysFromDateRange(fromAsDate, toAsDate);
        }
    }

    static generateDateKeysFromDateRange(from: Date, to: Date): string[] {
        let result: { [keys: string]: string } = {};
        let date = moment(from);
        let totalDays = moment(to).diff(from, "days");

        for (let i = 0; i <= totalDays; i++) {
            const dateKey = date.format(process.env.REACT_APP_DATE_FORMAT);
            const dateKeyParts = dateKey.split("-");
            const dateYearMonthKey = `${dateKeyParts[0]}-${dateKeyParts[1]}`;
            result = { ...result, [dateKey]: dateKey, [dateYearMonthKey]: dateYearMonthKey };
            date = date.add(1, "days")
        }

        return Object.keys(result);
    }

    static reminderDateRangeInReminderFilter(reminderToCheck: IReminder): (reminder: IReminder) => boolean {
        const dateObjectInMillis = DateUtil.getReminderFromAndToAsMillis(reminderToCheck);
        const fromInMillisToCheck = dateObjectInMillis.fromInMillis;
        const toInMillisToCheck = dateObjectInMillis.toInMillis;

        return (reminder: IReminder) => {
            const { fromInMillis, toInMillis } = DateUtil.getReminderFromAndToAsMillis(reminder);

            return reminder.id === reminderToCheck.id
                || DateUtil.dateInReminder(fromInMillisToCheck, reminder)
                || DateUtil.dateInReminder(toInMillisToCheck, reminder)
                || DateUtil.dateInReminder(fromInMillis, reminderToCheck)
                || DateUtil.dateInReminder(toInMillis, reminderToCheck)
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
        const dateTimeFormat = `${process.env.REACT_APP_DATE_FORMAT} ${process.env.REACT_APP_TIME_FORMAT}`;

        const fromAsDate = moment(`${fromDateStr} ${fromTimeStr}`, dateTimeFormat)
            .toDate();

        const toAsDate = moment(`${toDateStr} ${toTimeStr}`, dateTimeFormat)
            .toDate();

        return { fromAsDate, toAsDate };
    }
}