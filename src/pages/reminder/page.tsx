import React, { PureComponent, MouseEvent } from "react";
import { connect } from "react-redux";
import { Alert, Button, Form, Modal, ModalHeader, ModalBody, ModalFooter, Table } from "reactstrap";
import { faPencilAlt, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./page.css";

import { IReminderPageProps, MapStateToProps, MapDispatchToProps } from "./page-props";
import ReminderForm from "./form/form";
import { IReminderPageState, ReminderPageInitialState } from "./page-state";
import { ReminderStoreInitialState } from "../../redux/reminder/store.redux";
import { IReminder } from "../../entties/reminder.entity";
import { Calendar } from "../../components/calendar/calendar";
import moment from "moment";
import { ICalendarItem } from "../../components/calendar";

class ReminderPage extends PureComponent<IReminderPageProps, IReminderPageState> {

    private formFirstInput?: HTMLInputElement;

    constructor(props: IReminderPageProps) {
        super(props);

        this.state = ReminderPageInitialState;
    }

    componentDidMount() {
        this.loadRemindersByCalendarDate();
    }

    componentDidUpdate(prevProps: IReminderPageProps, prevState: IReminderPageState) {
        if (this.props.createdSuccessful && this.props.reminder === prevProps.reminder) {
            this.resetCreateModalAfterCreationSuccessFul();
        } else if (this.props.updatedSuccessful) {
            this.closeUpdateModal();
        } else if (this.props.deletedSuccessful) {
            if (this.state.showDeleteModal) {
                this.closeDeleteModal();
            } else if (this.state.showDeleteAllModal) {
                this.closeDeleteAllModal();
            }
        } else if (prevState.calendarDate !== this.state.calendarDate) {
            this.loadRemindersByCalendarDate();
        }
    }

    resetCreateModalAfterCreationSuccessFul = () => {
        this.clearReminder();
        this.focusFirstElementOnForm();

        setTimeout(this.props.resetReminderFlags, 2000);
    }

    openCreateModal = (e: MouseEvent<HTMLFormElement>) => {
        e.preventDefault();

        this.setState({ showCreateModal: true });

        const formattedCalendarDate = moment(this.state.calendarDate).format(process.env.REACT_APP_DATE_FORMAT);

        this.props.setReminder({
            ...ReminderStoreInitialState.reminder,
            fromDateStr: formattedCalendarDate,
            toDateStr: formattedCalendarDate
        });
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

    openViewRemindersForADayModal = (date: Date, reminders: IReminder[]) => {
        this.setState({ showViewRemindersForADayModal: true });
        this.props.setRemindersForDate(reminders);
    }

    closeViewRemindersForADayModal = () => {
        this.setState({ showViewRemindersForADayModal: false });
        this.props.setRemindersForDate([]);
    }

    openUpdateModal = (reminder: IReminder) => {
        this.setState({ showUpdateModal: true, showViewRemindersForADayModal: false });
        this.props.setRemindersForDate([]);
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
        this.setState({ showDeleteModal: true, showViewRemindersForADayModal: false });
        this.props.setRemindersForDate([]);
        this.props.setReminder(reminder);
    }

    closeDeleteModal = () => {
        this.setState({ showDeleteModal: false });
        this.props.setReminder(ReminderStoreInitialState.reminder);
        this.props.resetReminderFlags();
        this.clearReminder();
        this.loadRemindersByCalendarDate();
    }

    delete = (e: MouseEvent<HTMLFormElement>) => {
        e.preventDefault();

        const { reminder, reminders, remindersGroupedByDate } = this.props;

        if (reminder && reminder.id !== undefined) {
            this.props.deleteById(reminder.id, reminders, remindersGroupedByDate);
        }
    }

    openDeleteAllModal = () => {
        this.setState({ showDeleteAllModal: true, showViewRemindersForADayModal: false });
    }

    closeDeleteAllModal = () => {
        this.setState({ showDeleteAllModal: false });
        this.props.resetReminderFlags();
        this.props.setRemindersForDate([]);
        this.loadRemindersByCalendarDate();
    }

    deleteAll = (e: MouseEvent<HTMLFormElement>) => {
        e.preventDefault();

        const { remindersForDate, reminders, remindersGroupedByDate } = this.props;
        const ids = remindersForDate.map(r => r.id as number);
        this.props.deleteAll(ids, reminders, remindersGroupedByDate);
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

    onCalendarClickDay = (year: number, month: number, day: number, dataItems: ICalendarItem[]) => {
        const date = moment([year, month, day]).toDate();

        if (dataItems.length > 0) {
            const reminders = dataItems.map(i => i.data as IReminder);
            this.openViewRemindersForADayModal(date, reminders);
        }

        this.setState({ calendarDate: date });
    }

    loadRemindersByCalendarDate = () => {
        this.props.getAllRemindersByYearAndMonthWithWeather(this.state.calendarDate, this.props.remindersGroupedByDate);
    }

    render() {
        return (
            <div>
                <Form onSubmit={this.openCreateModal}>
                    <Button
                        id="btnOpenCreateModal"
                        data-testid="btnOpenCreateModal"
                        title="Create Reminder"
                        className="btn-create"
                        type="submit"
                        autoFocus
                    >
                        <FontAwesomeIcon icon={faPlus} />
                    </Button>

                    <Calendar
                        date={this.state.calendarDate}
                        items={this.props.calendarItems}
                        onDateChange={this.onCalendarDateChange}
                        onClickDay={this.onCalendarClickDay}
                    />
                </Form>

                {this.renderCreateModal()}
                {this.renderViewRemindersForADayModal()}
                {this.renderUpdateModal()}
                {this.renderDeleteModal()}
                {this.renderDeleteAllModal()}
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
                            data-testid="btnCancelCreate"
                            title="Cancel"
                            onClick={this.closeCreateModal}
                            color="danger"
                        >
                            Cancel
                        </Button>
                        <Button
                            id="btnCreate"
                            data-testid="btnCreate"
                            title="Create"
                            type="submit"
                            disabled={!this.props.formValid}
                            color="success"
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
                <Alert id="amCreateSucceeded" data-testid="amCreateSucceeded" color="success">
                    {`Reminder created successfully.`}
                </Alert>
            );
        } else if (this.props.createdSuccessful === false) {
            return (
                <Alert id="amCreateFailed" data-testid="amCreateFailed" color="danger">
                    {`There was a problem trying to create "${this.props.reminder.title}".`}
                </Alert>
            );
        } else {
            return (<div />);
        }
    }

    renderViewRemindersForADayModal = () => {
        return (
            <Modal
                isOpen={this.state.showViewRemindersForADayModal}
                toggle={this.closeViewRemindersForADayModal}
                className="view-reminder-modal"
            >
                <ModalHeader toggle={this.closeViewRemindersForADayModal}>
                    {`Reminders for ${moment(this.state.calendarDate).format(process.env.REACT_APP_DATE_FORMAT)}`}
                </ModalHeader>
                <ModalBody>
                    <Table responsive hover>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Time</th>
                                <th>City</th>
                                <th>Weather</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.props.remindersForDate.map((r, i) => (
                                (
                                    <tr key={`data_${i}`} style={{
                                        backgroundColor: r.bkgColor,
                                        color: r.fontColor
                                    }}>
                                        <td>{r.title}</td>
                                        <td>{`${r.fromTimeStr} to ${r.toTimeStr}`}</td>
                                        <td>{r.city}</td>
                                        <td>{r.weather}</td>
                                        <td>
                                            <div className="d-flex flex-row">
                                                <Button
                                                    id="btnOpenUpdateModal"
                                                    data-testid="btnOpenUpdateModal"
                                                    title="Edit this Reminder"
                                                    onClick={(e) => this.openUpdateModal(r)}
                                                    className="btn-edit"
                                                    style={{
                                                        color: r.fontColor
                                                    }}
                                                >
                                                    <FontAwesomeIcon icon={faPencilAlt} />
                                                </Button>
                                                <Button
                                                    id="btnOpenDeleteModal"
                                                    data-testid="btnOpenDeleteModal"
                                                    title="Delete this Reminder"
                                                    onClick={(e) => this.openDeleteModal(r)}
                                                    className="btn-delete"
                                                    style={{
                                                        color: r.fontColor
                                                    }}
                                                >
                                                    <FontAwesomeIcon icon={faTrash} />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            ))}
                        </tbody>
                    </Table >
                </ModalBody>
                <ModalFooter>
                    <Button
                        id="btnOpenDeleteAllModal"
                        data-testid="btnOpenDeleteAllModal"
                        title="Delete all"
                        onClick={this.openDeleteAllModal}
                        color="danger"
                    >
                        Delete All
                    </Button>
                    <Button
                        id="btnOkViewRemindersForADay"
                        data-testid="btnOkViewRemindersForADay"
                        title="Ok"
                        onClick={this.closeViewRemindersForADayModal}
                        color="success"
                    >
                        Ok
                    </Button>
                </ModalFooter>
            </Modal>
        );
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
                            data-testid="btnCancelUpdate"
                            title="Cancel"
                            onClick={this.closeUpdateModal}
                            color="danger"
                        >
                            Cancel
                        </Button>
                        <Button
                            id="btnUpdate"
                            data-testid="btnUpdate"
                            title="Update"
                            type="submit"
                            disabled={!this.props.formValid}
                            color="success"
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
                <Alert id="amUpdateFailed" data-testid="amUpdateFailed" color="danger">
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
                        About to delete a Reminder - {this.props.reminder.title}
                    </ModalHeader>
                    <ModalBody>
                        {this.props.reminder.recurrenceForAYear
                            ? (
                                <p>
                                    This reminder has recurrence for the rest of the year. If you remove it, all recurrences will be deleted as well.
                                </p>
                            )
                            : ""}
                        <p>
                            {`Are you sure you want to delete the reminder "${this.props.reminder.title}"?`}
                        </p>
                    </ModalBody>
                    <ModalFooter>
                        {this.renderDeleteMessage()}
                        <Button
                            id="btnCancelDelete"
                            data-testid="btnCancelDelete"
                            title="No"
                            onClick={this.closeDeleteModal}
                        >
                            No
                        </Button>
                        <Button
                            id="btnDelete"
                            data-testid="btnDelete"
                            title="Yes"
                            type="submit"
                            color="danger"
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
                <Alert id="amDeleteFailed" data-testid="amDeleteFailed" color="danger">
                    {`There was a problem trying to delete "${this.props.reminder.title}".`}
                </Alert>
            )
            : (<div />);
    }

    renderDeleteAllModal = () => {
        return (
            <Modal
                isOpen={this.state.showDeleteAllModal}
                toggle={this.closeDeleteAllModal}
            >
                <Form onSubmit={this.deleteAll}>
                    <ModalHeader toggle={this.closeDeleteAllModal}>
                        {`About to delete all Reminders for ${moment(this.state.calendarDate).format(process.env.REACT_APP_DATE_FORMAT)}`}
                    </ModalHeader>
                    <ModalBody>
                        <p>
                            There may be reminders with recurrence for the rest of the year. If you remove them, all recurrences will be deleted as well.
                        </p>
                        <p>
                            {`Are you sure you want to delete all reminders for "${moment(this.state.calendarDate).format(process.env.REACT_APP_DATE_FORMAT)}"?`}
                        </p>
                    </ModalBody>
                    <ModalFooter>
                        {this.renderDeleteAllMessage()}
                        <Button
                            id="btnCancelDeleteAll"
                            data-testid="btnCancelDeleteAll"
                            title="No"
                            onClick={this.closeDeleteAllModal}
                        >
                            No
                        </Button>
                        <Button
                            id="btnDeleteAll"
                            data-testid="btnDeleteAll"
                            title="Yes"
                            type="submit"
                            color="danger"
                        >
                            Yes
                        </Button>
                    </ModalFooter>
                </Form>
            </Modal>
        );
    }

    renderDeleteAllMessage = () => {
        return this.props.deletedSuccessful === false
            ? (
                <Alert id="amDeleteFailed" data-testid="amDeleteFailed" color="danger">
                    {`There was a problem trying to delete reminders from "${moment(this.state.calendarDate).format(process.env.REACT_APP_DATE_FORMAT)}".`}
                </Alert>
            )
            : (<div />);
    }

}

export default connect(
    MapStateToProps,
    MapDispatchToProps
)(ReminderPage);