import React, { PureComponent, MouseEvent } from "react";
import { connect } from "react-redux";
import { Alert, Button, Form, Modal, ModalHeader, ModalBody, ModalFooter, Row, Col } from "reactstrap";

import { IReminderPageProps, MapStateToProps, MapDispatchToProps } from "./page-props";
import ReminderForm from "./form/form";
import { IReminderPageState, ReminderPageInitialState } from "./page-state";
import { ReminderStoreInitialState } from "../../redux/reminder/store.redux";
import { IReminder } from "../../entties/reminder.entity";
import { Calendar } from "../../components/calendar/calendar";
import moment from "moment";

class ReminderPage extends PureComponent<IReminderPageProps, IReminderPageState> {

    private formFirstInput?: HTMLInputElement;

    constructor(props: IReminderPageProps) {
        super(props);

        this.state = ReminderPageInitialState;
    }

    componentDidMount() {
        this.loadRemindersByCalendarDate();
    }

    componentDidUpdate(prevProps: IReminderPageProps) {
        if (this.props.createdSuccessful && this.props.reminder === prevProps.reminder) {
            this.resetCreateModalAfterCreationSuccessFul();
        } else if (this.props.updatedSuccessful) {
            this.closeUpdateModal();
        } else if (this.props.deletedSuccessful) {
            this.closeDeleteModal();
        }
    }

    resetCreateModalAfterCreationSuccessFul = () => {
        this.clearReminder();
        this.focusFirstElementOnForm();

        setTimeout(this.props.resetReminderFlags, 2000);
    }

    openCreateModal = () => {
        this.setState({ showCreateModal: true });
        this.clearReminder();
    }

    closeCreateModal = () => {
        this.setState({ showCreateModal: false });
        this.clearReminder();
        this.props.resetReminderFlags();
        this.loadRemindersByCalendarDate();
    }

    create = (e: MouseEvent<HTMLFormElement>) => {
        e.preventDefault();

        const { reminder, reminders, remindersGroupedByDate, formValid } = this.props;

        if (formValid && reminder) {
            this.props.create(reminder, reminders, remindersGroupedByDate);
        }
    }

    openUpdateModal = (reminder: IReminder) => {
        this.setState({ showUpdateModal: true });
        this.props.setReminder(reminder);
    }

    closeUpdateModal = () => {
        this.setState({ showUpdateModal: false });
        this.clearReminder();
        this.props.resetReminderFlags();
        this.loadRemindersByCalendarDate();
    }

    update = (e: MouseEvent<HTMLFormElement>) => {
        e.preventDefault();

        const { reminder, reminders, remindersGroupedByDate, formValid } = this.props;

        if (formValid && reminder) {
            this.props.update(reminder, reminders, remindersGroupedByDate);
        }
    }

    openDeleteModal = (reminder: IReminder) => {
        this.setState({ showDeleteModal: true });
        this.clearReminder();
    }

    closeDeleteModal = () => {
        this.setState({ showDeleteModal: false });
        this.props.setReminder(ReminderStoreInitialState.reminder);
        this.props.resetReminderFlags();
        this.loadRemindersByCalendarDate();
    }

    delete = (e: MouseEvent<HTMLFormElement>) => {
        e.preventDefault();

        const { reminder, reminders, remindersGroupedByDate } = this.props;

        if (reminder && reminder.id !== undefined) {
            this.props.deleteById(reminders, remindersGroupedByDate, reminder.id);
        }
    }

    clearReminder = () => {
        this.props.setReminder({ ...ReminderStoreInitialState.reminder });
    }

    focusFirstElementOnForm = () => {
        if (this.formFirstInput) {
            this.formFirstInput.focus();
        }
    }

    setFormFirstInput = (input: HTMLInputElement) => {
        this.formFirstInput = input;
    }

    onCalendarDateChange = (year: number, month: number, day: number) => {

        this.setState({ calendarDate: moment([year, month, day]).toDate() });
    }

    onCalendarClickDay = (year: number, month: number, day: number, dataItems: IReminder[]) => {
        console.log(dataItems);

        this.setState({ calendarDate: moment([year, month, day]).toDate() });
    }

    loadRemindersByCalendarDate = () => {
        this.props.getAllRemindersByYearAndMonthWithWeather(this.state.calendarDate, this.props.remindersGroupedByDate);
    }

    render() {
        return (
            <div>
                <Button
                    id="btnOpenCreateModal"
                    title="Create Reminder"
                    onClick={this.openCreateModal}
                >
                    Create Reminder
                </Button>

                <Calendar
                    date={this.state.calendarDate}
                    items={this.props.calendarItems}
                    onDateChange={this.onCalendarDateChange}
                    onClickDay={this.onCalendarClickDay}
                >

                </Calendar>
                {this.renderCreateModal()}
                {this.renderUpdateModal()}
                {this.renderDeleteModal()}
            </div>
        );
    }

    renderCreateModal = () => {
        return (

            <Modal
                onOpened={this.focusFirstElementOnForm}
                isOpen={this.state.showCreateModal}
                toggle={this.closeCreateModal}
            >
                <Form onSubmit={this.create}>
                    <ModalHeader toggle={this.closeCreateModal}>
                        Create Reminder
                    </ModalHeader>
                    <ModalBody>
                        {this.renderCreateMessage()}
                        <ReminderForm setFirstInput={this.setFormFirstInput} />
                    </ModalBody>
                    <ModalFooter>
                        {this.renderCreateMessage()}
                        <Button
                            id="btnCancelCreate"
                            title="Cancel"
                            onClick={this.closeCreateModal}
                        >
                            Cancel
                        </Button>
                        <Button
                            id="btnCreate"
                            title="Create"
                            type="submit"
                            disabled={!this.props.formValid}
                        >
                            Create
                        </Button>
                    </ModalFooter>
                </Form>
            </Modal>
        );
    }

    renderCreateMessage = () => {
        if (this.props.createdSuccessful === true) {
            return (
                <Alert id="amCreateSuceeded" color="success">
                    {`Reminder created successfully.`}
                </Alert>
            );
        } else if (this.props.createdSuccessful === false) {
            return (
                <Alert id="amCreateFailed" color="danger">
                    {`There was a problem trying to create "${this.props.reminder.title}".`}
                </Alert>
            );
        } else {
            return (<div />);
        }
    }

    renderUpdateModal = () => {
        return (

            <Modal
                onOpened={this.focusFirstElementOnForm}
                isOpen={this.state.showUpdateModal}
                toggle={this.closeUpdateModal}
            >
                <Form onSubmit={this.update}>
                    <ModalHeader toggle={this.closeUpdateModal}>
                        Update Reminder
                    </ModalHeader>
                    <ModalBody>
                        {this.renderUpdateMessage()}
                        <ReminderForm setFirstInput={this.setFormFirstInput} />
                    </ModalBody>
                    <ModalFooter>
                        {this.renderUpdateMessage()}
                        <Button
                            id="btnCancelUpdate"
                            title="Cancel"
                            onClick={this.closeUpdateModal}
                        >
                            Cancel
                        </Button>
                        <Button
                            id="btnUpdate"
                            title="Update"
                            type="submit"
                            disabled={!this.props.formValid}
                        >
                            Update
                        </Button>
                    </ModalFooter>
                </Form>
            </Modal>
        );
    }

    renderUpdateMessage = () => {
        return this.props.updatedSuccessful === false
            ? (
                <Alert id="amUpdateFailed" color="danger">
                    {`There was a problem trying to update "${this.props.reminder.title}".`}
                </Alert>
            )
            : (<div />);
    }

    renderDeleteModal = () => {
        return (
            <Modal
                isOpen={this.state.showDeleteModal}
                toggle={this.closeDeleteModal}
            >
                <Form onSubmit={this.delete}>
                    <ModalHeader toggle={this.closeDeleteModal}>
                        About to delete a Reminder
                    </ModalHeader>
                    <ModalBody>
                        <p>
                            {`Are you sure you want to delete the reminder "${this.props.reminder.title}"?`}
                        </p>
                    </ModalBody>
                    <ModalFooter>
                        {this.renderDeleteMessage()}
                        <Button
                            id="btnCancelDelete"
                            title="No"
                            onClick={this.closeDeleteModal}
                        >
                            No
                        </Button>
                        <Button
                            id="btnDelete"
                            title="Yes"
                            type="submit"
                        >
                            Yes
                        </Button>
                    </ModalFooter>
                </Form>
            </Modal>
        );
    }

    renderDeleteMessage = () => {
        return this.props.deletedSuccessful === false
            ? (
                <Alert id="amDeleteFailed" color="danger">
                    {`There was a problem trying to delete "${this.props.reminder.title}".`}
                </Alert>
            )
            : (<div />);
    }

}

export default connect(
    MapStateToProps,
    MapDispatchToProps
)(ReminderPage);