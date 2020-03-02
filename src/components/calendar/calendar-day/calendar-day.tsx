import React, { PureComponent } from "react";

import { ICalendarDayProps, CalendarDayDefaultProps } from "./calendar-day-props";
import { ICalendarItem } from "../calendar-item";

export class CalendarDay extends PureComponent<ICalendarDayProps> {
    static defaultProps = CalendarDayDefaultProps;

    onClickDay = () => {
        if (this.props.onClickDay) {
            const { date, items } = this.props;

            this.props.onClickDay(date.getFullYear(), date.getMonth(), date.getDate(), items);
        }
    };

    render() {
        const { date, selected, disabled } = this.props;
        const weekendDay = date.getDay() === 0 || date.getDay() === 6;

        return (
            <div
                className={`day-col${disabled ? " disabled-day" : ""}${selected ? " current-day" : ""}${weekendDay ? " weekend-day" : ""}`}
                onClick={this.onClickDay}
            >
                <p
                    style={{
                        padding: "2px 7px",
                        margin: "0"
                    }}
                >
                    {date.getDate()}
                </p>
                {this.props.items.map(this.calendarDayMapper)}
            </div>
        );
    }

    calendarDayMapper = (calendarItem: ICalendarItem) => {
        return (
            <div
                key={`col-${calendarItem.fromDateTimeStr}${calendarItem.toDateTimeStr}`}
                style={{
                    backgroundColor: calendarItem.bkgColor || "#6c757d"
                }}
            >
                <p
                    style={{
                        color: calendarItem.fontColor || "#ffffff",
                        padding: "0px 5px",
                        textAlign: "center",
                        margin: "5px 0px"
                    }}
                >
                    {calendarItem.displayText}
                </p>
            </div>
        );
    }
}