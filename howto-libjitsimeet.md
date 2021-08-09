# lib-jitsi-meet

## Purpose
We use *lib-jitsi-meet* as the core technology for our media capturing component. The Jitsi Meet APIs have been used to create Jitsi Meet video conferences 
with a custom GUI.

We intend to build a media capturing component which connects to a vidoebridge as an hidden user to aquire media tracks (video and audio) and distribute the media 
frames via a message bus to various subscribers.

![Image](https://github.com/rifflearning/riff-jitsi-platform/blob/main/docs/Jitsi-Meet-Pipeline.png)

## Workflow
Depending on the customer subscription (multi-tenant or dedicated) a certain number of analytics services may be enabled on request via *Start Behavioral Analytics Services*.

When a request to enable *Behavioral Analytics* is seen by *jicofo*, the session manager typically triggers a built-in 'start recording' event. Our 'Meeting Manager' component intercepts this event and spawns a new *supercluster* which connects to the designated *videobridge*. The *capturer* component joins the current meeting as a *hidden user*. 

Upon establishing a connection to the *videobridge*, *capturer* begins receiving media tracks for all the meeting participants. It extracts audio and video frames and publishes them via a message bus. The message bus fans out the frames to the appropriate subscribers: speech-to-text, emotional sensing, voice sensing, gesture analysis, etc. 

Each component produces meaning output and writes it to the database. At this point this content is ready for visual consuption by the UI. We are planning on offering real time and post-factum meeting stats.

## lib-jitsi-meet internals
### Components
* ![JitsiMeetJS](https://jitsi.github.io/handbook/docs/dev-guide/dev-guide-ljm-api#jitsimeetjs)
* ![JitsiConnection](https://jitsi.github.io/handbook/docs/dev-guide/dev-guide-ljm-api#jitsiconnection)
* ![JitsiConference](https://jitsi.github.io/handbook/docs/dev-guide/dev-guide-ljm-api#jitsiconference)
* ![JitsiTrack](https://jitsi.github.io/handbook/docs/dev-guide/dev-guide-ljm-api#jitsitrack)
* ![JitsiTrackError](https://jitsi.github.io/handbook/docs/dev-guide/dev-guide-ljm-api#jitsitrackerror)


### Build

#### Source Code
![GitHub lib-jitsi-meet](https://github.com/jitsi/lib-jitsi-meet)

>NOTE: you need Node.js >= 12 and npm >= 6

To build the library, just type:
```sh
npm install
```

To lint:
```sh
npm run lint
```

and to run unit tests:
```sh
npm test
```

if you need to rebuild lib-jitsi-meet.min.js
```sh
npm run postinstall
```

Both linting and units will also be done by a pre-commit hook.

### Further reading

![lib-jitsi-meet Handbook](https://jitsi.github.io/handbook/docs/dev-guide/dev-guide-web)
![lib-jitsi-meet low level APIs](https://jitsi.github.io/handbook/docs/dev-guide/dev-guide-ljm-api)




