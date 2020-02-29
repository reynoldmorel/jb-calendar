export interface IReminder {
    title?: string;
    description?: string;
    from?: Date;
    to?: Date;
    fromDateStr?: string;
    toDateStr?: string;
    fromTimeStr?: string;
    toTimeStr?: string;
    city?: string;
    color?: string;
    recurrent?: boolean;
}