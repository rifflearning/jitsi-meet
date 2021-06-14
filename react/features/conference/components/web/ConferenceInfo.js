/* @flow */

import React from 'react';

import { JitsiRecordingConstants } from '../../../base/lib-jitsi-meet';
import { getParticipantCount } from '../../../base/participants/functions';
import { connect } from '../../../base/redux';
import { E2EELabel } from '../../../e2ee';
import { LocalRecordingLabel } from '../../../local-recording';
import { RecordingLabel } from '../../../recording';
import MultipleRoomsNameDropdown from '../../../riff-platform/components/Meeting/MultipleRoomsMeetingNameDropdown';
import { isToolboxVisible } from '../../../toolbox/functions.web';
import { TranscribingLabel } from '../../../transcribing';
import { VideoQualityLabel } from '../../../video-quality';
import ConferenceTimer from '../ConferenceTimer';

import ParticipantsCount from './ParticipantsCount';

import { InsecureRoomNameLabel } from '.';

/**
 * The type of the React {@code Component} props of {@link Subject}.
 */
type Props = {

    /**
     * Whether the info should span across the full width.
     */
    _fullWidth: boolean,

    /**
     * Whether the conference name and timer should be displayed or not.
     */
    _hideConferenceNameAndTimer: boolean,

    /**
     * Whether the conference timer should be shown or not.
     */
    _hideConferenceTimer: boolean,

    /**
     * Whether the participant count should be shown or not.
     */
    _showParticipantCount: boolean,

    /**
     * The subject or the of the conference.
     * Falls back to conference name.
     */
    _subject: string,

    /**
     * Indicates whether the component should be visible or not.
     */
    _visible: boolean,

    /**
     * Whether to show name with multiple rooms quantity instead of name.
     */
     _isMultipleRoomsQuantity: boolean
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
        _subject,
        _fullWidth,
        _visible,
        _isMultipleRoomsQuantity
    } = props;

    return (
        <div className = { `subject ${_visible ? 'visible' : ''}` }>
            <div className = { `subject-info-container${_fullWidth ? ' subject-info-container--full-width' : ''}` }>
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
                <RecordingLabel mode = { JitsiRecordingConstants.mode.FILE } />
                <RecordingLabel mode = { JitsiRecordingConstants.mode.STREAM } />
                <LocalRecordingLabel />
                <TranscribingLabel />
                <VideoQualityLabel />
                <InsecureRoomNameLabel />
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
    const { hideConferenceTimer, hideConferenceSubject, hideParticipantsStats } = state['features/base/config'];
    const { clientWidth } = state['features/base/responsive-ui'];

    return {
        _hideConferenceNameAndTimer: clientWidth < 300,
        _hideConferenceTimer: Boolean(hideConferenceTimer),
        _fullWidth: state['features/video-layout'].tileViewEnabled,
        _showParticipantCount: participantCount > 2 && !hideParticipantsStats,
        _subject: hideConferenceSubject ? '' : state['features/riff-platform']?.meeting?.meeting?.name,
        _visible: isToolboxVisible(state),
        _isMultipleRoomsQuantity: Boolean(state['features/riff-platform']?.meeting?.meeting?.multipleRoomsQuantity)
    };
}

export default connect(_mapStateToProps)(ConferenceInfo);
