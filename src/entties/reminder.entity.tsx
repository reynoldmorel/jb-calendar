export interface IReminder {
    title: string;
    from: Date;
    to: Date;
    city: string;
    description?: string;
    recurrent?: boolean;
}