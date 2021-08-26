import googleApi from '../../../google-api/googleApi.web';


// TODO: maybe use Jitsi code
// handle errors
const attemptSignInToGoogleApi = () => googleApi.initializeClient(
    '387032831739-h6i4p8ou45j21ke8317dn7888d92ur45.apps.googleusercontent.com', false, true)
    .then(() => googleApi.load())
    .then(() => googleApi.get())
    .then(() => googleApi.signInIfNotSignedIn())
    .then(() => Promise.resolve());

const getCalendarEntry = (calendarId, eventId) => googleApi._getGoogleApiClient()
        .client.calendar.events.get({
            'calendarId': calendarId,
            'eventId': eventId
        });
const editCalendarEntry = (calendarId, event) => googleApi._getGoogleApiClient()
        .client.calendar.events.patch({
            'calendarId': calendarId,
            'eventId': event.id,
            'resource': event
        }).then(e => {
            if (e.status === 200) {
                const eventId = new URL(e.result.htmlLink).searchParams.get('eid');
                const eventUrl = `https://calendar.google.com/calendar/r/eventedit/${eventId}`;

                console.log('event edited', e);

                window.open(eventUrl, '_blank').focus();

                return e.result;
            }
        });

const createCalendarEntry = (calendarId, event) => googleApi._getGoogleApiClient()
    .client.calendar.events.insert({
        'calendarId': calendarId,
        'resource': event
    }).then(e => {
        if (e.status === 200) {
            const eventId = new URL(e.result.htmlLink).searchParams.get('eid');
            const eventUrl = `https://calendar.google.com/calendar/r/eventedit/${eventId}`;

            console.log('event created', e);

            window.open(eventUrl, '_blank').focus();

            return e.result;
        }
    });

const insertCalendarEntry = (calendarId, event) => googleApi.get()
    .then(() => googleApi.isSignedIn())
    .then(isSignedIn => {
        console.log('isSignedIn', isSignedIn);
        if (!isSignedIn) {

            return attemptSignInToGoogleApi()
                .then(() => getCalendarEntry(calendarId, event.id))
                .then(calendarEvent => {
                    console.log('calendarEvent', calendarEvent);
                    if (calendarEvent) {
                        editCalendarEntry(calendarId, event);
                    } else {
                        createCalendarEntry(calendarId, event);
                    }
                });
        }

        getCalendarEntry(calendarId, event.id)
            .then(calendarEvent => {
                if (calendarEvent) {
                    editCalendarEntry(calendarId, event);
                } else {
                    createCalendarEntry(calendarId, event);
                }
            });

    });

export default insertCalendarEntry;
