import { ICalendarItem } from "../calendar-item";

export interface ICalendarDayProps {
    items: ICalendarItem[];
    date: Date;
    onClickDay?: (year: number, month: number, day: number, dataItems: ICalendarItem[]) => void;
}