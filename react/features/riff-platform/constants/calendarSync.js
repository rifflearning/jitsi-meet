export const GOOGLE_API_STATES = {
    // The state in which the Google API still needs to be loaded.
    NEEDS_LOADING: 0,

    // The state in which the Google API is loaded and ready for use.
    LOADED: 1,

    // The state in which a user has been logged in through the Google API.
    SIGNED_IN: 2
};

export const ERRORS = {
    AUTH_FAILED: 'sign_in_failed'
};

export const GOOGLE_EDIT_LINK = 'https://calendar.google.com/calendar/r/eventedit';

export const MS_API_CONFIGURATION = {

    // The URL to use when authenticating using Microsoft API.
    AUTH_ENDPOINT:
        'https://login.microsoftonline.com/common/oauth2/v2.0/authorize?',

    CALENDAR_ENDPOINT: '/me/calendars',

    // The Microsoft API scopes to request access for calendar.
    MS_API_SCOPES: 'openid profile Calendars.ReadWrite',

    // See https://docs.microsoft.com/en-us/azure/active-directory/develop/
    //  v2-oauth2-implicit-grant-flow#send-the-sign-in-request. This value is
    //  needed for passing in the proper domain_hint value when trying to refresh
    //  a token silently.
    MS_CONSUMER_TENANT: '9188040d-6c67-4c5b-b112-36a304b66dad',

    // The redirect URL to be used by the Microsoft API on successful
    // authentication.
    REDIRECT_URI: `${window.location.origin}/static/msredirect.html`
};
