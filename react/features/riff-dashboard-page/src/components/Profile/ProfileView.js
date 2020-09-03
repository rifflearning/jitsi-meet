/* ******************************************************************************
 * ProfileView.jsx                                                              *
 * *************************************************************************/ /**
 *
 * @fileoverview React component for the Profile
 *
 * Created on       Feb 28, 2019
 * @author          Jordan Reedie
 * @author          Michael Jay Lippert
 *
 * @copyright (c) 2019-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

import { riffChangeRoomName } from 'redux/actions/riff';
import { firebaseSendResetLink, firebaseSetCurUserDisplayName } from 'libs/utils';
import { Notification } from 'components/Notification';

import { BasicProfileElement } from './BasicProfileElement';
import { EditableProfileElement } from './EditableProfileElement';

/* ******************************************************************************
 * ProfileView                                                             */ /**
 *
 * React component for the Profile page
 *
 ********************************************************************************/
class ProfileView extends React.Component {
    static propTypes = {

        /** The logged in user's ID */
        uid: PropTypes.string.isRequired,

        /** The logged in user's email address */
        email: PropTypes.string.isRequired,

        /** The logged in user's display name */
        displayName: PropTypes.string.isRequired,

        /** The logged in user's personal room name */
        roomName: PropTypes.string.isRequired,

        /** A function to be invoked when the user successfully changes their display name */
        firebaseSetDisplayNameSuccess: PropTypes.func.isRequired,

        /** A function to be invoked when the user changes their room name */
        changeRoomName: PropTypes.func.isRequired,
    };

    /* **************************************************************************
     * constructor                                                         */ /**
     */
    constructor(props) {
        super(props);
        this.state = {
            displayName: props.displayName,
            roomName: props.roomName,
            profileChangeStatus: 'waiting',
            profileChangeErrorMessage: null,
            isResetLinkSent: false,
        };

        this._updateDisplayName = this._updateDisplayName.bind(this);
        this._updateRoomName = this._updateRoomName.bind(this);
        this._handleUpdateProfile = this._handleUpdateProfile.bind(this);
        this._resetProfileChangeStatus = this._resetProfileChangeStatus.bind(this);
        this._handleSendResetLink = this._handleSendResetLink.bind(this);
        this._clearEmailSentNotification = this._clearEmailSentNotification.bind(this);
    }

    /* **************************************************************************
     * render                                                              */ /**
     *
     * Required method of a React component.
     * @see {@link https://reactjs.org/docs/react-component.html#render|React.Component.render}
     */
    render() {
        const containerClassNames = [ 'column',
                                      'is-full-mobile',
                                      'is-half-tablet',
                                      'is-one-third-desktop',
                                      'is-one-quarter-widescreen',
                                      'is-offset-1',
                                      'has-text-left',
        ];
        return (
            <div className='section'>
                <Helmet>
                    <title>{'Profile'}</title>
                </Helmet>
                <div className='columns'>
                    <div className={containerClassNames.join(' ')}>
                        <div style={{ marginBottom: '20px' }}>
                            <h1 className='is-size-3'>{'Profile'}</h1>
                            <p className='is-size-6'>
                                {'Update your name or change your password.'}
                            </p>
                        </div>
                        <BasicProfileElement fieldName='Email'>
                            <p>{this.props.email}</p>
                        </BasicProfileElement>
                        <BasicProfileElement fieldName='Password'>
                            <p>
                                {'Want to change your password?'}&nbsp;
                                <a href='#' onClick={this._handleSendResetLink}>{'Reset it'}</a> {'here.'}
                            </p>
                        </BasicProfileElement>
                        <EditableProfileElement
                            fieldName='Display Name'
                            fieldInput={this.state.displayName}
                            handleInput={this._updateDisplayName}
                        />
                        <EditableProfileElement
                            fieldName='Room Name'
                            fieldInput={this.state.roomName}
                            handleInput={this._updateRoomName}
                        />
                        <div className='control' style={{ marginBottom: '15px' }}>
                            <button
                                className='button is-primary'
                                onClick={this._handleUpdateProfile}
                            >
                                {'Update'}
                            </button>
                        </div>

                        <Notification
                            show={this.state.profileChangeStatus === 'success'}
                            type='is-success'
                            onClose={this._resetProfileChangeStatus}
                        >
                            {'Profile updated!'}
                        </Notification>

                        <Notification
                            show={this.state.profileChangeStatus === 'error'}
                            type='is-warning'
                            onClose={this._resetProfileChangeStatus}
                        >
                            {this.state.profileChangeErrorMessage}
                        </Notification>

                        <Notification
                            show={this.state.isResetLinkSent}
                            type='is-success'
                            onClose={this._clearEmailSentNotification}
                            style={{ marginTop: '10px' }}
                        >
                            {'A password reset link has been sent to your email address!'}
                        </Notification>
                    </div>
                </div>
            </div>
        );
    }

    /* **************************************************************************
     * _updateRoomName                                                  */ /**
     */
    _updateRoomName(event) {
        this.setState({ roomName: event.target.value });
    }

    /* **************************************************************************
     * _updateDisplayName                                                  */ /**
     */
    _updateDisplayName(event) {
        this.setState({ displayName: event.target.value });
    }

    /* **************************************************************************
     * _handleUpdateProfile                                                */ /**
     *
     * Event handler to change the user's display name or room name
     *
     * @param {HtmlEvent} event
     */
    async _handleUpdateProfile(event) {
        event.preventDefault();
        const { displayName, roomName } = this.state;

        const displayNameChanged = displayName !== this.props.displayName;
        const roomNameChanged = roomName !== this.props.roomName;
        if (!(displayNameChanged || roomNameChanged)) {
            // Nothing in the user's profile has changed, abort
            return;
        }

        try {
            if (displayName === '') {
                throw new Error('You must enter something as your display name');
            }
            if (roomName === '') {
                throw new Error('You must enter something as your room name');
            }

            if (displayNameChanged) {
                const firebaseUser = await firebaseSetCurUserDisplayName(displayName);
                this.props.firebaseSetDisplayNameSuccess(firebaseUser.uid, displayName);
            }
            if (roomNameChanged) {
                const room = await riffChangeRoomName(this.props.uid, roomName);
                this.props.changeRoomName(room.title);
            }
            this.setState({ profileChangeStatus: 'success' });
        }
        catch (err) {
            let msg = err.message;
            if (msg && msg.indexOf('This operation') > -1) {
                msg = 'Oops! For your security, we need you to log in again before ' +
                      'you can change your profile.';
            }

            this.setState({ profileChangeStatus: 'error', profileChangeErrorMessage: msg });
        }
    }

    /* **************************************************************************
     * _handleSendResetLink                                                */ /**
     *
     * Event handler for sending a password reset link to email.
     *
     * @param {HtmlEvent} event
     */
    async _handleSendResetLink(event) {
        event.preventDefault();
        try {
            await firebaseSendResetLink(this.props.email);
            this.setState({ isResetLinkSent: true });
        }
        catch (err) {
            this.setState({ error: err });
        }
    }

    /* **************************************************************************
     * _resetProfileChangeStatus                                              */ /**
     *
     * Handler to clear profile change notifications by resetting the status
     *
     * @param {HtmlEvent} event
     */
    _resetProfileChangeStatus(event) {
        event.preventDefault();
        this.setState({ profileChangeStatus: 'waiting', profileChangeErrorMessage: null });
    }

    /* **************************************************************************
     * _clearEmailSentNotification                                         */ /**
     *
     * Handler to clear the notification that a reset email has been sent.
     *
     * @param {HtmlEvent} event
     */
    _clearEmailSentNotification(event) {
        event.preventDefault();
        this.setState({ isResetLinkSent: false });
    }
}

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    ProfileView,
};
