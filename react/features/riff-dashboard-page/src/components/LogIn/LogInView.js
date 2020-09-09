/* ******************************************************************************
 * LogInView.jsx                                                                *
 * *************************************************************************/ /**
 *
 * @fileoverview React component for the main Login page
 *
 * Created on       August 2, 2018
 * @author          Dan Calacci
 * @author          Jordan Reedie
 *
 * @copyright (c) 2018-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

import React from 'react';
import { Helmet } from 'react-helmet';

import promoImage from 'Images/signin-promo-img.svg';

import { Footer } from 'components/Footer/Footer';

import { LogInViewContainer } from './styled';
import { ForgotPasswordForm } from './ForgotPasswordForm';

import { LogInForm } from './index';

/* ******************************************************************************
 * LogInView                                                               */ /**
 *
 * React component for the Login page
 *
 ********************************************************************************/
class LogInView extends React.Component {

    /* **************************************************************************
     * constructor                                                         */ /**
     */
    constructor(props) {
        super(props);
        this.state = {
            isForgotPassword: false,
            email: '', // used only to initialize forgot password form
        };

        this._forgotPassword = this._forgotPassword.bind(this);
        this._cancelForgotPassword = this._cancelForgotPassword.bind(this);
    }

    /* **************************************************************************
     * render                                                              */ /**
     *
     * Required method of a React component.
     * @see {@link https://reactjs.org/docs/react-component.html#render|React.Component.render}
     */
    render() {
        let form = <LogInForm forgotPassword={this._forgotPassword}/>;
        if (this.state.isForgotPassword) {
            form = (
                <ForgotPasswordForm
                    initialEmail={this.state.email}
                    cancel={this._cancelForgotPassword}
                />
            );
        }

        return (
            <>
                <Helmet>
                    <title>{'Sign In'}</title>
                </Helmet>
                <LogInViewContainer>
                    <div className='inner'>
                        <img
                            src={promoImage}
                            alt='Riff - Sign in'
                            className='promo-image'
                        />
                        <div className='form-container'>
                            {form}
                        </div>
                    </div>
                </LogInViewContainer>
                <Footer/>
            </>
        );
    }

    /* **************************************************************************
     * _forgotPassword                                                     */ /**
     *
     * Switch form displayed to the forgot password form instead of the
     * log in form
     *
     * @param {string} email - email address to initial the forgot password
     *      control with.
     */
    _forgotPassword(email) {
        this.setState({ isForgotPassword: true, email });
    }

    /* **************************************************************************
     * _cancelForgotPassword                                               */ /**
     *
     * Click handler to dismiss the forgot password form and show the regular
     * log in form
     *
     * @param {HtmlEvent} event
     */
    _cancelForgotPassword(event) {
        event.preventDefault();
        this.setState({ isForgotPassword: false });
    }
}


/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    LogInView,
};
