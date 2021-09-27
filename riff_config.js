/* eslint-disable no-unused-vars, no-var */

// Riff Analytics feature settings
const riffConfig = {
    /** access to the riffdata server for sending/receiving meeting metrics */
    riffdata: {
        url: '<SERVER URL HERE>',
        path: '/api/videodata',
        email: 'default-user-email',
        password: 'default-user-password'
    },

    /** access to the api-gateway for user authentication, meeting scheduling, etc. */
    apiGateway: {
        url: '<SERVER URL HERE>',
        path: '/api-gateway'
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
        showMediatorOnJoinRegistered: true,
        showMediatorOnJoinAnonymous: true
    }
};

// uncomment this to enable setting riffConfig settings via URL Params
// window.riffConfig = riffConfig;
/* eslint-enable no-unused-vars, no-var */
