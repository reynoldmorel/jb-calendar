import { ICalendarItem } from "../calendar-item";

export interface ICalendarDayProps {
    items: ICalendarItem[];
    date: Date;
    disabled: boolean;
    selected: boolean;
    onClickDay?: (year: number, month: number, day: number, dataItems: ICalendarItem[]) => void;
}


export const CalendarDayDefaultProps = {
    items: [],
    disabled: false,
    selected: false
};