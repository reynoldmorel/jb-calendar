import { IReminder } from "../entties/reminder.entity";
import { DateUtil } from "./date.util";
import { WeatherService } from "../services/weather.service";
import { ICalendarItem } from "../components/calendar/calendar-item";

type ReminderGroup = { [key: string]: IReminder[] };
type DeleteResult = { newReminders: IReminder[], newRemindersGroupedByDate: ReminderGroup };
type CityWeather = { [key: string]: string }

export class ReminderUtil {
    static generateReminderDateKeys(reminder: IReminder): string[] {
        let { fromAsDate, toAsDate } = ReminderUtil.getReminderFromAndToAsDate(reminder);
        const { recurrenceForAYear } = reminder;

        return DateUtil.generateDateKeys(fromAsDate, toAsDate, recurrenceForAYear);
    }

    static reminderDateRangeInReminderFilter(reminderToCheck: IReminder): (reminder: IReminder) => boolean {
        const dateObjectInMillis = ReminderUtil.getReminderFromAndToAsMillis(reminderToCheck);
        const fromInMillisToCheck = dateObjectInMillis.fromInMillis;
        const toInMillisToCheck = dateObjectInMillis.toInMillis;

        return (reminder: IReminder) => {
            if (reminder.dateKeys) {
                for (let i = 0; i < reminder.dateKeys.length; i++) {
                    const dateKey = reminder.dateKeys[i];
                    const modifiedReminder = { ...reminder, fromDateStr: dateKey, toDateStr: dateKey }

                    const { fromInMillis, toInMillis } = ReminderUtil.getReminderFromAndToAsMillis(modifiedReminder);

                    const overlaps = reminder.id !== reminderToCheck.id
                        && (
                            ReminderUtil.dateInReminder(fromInMillisToCheck, reminder)
                            || ReminderUtil.dateInReminder(toInMillisToCheck, reminder)
                            || ReminderUtil.dateInReminder(fromInMillis, reminderToCheck)
                            || ReminderUtil.dateInReminder(toInMillis, reminderToCheck)
                        );

                    if (overlaps) {
                        return true;
                    }
                }
            }

            return false;
        };
    }

    static dateInReminder(dateInMillis?: number, reminder?: IReminder): boolean {
        if (dateInMillis !== undefined && reminder) {
            const { fromInMillis, toInMillis } =
                ReminderUtil.getReminderFromAndToAsMillis(reminder);

            return DateUtil.dateBetween(
                dateInMillis,
                fromInMillis,
                toInMillis
            )
        }

        return false;
    }

    static getReminderFromAndToAsMillis(reminder: IReminder) {
        const dateObject = ReminderUtil.getReminderFromAndToAsDate(reminder);

        return {
            fromInMillis: dateObject.fromAsDate.getTime(),
            toInMillis: dateObject.toAsDate.getTime()
        };
    }

    static getReminderFromAndToAsDate(reminder: IReminder) {
        const { fromDateStr, toDateStr, fromTimeStr, toTimeStr } = reminder;
        const dateTimeFormat = `${process.env.REACT_APP_DATE_FORMAT} ${process.env.REACT_APP_TIME_FORMAT}`;

        return DateUtil.getFromAndToAsDate(`${fromDateStr} ${fromTimeStr}`, `${toDateStr} ${toTimeStr}`, dateTimeFormat);
    }

    static async populateWeather(reminders: IReminder[] = []) {
        let result: IReminder[] = [];
        const cityWeatherMap: CityWeather = {};

        for (let i = 0; i < reminders.length; i++) {
            const reminder = reminders[i];

            if (reminder.city) {
                let weather = cityWeatherMap[reminder.city];

                if (!weather) {
                    try {
                        const { data } = await WeatherService.getWeatherInfoByCity(reminder.city);
                        weather = data.weather[0].description;
                    } catch {
                        weather = "";
                    }
                }

                const reminderWithWeather = { ...reminder, weather };
                result = result.concat([reminderWithWeather]);
            } else {
                result = result.concat([{ ...reminder }]);
            }
        }

        return result;
    }

    static groupReminder(reminder: IReminder, remindersGroupedByDate: ReminderGroup): ReminderGroup {
        if (reminder.dateKeys) {
            for (let i = 0; i < reminder.dateKeys.length; i++) {
                const dateKey = reminder.dateKeys[i];
                remindersGroupedByDate = ReminderUtil.putReminder(reminder, dateKey, remindersGroupedByDate);
            }
        }

        return remindersGroupedByDate;
    }

    static putReminder(reminder: IReminder, dateKey: string, remindersGroupedByDate: ReminderGroup): ReminderGroup {
        return {
            ...remindersGroupedByDate,
            [dateKey]: [reminder].concat(remindersGroupedByDate[dateKey] || [])
        };
    }

    static removeGroupReminder(reminder: IReminder, remindersGroupedByDate: ReminderGroup): ReminderGroup {
        if (reminder.dateKeys) {
            for (let i = 0; i < reminder.dateKeys.length; i++) {
                const dateKey = reminder.dateKeys[i];
                remindersGroupedByDate = ReminderUtil.removeReminder(reminder, dateKey, remindersGroupedByDate);
            }
        }

        return remindersGroupedByDate;
    }

    static removeReminder(reminder: IReminder, dateKey: string, remindersGroupedByDate: ReminderGroup): ReminderGroup {
        return {
            ...remindersGroupedByDate,
            [dateKey]: remindersGroupedByDate[dateKey].filter(r => r.id !== reminder.id)
        };
    }

    static calendarItemMapper(reminder: IReminder): ICalendarItem {
        let cityText = "";

        if (reminder.city) {
            cityText = ` - ${reminder.city}${reminder.weather ? `: ${reminder.weather}` : ""}`;
        }

        return {
            displayText: `${reminder.title} - ${reminder.fromTimeStr} to ${reminder.toTimeStr}${cityText}`,
            fromDateTimeStr: `${reminder.fromDateStr} ${reminder.fromTimeStr}`,
            toDateTimeStr: `${reminder.toDateStr} ${reminder.toTimeStr}`,
            recurrenceForAYear: reminder.recurrenceForAYear,
            bkgColor: reminder.bkgColor,
            fontColor: reminder.fontColor,
            dateKeys: reminder.dateKeys,
            data: reminder
        };
    }

    static deleteById(id: number, reminders: IReminder[], remindersGroupedByDate: ReminderGroup): DeleteResult | undefined {
        const reminder = reminders.find(r => r.id === id);

        if (reminder) {
            const dateKeys = ReminderUtil.generateReminderDateKeys(reminder);

            if (dateKeys.length > 0) {
                const newReminders = reminders.filter(r => r.id !== id);
                const newRemindersGroupedByDate = ReminderUtil.removeGroupReminder(reminder, remindersGroupedByDate);

                return { newReminders, newRemindersGroupedByDate };
            }
        }
        return undefined;
    }
}