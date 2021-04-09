### Scheduler

The [momentjs](https://momentjs.com/) is used for working with time. The [moment-recur](https://github.com/c-trimm/moment-recur) is plugin for momentjs which helps to generate recurrences. The [moment-timezone](https://momentjs.com/timezone/) allows to handle dates in any [IANA timezone](https://www.iana.org/time-zones) without worrying about daylight savings time.

Scheduler functionality: 
- the datepicker doesn't allow users to select past days (e.g. yesterday); 
- scheduler allows users to create recurring meetings. These meetings can be repeated on a daily, weekly, monthly. Users can set all necessary parameters, including the recurrence. User can set end date or set number of occurrence;
- scheduler allows setting meetings in different time zones. By default, local timezone is used. When the user selects another timezone, the scheduler will save the meeting time accordingly to the selected timezone value. 

- user can set 'Allow anonymous users' option which allows anonymous users to join the meeting;
- user can set multiple numbers of rooms for one meeting;
- meeting can be edited. In edit case, the current meeting is removed and created one new. If one occurrence is edited we pass the current `roomId` and recurrence options to new meeting.

Dates are stored in UTC time in database. Client uses time by timezone using function which set defined timezone to date:
```
getDateByTimeAndTimezone(date, timezone)
```
Recurring meetings can be repeated on a daily, weekly, monthly basis and created in two ways. For creating by the ***end date*** we use function:
```
calculateRecurringByEndDate({ startDate, endDate, ...options})
``` 
 by ***occurrences***:  
 ```
 calculateRecurringByOccurrence({ startDate, occurrences, ...options})
 ```
 For correct result it is necessary to pass date in UTC time this way `date.clone().utc(true)`. It changes timezone to UTC without changing the current time. We need it for correct recurring dates using moment-recur. Moment-recur handles dates only and time information is discarded *(e.g. if we pass date in UTC time and when we select monthly recurrence by day and timezone day is different than UTC day - as the result we will have recurrence dates by UTC, not timezone)*;

Before sending recurrence to database we set timezone to start/end date *(getDateByTimeAndTimezone function)* with correct time by `startDate` and `duration`(for end date) using:
```
getRecurringDatesWithTime({ dates, startDate, duration, timezone }) 
```
In editing case meeting timezone is set to all date; 

# Test cases: 
1. For testing DST we need to schedule recurring meetings when DST starts or DST ends. 

***Result:***  we will have all recurring meetings have the same time.

***Example***: *11/07/2021 in USA  DST ends and if we have recurring meetings from 11/06/2021 to 11/08/2021 at 9 PM  and America/New_York timezone. Meetings have to be at 9 PM. If your local timezone has another DST date you will see a different time between 11/06/2021 and 11/07/2021*

If you create 2 meetings with the same time(hh:mm) but different dates(dd:hh:mm) - DST/non DST will not make any difference in for time(hh:mm) for the meeting.

2. To test weekly and monthly meetings recurrence:
- change another timezone then local;
- set any time field value that changes local date *(e.g. 24th of May becomes 25th or 23th)*;
- select weekly or monthly with some repeat option *(e.g. monthly recurrence and 6 day of the month)*;

***Result:*** If local day is different from selected timezone. The correct recurrence option will be in the selected timezone (every 6 day of the month).