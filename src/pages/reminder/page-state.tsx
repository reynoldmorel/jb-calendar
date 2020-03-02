export interface IReminderPageState {
    showCreateModal: boolean;
    showViewRemindersForADayModal: boolean;
    showUpdateModal: boolean;
    showRemindersForDateModal: boolean;
    showDeleteModal: boolean;
    showDeleteAllModal: boolean;
    calendarDate: Date;
}

export const ReminderPageInitialState: IReminderPageState = {
    showCreateModal: false,
    showViewRemindersForADayModal: false,
    showUpdateModal: false,
    showRemindersForDateModal: false,
    showDeleteModal: false,
    showDeleteAllModal: false,
    calendarDate: new Date()
};