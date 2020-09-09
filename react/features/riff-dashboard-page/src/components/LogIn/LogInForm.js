/* ******************************************************************************
 * LogInForm.jsx                                                                *
 * *************************************************************************/ /**
 *
 * @fileoverview Login form react component
 *
 * Created on       March 4, 2019
 * @author          Jordan Reedie
 *
 * @copyright (c) 2019-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { firebaseLogin } from 'libs/utils';
import { riffGetRoomFromUser } from 'Redux/actions/riff';
import { Routes } from 'Redux/constants';
import { getIsPersonalMode } from 'Redux/selectors/config';

import { LargeHeading } from 'Components/styled';

import { SubmitButton } from 'Components/Common/Form/SubmitButton';
import { FormField } from 'Components/Common/Form/FormField';
import { FormError } from 'Components/Common/Form/FormError';

import { LogInFormContainer } from './styled';

/* ******************************************************************************
 * LogInForm                                                               */ /**
 *
 * React component for the Login form
 *
 ********************************************************************************/
class LogInForm extends React.Component {
    static propTypes = {

        /** the current inviteId, need it to know
         *  where to redirect when we log in
         */
        inviteId: PropTypes.string,

        /** function to invoke when the firebase login is successful */
        firebaseLoginSuccess: PropTypes.func.isRequired,

        /** function to invoke when forgot password is clicked */
        forgotPassword: PropTypes.func.isRequired,
    };

    /* **************************************************************************
     * constructor                                                         */ /**
     */
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            email: '',
            password: '',
        };

        this._updateEmail = this._updateEmail.bind(this);
        this._updatePassword = this._updatePassword.bind(this);
        this._forgotPassword = this._forgotPassword.bind(this);
        this._handleLogin = this._handleLogin.bind(this);
    }

    /* **************************************************************************
     * render                                                              */ /**
     *
     * Required method of a React component.
     * @see {@link https://reactjs.org/docs/react-component.html#render|React.Component.render}
     */
    render() {
        return (
            <LogInFormContainer>
                <LargeHeading>{'Sign In'}</LargeHeading>
                <p className='sub-heading'>
                    {'Sign in to save your meeting metrics and access your meeting history!'}
                </p>
                <form onSubmit={this._handleLogin}>
                    <FormError
                        error={this.state.error}
                    />
                    <FormField
                        isRequired={true}
                        labelName='Email'
                        inputName='email'
                        inputType='text'
                        placeHolder=''
                        handleFunction={this._updateEmail}
                        error={this.state.error}
                        value={this.state.email}
                    />
                    <FormField
                        isRequired={true}
                        labelName='Password'
                        inputName='password'
                        inputType='password'
                        placeHolder=''
                        handleFunction={this._updatePassword}
                        error={this.state.error}
                        value={this.state.password}
                    />
                    <p className='forgot-password'>
                        <a href='#' onClick={this._forgotPassword}>{'Forgot your password?'}</a>
                    </p>
                    <SubmitButton
                        disabled={!this._validateForm()}
                        btnText={'Sign In'}
                    />
                </form>
                <div className='sign-up-prompt'>
                    {'New to Riff Analytics? '}
                    <Link to={Routes.SignUp}>
                        {'Sign up today'}
                    </Link>
                </div>
            </LogInFormContainer>
        );
    }

    /* **************************************************************************
     * _updateEmail                                                        */ /**
     */
    _updateEmail(event) {
        this.setState({ email: event.target.value });
    }

    /* **************************************************************************
     * _updatePassword                                                     */ /**
     */
    _updatePassword(event) {
        this.setState({ password: event.target.value });
    }

    /* **************************************************************************
     * _forgotPassword                                                     */ /**
     *
     * Click handler to display the forgot password form instead of the
     * log in form
     *
     * @param {HtmlEvent} event
     */
    _forgotPassword(event) {
        event.preventDefault();
        this.props.forgotPassword(this.state.email);
    }

    /* **************************************************************************
     * _handleLogin                                                        */ /**
     *
     * Form submit handler for login.
     *
     * @param {HtmlEvent} event
     */
    async _handleLogin(event) {
        event.preventDefault();
        const { email, password } = event.target.elements;
        try {
            const firebaseUser = await firebaseLogin(email.value, password.value);
            // only bother with the fields we need
            const user = {
                uid: firebaseUser.uid,
                displayName: firebaseUser.displayName,
                email: firebaseUser.email,
                emailVerified: firebaseUser.emailVerified,
            };

            if (getIsPersonalMode()) {
                const room = await riffGetRoomFromUser(firebaseUser.uid);
                if (room) {
                    user.roomName = room.title;
                    user.roomId = room._id;
                }
                // don't need to create a room right now if we don't have one,
                // that will be handled by the firebase listener
            }

            // inviteId will always be null if we're not in personal mode, that's fine
            this.props.firebaseLoginSuccess(user, this.props.inviteId);
        }
        catch (err) {
            this.setState({ error: err });
        }
    }

    /* **************************************************************************
     * _validateForm                                                       */ /**
     */
    _validateForm() {
        return this.state.email !== '';
    }
}


/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    LogInForm,
};
