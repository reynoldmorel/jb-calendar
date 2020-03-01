export interface IReminderPageState {
    showCreateModal: boolean;
    showUpdateModal: boolean;
    showRemindersForDateModal: boolean;
    showDeleteModal: boolean;
}

export const ReminderPageInitialState: IReminderPageState = {
    showCreateModal: false,
    showUpdateModal: false,
    showRemindersForDateModal: false,
    showDeleteModal: false
};