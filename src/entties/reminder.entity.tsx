export interface IReminder {
    id?: number;
    title?: string;
    description?: string;
    fromDateStr?: string;
    toDateStr?: string;
    fromTimeStr?: string;
    toTimeStr?: string;
    dateKeys?: string[];
    city?: string;
    weather?: string;
    bkgColor?: string;
    fontColor?: string;
    recurrenceForAYear?: boolean;
}

export type ReminderGroup = { [key: string]: IReminder[] };