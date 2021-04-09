import moment from 'moment';
import 'moment-recur';
import momentTZ from 'moment-timezone';

export const daysOfWeekMap = {
    'Mon': 1,
    'Tue': 2,
    'Wed': 3,
    'Thu': 4,
    'Fri': 5,
    'Sat': 6,
    'Sun': 7
};

export const getRecurringDailyEventsByOccurance = ({
    startDate,
    daysOccurances,
    daysInterval
}) => [ startDate ].concat(
        startDate
            .recur()
            .every(daysInterval, 'days')
            .next(daysOccurances - 1)
);

// eslint-disable-next-line no-confusing-arrow
export const getRecurringDailyEventsByEndDate = ({
    startDate,
    endDate,
    daysInterval,
    daysOccurances
}) =>
    endDate
        ? startDate
            .recur(endDate)
            .every(daysInterval, 'days')
            .all()
        : getRecurringDailyEventsByOccurance({
            startDate,
            daysOccurances,
            daysInterval
        });

export const getRecurringWeeklyEventsByOccurance = ({
    startDate,
    weeksOccurances,
    daysOfWeek
}) => {
    const isStartDateBelongsToDaysArr = daysOfWeek.find(
        day => day === daysOfWeekMap[startDate.format('ddd')]
    );

    return isStartDateBelongsToDaysArr
        ? [ startDate ].concat(
                startDate
                  .recur()
                  .every(daysOfWeek)
                  .daysOfWeek()
                  .next(weeksOccurances - 1)
        )
        : startDate
              .recur()
              .every(daysOfWeek)
              .daysOfWeek()
              .next(weeksOccurances);
};

// eslint-disable-next-line no-confusing-arrow
export const getRecurringWeeklyEventsByEndDate = ({
    startDate,
    endDate,
    weeksOccurances,
    daysOfWeek
}) => endDate
    ? startDate
            .recur(endDate)
            .every(daysOfWeek)
            .daysOfWeek()
            .all()
    : getRecurringWeeklyEventsByOccurance({
        startDate,
        weeksOccurances,
        daysOfWeek
    });
export const getRecurringMonthlyEventsByOccurance = ({
    startDate,
    monthOccurances,
    monthlyBy,
    dayOfMonth,
    monthlyByWeekDay,
    monthlyByPosition
}) => {
    if (monthlyBy === 'monthlyByDay') {
        const isStartDayEqualToDayOfMonth
            = parseInt(startDate.format('D'), 10) === dayOfMonth;

        return isStartDayEqualToDayOfMonth
            ? [ startDate ].concat(
                startDate
                      .recur()
                      .every(dayOfMonth)
                      .daysOfMonth()
                      .next(monthOccurances - 1)
            )
            : startDate
                  .recur()
                  .every(dayOfMonth)
                  .daysOfMonth()
                  .next(monthOccurances);
    }

    const recurrence = startDate
            .recur()
            .every(monthlyByWeekDay)
            .daysOfWeek()
            .every(monthlyByPosition)
            .weeksOfMonthByDay()
            .next(monthOccurances);
    const startDateFromRecurrence = startDate
            .recur(recurrence[0])
            .every(monthlyByWeekDay)
            .daysOfWeek()
            .every(monthlyByPosition)
            .weeksOfMonthByDay()
            .all()[0];

    const isStartDayEqualToStartDateFromRecurrence
            = startDate.isSame(startDateFromRecurrence, 'day');

    return isStartDayEqualToStartDateFromRecurrence
        ? [ startDate ].concat(
                startDate
                      .recur()
                      .every(monthlyByWeekDay)
                      .daysOfWeek()
                      .every(monthlyByPosition)
                      .weeksOfMonthByDay()
                      .next(monthOccurances - 1)
        )
        : recurrence;

};

export const getRecurringMonthlyEventsByEndDate = ({
    startDate,
    endDate,
    monthOccurances,
    monthlyBy,
    dayOfMonth,
    monthlyByWeekDay,
    monthlyByPosition
}) => {
    if (monthlyBy === 'monthlyByDay') {
        return endDate
            ? startDate
                  .recur(endDate)
                  .every(dayOfMonth)
                  .daysOfMonth()
                  .all()
            : getRecurringMonthlyEventsByOccurance({
                startDate,
                monthOccurances,
                monthlyBy: 'monthlyByDay',
                dayOfMonth,
                monthlyByWeekDay,
                monthlyByPosition
            });
    }

    return endDate
        ? startDate
                  .recur(endDate)
                  .every(monthlyByWeekDay)
                  .daysOfWeek()
                  .every(monthlyByPosition)
                  .weeksOfMonthByDay()
                  .all()
        : getRecurringMonthlyEventsByOccurance({
            startDate,
            monthOccurances,
            monthlyBy: 'monthlyByWeekDay',
            dayOfMonth,
            monthlyByWeekDay,
            monthlyByPosition
        });

};

// Returns time by selected time and timezone
export const getDateByTimeAndTimezone = (date, timeZone) => {
    const t = moment(date)
        .clone()
        .format()
        .slice(0, 19);

    return momentTZ.tz(t, timeZone);
};
