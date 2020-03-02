import React, { Component } from "react";
import { FormGroup, Button } from "reactstrap";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";

import "./calendar.css";

import { ICalendarProps, CalendarDefaultProps } from "./calendar-props";
import { ICalendarItem } from "./calendar-item";
import { CalendarUtil } from "../../utils/calendar.util";
import { CalendarDay } from "./calendar-day";

type CalendarItemGroup = { [key: string]: ICalendarItem[] };

export class Calendar extends Component<ICalendarProps> {

    static defaultProps = CalendarDefaultProps;

    private calendarItemsGroupedByDate: CalendarItemGroup = {};

    shouldComponentUpdate(nextProps: ICalendarProps) {
        const { dateFormat, timeFormat, dateAndTimeSeparator, items } = nextProps;
        const dateTimeFormat = `${dateFormat}${dateAndTimeSeparator}${timeFormat}`
        this.calendarItemsGroupedByDate = CalendarUtil.groupCalendarItems(items, dateTimeFormat);

        return true;
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
            <div className="jb-calendar">
                <div>
                    <FormGroup className="d-flex justify-content-between m-0 year-band">
                        <Button
                            id="btnPrevYear"
                            title="Previous Year"
                            className="btn-arrows"
                            onClick={this.prevYear}
                        >
                            <FontAwesomeIcon icon={faAngleLeft} />
                        </Button>
                        <span>
                            <strong>{this.props.date.getFullYear()}</strong>
                        </span>
                        <Button
                            id="btnNextYear"
                            title="Next Year"
                            className="btn-arrows"
                            onClick={this.nextYear}
                        >
                            <FontAwesomeIcon icon={faAngleRight} />
                        </Button>
                    </FormGroup>
                    <FormGroup className="d-flex justify-content-between m-0 month-band">
                        <Button
                            id="btnPrevMonth"
                            title="Previous Month"
                            className="btn-arrows"
                            onClick={this.prevMonth}
                        >
                            <FontAwesomeIcon icon={faAngleLeft} />
                        </Button>
                        <span>
                            <strong>{moment(this.props.date).format("MMMM")}</strong>
                        </span>
                        <Button
                            id="btnNextMonth"
                            title="Next Month"
                            className="btn-arrows"
                            onClick={this.nextMonth}
                        >
                            <FontAwesomeIcon icon={faAngleRight} />
                        </Button>
                    </FormGroup>
                </div>
                <div>
                    <div className="days-name-col-container">
                        <div className="days-name-col">
                            Sunday
                        </div>
                        <div className="days-name-col">
                            Monday
                        </div>
                        <div className="days-name-col">
                            Tuesday
                        </div>
                        <div className="days-name-col">
                            Wednesday
                        </div>
                        <div className="days-name-col">
                            Thursday
                        </div>
                        <div className="days-name-col">
                            Friday
                        </div>
                        <div className="days-name-col">
                            Saturday
                        </div>
                    </div>
                    {this.renderCalendarDays()}
                </div>
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

        const momentFirstDay = momentDate.startOf("month");
        const firstDay = momentFirstDay.get("day");
        let momentDateToComplete = momentFirstDay.subtract(firstDay, "days");

        for (let i = firstDay; i > 0; i--) {
            console.log(momentDateToComplete.toDate().toISOString())
            const calendarDay = this.buildEmptyCalendarDay(momentDateToComplete);
            daysCol = daysCol.concat([calendarDay]);
            momentDateToComplete = momentDateToComplete.add(1, "days");
        }

        for (let i = 1; i <= lastDay; i++) {
            momentDate = moment([year, month, i]);
            const calendarDay = this.buildCalendarDay(momentDate);
            daysCol = daysCol.concat([calendarDay]);

            if (daysCol.length === 7) {
                const row = this.buildCalendarRow(momentDate.toDate(), daysCol);
                result = result.concat([row]);
                daysCol = [];
            }
        }

        if (daysCol.length > 0) {
            const row = this.buildCalendarRow(momentDate.toDate(), daysCol);
            result = result.concat([row]);
        }

        return result;
    }

    buildCalendarRow = (date: Date, daysCol: React.ReactNode[]) => {
        return (
            <div
                key={`cdr-${date.toISOString()}`}
                className="day-col-container"
            >
                {daysCol}
            </div>
        );
    }

    buildCalendarDay = (momentDate: moment.Moment) => {
        const { date, dateFormat, onClickDay } = this.props;

        const formattedMomentDate = momentDate.format(dateFormat);
        const items = this.calendarItemsGroupedByDate[formattedMomentDate] || [];

        return (
            <CalendarDay
                key={`cd-${formattedMomentDate}`}
                date={momentDate.toDate()}
                items={items}
                onClickDay={onClickDay}
                selected={formattedMomentDate === moment(date).format(dateFormat)}
            />
        );
    }

    buildEmptyCalendarDay = (momentDate: moment.Moment) => {
        const { dateFormat, onClickDay } = this.props;

        const formattedMomentDate = momentDate.format(dateFormat);
        return (
            <CalendarDay
                key={`cd-${formattedMomentDate}`}
                date={momentDate.toDate()}
                onClickDay={onClickDay}
                disabled
            />
        );
    }
}