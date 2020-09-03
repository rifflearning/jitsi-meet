/* ******************************************************************************
 * Measuring.jsx                                                                *
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

import riffVideoImage from 'Images/click-riff-video.svg';
import joinRoomImage from 'Images/join-room.svg';
import seeMetricsImage from 'Images/see-metrics.svg';

import { MediumHeading } from 'Components/styled';

import {
    HomeParagraph,
    HomeSectionInner,
    MeasuringCard,
    MeasuringCardImg,
    MeasuringCardTitle,
    MeasuringContainer,
} from '../styled';

/* ******************************************************************************
 * Measuring                                                               */ /**
 *
 * React component to render promotional info about Riff's products
 *
 ********************************************************************************/
class Measuring extends React.PureComponent {
    /* **************************************************************************
     * render                                                              */ /**
     *
     * Required method of a React component.
     * @see {@link https://reactjs.org/docs/react-component.html#render|React.Component.render}
     */
    render() {
        return (
            <MeasuringContainer>
                <HomeSectionInner flexDirection={'column'}>
                    <MediumHeading>{'Measuring What Happens'}</MediumHeading>
                    <HomeParagraph
                        fontSize={'16px'}
                        lineHeight={'1.63'}
                        className='info-text'
                    >
                        {`Using research from the MIT Media Lab about how teams interact, Riff
                        gives you the data to choose the most effective ways to engage with your
                        peers. Riff never looks at what you say, just the conversational “signatures”,
                        such as turn-taking and time spoken. Using AI, Riff builds and refines the
                        interaction models of high-functioning teams.`}
                    </HomeParagraph>
                    <div className='measuring-cards-container'>
                        <MeasuringCard>
                            <MeasuringCardTitle
                                marginBottom={'24px'}
                            >
                                {'Click Riff Video'}
                            </MeasuringCardTitle>
                            <MeasuringCardImg top={'46%'}>
                                <img
                                    className='card-image'
                                    src={riffVideoImage}
                                    alt={'Riff - Allow access to camera and mic.'}
                                />
                            </MeasuringCardImg>
                            <HomeParagraph
                                fontSize={'16px'}
                                lineHeight={'1.63'}
                                className='card-text'
                            >
                                {'Make sure the browser has access to your camera and microphone.'}
                            </HomeParagraph>
                        </MeasuringCard>
                        <MeasuringCard>
                            <MeasuringCardTitle
                                marginBottom={'37px'}
                            >
                                {'Enter Your Name and Click Join Room'}
                            </MeasuringCardTitle>
                            <MeasuringCardImg>
                                <img
                                    className='card-image'
                                    src={joinRoomImage}
                                    alt={'Riff - Allow access to camera and mic.'}
                                />
                            </MeasuringCardImg>
                            <HomeParagraph
                                fontSize={'16px'}
                                lineHeight={'1.63'}
                                className='card-text'
                            >
                                {'Invite other people to join your room and start a video chat.'}
                            </HomeParagraph>
                        </MeasuringCard>
                        <MeasuringCard>
                            <MeasuringCardTitle
                                className='card-title'
                                marginBottom={'37px'}
                            >
                                {'See Metrics After the Meeting'}
                            </MeasuringCardTitle>
                            <MeasuringCardImg>
                                <img
                                    className='card-image'
                                    src={seeMetricsImage}
                                    alt={'Riff - Allow access to camera and mic.'}
                                />
                            </MeasuringCardImg>
                            <HomeParagraph
                                fontSize={'16px'}
                                lineHeight={'1.63'}
                                className='card-text'
                            >
                                {'See how you interact with others during your video chat.'}
                            </HomeParagraph>
                        </MeasuringCard>
                    </div>
                </HomeSectionInner>
            </MeasuringContainer>
        );
    }
}

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    Measuring,
};
