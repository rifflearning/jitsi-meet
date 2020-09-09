/* ******************************************************************************
 * Home.jsx                                                                     *
 * *************************************************************************/ /**
 *
 * @fileoverview React component for the Home page
 *
 * Created on       June 22, 2018
 * @author          Dan Calacci
 * @author          Michael Jay Lippert
 *
 * @copyright (c) 2018-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

import React from 'react';

import { Footer } from 'components/Footer/Footer';

import { PostMeetingMetrics } from './HomeSections/PostMeetingMetrics';
import { Feedback } from './HomeSections/Feedback';
import { MetricsHelp } from './HomeSections/MetricsHelp';
import { Measuring } from './HomeSections/Measuring';
import { BetterCommunication } from './HomeSections/BetterCommunication';

import { HomeContainer } from './styled';

/* ******************************************************************************
 * Home                                                                    */ /**
 *
 * React component to present the Riff Platform home page
 *
 ********************************************************************************/
class Home extends React.Component {
    /* **************************************************************************
     * render                                                              */ /**
     *
     * Required method of a React component.
     * @see {@link https://reactjs.org/docs/react-component.html#render|React.Component.render}
     */
    render() {
        return (
            <HomeContainer>
                <BetterCommunication/>
                <Measuring/>
                <Feedback/>
                <MetricsHelp/>
                <PostMeetingMetrics/>
                <Footer/>
            </HomeContainer>
        );
    }
}

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    Home,
};
