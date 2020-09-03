/* ******************************************************************************
 * App.jsx                                                                      *
 * *************************************************************************/ /**
 *
 * @fileoverview Top level react component of the Riff Platform SPA
 *
 * Note: This has been the main page of the "app" from when this was rythm-rtc
 * and was not a single page app.
 *
 * Created on       August 7, 2017
 * @author          Jordan Reedie
 * @author          Dan Calacci
 * @author          Michael Jay Lippert
 *
 * @copyright (c) 2017-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

import React from 'react';
import PropTypes from 'prop-types';
import { Route, Router } from 'react-router';
import { Helmet } from 'react-helmet';
import { ScaleLoader } from 'react-spinners';
import { v4 as uuidv4 } from 'uuid';

import { store } from 'redux/store';
import { getDummyEmailDomain, getIsPersonalMode, getUseSurveyLogin } from 'redux/selectors/config';
import {
    getCanUserBeInvited,
    getIsUserLoggedIn,
    getUserId,
    getUserRoomId,
} from 'redux/selectors/user';
import { Routes } from 'redux/constants';
import { Colors, isCSSAnimationsSupported, logger, surveys } from 'libs/utils';

import { Chat } from 'components/Chat';
import { Dashboard } from 'components/Dashboard';
import { ExternalRedirect } from 'components/external_redirect';
import { Home } from 'components/Home';
import { LogIn } from 'components/LogIn';
import { NavBar } from 'components/NavBar';
import { Profile } from 'components/Profile';
import { SignUp } from 'components/SignUp';

import { browserHistory } from '../../history';

import { LoadingTextAlt, SkipContent } from './styled';

// TODO decide where to put this
/** how many characters should an invite id be? */
const INVITE_LENGTH = 10;

const LoadingView = () => {
    const loadingIndication = isCSSAnimationsSupported()
        ? <ScaleLoader color={Colors.lightRoyal}/>
        : <LoadingTextAlt>{'Loading...'}</LoadingTextAlt>;

    return (
        <div className='columns has-text-centered is-centered is-vcentered' style={{ minHeight: '100vh' }}>
            <div className='column is-vcentered has-text-centered' aria-label='loading'>
                {loadingIndication}
            </div>
        </div>
    );
};

/* ******************************************************************************
 * App                                                                     */ /**
 *
 * React component to present the Riff Platform SPA (single page application).
 * It controls routing between pages, etc.
 *
 ********************************************************************************/
class App extends React.Component {
    static propTypes = {

        /** true when the connection to the riffdata server has been established */
        isRiffConnected: PropTypes.bool.isRequired,

        /** function to connect to the riffdata server */
        authenticateRiff: PropTypes.func.isRequired,

        /** function to change (replace current route in router history) the current route */
        changeRoute: PropTypes.func.isRequired,

        /** function to dispatch actions when an lti user has successfully logged in */
        ltiUserLoggedIn: PropTypes.func.isRequired,

        /** function to dispatch actions when a query parameter user has successfully logged in */
        qparamUserLoggedIn: PropTypes.func.isRequired,

        /** function to start the firebase login listener */
        startFirebaseLoginListener: PropTypes.func.isRequired,

        /** function to set the room name from a teams meeting invitation */
        setRoomName: PropTypes.func.isRequired,

        /** function to set the room id */
        setRoomId: PropTypes.func.isRequired,

        /** function to set the invite id from a personal meeting invitation */
        setInviteId: PropTypes.func.isRequired,

        // match, location and history are props added by withRouter() from 'react-router-dom'
        /** contains information about how a <Route path> matched the URL */
        match: PropTypes.shape({
            params: PropTypes.object,
            isExact: PropTypes.bool,
            path: PropTypes.string,
            url: PropTypes.string,
        }),

        /** represents where the app is now, where you want it to go, or even where it was */
        location: PropTypes.shape({
            key: PropTypes.string,
            pathname: PropTypes.string,
            search: PropTypes.string,
            hash: PropTypes.string,
            state: PropTypes.object,
        }).isRequired,

        /** allows you to manage and handle the browser history */
        history: PropTypes.shape({
            length: PropTypes.number,
            action: PropTypes.string,
            location: PropTypes.object,
            push: PropTypes.func,
            replace: PropTypes.func,
            go: PropTypes.func,
            goBack: PropTypes.func,
            goForward: PropTypes.func,
            block: PropTypes.func,
        }),
    };

    /* **************************************************************************
     * constructor                                                         */ /**
     *
     * App constructor.
     * This react component is created when the SPA is loaded (or refreshed)
     * so this is a good place for initial actions that really only need to
     * happen once.
     *
     * @param {object} props
     */
    constructor(props) {
        super(props);

        if (!this.props.isRiffConnected) {
            this.props.authenticateRiff();
        }

        this.checkExternalLogin();

        // Using the survey login replaces firebase authentication entirely
        if (!getUseSurveyLogin()) {
            // Start the firebase login listener after checking external login so
            // they take precedence
            logger.debug('App.constructor: Start the firebase login listener');
            this.props.startFirebaseLoginListener();
        }

        if (getIsPersonalMode()) {
            this.checkForJoinOrHost();
        }
        else {
            this.checkForTeamsInvite();
        }
    }

    /* **************************************************************************
     * componentDidUpdate                                                  */ /**
     *
     * componentDidUpdate() is invoked immediately after updating occurs. This
     * method is not called for the initial render.
     *
     * Use this as an opportunity to operate on the DOM when the component has
     * been updated.
     * = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = = =
     * Whenever the route (pathname) changes, if some element had focus,
     * remove focus from that element and set it on the body (top element).
     * This helps w/ a11y keyboard navigation.
     *
     * Additionally, when the route changes, update the redux state relevant to
     * hosting/joining meetings
     */
    componentDidUpdate(prevProps) {
        const currentPath = this.props.location.pathname;
        if (prevProps.location.pathname !== currentPath) {
            if (document.activeElement) {
                document.activeElement.blur();
                document.body.focus();
            }
            if (getIsPersonalMode()) {
                if (currentPath.startsWith(Routes.Join) || currentPath === Routes.Host) {
                    this.updateRoomInfo();
                }
            }
        }
    }

    /* **************************************************************************
     * render                                                              */ /**
     *
     * Required method of a React component.
     * @see {@link https://reactjs.org/docs/react-component.html#render|React.Component.render}
     */
    render() {
        // login/signup routes are external for Qualtrics survey auth and internal
        // for firebase auth.
        let externalRoutes = null;
        let internalRoutes = null;
        if (getUseSurveyLogin()) {
            externalRoutes = (
                <>
                    <Route exact={true} path={Routes.SignIn}>
                        <ExternalRedirect href={surveys.loginUrl}/>
                    </Route>
                    <Route exact={true} path={Routes.SignUp}>
                        <ExternalRedirect href={surveys.registerUrl}/>
                    </Route>
                </>
            );
        }
        else {
            internalRoutes = (
                <>
                    <Route exact={true} path={Routes.SignIn} component={LogIn}/>
                    <Route exact={true} path={Routes.SignUp} component={SignUp}/>
                </>
            );
        }

        const activeRoute = this.props.location.pathname;

        return (
            <div>
                <Helmet defaultTitle='Riff' titleTemplate='%s - Riff'/>
                <Router history={browserHistory}>
                    {/* External Redirect Routes that should happen regardless of other state */}
                    {externalRoutes}

                    <div>
                        <SkipContent>
                            <a href={`${activeRoute}#main-content-container`}>
                                {'skip to main content'}
                            </a>
                        </SkipContent>
                        <NavBar
                            activeRoute={activeRoute}
                        />
                        {!this.props.isRiffConnected ? (
                            <LoadingView/>
                        ) : (
                            <div id='main-content-container'>
                                <Route path={`(${Routes.Home}|.|/)`} component={Home}/>
                                <Route exact={true} path={Routes.Chat} component={Chat}/>
                                <Route exact={false} path={Routes.Join} component={Chat}/>
                                <Route exact={true} path={Routes.Host} component={Chat}/>
                                <Route exact={true} path={Routes.Metrics} component={Dashboard}/>
                                <Route exact={true} path={Routes.UserProfile} component={Profile}/>
                                {internalRoutes}
                            </div>
                        )}
                    </div>
                </Router>
            </div>
        );
    }

    /* **************************************************************************
     * updateRoomInfo                                                      */ /**
     *
     * Update redux state to reflect route change to host or join. Only called
     * when in Routes.Host or Routes.Join
     *
     */
    updateRoomInfo() {
        const state = store.getState();
        if (this.props.location.pathname === Routes.Host) {
            this.props.setRoomId(state.user.roomId);
        }
        else {
            this.props.setRoomId(state.chat.inviteId);
        }
    }

    /* **************************************************************************
     * checkExternalLogin                                                  */ /**
     *
     * Login credentials may be provided by query params or by Lti.
     * Lti credentials will be checked for and used first, then query params.
     * if either is found they will override any current login otherwise
     * the currently logged in user (from the persistent store) will remain
     * logged in (this supports browser refresh from various pages).
     *
     * @returns {boolean} true if external info logged in a user
     */
    checkExternalLogin() {
        if (this.tryLoginFromLti()) {
            return true;
        }

        if (this.tryLoginFromQueryParams()) {
            return true;
        }

        // No credentials supplied, check if a user is already logged in

        // grab the uid from the state directly because if we pass it through props
        // we'll re-render after logging in when we really don't need to.
        const state = store.getState();
        if (getIsUserLoggedIn(state)) {
            logger.info(`App.checkExternalLogin: user "${getUserId(state)}" is logged in`);
        }
        else {
            logger.info('App.checkExternalLogin: No logged in user');

            // You must be logged in to see metrics or join a meeting. If the user was trying
            // to go to one of those places and they're not logged in send them to /home
            const noUserNoRoute = [ Routes.Metrics, Routes.Chat ];
            const pathname = this.props.location.pathname;
            if (noUserNoRoute.includes(pathname)) {
                logger.warn(`App: invalid route w/ no user "${pathname}", replace w/ ${Routes.Home}`);
                this.props.changeRoute(Routes.Home);
            }
        }

        return false;
    }

    /* **************************************************************************
     * tryLoginFromLti                                                     */ /**
     *
     * Check for Lti credentials and if found use them to login, return true
     * if successful, false if Lti credentials were not used to login.
     *
     * @returns {boolean} true if Lti credentials were found and used to login
     */
    tryLoginFromLti() {
        const ltiCredentialsFound = window.lti_data.lti_user && window.lti_data.is_valid;

        if (!ltiCredentialsFound) {
            return false;
        }

        const ltiData = window.lti_data;

        const user = {
            uid:      ltiData.user.id,
            email:    ltiData.user.email,
            fullName: ltiData.user.name.full,
        };
        const roomName = ltiData.group;

        logger.info('App.tryLoginFromLti: Logging in Lti user', { user, roomName });

        // Dispatch actions to login and set display name and room name
        this.props.ltiUserLoggedIn({ user, roomName });

        // lastly the route for lti login needs to be adjusted to the appropriate
        // destination page
        const ltiLaunchPathPrefix = '/lti/launch';
        let launchPath = this.props.location.pathname;
        if (launchPath.startsWith(ltiLaunchPathPrefix)) {
            launchPath = launchPath.slice(ltiLaunchPathPrefix.length);
            launchPath = launchPath || '/';
            this.props.changeRoute(launchPath);
        }

        return true;
    }

    /* **************************************************************************
     * tryLoginFromQueryParams                                             */ /**
     *
     * Check for query param credentials and if found use them to login, return
     * true if successful, false if query param credentials were not used to
     * login.
     *
     * @returns {boolean} true if query param credentials were found and used
     *      to login
     */
    tryLoginFromQueryParams() {
        const params = new URLSearchParams(this.props.location.search);

        const queryCredentialsFound = params.has('uid');

        if (!queryCredentialsFound) {
            return false;
        }

        let uid = params.get('uid');
        const displayName = params.get('name');
        const roomName = params.get('room');

        // if a temporary id is requested, create it now
        if (uid === '{tempId}') {
            uid = `tmp-${uuidv4()}`;
        }

        const email = `${uid}@${getDummyEmailDomain()}`;
        const usersDefaultDisplayName = displayName || 'Anonymous';

        const user = { uid, email, displayName: usersDefaultDisplayName };

        logger.info('App.tryLoginFromQueryParams: Logging in with qparam user', { user, roomName });

        // Dispatch actions to login and set display name and room name
        this.props.qparamUserLoggedIn({ user, roomName });

        return true;
    }

    /* **************************************************************************
     * checkForTeamsInvite                                               */ /**
     *
     * Currently a meeting invite is simple. The route is to the chat lobby
     * AND there is a 'room' parameter whose value is the room name to be
     * entered in the lobby field.
     *
     * If a meeting invite is found, the route should be the chat lobby IF
     * a user is logged in, and the login page if no user is logged in.
     */
    checkForTeamsInvite() {
        const params = new URLSearchParams(this.props.location.search);
        const pathname = this.props.location.pathname;
        const isMeetingInvite = pathname === Routes.Chat && params.has('room');

        // Grab any needed user info from the state directly because if we pass
        // it through props we'll re-render after logging in when we really
        // don't need to.
        const state = store.getState();

        // Either no meeting invite or the user can't be invited in this manner
        // (ie lti and qparam users have their own invite mechanism)
        if (!isMeetingInvite || !getCanUserBeInvited(state)) {
            return;
        }

        // Set the invitation room name (user may still change the name)
        const roomName = params.get('room');
        this.props.setRoomName(roomName);

        if (getIsUserLoggedIn(state)) {
            // We're good the route is already Routes.Chat
            logger.info(`App.checkForMeetingInvite: user "${getUserId(state)}" ` +
                        `is invited to a meeting in room "${roomName}"`);
            return;
        }

        logger.info('App.checkForMeetingInvite: unknown user is invited to a meeting in room ' +
                    `"${roomName}". redirecting to the login page`);

        this.props.changeRoute(Routes.SignIn);
    }

    /* **************************************************************************
     * checkForJoinOrHost                                                  */ /**
     *
     * If the route is Join AND there is a 10 char room ID appended to the path,
     * we have an invite
     *
     * If a meeting invite is found, the route should be the chat lobby IF
     * a user is logged in, and the login page if no user is logged in.
     *
     * If a meeting invite is not found (aka we are hosting), but the user is signed in,
     * we should set the room id to their personal room and let them continue
     */
    checkForJoinOrHost() {
        // Grab any needed user info from the state directly because if we pass
        // it through props we'll re-render after logging in when we really
        // don't need to.
        const state = store.getState();

        const pathname = this.props.location.pathname;
        const splitPath = pathname.split('/');
        const baseRoute = `/${splitPath[1]}`;
        const inviteRoomId = splitPath.length > 2 ? splitPath[2] : '';
        const isJoinOrHost = baseRoute === Routes.Join || baseRoute === Routes.Host;
        if (!isJoinOrHost) {
            // this is neither a join nor host, abort.
            return;
        }

        const isMeetingInvite = baseRoute === Routes.Join && inviteRoomId.length === INVITE_LENGTH;
        const isLoggedIn = getIsUserLoggedIn(state);
        // if it's an invite, obviously just use the invite
        if (isMeetingInvite) {
            // set the invite id separately from the room id
            // we want to store the invite id so we can return to
            // it if we navigate to another page
            // set the room id so it will be ready as soon as the user gets redirected to the lobby
            this.props.setInviteId(inviteRoomId);
            this.props.setRoomId(inviteRoomId);
        }
        // if it's not an invite and we're logged in,
        // set the room Id to the user's personal room
        else if (!isMeetingInvite && isLoggedIn) {
            this.props.setRoomId(getUserRoomId(state));
        }
        // roomId will not be set if this is not an invite and the user is not logged in

        if (isLoggedIn) {
            // We're good the route is already to the lobby
            logger.info(`App.checkForPersonalInvite: user "${getUserId(state)}" ` +
                        `is invited to a meeting in room "${inviteRoomId}"`);
            return;
        }

        // if we're not logged in but trying to go to
        // either the join or host page, the user must sign in
        this.props.changeRoute(Routes.SignIn);
    }
}

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    App,
};
