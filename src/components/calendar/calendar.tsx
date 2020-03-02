import React, { PureComponent } from "react";
import { Row, Col, FormGroup, Button } from "reactstrap";
import moment from "moment";

import { ICalendarProps, CalendarDefaultProps } from "./calendar-props";
import { ICalendarItem } from "./calendar-item";
import { CalendarUtil } from "../../utils/calendar.util";
import { CalendarDay } from "./calendar-day";

type CalendarItemGroup = { [key: string]: ICalendarItem[] };

export class Calendar extends PureComponent<ICalendarProps> {

    static defaultProps = CalendarDefaultProps;

    private calendarItemsGroupedByDate: CalendarItemGroup = {};

    componentWillUpdate(nextProps: ICalendarProps) {
        const { dateFormat, timeFormat, dateAndTimeSeparator, items } = nextProps;
        const dateTimeFormat = `${dateFormat}${dateAndTimeSeparator}${timeFormat}`
        this.calendarItemsGroupedByDate = CalendarUtil.groupCalendarItems(items, dateTimeFormat);
    }

    prevYear = () => {
        if (this.props.onDateChange) {
            const momentDate = moment(this.props.date).subtract(1, "years");
            this.props.onDateChange(momentDate.get("year"), momentDate.get("month"), momentDate.get("date"));
        }
    }

    nextYear = () => {
        if (this.props.onDateChange) {
            const momentDate = moment(this.props.date).add(1, "years");
            this.props.onDateChange(momentDate.get("year"), momentDate.get("month"), momentDate.get("date"));
        }
    }

    prevMonth = () => {
        if (this.props.onDateChange) {
            const momentDate = moment(this.props.date).subtract(1, "months");
            this.props.onDateChange(momentDate.get("year"), momentDate.get("month"), momentDate.get("date"));
        }
    }

    nextMonth = () => {
        if (this.props.onDateChange) {
            const momentDate = moment(this.props.date).add(1, "months");
            this.props.onDateChange(momentDate.get("year"), momentDate.get("month"), momentDate.get("date"));
        }
    }

    render() {
        return (
            <div>
                <Row className="m-5">
                    <Col md="12">
                        <FormGroup className="d-flex justify-content-between m-0 mb-1">
                            <Button
                                id="btnPrevYear"
                                title="Previous Year"
                                onClick={this.prevYear}
                            >
                                {"<"}
                            </Button>
                            <span>
                                <strong>{this.props.date.getFullYear()}</strong>
                            </span>
                            <Button
                                id="btnNextYear"
                                title="Next Year"
                                onClick={this.nextYear}
                            >
                                {">"}
                            </Button>
                        </FormGroup>
                        <FormGroup className="d-flex justify-content-between m-0 mb-1">
                            <Button
                                id="btnPrevMonth"
                                title="Previous Month"
                                onClick={this.prevMonth}
                            >
                                {"<"}
                            </Button>
                            <span>
                                <strong>{moment(this.props.date).format("MMMM")}</strong>
                            </span>
                            <Button
                                id="btnNextMonth"
                                title="Next Month"
                                onClick={this.nextMonth}
                            >
                                {">"}
                            </Button>
                        </FormGroup>
                    </Col>
                </Row>
                <Row className="m-5">
                    <Col md="12">
                        {this.renderCalendarDays()}
                    </Col>
                </Row>
            </div>
        );
    }

    renderCalendarDays = () => {
        const { date } = this.props;
        const lastDay = moment(this.props.date).endOf("month").get("date");
        const year = date.getFullYear();
        const month = date.getMonth();
        let momentDate = moment([year, month, 1]);
        let result: React.ReactNode[] = [];
        let daysCol: React.ReactNode[] = [];

        for (let i = 1; i <= lastDay; i++) {
            momentDate = moment([year, month, i]);
            const calendarDay = this.buildCalendarDay(momentDate);
            daysCol = daysCol.concat([calendarDay]);

            if (i % 7 === 0) {
                const row = this.buildCalendarRow(momentDate.toDate(), daysCol);
                result = result.concat([row]);
                daysCol = [];
            }
        }

        const row = this.buildCalendarRow(momentDate.toDate(), daysCol);
        result = result.concat([row]);

        return result;
    }

    buildCalendarRow = (date: Date, daysCol: React.ReactNode[]) => {
        return (
            <Row key={`cdr-${date.toISOString()}`}>
                {daysCol}
            </Row>
        );
    }

    buildCalendarDay = (momentDate: moment.Moment) => {
        const { dateFormat, onClickDay } = this.props;

        const formattedMomentDate = momentDate.format(dateFormat);
        const items = this.calendarItemsGroupedByDate[formattedMomentDate] || [];

        return (
            <CalendarDay
                key={`cd-${formattedMomentDate}`}
                date={momentDate.toDate()}
                items={items}
                onClickDay={onClickDay}
            />
        );
    }
}