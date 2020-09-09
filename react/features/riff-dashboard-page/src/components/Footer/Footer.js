/* ******************************************************************************
 * Footer.jsx                                                                   *
 * *************************************************************************/ /**
 *
 * @fileoverview React component to render the footer, appearing on several pages
 *
 * Created on       April 16, 2020
 * @author          Brec Hanson
 *
 * @copyright (c) 2020-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

import React from 'react';

import { FooterContainer } from './styled';

/* ******************************************************************************
 * Footer                                                                  */ /**
 *
 * React component to render promotional info about Riff's products
 *
 ********************************************************************************/
class Footer extends React.PureComponent {
    /* **************************************************************************
     * render                                                              */ /**
     *
     * Required method of a React component.
     * @see {@link https://reactjs.org/docs/react-component.html#render|React.Component.render}
     */
    render() {
        return (
            <FooterContainer>
                <div className='footer-inner'>
                    <div className='footer-left'>
                        <div className='copyright'>
                            {'© 2020 Riff Analytics'}
                        </div>
                    </div>
                    <div className='footer-right'>
                        <button className='contact-btn'>
                            <a href={'mailto:info@riffanalytics.ai'}>
                                {'Contact Us'}
                            </a>
                        </button>
                        <a
                            href='https://www.riffanalytics.ai/privacy-policy'
                            className='privacy-policy-link'
                        >
                            {'Privacy Policy'}
                        </a>
                    </div>
                </div>
            </FooterContainer>
        );
    }
}

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    Footer,
};
