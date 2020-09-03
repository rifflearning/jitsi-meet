/* ******************************************************************************
 * PostMeetingMetrics.jsx                                                       *
 * *************************************************************************/ /**
 *
 * @fileoverview React component to visualise and describe post meeting metrics
 *
 * Created on       October 12, 2019
 * @author          Brec Hanson
 *
 * @copyright (c) 2019-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

import React from 'react';

import promoImage from 'Images/post-meeting-metrics.png';
import musicNotesImg from 'Images/music-notes-sliver-3.svg';

import { MediumHeading } from 'Components/styled';

import {
    HomeParagraph,
    HomeSectionInner,
    PostMeetingContainer,
    UnorderedList,
} from '../styled';

/* ******************************************************************************
 * PostMeetingMetrics                                                      */ /**
 *
 * React component to visualise and describe post meeting metrics
 *
 ********************************************************************************/
class PostMeetingMetrics extends React.PureComponent {
    /* **************************************************************************
     * render                                                              */ /**
     *
     * Required method of a React component.
     * @see {@link https://reactjs.org/docs/react-component.html#render|React.Component.render}
     */
    render() {
        return (
            <PostMeetingContainer>
                <HomeSectionInner>
                    <img
                        src={promoImage}
                        className='promo-img'
                        alt='Riff - Post meeting metrics'
                    />
                    <div className='promo-text-container'>
                        <MediumHeading>{'Post-meeting Metrics'}</MediumHeading>
                        <HomeParagraph
                            fontSize={'16px'}
                            lineHeight={'1.63'}
                        >
                            {'After each Riff video call, Riff will display a set of metrics ' +
                                'about the conversation. Use this data to see:'}
                        </HomeParagraph>
                        <UnorderedList>
                            <li>{'How balanced your conversations are, and how they change over time.'}</li>
                            <li>{'If you or other team members dominate conversations, ' +
                                    'or need to speak up more.'}</li>
                            <li>{'Who you influence and influences you.'}</li>
                        </UnorderedList>
                    </div>
                </HomeSectionInner>
                <img
                    src={musicNotesImg}
                    className='music-notes-img'
                    alt='Riff - Post meeting metrics'
                />
            </PostMeetingContainer>
        );
    }
}

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    PostMeetingMetrics,
};
