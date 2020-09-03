/* ******************************************************************************
 * index.js                                                                     *
 * *************************************************************************/ /**
 *
 * @fileoverview Hook up the Dashboard to redux state and actions
 *
 * Created on       August 27, 2018
 * @author          Dan Calacci
 * @author          Michael Jay Lippert
 * @author          Brec Hanson
 *
 * @copyright (c) 2018-present Riff Learning, Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

import { connect } from 'react-redux';

import { loadRecentMeetings } from 'redux/actions/dashboard';
import { dismissPostMeetingSurvey } from 'redux/actions/chat';
import { getGraphDataset, getSelectedMeeting } from 'redux/selectors/dashboard';
import { getIsRiffConnected } from 'redux/selectors/riff';
import { getUserId } from 'redux/selectors/user';
import { getIsPostMeetingSurveyRequested } from 'redux/selectors/chat';

import { GraphDatasetTypes } from 'libs/utils/constants';

import { DashboardView } from './DashboardView';

const dashboardMapProps = {
    mapStateToProps: state => ({
        uid:                          getUserId(state),
        isRiffConnected:              getIsRiffConnected(state),
        fetchMeetingsStatus:          getGraphDataset(state, GraphDatasetTypes.MEETINGS).status,
        fetchMeetingsMessage:         getGraphDataset(state, GraphDatasetTypes.MEETINGS).message,
        lastFetched:                  getGraphDataset(state, GraphDatasetTypes.MEETINGS).lastFetched,
        selectedMeeting:              getSelectedMeeting(state),
        isPostMeetingSurveyRequested: getIsPostMeetingSurveyRequested(state),
    }),

    mapDispatchToProps: dispatch => ({
        loadRecentMeetings: (uid, selectedMeeting) => {
            dispatch(loadRecentMeetings(uid, selectedMeeting));
        },

        handleRefreshClick: (event, uid, selectedMeeting) => {
            dispatch(loadRecentMeetings(uid, selectedMeeting));
        },

        dismissPostMeetingSurvey: () => {
            dispatch(dismissPostMeetingSurvey());
        },
    }),
};


const ConnectedDashboard = connect(dashboardMapProps.mapStateToProps,
                                   dashboardMapProps.mapDispatchToProps)(DashboardView);

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    ConnectedDashboard as Dashboard,
};
