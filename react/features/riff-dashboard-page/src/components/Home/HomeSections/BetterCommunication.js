/* ******************************************************************************
 * BetterCommunication.jsx                                                      *
 * *************************************************************************/ /**
 *
 * @fileoverview React component to render promotional info about Riff's products
 *
 * Created on       April 14, 2020
 * @author          Brec Hanson
 *
 * @copyright (c) 2020-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

import React from 'react';

import SecurityIcon from '@material-ui/icons/Security';

import betterCommImage from 'Images/better-communication.svg';

import { LargeHeading } from 'Components/styled';

import {
    BetterCommunicationContainer,
    HomeParagraph,
    HomeSectionInner,
    PrivacyCard,
} from '../styled';

/* ******************************************************************************
 * BetterCommunication                                                     */ /**
 *
 * React component to render promotional info about Riff's products
 *
 ********************************************************************************/
class BetterCommunication extends React.PureComponent {
    /* **************************************************************************
     * render                                                              */ /**
     *
     * Required method of a React component.
     * @see {@link https://reactjs.org/docs/react-component.html#render|React.Component.render}
     */
    render() {
        return (
            <BetterCommunicationContainer>
                <HomeSectionInner>
                    <div className='better-comm-text'>
                        <LargeHeading>{'Better Communication by Design'}</LargeHeading>
                        <HomeParagraph fontSize={'20px'} lineHeight={'1.4'}>
                            {'How we interact with our peers has a big impact on our success. ' +
                            'Riff reveals the patterns of successful collaboration and gives ' +
                            'you metrics to create better outcomes.'}
                        </HomeParagraph>
                        <PrivacyCard>
                            <i className='security-icon'>
                                <SecurityIcon/>
                            </i>
                            <div className='text'>
                                <p className='privacy-title'>
                                    {'We respect your privacy'}
                                </p>
                                <p className='sub-text'>
                                    {'Read our '}
                                    <a href='https://www.riffanalytics.ai/privacy-policy'>
                                        {'Privacy Policy'}
                                    </a>{' to learn more.'}
                                </p>
                            </div>
                        </PrivacyCard>
                    </div>
                    <img
                        src={betterCommImage}
                        alt='Riff - Better Communication'
                        className='better-comm-image'
                    />
                </HomeSectionInner>
            </BetterCommunicationContainer>
        );
    }
}

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    BetterCommunication,
};
