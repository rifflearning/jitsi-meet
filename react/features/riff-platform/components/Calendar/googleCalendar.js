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
                console.log('event created', e);

                return e.result;
            });

    });

export default createCalendarEntry;
