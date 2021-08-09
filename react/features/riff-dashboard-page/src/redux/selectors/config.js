/* ******************************************************************************
 * config.js                                                                    *
 * *************************************************************************/ /**
 *
 * @fileoverview Selectors to access configuration settings
 *
 * Currently configuration settings are found in the global object
 * `window.client_config`.
 * At some point they may want to be moved to the redux store in which case
 * the methods defined here will need a `state` argument.
 *
 * Created on       January 20, 2020
 * @author          Michael Jay Lippert
 *
 * @copyright (c) 2020-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

// DevNote: if you need to import logger,
// do it from the util file directly rather than the utils/index
// in order to avoid a circular dependency as the firebase_utils import this file!

/**
 * The configuration settings that were initialized when the app was loaded
 * They should NOT be modfied.
 */
const configSettings = window.client_config || {};

/**
 * Type of the configuration settings for meetings
 *
 * @typedef {!Object} MeetingSettings
 *
 * @property {boolean} enableMeetingMediator
 *      determines if the meeting mediator should be enabled (shown) while
 *      in a meeting
 * @property {boolean} enablePostMeetingSurvey
 *      determines whether the post meeting survey should be shown overlayed
 *      on the dashboard when leaving a meeting
 * @property {boolean} enableDoc
 *      currently ignored, in future should enable or disable the presence of
 *      the meeting doc
 * @property {boolean} useConfigDoc
 *      determines if the meeting "document" shown in a meeting is determined
 *      by configuration settings, or if the meeting participants may share
 *      any arbitrary url as the meeting document.
 * @property {boolean} showDocOnJoin
 *      only used when useConfigDoc is true, in which case it determines
 *      if the doc is shown or hidden when the meeting is joined. The
 *      user can then hide a shown doc, or show a hidden doc.
 * @property {'googleDoc' | 'url'} docType
 *      the type of config meeting doc. Only 'url is supported at this time
 *      which means to display the configured 'docUrl',
 *      We may eventually support other options such as sim or whiteboard...
 * @property {string} docUrl
 *      the url of the meeting doc if the `docType` is 'url'
 * @property {Array<'uid' | 'room' | 'display_name'>} docUrlParams
 *      only used when useConfigDoc is true. Specifies the query parameters
 *      to be appended to the docUrl when loading that url. This enables
 *      some specific information to be passed to that url, for example
 *      for a shared simulation exercise.
 */

/**
 * Type of the configuration settings for the survey interface for registration,
 * login etc.
 *
 * These values are tied to how Riff has currently created this survey functionality
 * using [Qualtrics](https://www.qualtrics.com).
 *
 * @typedef {!Object} SurveySettings
 *
 * @property {string} domain
 *      the base domain of the survey paths
 * @property {string} registerPath
 *      the path on the base domain to the registration survey
 * @property {string} loginPath
 *      the path on the base domain to the login survey
 * @property {string} completeBaselinePath
 *      the path on the base domain to the login survey
 * @property {string} postMeetingPath
 *      the path on the base domain to the post meeting survey
 */

/* ******************************************************************************
 * getSurveySettings                                                       */ /**
 *
 * Get the survey settings used for user registration, login and the post
 * meeting survey.
 * @see SurveySettings type definition
 *
 * @returns {SurveySettings}
 */
function getSurveySettings() {
    return configSettings.survey;
}

/* ******************************************************************************
 * getMeetingSettings                                                      */ /**
 *
 * Get the configuration settings for meetings
 * @see MeetingSettings type definition
 *
 * @returns {MeetingSettings}
 */
function getMeetingSettings() {
    return configSettings.meeting;
}

/* ******************************************************************************
 * getShowMeetingMediator                                                  */ /**
 *
 * Get settings for whether the meeting mediator should be enabled in meetings.
 *
 * @returns {boolean}
 */
function getShowMeetingMediator() {
    return Boolean(getMeetingSettings().enableMeetingMediator);
}

/* ******************************************************************************
 * getSignalMasterSettings                                                 */ /**
 *
 * Get the signalmaster server settings
 *
 * @returns {{ url: string, path: ?string }}
 */
function getSignalMasterSettings() {
    return configSettings.signalMaster;
}

/* ******************************************************************************
 * getRiffdataSettings                                                     */ /**
 *
 * Get the riffdata server settings
 *
 * @returns {{ url: string, path: ?string, email: string, password: string }}
 */
function getRiffdataSettings() {
    return configSettings.dataServer;
}

/* ******************************************************************************
 * getFirebaseConfig                                                       */ /**
 *
 * Get the firebase config settings
 *
 * @returns {Object} configuration settings to enable user authentication for
 *      Riff Learning.
 */
function getFirebaseConfig() {
    return {
        apiKey: process.env.API_KEY,
        authDomain: process.env.AUTH_DOMAIN,
        databaseURL: process.env.DATABASE_URL,
        projectId: process.env.PROJECT_ID,
        storageBucket: process.env.STORAGE_BUCKET,
        messagingSenderId: process.env.MESSAGING_SENDER_ID
    }
    return configSettings.firebase;
}

/* ******************************************************************************
 * getWebRtcDebug                                                          */ /**
 *
 * Get the setting which determines if webrtc debug logging should be enabled.
 *
 * @returns {boolean} true if webrtc debugging should be enabled.
 */
function getWebRtcDebug() {
    return Boolean(configSettings.webrtc_debug);
}

/* ******************************************************************************
 * getConfigLogLevel                                                       */ /**
 *
 * Get the configured log level setting.
 * See libs/utils/logger.js for valid log level values.
 * TODO: change the config from just debug true/false to specifying a level.
 *
 * @returns {'debug' | 'info' | 'warn' | 'error'}
 */
function getConfigLogLevel() {
    return configSettings.react_app_debug ? 'debug' : 'info';
}

/* ******************************************************************************
 * getRtcServerVer                                                         */ /**
 *
 * Get the version string of the rtc server which is currently running from
 * the config.
 *
 * @returns {string}
 */
function getRtcServerVer() {
    return configSettings.rtcServerVer;
}

/* ******************************************************************************
 * getDummyEmailDomain                                                     */ /**
 *
 * Get the dummy email domain to use for constructed email addresses (such as
 * for query param login).
 *
 * @returns {string}
 */
function getDummyEmailDomain() {
    return configSettings.dummyEmailDomain;
}

/* ******************************************************************************
 * getUseSurveyLogin                                                       */ /**
 *
 * Get the setting which specifies that user login and signup/registration
 * should be done from the survey urls.
 *
 * @returns {boolean}
 */
function getUseSurveyLogin() {
    return configSettings.useSurveyLogin === true;
}

/* ******************************************************************************
 * getIsPersonalMode                                                       */ /**
 *
 * Get the setting which specifies that the site only supports "personal mode"
 * meetings. Each user has their own room to invite others to meet in via the
 * invite link, and room names are not visible or editable.
 *
 * @returns {boolean}
 */
function getIsPersonalMode() {
    return configSettings.personalMode === true;
}


/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    getConfigLogLevel,
    getDummyEmailDomain,
    getFirebaseConfig,
    getIsPersonalMode,
    getMeetingSettings,
    getRiffdataSettings,
    getRtcServerVer,
    getShowMeetingMediator,
    getSignalMasterSettings,
    getSurveySettings,
    getUseSurveyLogin,
    getWebRtcDebug,
};
