/* ******************************************************************************
 * Feedback.jsx                                                                 *
 * *************************************************************************/ /**
 *
 * @fileoverview React component to render promotional info about Riff's products
 *
 * Created on       October 12, 2019
 * @author          Brec Hanson
 *
 * @copyright (c) 2019-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

import React from 'react';

import FeedbackImage from 'Images/feedback-promo.png';
import musicNotesImg from 'Images/music-notes-sliver-1.svg';

import { MediumHeading } from 'Components/styled';

import {
    FeedbackContainer,
    HomeParagraph,
    HomeSectionInner,
} from '../styled';

/* ******************************************************************************
 * Feedback                                                                */ /**
 *
 * React component to render promotional info about Riff's products
 *
 ********************************************************************************/
class Feedback extends React.PureComponent {
    /* **************************************************************************
     * render                                                              */ /**
     *
     * Required method of a React component.
     * @see {@link https://reactjs.org/docs/react-component.html#render|React.Component.render}
     */
    render() {
        return (
            <FeedbackContainer>
                <HomeSectionInner>
                    <img
                        src={FeedbackImage}
                        className='feedback-promo-img'
                        alt='Riff - Feedback makes a difference'
                    />
                    <div className='promo-text-container'>
                        <MediumHeading>
                            {'Small Changes, Big Results'}
                        </MediumHeading>
                        <HomeParagraph
                            fontSize={'16px'}
                            lineHeight={'1.63'}
                        >
                            {`Even a small amount of feedback can make a big
                              difference: learners in online courses who used
                              Riff video twice a week had 30% higher grades,
                              and were twice as likely to complete the course.`}
                            <br/><br/>
                            {`In small group online video meetings, people
                              reported that they felt more confident speaking
                              and they were more likely to positively
                              contribute.`}
                        </HomeParagraph>
                    </div>
                </HomeSectionInner>
                <img
                    src={musicNotesImg}
                    className='music-notes-img'
                    alt='Riff - Feedback makes a difference'
                />
            </FeedbackContainer>
        );
    }
}

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    Feedback,
};
