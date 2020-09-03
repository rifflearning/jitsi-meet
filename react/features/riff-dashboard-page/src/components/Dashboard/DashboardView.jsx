/* ******************************************************************************
 * DashboardView.jsx                                                            *
 * *************************************************************************/ /**
 *
 * @fileoverview React component container for meeting metrics (the dashboard)
 *
 * Created on       August 27, 2018
 * @author          Dan Calacci
 * @author          Michael Jay Lippert
 * @author          Brec Hanson
 *
 * @copyright (c) 2018-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

import React from 'react';
import PropTypes from 'prop-types';
import { ScaleLoader } from 'react-spinners';
import { Helmet } from 'react-helmet';
import am4themes_animated from '@amcharts/amcharts4/themes/animated'; // eslint-disable-line camelcase
import * as am4core from '@amcharts/amcharts4/core';

import { Colors, logger, setWindowScrolling, surveys } from 'libs/utils';
import { GraphTypes } from 'libs/utils/constants';

import { MediumHeading } from 'Components/styled';

import { IFrameOverlay } from './IFrameOverlay';
import { MeetingList } from './MeetingList';
import {
    MeetingInfo,
    SpeakingTime,
    StackedBarGraph,
    TimelineChart,
} from './Metrics';

const HelmetComponent = () => {
    return (
        <Helmet>
            <title>{'My Metrics'}</title>
        </Helmet>
    );
};

/* ******************************************************************************
 * DashboardView                                                           */ /**
 *
 * React component to present the Riff Metrics for meetings the user attended
 *
 ********************************************************************************/
class DashboardView extends React.Component {
    static propTypes = {

        /** ID of the current user */
        uid: PropTypes.string.isRequired,

        /** The meeting object that is currently selected or null if none is selected
         *  Note: PropTypes has no native way to distinguish between null and undefined
         *        allowing null is why this is "optional"
         */
        selectedMeeting: PropTypes.object,

        /** determines if the post meeting survey should be give to the user */
        isPostMeetingSurveyRequested: PropTypes.bool.isRequired,

        /** status of the meetings */
        fetchMeetingsStatus: PropTypes.oneOf([ 'loading', 'loaded', 'error' ]).isRequired,

        /** If the fetch status is an error, this is the error message */
        fetchMeetingsMessage: PropTypes.string,

        /** determines if a connection to the riffdata server has been established */
        isRiffConnected: PropTypes.bool.isRequired,

        /** function to load the meetings for a particular user (it had better be the current user) */
        loadRecentMeetings: PropTypes.func.isRequired,

        /** function to dismiss the post meeting survey if it is displayed */
        dismissPostMeetingSurvey: PropTypes.func.isRequired,
    };

    /* **************************************************************************
     * constructor                                                         */ /**
     */
    constructor(props) {
        super(props);

        am4core.useTheme(am4themes_animated);
        this.mainContent = React.createRef();

        this.closeSurvey = this.closeSurvey.bind(this);
    }

    /* **************************************************************************
     * componentDidMount                                                   */ /**
     *
     * Lifecycle method of a React component.
     * This is invoked immediately after a component is mounted (inserted into the
     * tree). Initialization that requires DOM nodes should go here.
     *
     * Load the user's list of meetings. As this may be a time consuming operation
     * we wait until this page is mounted and we know that the list is actually
     * needed.
     *
     * @see {@link https://reactjs.org/docs/react-component.html#componentdidmount|React.Component.componentDidMount}
     */
    componentDidMount() {
        if (this.props.isRiffConnected) {
            logger.debug('going to load recent meetings (1)', this.props.uid);
            this.props.loadRecentMeetings(this.props.uid, this.props.selectedMeeting);
        }

        // make sure window scrolling is enabled
        setWindowScrolling(true);
    }

    /* **************************************************************************
     * componentDidUpdate                                                  */ /**
     *
     * componentDidUpdate() is invoked immediately after updating occurs. This
     * method is not called for the initial render.
     *
     * Use this as an opportunity to operate on the DOM when the component has
     * been updated.
     */
    componentDidUpdate(prevProps) {
        // When the user selects a different meeting from the sidebar, scroll to the top of the main content.
        // Only do this if the user has scrolled past the top of the main content.
        // If selectedMeeting is null, this is the first load, don't scroll.
        // Add a 25 pixel buffer to the top, this is will make the first metric flush
        // with the sticky meetings list sidebar.
        // Check if this.mainContent exists because of:
        // https://github.com/facebook/react/issues/12034
        const scrollTarget = this.mainContent ? this.mainContent.offsetTop - 25 : 0;
        if (prevProps.selectedMeeting !== null &&
          document.documentElement.scrollTop > scrollTarget &&
          prevProps.selectedMeeting._id !== this.props.selectedMeeting._id
        ) {
            window.scrollTo(0, scrollTarget);
        }
    }

    /* **************************************************************************
     * render                                                              */ /**
     *
     * Required method of a React component.
     * @see {@link https://reactjs.org/docs/react-component.html#render|React.Component.render}
     */
    render() {
        logger.debug('DashboardView: render');

        let postMeetingSurvey = null;
        if (this.props.isPostMeetingSurveyRequested) {
            postMeetingSurvey = (
                <IFrameOverlay
                    src={surveys.getPostMeetingUrl(this.props.uid)}
                    close={this.closeSurvey}
                />
            );
        }

        if (this.props.fetchMeetingsStatus === 'loading') {
            return (
                <div className='columns is-centered has-text-centered'>
                    <HelmetComponent/>
                    {postMeetingSurvey}
                    <div className='column'>
                        <ScaleLoader color={Colors.lightRoyal}/>
                    </div>
                </div>
            );
        }

        if (this.props.fetchMeetingsStatus === 'error') {
            return (
                <div className='columns is-centered has-text-centered is-vcentered' style={{ height: '92vh' }}>
                    <HelmetComponent/>
                    {postMeetingSurvey}
                    <div className='column is-vcentered' style={{ alignItems: 'center' }}>
                        <p className='is-size-4 is-primary'>{this.props.fetchMeetingsMessage}</p>
                        <ScaleLoader color={Colors.lightRoyal}/>
                    </div>
                </div>
            );
        }

        // Style for the metric rows used to constrain the height of the small charts
        const metricRowStyle = { height: '400px' };

        const timelineRowStyle = { height: '450px' };

        return (
            <div
                className='dashboard-view-component'
            >
                <div className='inner'>
                    <HelmetComponent/>
                    {postMeetingSurvey}
                    <MeetingList/>
                    <div className='dashboard-content-container'>
                        <div className='dashboard-header-container'>
                            <MediumHeading className='header'>{'Your Conversations'}</MediumHeading>
                            <form action='mailto:feedback@riffanalytics.ai'>
                                <button className='feedback-btn'>
                                    {'Give us feedback'}
                                </button>
                            </form>
                        </div>
                        <MeetingInfo/>
                        <div ref={ref => this.mainContent = ref}/>
                        <div className='metrics-container'>
                            <div className='metric-row' style={metricRowStyle}>
                                <div className='metric-container'>
                                    <SpeakingTime
                                        graphType={GraphTypes.SPEAKING_TIME}
                                    />
                                </div>
                                <div className='metric-container'>
                                    <StackedBarGraph
                                        graphType={GraphTypes.GROUPED_INFLUENCES}
                                        embeddedGraphTypes={[
                                            GraphTypes.MY_INFLUENCE,
                                            GraphTypes.THEIR_INFLUENCE,
                                        ]}
                                    />
                                </div>
                            </div>
                            <div className='metric-row' style={metricRowStyle}>
                                <div className='metric-container'>
                                    <StackedBarGraph
                                        graphType={GraphTypes.GROUPED_INTERRUPTIONS}
                                        embeddedGraphTypes={[
                                            GraphTypes.MY_INTERRUPTIONS,
                                            GraphTypes.THEIR_INTERRUPTIONS,
                                        ]}
                                    />
                                </div>
                                <div className='metric-container'>
                                    <StackedBarGraph
                                        graphType={GraphTypes.GROUPED_AFFIRMATIONS}
                                        embeddedGraphTypes={[
                                            GraphTypes.MY_AFFIRMATIONS,
                                            GraphTypes.THEIR_AFFIRMATIONS,
                                        ]}
                                    />
                                </div>
                            </div>
                            <div className='metric-row' style={timelineRowStyle}>
                                <TimelineChart
                                    graphType={GraphTypes.TIMELINE}
                                    eventTypes={[
                                        GraphTypes.MY_INTERRUPTIONS,
                                        GraphTypes.THEIR_INTERRUPTIONS,
                                        GraphTypes.MY_AFFIRMATIONS,
                                        GraphTypes.THEIR_AFFIRMATIONS,
                                        GraphTypes.MY_INFLUENCE,
                                        GraphTypes.THEIR_INFLUENCE,
                                    ]}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    /* **************************************************************************
     * closeSurvey                                                         */ /**
     *
     * Close the post meeting survey.
     */
    closeSurvey() {
        setWindowScrolling(true);
        this.props.dismissPostMeetingSurvey();
    }

}

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    DashboardView,
};
