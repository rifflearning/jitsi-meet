/* ******************************************************************************
 * index.js                                                                     *
 * *************************************************************************/ /**
 *
 * @fileoverview Hook up the MeetingList to redux state and actions
 *
 * Created on       November 23, 2019
 * @author          Brec Hanson
 * @author          Michael Jay Lippert
 *
 * @copyright (c) 2019-present Riff Learning, Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

import { connect } from 'react-redux';

import { logger } from '../../../libraries/utils';
import { EStatus, GraphDatasetTypes, GraphTypes } from '../../../libraries/utils/constants';
import {
    loadMeetingData,
    selectMeeting
} from '../../../redux/actions/dashboard';
import { getUserId } from '../../../redux/selectors/user';


import { MeetingList } from './MeetingList';

const meetingListMapProps = {
    mapStateToProps: state => {
        return {
            uid: getUserId(state),
            meetings: state.dashboard.graphDatasets[GraphDatasetTypes.MEETINGS].data,
            selectedMeeting: state.dashboard.selectedMeeting || null,

            // Would be nice to make this a selector I think.
            // Should map over all graphs defined in dashboardGraphs in the dashboard reducer
            // and check the status.
            // - Brec 11/11/2019
            areAllGraphsRendered:
            state.dashboard.dashboardGraphs[GraphTypes.TIMELINE].status === EStatus.LOADED
            && state.dashboard.dashboardGraphs[GraphTypes.SPEAKING_TIME].status === EStatus.LOADED
            && state.dashboard.dashboardGraphs[GraphTypes.GROUPED_INFLUENCES].status === EStatus.LOADED
            && state.dashboard.dashboardGraphs[GraphTypes.GROUPED_INTERRUPTIONS].status === EStatus.LOADED
            && state.dashboard.dashboardGraphs[GraphTypes.GROUPED_AFFIRMATIONS].status === EStatus.LOADED
        };
    },

    mapDispatchToProps: dispatch => {
        return {
            onSelectionChanged: (uid, meeting) => {
                logger.debug('selected meeting', meeting._id);

                // TODO: Why do we want 2 distinct actions to select the meeting
                // and to load the meeting data? -mjl 2018-09-05
                dispatch(selectMeeting(meeting));
                dispatch(loadMeetingData(uid, meeting._id));
            }
        };
    }
};


const ConnectedMeetingList = connect(meetingListMapProps.mapStateToProps,
                                     meetingListMapProps.mapDispatchToProps)(MeetingList);

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    ConnectedMeetingList as MeetingList
};
