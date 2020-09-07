/* ******************************************************************************
 * NavBarView.jsx                                                               *
 * *************************************************************************/ /**
 *
 * @fileoverview React component to render the site-wide nav bar
 *
 * Display the navbar unless the user is currently participating in a meeting
 *
 * Created on       August 1, 2018
 * @author          Dan Calacci
 * @author          Michael Jay Lippert
 * @author          Jordan Reedie
 * @author          Brec Hanson
 *
 * @copyright (c) 2018-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import AvatarIcon from '@material-ui/icons/AccountCircle';
import ArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';

import { AuthTypes, Routes } from 'Redux/constants';


import {
    DesktopMenu,
    Dropdown,
    MobileMenu,
    NavBar,
    ProfileBtn,
    ProfileBtnContainer,
} from './styled';


/* ******************************************************************************
 * NavBarView                                                              */ /**
 *
 * React component to present the navigation bar at the top of all pages.
 *
 ********************************************************************************/
class NavBarView extends React.Component {
    static propTypes = {

        /** is the user logged in */
        isUserLoggedIn: PropTypes.bool.isRequired,

        /** is there a connection to the riffdata server */
        isRiffConnected: PropTypes.bool.isRequired,

        /** is the site in personal mode */
        isPersonalMode: PropTypes.bool.isRequired,

        /** the authorization type of the logged in user, value is ignored if no user is logged in */
        authType: PropTypes.string.isRequired,

        /** handles logging out the user */
        handleLogOut: PropTypes.func.isRequired,

        /** is the mobile hamburger menu open */
        menuOpen: PropTypes.bool.isRequired,

        /** handles the hamburger menu icon being clicked */
        toggleMenu: PropTypes.func.isRequired,

        /** true if a user is currently in a meeting, false otherwise */
        inRoom: PropTypes.bool.isRequired,

        /** if in personal mode: true if a user got to our app through a join link, false otherwise
         *  if in teams mode: null
         */
        wasInvited: PropTypes.bool,

        /** if in personal mode: the invite id from the user's invite, if they were invited
         *  if in teams mode: null
         */
        inviteId: PropTypes.string,

        /** the active route in the app */
        activeRoute: PropTypes.oneOf([ ...Object.values(Routes), '/' ]).isRequired,

        /** the username of the logged in user */
        userName: PropTypes.string,
    };

    /* **************************************************************************
     * constructor                                                         */ /**
     */
    constructor(props) {
        super(props);

        this.state = {
            profileBtnExpanded: false,
        };

        this._toggleProfileBtnExpand = this._toggleProfileBtnExpand.bind(this);
    }

    /* **************************************************************************
     * componentDidUpdate                                                  */ /**
     */
    componentDidUpdate(prevProps) {
        if (prevProps.activeRoute !== this.props.activeRoute) {
            this._toggleProfileBtnExpand(false);
        }
    }

    /* **************************************************************************
     * render                                                              */ /**
     *
     * Required method of a React component.
     * @see {@link https://reactjs.org/docs/react-component.html#render|React.Component.render}
     */
    render() {
        // we don't display the navbar when a user is in a meeting
        if (this.props.inRoom) {
            return null;
        }

        const menuOpenClass = this.props.menuOpen ? 'is-active' : '';

        return (
            <NavBar aria-label='main navigation'>
                <div className='riff-logo'>
                    <Link
                        // to={Routes.Home}
                        to={''}
                        onClick={() => {
                            window.location.pathname = '/';
                        }}
                    >
                        <img alt={'Riff homepage'} src={'/images/riffLogo.svg'}/>
                    </Link>
                </div>
                <button
                    role='button'
                    aria-expanded={this.props.menuOpen}
                    className={`navbar-burger burger ${menuOpenClass}`}
                    onClick={this.props.toggleMenu}
                >
                    <span/>
                    <span/>
                    <span/>
                </button>
                <DesktopMenu>
                    <div className='nav-route-btns'>
                        {this._getNavRouteLinks()}
                    </div>
                    {this._getNoAuthUserLinks()}
                    {this._getProfileBtn()}
                </DesktopMenu>
                <MobileMenu>
                    <div className={`navbar-menu ${menuOpenClass}`}>
                        {this._getNavRouteLinks()}
                        {this._getAuthUserLinks()}
                        {this._getNoAuthUserLinks()}
                    </div>
                </MobileMenu>
            </NavBar>
        );
    }

    /* **************************************************************************
     * _getProfileBtn                                                      */ /**
     *
     * Get the profile button, containing links for logged in users.
     *
     * @returns {Node}
     */
    _getProfileBtn() {
        if (this.props.isUserLoggedIn) {
            return (
                <ProfileBtnContainer>
                    <ProfileBtn onClick={() => this._toggleProfileBtnExpand()}>
                        <i className='avatar-icon'>
                            <AvatarIcon/>
                        </i>
                        <span className='username'>{this.props.userName}</span>
                        <i className='arrow-icon'>
                            <ArrowDownIcon/>
                        </i>
                    </ProfileBtn>
                    <Dropdown expanded={this.state.profileBtnExpanded}>
                        <div className='dropdown-items'>
                            {this._getAuthUserLinks()}
                        </div>
                    </Dropdown>
                </ProfileBtnContainer>
            );
        }

        return null;
    }

    /* ******************************************************************************
     * _toggleProfileBtnExpand                                                 */ /**
     *
     * Toggles the expanded state of the accordion menu in the Profile button.
     * If a boolean is passed then the expand state will be set to that, else
     * the state will be toggled.
     *
     * @param {?boolean} expand - the desired state of the profile dropdown menu
     *      true - expanded, false - collapsed, undefined - toggle current state
     */
    _toggleProfileBtnExpand(expand) {
        const profileBtnExpanded = expand !== undefined ? expand : !this.state.profileBtnExpanded;
        this.setState({ profileBtnExpanded });
    }

    /* **************************************************************************
     * _getNavRouteLinks                                                   */ /**
     *
     * Get an array of links for navigation to other pages for the nav bar.
     *
     * @returns {Array<Node>}
     */
    _getNavRouteLinks() {
        const { activeRoute } = this.props;

        let chatRoute;
        let joinRoute = null;
        if (this.props.isPersonalMode) {
            if (this.props.wasInvited) {
                const joinPath = `${Routes.Join}/${this.props.inviteId}`;
                joinRoute = (
                    <Link
                        to={joinPath}
                        className={`nav-link ${activeRoute === joinPath ? 'is-active' : ''}`}
                    >
                        {'Meeting Invitation'}
                    </Link>
                );
            }
            chatRoute = (
                <Link
                    to={Routes.Host}
                    className={`nav-link ${activeRoute === Routes.Host ? 'is-active' : ''}`}
                >
                    {'Host a Meeting'}
                </Link>
            );
        }
        else {
            chatRoute = (
                <Link
                    // to={Routes.Chat}
                    to={''}
                    className={`nav-link ${activeRoute === Routes.Chat ? 'is-active' : ''}`}
                    onClick={() => {
                        window.location.pathname = `/${this.props.selectedMeeting.room}`;
                    }}
                >
                    {'Riff Video'}
                </Link>
            );
        }
        // chat and metrics can only be used by logged in users and only if we have an
        // authenticated connection to the riffdata server
        if (this.props.isUserLoggedIn && this.props.isRiffConnected) {
            return (
                <>
                    {joinRoute}
                    {chatRoute}
                    <Link
                        // to={Routes.Metrics}
                        to={''}
                        className={`nav-link ${activeRoute === Routes.Metrics ? 'is-active' : ''}`}
                    >
                        {'Riff Metrics'}
                    </Link>
                </>
            );
        }

        return null;
    }

    /* **************************************************************************
     * _getAuthUserLinks                                                   */ /**
     *
     * Get an array of user navigation links for the current logged in user.
     * The set of links will differ by configuration settings,
     * and the user's authType.
     *
     * @returns {Array<Node>}
     */
    _getAuthUserLinks() {
        const userLinks = [];
        if (this.props.isUserLoggedIn) {
            // The profile page is only relevant for firebase users
            if (this.props.authType === AuthTypes.Firebase) {
                userLinks.push(
                    <Link
                        // to={Routes.UserProfile}
                        to={''}
                        key={Routes.UserProfile}>
                        {'Profile'}
                    </Link>
                );
            }

            // We don't allow Lti users to sign out
            if (this.props.authType !== AuthTypes.Lti) {
                userLinks.push(
                    <Link
                        // to={Routes.Home}
                        to={''}
                        key='logout'
                        // onClick={this.props.handleLogOut}
                    >
                        {'Sign Out'}
                    </Link>
                );
            }

            return userLinks;
        }

        return null;
    }

    /* **************************************************************************
    * _getNoAuthUserLinks                                                  */ /**
     *
     * Get an array of user navigation links for a logged out user.
     *
     * @returns {Node}
     */
    _getNoAuthUserLinks() {
        if (!this.props.isUserLoggedIn) {
            return (
                <>
                    <Link
                        to={Routes.SignIn}
                        className='sign-in-btn'
                    >
                        {'Sign In'}
                    </Link>
                    <Link
                        to={Routes.SignUp}
                        className='sign-up-btn'
                    >
                        {this.props.isPersonalMode ? 'Sign Up For Free' : 'Sign Up'}
                    </Link>
                </>
            );
        }

        return null;
    }
}

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    NavBarView,
};
