/* eslint-disable no-unused-vars, no-var */

// Riff Analytics feature settings
const riffConfig = {
    /** access to the riffdata server for sending/receiving meeting metrics */
    riffdata: {
        // by default, we use the riffdata server located on the same server
        // jitsi-meet is being served from
        url: '/',
        path: '/api/videodata',
        email: 'default-user-email',
        password: 'default-user-password'
    },

    /** access to the api-gateway for user authentication, meeting scheduling, etc. */
    apiGateway: {
        // by default, we use the api gateway located on the same server
        // jitsi-meet is being served from
        url: '/api-gateway'
    },

    /**
     * If true this site is intended ONLY for embedded meetings with
     * user and meeting info supplied via query params
     */
    embeddedAccessOnly: false,

    metrics: {
        showExperimentalMetrics: false,
        showEmotionsMetrics: false,
        sendUtteranceVolumes: false
    },

    scheduler: {
        enableGroupMeetings: false
    },

    /** Various settings for the meeting UI */
    meeting: {
        /** should the meeting mediator be available */
        enableMeetingMediator: true,

        /**
         * should we start the user in 'presenter mode'
         * when they share their screen?
         */
        enablePresenterModeByDefault: false,

        showMediatorOnJoinRegistered: true,
        showMediatorOnJoinAnonymous: true
    },

    calendar: {
        enableCalendarIntegration: false,
        googleApiAppClientId: '',
        microsoftApiAppClientId: ''
    }
};

// uncomment this to enable setting riffConfig settings via URL Params
// window.riffConfig = riffConfig;
/* eslint-enable no-unused-vars, no-var */
