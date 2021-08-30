import { Client } from '@microsoft/microsoft-graph-client';

export const createCalendarEntry = (calendarId, event, token) => {

    if (!token) {
        return Promise.reject('Not authorized, please sign in!');
    }

    const client = Client.init({
        authProvider: done => done(null, token)
    });

    return client
                    .api('/me/events/')
                    .post(event)
                    .then(res => {

                        console.log('res', res);
                        if (res?.id) {

                            const eventUrl = res.webLink;

                            window.open(eventUrl, '_blank').focus();
                        }

                        // const body = description.body;

                        // if (description.bodyPreview) {
                        //     body.content
                        //         = `${description.bodyPreview}<br><br>`;
                        // }

                        // // replace all new lines from the text with html
                        // // <br> to make it pretty
                        // body.content += text.split('\n').join('<br>');

                        // return client
                        //     .api(`/me/calendar/events/${id}`)
                        //     .patch({
                        //         body,
                        //         location: {
                        //             'displayName': location
                        //         }
                        //     });
                    });


};
