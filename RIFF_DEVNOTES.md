## Riff-platform app
- we created separate app for our admin panel: `react/features/riff-platform`;
- we use it for meeting scheduler, meetings list, auth logic etc;
- we get redirected to that app when we go to `/app/`;
- when we go to meeting `/ROOM_ID`, we check if allowed to participate. If no, then we get redirected to *riff-platform*.

## Navigation in jitsi-meet, riff-platform
- if we put any ID to the location, `/ROOM_ID`, we get to the *jitsi-meet*.
- if we put `/app/` to the location, we get to *riff-platform*.

- we use react-router for navigating in *riff-platform*, routes are here `react/features/riff-platform/components/Main.js`.
- we use changing location to navigate ***with reload*** page **from** *riff-platform* **to** *jitsi-meet*:
```
window.location.replace(ROOM_ID);
```
- we use custom function to navigate ***without reload*** **from** *jitsi-meet* **to** *riff-platform*:
```
navigateWithoutReload(RiffPlatformComponent, `${ROUTES.BASENAME}${ROUTES.DASHBOARD}`)
```

## Checking meetings
When we get to `/ROOM_ID`, we check if we allowed to get to that meeting:
 - if yes, we go to the meeting;
 - if no, we get redirected to /app/waiting/ROOM_ID, where we display the reason why we can't access this room.

When we start meeting from *meetingslist* from *riff-platform*, we get redirected to `/app/waiting/ROOM_ID`, where we check if we allowed to get to that meeting:
 - if no, display error message;
 - if yes, get redirected to `/ROOM_ID` to jitsi-meet app.

### Recurrent meetings

For recurrent meetings we create several meetings with the same `roomId`.
When you're trying to get the meeting by `roomId`:
 - backend gets array of all meetings with the same `roomId`;
 - then cut all previous meetings and return only the first upcomming meeting.

*We had an issue [ODIN-110](https://riffanalytics.atlassian.net/browse/ODIN-110): when meeting time is over but the conversation is still going, if you reload page you'd get to the next upcomming meeting and would not be able to join the meeting (because it's over and in considered as previous already).*
*To prevent that issue we consider current meeting as upcomming for 2 hours more after meeting `endDate` regardless of meeting duration. See this [commit](https://github.com/rifflearning/riff-jitsi-platform/pull/12/commits/5212d66cbaa214415a39258ec33abfb0b0ce5c88).*

## Sibilant 
- we use [@rifflearning/sibilant](https://github.com/rifflearning/sibilant) package for detecting speaking events and send them to the riff-data server for meeting mediator and metrics page

## [Local recording dev notes](react/features/riff-platform/docs/LOCALRECDEVNOTES.md)
## [Scheduler dev notes](react/features/riff-platform/docs/SCHEDULERDEVNOTES.md)