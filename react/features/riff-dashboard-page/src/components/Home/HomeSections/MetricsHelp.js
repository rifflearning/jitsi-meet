/* ******************************************************************************
 * MetricsHelp.jsx                                                              *
 * *************************************************************************/ /**
 *
 * @fileoverview React component to render promotional info
 *
 * The promotional information in this component includes a visual example of
 * Riff's meeting mediator and a description of how it works and why it's useful
 *
 * Created on       October 12, 2019
 * @author          Brec Hanson
 *
 * @copyright (c) 2019-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

import React from 'react';

import metricsPromoImage from 'Images/riff-data-promo.png';
import musicNotesImg from 'Images/music-notes-sliver-2.svg';

import { MediumHeading } from 'Components/styled';

import {
    HomeParagraph,
    HomeSectionInner,
    MetricsHelpContainer,
    UnorderedList,
} from '../styled';

/* ******************************************************************************
 * MetricsHelp                                                             */ /**
 *
 * React component to render promotional info
 *
 ********************************************************************************/
class MetricsHelp extends React.PureComponent {
    /* **************************************************************************
     * render                                                              */ /**
     *
     * Required method of a React component.
     * @see {@link https://reactjs.org/docs/react-component.html#render|React.Component.render}
     */
    render() {
        return (
            <MetricsHelpContainer>
                <img
                    src={musicNotesImg}
                    className='music-notes-img'
                    alt='Riff - Metrics to help meetings'
                />
                <HomeSectionInner>
                    <div className='promo-text-container'>
                        <div className='header-section'>
                            <MediumHeading>{'Riff Data'}</MediumHeading>
                            <HomeParagraph
                                fontSize={'16px'}
                                lineHeight={'1.63'}
                                margin={'12px 0'}
                                className='card-text'
                            >
                                {'Metrics to help you during and after your meetings.'}
                            </HomeParagraph>
                        </div>
                        <MediumHeading>{'Real-time Intervention'}</MediumHeading>
                        <HomeParagraph
                            fontSize={'16px'}
                            lineHeight={'1.63'}
                            margin={'12px 0'}
                        >
                            {`The Meeting Mediator measures your conversations in real-time and gives
                              passive feedback to the group.`}
                        </HomeParagraph>
                        <UnorderedList>
                            <li>{'How the conversation changes as it\'s happening.'}</li>
                            <li>{'If people are over- or under-contributing.'}</li>
                            <li>{'How engaged participants are.'}</li>
                            <li>{'Notice what\'s happening and redirect the conversation.'}</li>
                        </UnorderedList>
                    </div>
                    <img
                        src={metricsPromoImage}
                        className='metrics-promo-img'
                        alt='Riff - Metrics to help meetings'
                    />
                </HomeSectionInner>
            </MetricsHelpContainer>
        );
    }
}

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    MetricsHelp,
};
