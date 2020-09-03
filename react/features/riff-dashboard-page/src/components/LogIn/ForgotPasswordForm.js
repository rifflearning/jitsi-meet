/* ******************************************************************************
 * ForgotPasswordForm.js                                                        *
 * *************************************************************************/ /**
 *
 * @fileoverview React component for the Forgot password form
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

import { firebaseSendResetLink } from 'libs/utils';

import { SubmitButton } from 'components/Common/Form/SubmitButton';

import { FormField } from 'components/Common/Form/FormField';
import { FormError } from 'components/Common/Form/FormError';

import { CancelButton } from './CancelButton';

/* ******************************************************************************
 * ForgotPasswordForm                                                      */ /**
 *
 * React component for the Forgot password form
 *
 ********************************************************************************/
class ForgotPasswordForm extends React.Component {
    static propTypes = {

        /** email address to initialize the email field */
        initialEmail: PropTypes.string,

        /** function to invoke when the cancel button is clicked */
        cancel: PropTypes.func.isRequired,
    };

    /* **************************************************************************
     * constructor                                                         */ /**
     */
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            email: props.initialEmail || '',
            isResetLinkSent: false,
        };

        this._updateEmail = this._updateEmail.bind(this);
        this._clearError = this._clearError.bind(this);
        this._clearEmailSentNotification = this._clearEmailSentNotification.bind(this);
        this._handleSendResetLink = this._handleSendResetLink.bind(this);
    }

    /* **************************************************************************
     * render                                                              */ /**
     *
     * Required method of a React component.
     * @see {@link https://reactjs.org/docs/react-component.html#render|React.Component.render}
     */
    render() {
        return (
            <div>
                <p className='title'>
                    {'Forgot Password'}
                </p>
                <p style={{ marginBottom: '12px' }}>{'A password reset link will be sent to your email address'}</p>
                <form onSubmit={this._handleSendResetLink}>
                    <FormError
                        error={this.state.error}
                    />
                    <div className='field'>
                        <FormField
                            isRequired={true}
                            labelName='Email'
                            inputName='email'
                            inputType='text'
                            placeHolder=''
                            handleFunction={this._updateEmail}
                            error={this.state.error}
                        />
                        <div>
                            <CancelButton handleCancelClick={this.props.cancel}/>
                            <SubmitButton
                                disabled={!this._validateForm()}
                                btnText={'Submit'}
                            />
                        </div>
                        {this.state.isResetLinkSent && (
                            <div className='notification is-success'>
                                <button
                                    className='delete'
                                    onClick={this._clearEmailSentNotification}
                                />
                                {'A link to reset your password has been sent!'}
                            </div>
                        )}
                    </div>
                </form>
            </div>
        );
    }

    /* **************************************************************************
     * _updateEmail                                                        */ /**
     */
    _updateEmail(event) {
        this.setState({ email: event.target.value });
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

    /* **************************************************************************
     * _validateForm                                                       */ /**
     */
    _validateForm() {
        return this.state.email !== '';
    }

    /* **************************************************************************
     * _handleSendResetLink                                                */ /**
     *
     * Form submit handler for sending a password reset link to email.
     *
     * @param {HtmlEvent} event
     */
    async _handleSendResetLink(event) {
        event.preventDefault();
        const { email } = event.target.elements;
        try {
            await firebaseSendResetLink(email.value);
            this.setState({ isResetLinkSent: true });
        }
        catch (err) {
            this.setState({ error: err });
        }
    }
}


/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    ForgotPasswordForm,
};
