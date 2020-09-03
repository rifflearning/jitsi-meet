/* ******************************************************************************
 * SignUpView.js                                                                *
 * *************************************************************************/ /**
 *
 * @fileoverview React component for the main Signup page
 *
 * Created on       July 24, 2018
 * @author          Dan Calacci
 * @author          Jordan Reedie
 *
 * @copyright (c) 2018-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

import { firebaseCreateUser, setWindowScrolling } from 'libs/utils';
import { riffCreateParticipant, riffGetRoomFromUser } from 'redux/actions/riff';
import { Routes } from 'redux/constants';
import { getIsPersonalMode } from 'redux/selectors/config';

import promoImage from 'Images/signup-promo-img.svg';

import { LargeHeading } from 'Components/styled';
import { Footer } from 'components/Footer/Footer';
import { SubmitButton } from 'components/Common/Form/SubmitButton';
import { FormField } from 'components/Common/Form/FormField';
import { FormError } from 'components/Common/Form/FormError';

import { SignUpViewContainer } from './styled';

/* ******************************************************************************
 * SignUpView                                                              */ /**
 *
 * React component for the Signup page
 *
 ********************************************************************************/
class SignUpView extends React.Component {
    static propTypes = {

        /** function to invoke when the firebase user has been successfully created */
        firebaseSignupSuccess: PropTypes.func.isRequired,

        /** if the user was invited to a personal meeting,
         * this will contain the invite ID
         */
        inviteId: PropTypes.string,
    };

    /* **************************************************************************
     * constructor                                                         */ /**
     */
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            displayName: '',
            roomName: '',
            termsAgreed: false,
            error: null,
        };

        this._updateEmail = this._updateEmail.bind(this);
        this._updatePassword = this._updatePassword.bind(this);
        this._updateDisplayName = this._updateDisplayName.bind(this);
        this._updateRoomName = this._updateRoomName.bind(this);
        this._updateTermsAgreed = this._updateTermsAgreed.bind(this);
        this._handleSignUp = this._handleSignUp.bind(this);
        this._clearError = this._clearError.bind(this);
    }

    componentDidMount() {
        // need to make sure scrolling is enabled
        // in case user has a small screen
        setWindowScrolling(true);
    }

    /* **************************************************************************
     * render                                                              */ /**
     *
     * Required method of a React component.
     * @see {@link https://reactjs.org/docs/react-component.html#render|React.Component.render}
     */
    render() {
        return (
            <>
                <Helmet>
                    <title>{'Sign Up'}</title>
                </Helmet>
                <SignUpViewContainer>
                    <div className='inner'>
                        <div className='form-container'>
                            <LargeHeading>{'Sign Up'}</LargeHeading>
                            <p className='sub-heading'>
                                {'Sign up to see data about your conversations.'}
                            </p>
                            <p className='sub-heading-2'>
                                {`Creating a profile helps you get the most out of Riff. A
                                profile gives you access to all your historical video chat data,
                                and all new insights, as we add them to the product.`}
                            </p>
                            <form onSubmit={this._handleSignUp}>
                                <FormError
                                    error={this.state.error}
                                />
                                <FormField
                                    isRequired={true}
                                    labelName='Display Name'
                                    inputName='displayName'
                                    inputType='text'
                                    placeHolder=''
                                    handleFunction={this._updateDisplayName}
                                    error={this.state.error}
                                    value={this.state.displayName}
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
                                <FormField
                                    isRequired={true}
                                    labelName='Room Name'
                                    inputName='roomName'
                                    inputType='text'
                                    placeHolder=''
                                    handleFunction={this._updateRoomName}
                                    error={this.state.error}
                                    value={this.state.roomName}
                                />
                                <div className='terms-container'>
                                    <input
                                        type='checkbox'
                                        onChange={this._updateTermsAgreed}
                                    />
                                    {'I agree to Riff'}&nbsp;
                                    <a
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        href='https://www.rifflearning.com/terms-of-service'
                                    >
                                        {'Terms of Service'}
                                    </a>
                                    &nbsp;{'and'}&nbsp;
                                    <a
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        href='https://www.rifflearning.com/privacy-policy'
                                    >
                                        {'Privacy Policy'}
                                    </a>
                                </div>
                                <SubmitButton
                                    disabled={!this._validateForm()}
                                    btnText={'Sign Up'}
                                />
                            </form>
                            <div className='sign-in-prompt'>
                                {'Already have an account? '}
                                <Link to={Routes.SignIn}>
                                    {'Sign in now'}
                                </Link>
                            </div>
                        </div>
                        <img
                            src={promoImage}
                            alt='Riff - Sign up'
                            className='promo-image'
                        />
                    </div>
                </SignUpViewContainer>
                <Footer/>
            </>
        );
    }

    /* **************************************************************************
     * _updateEmail                                                        */ /**
     */
    _updateEmail(event) {
        this.setState({ email: event.target.value });
    }

    /* **************************************************************************
     * _updateTermsAgreed                                                        */ /**
     */
    _updateTermsAgreed(event) {
        this.setState({ termsAgreed: event.target.checked });
    }

    /* **************************************************************************
     * _updatePassword                                                     */ /**
     */
    _updatePassword(event) {
        this.setState({ password: event.target.value });
    }

    /* **************************************************************************
     * _updateDisplayName                                                  */ /**
     */
    _updateDisplayName(event) {
        this.setState({ displayName: event.target.value });
    }

    /* **************************************************************************
     * _updateRoomName                                                     */ /**
     */
    _updateRoomName(event) {
        this.setState({ roomName: event.target.value });
    }

    /* **************************************************************************
     * _handleSignUp                                                       */ /**
     *
     * Form submit handler for sign up.
     *
     * @param {HtmlEvent} event
     */
    async _handleSignUp(event) {
        event.preventDefault();
        const { email, password, displayName } = this.state;

        try {
            const firebaseUser = await firebaseCreateUser({ email, password, displayName });
            // only bother with the fields we need
            const simplifiedUser = {
                uid: firebaseUser.uid,
                displayName: firebaseUser.displayName,
                email: firebaseUser.email,
                emailVerified: firebaseUser.emailVerified,
            };

            // if we're in personal mode, we need to create a room for the user
            if (getIsPersonalMode()) {
                simplifiedUser.roomName = this.state.roomName;
                // because personal rooms are linked to a participant, we must create
                // the participant at the time of account creation
                // we don't really need to do anything with the return value,
                // but we want to wait until the participant is created before moving on
                const participant = await riffCreateParticipant(simplifiedUser);
                const room = await riffGetRoomFromUser(participant._id);
                simplifiedUser.roomId = room._id;
            }

            this.props.firebaseSignupSuccess(simplifiedUser, this.props.inviteId);
        }
        catch (err) {
            this.setState({ error: err });
        }
    }

    /* **************************************************************************
     * _clearError                                                         */ /**
     *
     * Handler to clear a displayed login error
     *
     * @param {HtmlEvent} event
     */
    _clearError(event) {
        event.preventDefault();
        this.setState({ error: null });
    }

    /* **************************************************************************
     * _validateForm                                                       */ /**
     */
    _validateForm() {
        return this.state.email !== ''
            && this.state.password !== ''
            && this.state.displayName !== ''
            && this.state.roomName !== ''
            && this.state.termsAgreed;
    }
}


/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    SignUpView,
};
