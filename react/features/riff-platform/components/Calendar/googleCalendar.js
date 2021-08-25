import googleApi from '../../../google-api/googleApi.web';

const createCalendarEntry = (calendarId, event) => googleApi.get()
    .then(() => googleApi.isSignedIn())
    .then(isSignedIn => {
        console.log('isSignedIn', isSignedIn);
        if (!isSignedIn) {
            return null;
        }

        return googleApi._getGoogleApiClient()
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

    });

export default createCalendarEntry;
