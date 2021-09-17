### Interesting moments

Interesting moments functionality:
- authorized user can mark moment as interesting by clicking on star icon in Toolbar component
- after click, we will query videodata platform for meetingId of room user is currently in
- request gets send with participantId (id of current user) and time (ISO string) as body params, and meetingId to the 'moments' service

- notification that user has successfully highlighted interesting moment will be shown
- after the end of the meeting, user can view all interesting moments
under 'Experimental Dashboard' inside primary timeline alongside other metrics


#### NOTE!
Also, you should take into account that ```meetingId``` in this context
(despite being somewhat similar) has nothing to do with the
**id of the meeting stored in api-gateway meetings collection**,
so you must not rely on it if you need to get information about the meeting itself
