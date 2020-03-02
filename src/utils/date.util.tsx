import moment from "moment";

export class DateUtil {
    static generateDateKeys(fromAsDate: Date, toAsDate: Date, recurrenceForAYear: boolean = false): string[] {
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

    static dateBetween(dateInMillis: number, fromInMillis: number, toInMillis: number): boolean {
        return fromInMillis <= dateInMillis && toInMillis >= dateInMillis
    }

    static getFromAndToAsDate(fromDateTimeStr: string, toDateTimeStr: string, dateTimeFormat: string) {
        const fromAsDate = moment(fromDateTimeStr, dateTimeFormat)
            .toDate();

        const toAsDate = moment(toDateTimeStr, dateTimeFormat)
            .toDate();

        return { fromAsDate, toAsDate };
    }
}