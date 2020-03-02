export interface ICalendarItem {
    displayText: string;
    fromDateTimeStr: string;
    toDateTimeStr: string;
    bkgColor?: string;
    fontColor?: string;
    recurrenceForAYear?: boolean;
    dateKeys?: string[];
    data: any;
}

export type CalendarItemGroup = { [key: string]: ICalendarItem[] };