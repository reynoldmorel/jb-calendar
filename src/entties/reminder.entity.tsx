export interface IReminder {
    title: string;
    from: Date;
    to: Date;
    city: string;
    color: string;
    description?: string;
    recurrent?: boolean;
}