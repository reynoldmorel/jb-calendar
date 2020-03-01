import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { Alert, Button, Form, Modal, ModalHeader, ModalBody, ModalFooter, Row, Col } from "reactstrap";

import { IReminderPageProps, MapStateToProps, MapDispatchToProps } from "./page-props";
import ReminderForm from "./form/form";
import { IReminderPageState, ReminderPageInitialState } from "./page-state";
import { ReminderStoreInitialState } from "../../redux/reminder/store.redux";
import { IReminder } from "../../entties";

class ReminderPage extends PureComponent<IReminderPageProps, IReminderPageState> {

    constructor(props: IReminderPageProps) {
        super(props);

        this.state = ReminderPageInitialState;
    }

    componentDidUpdate() {
        if (this.props.createdSuccessful) {
            this.closeCreateModal();
        } else if (this.props.updatedSuccessful) {
            this.closeUpdateModal();
        } else if (this.props.deletedSuccessful) {
            this.closeDeleteModal();
        }
    }

    openCreateModal = () => {
        this.setState({ showCreateModal: true });
        this.props.setReminder(ReminderStoreInitialState.reminder);
    }

    closeCreateModal = () => {
        this.setState({ showCreateModal: false });
        this.props.setReminder(ReminderStoreInitialState.reminder);
        this.props.resetReminderFlags();
    }

    create = () => {
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
        this.props.setReminder(ReminderStoreInitialState.reminder);
        this.props.resetReminderFlags();
    }

    update = () => {
        const { reminder, reminders, remindersGroupedByDate, formValid } = this.props;
        if (formValid && reminder) {
            this.props.update(reminder, reminders, remindersGroupedByDate);
        }
    }

    openDeleteModal = (reminder: IReminder) => {
        this.setState({ showDeleteModal: true });
        this.props.setReminder(reminder);
    }

    closeDeleteModal = () => {
        this.setState({ showDeleteModal: false });
        this.props.setReminder(ReminderStoreInitialState.reminder);
        this.props.resetReminderFlags();
    }

    delete = () => {
        const { reminder, reminders, remindersGroupedByDate } = this.props;

        if (reminder && reminder.id !== undefined) {
            this.props.deleteById(reminders, remindersGroupedByDate, reminder.id);
        }
    }

    render() {
        return (
            <div>
                <Button onClick={this.openCreateModal}>
                    Create Reminder
                </Button>

                {this.renderCreateModal()}
                {this.renderUpdateModal()}
                {this.renderDeleteModal()}
            </div>
        );
    }

    renderCreateModal = () => {
        return (
            <Modal
                isOpen={this.state.showCreateModal}
                toggle={this.closeCreateModal}
            >
                <ModalHeader toggle={this.closeCreateModal}>
                    Create Reminder
                </ModalHeader>
                <ModalBody>
                    <ReminderForm />
                </ModalBody>
                <ModalFooter>
                    {this.renderCreateErrorMessage}
                    <Button onClick={this.closeCreateModal}>
                        Cancel
                    </Button>
                    <Button onClick={this.create}>
                        Create
                    </Button>
                </ModalFooter>
            </Modal>
        );
    }

    renderCreateErrorMessage = () => {
        return this.props.createdSuccessful === false
            ? (
                <Alert color="danger">
                    There was a problem trying to create "{this.props.reminder.title}".
                </Alert>
            )
            : (<div />);
    }

    renderUpdateModal = () => {
        return (
            <Modal
                isOpen={this.state.showUpdateModal}
                toggle={this.closeUpdateModal}
            >
                <ModalHeader toggle={this.closeUpdateModal}>
                    Update Reminder
                </ModalHeader>
                <ModalBody>
                    <ReminderForm />
                </ModalBody>
                <ModalFooter>
                    {this.renderUpdateErrorMessage}
                    <Button onClick={this.closeUpdateModal}>
                        Cancel
                    </Button>
                    <Button onClick={this.update}>
                        Update
                    </Button>
                </ModalFooter>
            </Modal>
        );
    }

    renderUpdateErrorMessage = () => {
        return this.props.updatedSuccessful === false
            ? (
                <Alert color="danger">
                    There was a problem trying to update "{this.props.reminder.title}".
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
                <ModalHeader toggle={this.closeDeleteModal}>
                    About to delete a Reminder
                </ModalHeader>
                <ModalBody>
                    <p>
                        Are you sure you want to delete the reminder "{this.props.reminder.title}"?
                    </p>
                </ModalBody>
                <ModalFooter>
                    {this.renderDeleteErrorMessage}
                    <Button onClick={this.closeDeleteModal}>
                        No
                    </Button>
                    <Button onClick={this.delete}>
                        Yes
                    </Button>
                </ModalFooter>
            </Modal>
        );
    }

    renderDeleteErrorMessage = () => {
        return this.props.deletedSuccessful === false
            ? (
                <Alert color="danger">
                    There was a problem trying to delete "{this.props.reminder.title}".
                </Alert>
            )
            : (<div />);
    }

}

export default connect(
    MapStateToProps,
    MapDispatchToProps
)(ReminderPage);