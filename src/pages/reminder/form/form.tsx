import React, { PureComponent, ChangeEvent } from "react";
import { connect } from "react-redux";
import { ColorResult, ChromePicker } from 'react-color';

import { IReminderFormProps, MapStateToProps, MapDispatchToProps } from "./form-props";
import { Row, Col, FormGroup, Label, Input, Alert, Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { ReminderFormInitialState, IReminderFormState } from "./form-state";

class ReminderForm extends PureComponent<IReminderFormProps, IReminderFormState> {

    constructor(props: IReminderFormProps) {
        super(props);

        this.state = ReminderFormInitialState;
    }

    toggleColorPickerModal = () => {
        this.setState({ showColorPickerModal: !this.state.showColorPickerModal })
    }

    handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value;
        this.props.setReminder({ ...this.props.reminder, title });
    };

    handleDescriptionChange = (e: ChangeEvent<HTMLInputElement>) => {
        const description = e.target.value;
        this.props.setReminder({ ...this.props.reminder, description });
    };

    handleCityChange = (e: ChangeEvent<HTMLInputElement>) => {
        const city = e.target.value;
        this.props.setReminder({ ...this.props.reminder, city });
    };

    handleFromDateChange = (e: ChangeEvent<HTMLInputElement>) => {
        const fromDateStr = e.target.value;
        this.props.setReminder({ ...this.props.reminder, fromDateStr });
    };

    handleFromTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
        const fromTimeStr = e.target.value;
        this.props.setReminder({ ...this.props.reminder, fromTimeStr });
    };

    handleToDateChange = (e: ChangeEvent<HTMLInputElement>) => {
        const toDateStr = e.target.value;
        this.props.setReminder({ ...this.props.reminder, toDateStr });
    };

    handleToTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
        const toTimeStr = e.target.value;
        this.props.setReminder({ ...this.props.reminder, toTimeStr });
    };

    handleRecurrenceForAYearChange = (e: ChangeEvent<HTMLInputElement>) => {
        const recurrenceForAYear = e.target.checked;
        this.props.setReminder({ ...this.props.reminder, recurrenceForAYear });
    };

    handleColorChange = (handler: ColorResult) => {
        const color = handler.hex;
        this.props.setReminder({ ...this.props.reminder, color });
    };

    setFirstInputRef = (input?: HTMLInputElement | null) => {
        if (input && this.props.setFirstInput) {
            this.props.setFirstInput(input);
        }
    }

    render() {
        return (
            <div>
                <Row>
                    <Col xs="12">
                        <FormGroup>
                            <Label for="txtTitle">
                                <strong>Title</strong>
                            </Label>
                            <Input
                                id="txtTitle"
                                autoFocus
                                onChange={this.handleTitleChange}
                                value={this.props.reminder.title}
                                maxLength={Number(process.env.REACT_APP_REMINDER_TITLE_MAX_LENGTH)}
                                innerRef={(input) => this.setFirstInputRef(input)}
                            />
                            {this.renderTitleErrorMessage()}
                        </FormGroup>
                        <FormGroup>
                            <Label for="txtDescription">
                                Description
                            </Label>
                            <Input
                                id="txtDescription"
                                onChange={this.handleDescriptionChange}
                                value={this.props.reminder.description}
                                maxLength={Number(process.env.REACT_APP_REMINDER_DESCRIPTION_MAX_LENGTH)}
                                type="textarea"
                            />
                            {this.renderDescriptionErrorMessage()}
                        </FormGroup>
                        <FormGroup>
                            <Label for="txtCity">
                                City
                            </Label>
                            <Input
                                id="txtCity"
                                onChange={this.handleCityChange}
                                value={this.props.reminder.city}
                                maxLength={Number(process.env.REACT_APP_REMINDER_CITY_MAX_LENGTH)}
                            />
                            {this.renderCityErrorMessage()}
                        </FormGroup>
                        <FormGroup className="mt-2 mb-2">
                            <Label for="txtToTime">
                                Pick a color
                            </Label>
                            <Button
                                className="m-2"
                                onClick={this.toggleColorPickerModal}
                                style={{
                                    backgroundColor: this.props.reminder.color,
                                    color: this.props.reminder.color
                                }}
                            >
                                Color
                            </Button>
                        </FormGroup>
                        <FormGroup>
                            <Label for="txtFromDate">
                                <strong>From Date</strong>
                            </Label>
                            <Input
                                id="txtFromDate"
                                onChange={this.handleFromDateChange}
                                value={this.props.reminder.fromDateStr}
                                type="date"
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="txtFromTime">
                                <strong>From Time</strong>
                            </Label>
                            <Input
                                id="txtFromTime"
                                onChange={this.handleFromTimeChange}
                                value={this.props.reminder.fromTimeStr}
                                type="time"
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="txtToDate">
                                <strong>To Date</strong>
                            </Label>
                            <Input
                                id="txtToDate"
                                onChange={this.handleToDateChange}
                                value={this.props.reminder.toDateStr}
                                type="date"
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="txtToTime">
                                <strong>To Time</strong>
                            </Label>
                            <Input
                                id="txtToTime"
                                onChange={this.handleToTimeChange}
                                value={this.props.reminder.toTimeStr}
                                type="time"
                            />
                            {this.renderDateTimeErrorMessage()}
                        </FormGroup>
                        <FormGroup check>
                            <Input
                                id="chkRecurrenceForAYear"
                                type="checkbox"
                                onChange={this.handleRecurrenceForAYearChange}
                                checked={this.props.reminder.recurrenceForAYear}
                            />
                            <Label for="chkRecurrenceForAYear" check>Recurrence for the rest of the year</Label>
                            {this.renderRecurrenceForAYearErrorMessage()}
                        </FormGroup>
                    </Col>
                </Row>
                {this.renderColorPickerModal()}
            </div>
        );
    }

    renderTitleErrorMessage = () => {
        return this.props.titleValid === false
            ? (
                <Alert id="amvTitle" color="danger">
                    {`Title must have ${process.env.REACT_APP_REMINDER_TITLE_MIN_LENGTH} to ${process.env.REACT_APP_REMINDER_TITLE_MAX_LENGTH} chars.`}
                </Alert>
            )
            : (<div />);
    }

    renderDescriptionErrorMessage = () => {
        return this.props.descriptionValid === false
            ? (
                <Alert id="amvDescription" color="danger">
                    {`Description can have a max. of ${process.env.REACT_APP_REMINDER_TITLE_MAX_LENGTH} chars.`}
                </Alert>
            )
            : (<div />);
    }

    renderCityErrorMessage = () => {
        return this.props.cityValid === false
            ? (
                <Alert id="amvCity" color="danger">
                    {`City can have a max. of ${process.env.REACT_APP_REMINDER_TITLE_MAX_LENGTH} chars.`}
                </Alert>
            )
            : (<div />);
    }

    renderDateTimeErrorMessage = () => {
        if (this.props.dateTimeValid === false) {
            return (
                <Alert id="amvDateTime" color="danger">
                    {`"From Datetime" must be higher than "To Datetime".`}
                </Alert>
            );
        } else if (this.props.dateTimeOverlapValid === false) {
            return (
                <Alert id="amvDateTimeOverlap" color="danger">
                    {`Datetime Range overlaps other existing reminders.`}
                </Alert>
            );
        } else {
            return (<div />);
        }
    }

    renderRecurrenceForAYearErrorMessage = () => {
        return this.props.recurrenceForAYearValid === false
            ? (
                <Alert id="amvRecurrenceForAYear" color="danger">
                    {`If "Recurrence for the rest of the year" was selected, then Datetime Range must not exceed a month.`}
                </Alert>
            )
            : (<div />);
    }

    renderColorPickerModal = () => {
        return (

            <Modal
                isOpen={this.state.showColorPickerModal}
                toggle={this.toggleColorPickerModal}
            >
                <ModalHeader toggle={this.toggleColorPickerModal}>
                    Choose a color for your Reminder
                </ModalHeader>
                <ModalBody>
                    <ChromePicker
                        styles={{
                            default: {
                                picker: {
                                    width: "inherited"
                                }
                            }
                        }}
                        color={this.props.reminder.color}
                        onChangeComplete={this.handleColorChange}
                    />
                </ModalBody>
                <ModalFooter>
                    <Button onClick={this.toggleColorPickerModal}>
                        Ok
                    </Button>
                </ModalFooter>
            </Modal>
        );
    }
}

export default connect(
    MapStateToProps,
    MapDispatchToProps
)(ReminderForm);