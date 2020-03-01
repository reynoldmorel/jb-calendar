export interface IReminder {
    id?: number;
    title?: string;
    description?: string;
    fromDateStr?: string;
    toDateStr?: string;
    fromTimeStr?: string;
    toTimeStr?: string;
    city?: string;
    weather?: string;
    color?: string;
    recurrentForAYear?: boolean;
}