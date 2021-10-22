/* @flow */

import React, { Component } from 'react';

import { JitsiRecordingConstants } from '../../../base/lib-jitsi-meet';
import { getParticipantCount } from '../../../base/participants/functions';
import { connect } from '../../../base/redux';
import { E2EELabel } from '../../../e2ee';
import { LocalRecordingLabel } from '../../../local-recording';
import { RecordingLabel, getSessionStatusToShow } from '../../../recording';
import RiffLocalRecordingLabel from '../../../riff-platform/components/LocalRecorder/LocalRecordingLabel';
import MultipleRoomsNameDropdown from '../../../riff-platform/components/Meeting/MultipleRoomsMeetingNameDropdown';
import { isToolboxVisible } from '../../../toolbox/functions.web';
import { TranscribingLabel } from '../../../transcribing';
import { VideoQualityLabel } from '../../../video-quality';
import ConferenceTimer from '../ConferenceTimer';
import { getConferenceInfo } from '../functions';

import ConferenceInfoContainer from './ConferenceInfoContainer';
import InsecureRoomNameLabel from './InsecureRoomNameLabel';
import ParticipantsCount from './ParticipantsCount';
import SubjectText from './SubjectText';

const COMPONENTS = [
    {
        Component: SubjectText,
        id: 'subject'
    },
    {
        Component: ConferenceTimer,
        id: 'conference-timer'
    },
    {
        Component: ParticipantsCount,
        id: 'participants-count'
    },
    {
        Component: E2EELabel,
        id: 'e2ee'
    },
    {
        Component: () => (
            <>
                <RecordingLabel mode = { JitsiRecordingConstants.mode.FILE } />
                <RecordingLabel mode = { JitsiRecordingConstants.mode.STREAM } />
            </>
        ),
        id: 'recording'
    },
    {
        Component: LocalRecordingLabel,
        id: 'local-recording'
    },
    {
        Component: TranscribingLabel,
        id: 'transcribing'
    },
    {
        Component: VideoQualityLabel,
        id: 'video-quality'
    },
    {
        Component: InsecureRoomNameLabel,
        id: 'insecure-room'
    }
];

/**
 * The type of the React {@code Component} props of {@link Subject}.
 */
type Props = {

    /**
     * The conference info labels to be shown in the conference header.
     */
    _conferenceInfo: Object,

    /**
     * Indicates whether the component should be visible or not.
     */
    _visible: boolean,

    /**
     * Whether to show name with multiple rooms quantity instead of name.
     */
     _isMultipleRoomsQuantity: boolean,

    /**
     * Whether or not the recording label is visible.
     */
    _recordingLabel: boolean
};

const getLeftMargin = () => {
    const subjectContainerWidth = document.getElementById('subject-container')?.clientWidth ?? 0;
    const recContainerWidth = document.getElementById('rec-container')?.clientWidth ?? 0;
    const subjectDetailsContainer = document.getElementById('subject-details-container')?.clientWidth ?? 0;

    return (subjectContainerWidth - recContainerWidth - subjectDetailsContainer) / 2;

};

/**
 * The upper band of the meeing containing the conference name, timer and labels.
 *
 * @param {Object} props - The props of the component.
 * @returns {React$None}
 */
 function ConferenceInfo(props: Props) {
    const {
        _hideConferenceNameAndTimer,
        _hideConferenceTimer,
        _showParticipantCount,
        _hideRecordingLabel,
        _subject,
        _fullWidth,
        _visible,
        _isMultipleRoomsQuantity,
        _recordingLabel
    } = props;

    return (
        <div className = { `subject ${_recordingLabel ? 'recording' : ''} ${_visible ? 'visible' : ''}` }>
            <div
                className = { `subject-info-container${_fullWidth ? ' subject-info-container--full-width' : ''}` }
                id = 'subject-container'>
                {!_hideRecordingLabel && <div
                    className = 'show-always'
                    id = 'rec-container'
                    // eslint-disable-next-line react-native/no-inline-styles
                    style = {{
                        marginLeft: !_recordingLabel || _visible ? 0 : getLeftMargin()
                    }}>
                    <RecordingLabel mode = { JitsiRecordingConstants.mode.FILE } />
                    <RecordingLabel mode = { JitsiRecordingConstants.mode.STREAM } />
                    <LocalRecordingLabel />
                </div>
                }
                <div
                    className = 'subject-details-container'
                    id = 'subject-details-container'>
                    {
                        !_hideConferenceNameAndTimer
                        && <div className = 'subject-info'>
                            {_isMultipleRoomsQuantity
                                ? <MultipleRoomsNameDropdown />
                                : _subject && <span className = 'subject-text'>{ _subject }</span>}
                            { !_hideConferenceTimer && <ConferenceTimer /> }
                        </div>
                    }
                    { _showParticipantCount && <ParticipantsCount /> }
                    <E2EELabel />
                    {_hideRecordingLabel && (
                        <>
                            <RecordingLabel mode = { JitsiRecordingConstants.mode.FILE } />
                            <RecordingLabel mode = { JitsiRecordingConstants.mode.STREAM } />
                            <LocalRecordingLabel />
                        </>
                    )}
                    <TranscribingLabel />
                    <VideoQualityLabel />
                    <InsecureRoomNameLabel />
                    <RiffLocalRecordingLabel />
                </div>
            </div>
        </div>
    );
}


/**
 * Maps (parts of) the Redux state to the associated
 * {@code Subject}'s props.
 *
 * @param {Object} state - The Redux state.
 * @private
 * @returns {{
 *     _hideConferenceTimer: boolean,
 *     _showParticipantCount: boolean,
 *     _subject: string,
 *     _visible: boolean
 * }}
 */
function _mapStateToProps(state) {
    const participantCount = getParticipantCount(state);
    const {
        hideConferenceTimer,
        hideConferenceSubject,
        hideParticipantsStats,
        hideRecordingLabel,
        iAmRecorder
    } = state['features/base/config'];
    const { clientWidth } = state['features/base/responsive-ui'];

    const shouldHideRecordingLabel = hideRecordingLabel || iAmRecorder;
    const fileRecordingStatus = getSessionStatusToShow(state, JitsiRecordingConstants.mode.FILE);
    const streamRecordingStatus = getSessionStatusToShow(state, JitsiRecordingConstants.mode.STREAM);
    const isFileRecording = fileRecordingStatus ? fileRecordingStatus !== JitsiRecordingConstants.status.OFF : false;
    const isStreamRecording = streamRecordingStatus
        ? streamRecordingStatus !== JitsiRecordingConstants.status.OFF : false;
    const { isEngaged } = state['features/local-recording'];

    return {
        _hideConferenceNameAndTimer: clientWidth < 300,
        _hideConferenceTimer: Boolean(hideConferenceTimer),
        _hideRecordingLabel: shouldHideRecordingLabel,
        _fullWidth: state['features/video-layout'].tileViewEnabled,
        _showParticipantCount: participantCount > 2 && !hideParticipantsStats,
        _subject: hideConferenceSubject ? '' : state['features/riff-platform']?.meeting?.meeting?.name,
        _visible: isToolboxVisible(state),
        _isMultipleRoomsQuantity: Boolean(state['features/riff-platform']?.meeting?.meeting?.multipleRoomsQuantity),
        _recordingLabel: (isFileRecording || isStreamRecording || isEngaged) && !shouldHideRecordingLabel
    };
}

export default connect(_mapStateToProps)(ConferenceInfo);
