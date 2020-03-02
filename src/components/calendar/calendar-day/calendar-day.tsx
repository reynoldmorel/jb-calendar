import React, { PureComponent } from "react";
import { Col, Row } from "reactstrap";

import { ICalendarDayProps } from "./calendar-day-props";
import { ICalendarItem } from "../calendar-item";

export class CalendarDay extends PureComponent<ICalendarDayProps> {
    onClickDay = () => {
        if (this.props.onClickDay) {
            const { date, items } = this.props;

            this.props.onClickDay(date.getFullYear(), date.getMonth(), date.getDate(), items);
        }
    };

    render() {
        const { date } = this.props;

        return (
            <Col
                md="1"
                onClick={this.onClickDay}
            >
                <span>{date.getDate()}</span>
                {this.props.items.map(this.calendarDayMapper)}
            </Col>
        );
    }

    calendarDayMapper = (calendarItem: ICalendarItem) => {
        return (
            <Row
                key={`col-${calendarItem.fromDateTimeStr}${calendarItem.toDateTimeStr}`}
                style={{
                    backgroundColor: calendarItem.bkgColor || "#6c757d"
                }}
            >
                <Col md="12">
                    <span
                        style={{
                            color: calendarItem.fontColor || "#ffffff"
                        }}
                    >
                        {calendarItem.displayText}
                    </span>
                </Col>
            </Row>
        );
    }
}