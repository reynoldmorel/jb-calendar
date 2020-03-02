import { ICalendarItem } from "./calendar-item";

export interface ICalendarProps {
    dateFormat: string;
    timeFormat: string;
    dateAndTimeSeparator: string;
    date: Date;
    items: ICalendarItem[];
    onDateChange?: (year: number, month: number, day: number) => void;
    onClickDay?: (year: number, month: number, day: number, dataItems: ICalendarItem[]) => void;
}

export const CalendarDefaultProps: ICalendarProps = {
    dateFormat: "YYYY-MM-DD",
    timeFormat: "HH:mm",
    dateAndTimeSeparator: " ",
    date: new Date(),
    items: []
};