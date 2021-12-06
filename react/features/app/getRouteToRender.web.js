// @flow
import { generateRoomWithoutSeparator } from '@jitsi/js-utils/random';

import { isRoomValid } from '../base/conference';
import { isSupportedBrowser, isSupportedMobileBrowser } from '../base/environment';
import { isMobileBrowser } from '../base/environment/utils';
import { toState } from '../base/redux';
import { Conference } from '../conference';
import { getDeepLinkingPage } from '../deep-linking';
import {
    isLtiUser,
    setLtiUserData,
    shouldRedirectToRiff
} from '../riff-platform/actions/jitsiActions';
import RiffPlatform from '../riff-platform/components';
import UnsupportedMobileBrowser from '../riff-platform/components/UnsupportedBrowser';
import {
    isLtiPath,
    isRiffPlatformCurrentPath,
    ltiPathTranslator
} from '../riff-platform/functions';
import { UnsupportedDesktopBrowser } from '../unsupported-browser';
import { BlankPage, isWelcomePageUserEnabled, WelcomePage } from '../welcome';

/**
 * Determines which route is to be rendered in order to depict a specific Redux
 * store.
 *
 * @param {(Function|Object)} stateful - THe redux store, state, or
 * {@code getState} function.
 * @returns {Promise<Object>}
 */
export async function _getRouteToRender(stateful: Function | Object): Promise<Route> {
    const state = toState(stateful);

    // this was previously happening in shouldRedirectToRiff
    // I pulled it out here, but i'm not sure it really belongs here either.
    // NOTE - we rely on the data from setLtiUserData in _getLtiRoute.
    // however, since that is updated in redux, we actually
    // don't have access to it in this function
    // since the redux state gets updated in setLtiUserData
    // but we still have the same state object from before
    // we called it
    // So, for now, we also return and capture the lti data
    // from setLtiUserData.
    // TODO (jr) - think about when not on a tight deadline :)
    let ltiData = null;

    if (isLtiUser()) {
        ltiData = await setLtiUserData();
    } else if (await shouldRedirectToRiff()) {
        const route = {
            component: RiffPlatform,
            href: undefined
        };

        return Promise.resolve(route);
    }

    if (navigator.product === 'ReactNative') {
        return _getMobileRoute(state);
    }

    return (
        _getLtiRoute(ltiData)
        || _getRiffPlatformRoute()
        || _getWebConferenceRoute(state)
        || _getWebWelcomePageRoute(state)
    );
}

/**
 * Returns the {@code Route} to display when trying to access a conference if
 * a valid conference is being joined.
 *
 * @returns {Promise<Route>|undefined}
 */
function _getRiffPlatformRoute(): ?Promise<Route> {
    if (isRiffPlatformCurrentPath()) {
        const route = {
            component: RiffPlatform,
            href: undefined
        };

        return Promise.resolve(route);
    }

    return undefined;
}

/**
 * Returns the {@code Route} to display if the user
 * navigated here via LTI.
 *
 * NOTE - we are passing ltiData instead of the redux state
 * only as a temporary solution.
 * We should be passing the redux state once the LTI login is refactored.
 *
 * @param {Object} ltiData - The LTI data. Temporary solution,
 *    we do not want this here long term.
 * @returns {Promise<Route>|undefined}
 */
function _getLtiRoute(ltiData): ?Promise<Route> {
    const currentPath = window.location.pathname;

    if (!isLtiPath(currentPath) || ltiData === null) {
        return;
    }

    const route = _getEmptyRoute();

    // mock the redux state to send ltiPathTranslator
    // once we refactor we can just pass the state
    const mockState = {
        'features/riff-platform': {
            meeting: {
                meeting: { roomId: ltiData.roomId }
            }
        }
    };

    const newPath = ltiPathTranslator(currentPath, mockState);

    route.href = new URL(newPath, window.location.origin).toString();

    return Promise.resolve(route);
}

/**
 * Returns the {@code Route} to display on the React Native app.
 *
 * @param {Object} state - The redux state.
 * @returns {Promise<Route>}
 */
function _getMobileRoute(state): Promise<Route> {
    const route = _getEmptyRoute();

    if (isRoomValid(state['features/base/conference'].room)) {
        route.component = Conference;
    } else if (isWelcomePageAppEnabled(state)) {
        route.component = WelcomePage;
    } else {
        route.component = BlankPage;
    }

    return Promise.resolve(route);
}

/**
 * Returns the {@code Route} to display when trying to access a conference if
 * a valid conference is being joined.
 *
 * @param {Object} state - The redux state.
 * @returns {Promise|undefined}
 */
function _getWebConferenceRoute(state) {
    if (!isRoomValid(state['features/base/conference'].room)) {
        return;
    }

    const route = _getEmptyRoute();

    // Update the location if it doesn't match. This happens when a room is
    // joined from the welcome page. The reason for doing this instead of using
    // the history API is that we want to load the config.js which takes the
    // room into account.
    const { locationURL } = state['features/base/connection'];

    if (window.location.href !== locationURL.href) {
        route.href = locationURL.href;

        return Promise.resolve(route);
    }

    return getDeepLinkingPage(state)
        .then(deepLinkComponent => {
            if (deepLinkComponent) {
                route.component = deepLinkComponent;
            } else if (isSupportedBrowser() && !isMobileBrowser()) {
                route.component = Conference;
            } else if (isMobileBrowser() && isSupportedMobileBrowser()) {
                route.component = Conference;
            } else if (isMobileBrowser() && !isSupportedMobileBrowser()) {
                route.component = UnsupportedMobileBrowser;
            } else {
                route.component = UnsupportedDesktopBrowser;
            }

            return route;
        });
}

/**
 * Returns the {@code Route} to display when trying to access the welcome page.
 *
 * @param {Object} state - The redux state.
 * @returns {Promise<Object>}
 */
function _getWebWelcomePageRoute(state) {
    const route = _getEmptyRoute();

    if (isWelcomePageUserEnabled(state)) {
        if (isSupportedBrowser()) {
            route.component = WelcomePage;
        } else {
            route.component = UnsupportedDesktopBrowser;
        }
    } else {
        // Web: if the welcome page is disabled, go directly to a random room.

        let href = window.location.href;

        href.endsWith('/') || (href += '/');
        route.href = href + generateRoomWithoutSeparator();
    }

    return Promise.resolve(route);
}

/**
 * Returns the default {@code Route}.
 *
 * @returns {Object}
 */
function _getEmptyRoute() {
    return {
        component: BlankPage,
        href: undefined
    };
}
