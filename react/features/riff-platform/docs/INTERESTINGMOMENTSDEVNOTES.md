### Interesting moments

Interesting moments functionality:
- authorized user can mark moment as interesting by clicking on star icon in Toolbar component
- after click, we will query videodata platform for meetingId of room user is currently in
- request gets send with submittedBy (id of current user) and time (ISO string) as body params, and meetingId as request variable to the backend endpoint
```
http://localhost:4445/api/meetings/:meetingId/markInterestingMoments
```

- notification that user has successfully highlighted interesting moment will be shown
- after the end of the meeting, user can view timeline of all interesting moments
under 'Experimental Dashboard'
- soonly, interesting moments timeline will be merged with the primary metrics timeline
- array of interesting moments could be retrieved by making GET request to the following endpoint
```
http://localhost:4445/api/meetings/:meetingId/interestingMoments
```

#### NOTE!
This is the temporary solution. Eventually all interesting moments will be stored
inside videodata platform.

Also, you should take into account that ```meetingId``` in this context
(despite being somewhat similar) has nothing to do with the
**id of the meeting stored in api-gateway meetings collection**,
so you must not rely on it if you need to get information about the meeting itself
