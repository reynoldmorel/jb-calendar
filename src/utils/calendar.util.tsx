import { ICalendarItem } from "../components/calendar";
import { DateUtil } from "./date.util";

type CalendarItemGroup = { [key: string]: ICalendarItem[] };

export class CalendarUtil {
    static generateCalendarItemDateKeys(calendarItem: ICalendarItem, dateTimeFormat: string): string[] {
        let { fromAsDate, toAsDate } = CalendarUtil.getCalendarItemFromAndToAsDate(calendarItem, dateTimeFormat);
        const { recurrenceForAYear } = calendarItem;

        return DateUtil.generateDateKeys(fromAsDate, toAsDate, recurrenceForAYear);
    }

    static getCalendarItemFromAndToAsDate(calendarItem: ICalendarItem, dateTimeFormat: string) {
        return DateUtil.getFromAndToAsDate(calendarItem.fromDateTimeStr, calendarItem.toDateTimeStr, dateTimeFormat);
    }

    static groupCalendarItems(calendarItems: ICalendarItem[], dateTimeFormat: string): CalendarItemGroup {
        let calendarItemsGroupedByDate = {};

        for (let i = 0; i < calendarItems.length; i++) {
            let calendarItem = calendarItems[i];
            const dateKeys = CalendarUtil.generateCalendarItemDateKeys(calendarItem, dateTimeFormat);

            calendarItem = { ...calendarItem, dateKeys };
            calendarItemsGroupedByDate = CalendarUtil.groupCalendarItem(calendarItem, calendarItemsGroupedByDate);
        }

        return calendarItemsGroupedByDate;
    }

    static groupCalendarItem(calendarItem: ICalendarItem, calendarItemsGroupedByDate: CalendarItemGroup): CalendarItemGroup {
        if (calendarItem.dateKeys) {
            for (let i = 0; i < calendarItem.dateKeys.length; i++) {
                const dateKey = calendarItem.dateKeys[i];
                calendarItemsGroupedByDate = CalendarUtil.putCalendarItem(calendarItem, dateKey, calendarItemsGroupedByDate);
            }
        }

        return calendarItemsGroupedByDate;
    }

    static putCalendarItem(calendarItem: ICalendarItem, dateKey: string, calendarItemsGroupedByDate: CalendarItemGroup): CalendarItemGroup {
        return {
            ...calendarItemsGroupedByDate,
            [dateKey]: [calendarItem].concat(calendarItemsGroupedByDate[dateKey] || [])
        };
    }
}