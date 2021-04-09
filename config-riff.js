/* eslint-disable no-unused-vars, no-var */

// Riff Analytics feature settings
const riffConfig = {
    /** access to the riffdata server for sending/receiving meeting metrics */
    riffdata: {
        url: '/',
        path: '/api/videodata',
        email: 'default-user-email',
        password: 'default-user-password'
    },

    /** access to the api-gateway for user authentication, meeting scheduling, etc. */
    apiGateway: {
        url: '/',
        path: '/api-gateway'
    },

    /**
     * If true this site is intended ONLY for embedded meetings with
     * user and meeting info supplied via query params
     */
    embeddedAccessOnly: false,

    userAuthentication: {
        /** The host of a meeting may allow it to have anonymous participants */
        allowAnonymousLogin: true
    },

    metrics: {
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
        showMediatorOnJoinAnonymous: true,

        /** is document sharing available? */
        enableDoc: true,

        /** What type of document can be shared? only 'url' at this time */
        docType: 'url',

        /**
         * useConfigDoc determines if the URL sharing feature is replaced
         * by sharing the single doc defined here in docUrl.
         * The settings docUrl, docUrlParams and showDocOnJoin only
         * apply if useConfigDoc is true.
         */
        useConfigDoc: false,
        showDocOnJoin: true,
        docUrl: 'https://www.riffanalytics.ai',

        /**
         * runtime values to be passed to the url doc as query params
         * any or none of these: 'uid', 'room', 'display_name'
         */
        docUrlParams: []
    }
};

/* eslint-enable no-unused-vars, no-var */
