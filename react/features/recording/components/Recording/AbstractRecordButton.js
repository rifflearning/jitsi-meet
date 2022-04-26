// @flow

import {
    createToolbarEvent,
    sendAnalytics
} from '../../../analytics';
import { IconToggleRecording } from '../../../base/icons';
import { JitsiRecordingConstants } from '../../../base/lib-jitsi-meet';
<<<<<<< HEAD
=======
import { getLocalParticipant } from '../../../base/participants';
>>>>>>> 730eb2e04 (feat(video-local-recording): Enable users to record their conference locally.)
import { AbstractButton, type AbstractButtonProps } from '../../../base/toolbox/components';
import { maybeShowPremiumFeatureDialog } from '../../../jaas/actions';
import { FEATURES } from '../../../jaas/constants';
import { getActiveSession, getRecordButtonProps } from '../../functions';

/**
 * The type of the React {@code Component} props of
 * {@link AbstractRecordButton}.
 */
export type Props = AbstractButtonProps & {

    /**
     * True if the button needs to be disabled.
     */
    _disabled: Boolean,

    /**
     * True if there is a running active recording, false otherwise.
     */
    _isRecordingRunning: boolean,

    /**
     * The tooltip to display when hovering over the button.
     */
    _tooltip: ?String,

    /**
     * The redux {@code dispatch} function.
     */
    dispatch: Function,

    /**
     * The i18n translate function.
     */
    t: Function
};

/**
 * An abstract implementation of a button for starting and stopping recording.
 */
export default class AbstractRecordButton<P: Props> extends AbstractButton<P, *> {
    accessibilityLabel = 'toolbar.accessibilityLabel.recording';
    icon = IconToggleRecording;
    label = 'dialog.startRecording';
    toggledLabel = 'dialog.stopRecording';

    /**
     * Returns the tooltip that should be displayed when the button is disabled.
     *
     * @private
     * @returns {string}
     */
    _getTooltip() {
        return this.props._tooltip || '';
    }

    /**
     * Helper function to be implemented by subclasses, which should be used
     * to handle the start recoding button being clicked / pressed.
     *
     * @protected
     * @returns {void}
     */
    _onHandleClick() {
        // To be implemented by subclass.
    }

    /**
     * Handles clicking / pressing the button.
     *
     * @override
     * @protected
     * @returns {void}
     */
    async _handleClick() {
        const { _isRecordingRunning, dispatch, handleClick } = this.props;

        if (handleClick) {
            handleClick();

            return;
        }

        sendAnalytics(createToolbarEvent(
            'recording.button',
            {
                'is_recording': _isRecordingRunning,
                type: JitsiRecordingConstants.mode.FILE
            }));
        const dialogShown = await dispatch(maybeShowPremiumFeatureDialog(FEATURES.RECORDING));

        if (!dialogShown) {
            this._onHandleClick();
        }
    }

    /**
     * Helper function to be implemented by subclasses, which must return a
     * boolean value indicating if this button is disabled or not.
     *
     * @override
     * @protected
     * @returns {boolean}
     */
    _isDisabled() {
        return this.props._disabled;
    }

    /**
     * Indicates whether this button is in toggled state or not.
     *
     * @override
     * @protected
     * @returns {boolean}
     */
    _isToggled() {
        return this.props._isRecordingRunning;
    }
}

/**
 * Maps (parts of) the redux state to the associated props for the
 * {@code RecordButton} component.
 *
 * @param {Object} state - The Redux state.
 * @private
 * @returns {{
 *     _disabled: boolean,
 *     _isRecordingRunning: boolean,
 *     _tooltip: string,
 *     visible: boolean
 * }}
 */
<<<<<<< HEAD
export function _mapStateToProps(state: Object): Object {
    const {
        disabled: _disabled,
        tooltip: _tooltip,
        visible
    } = getRecordButtonProps(state);
=======
export function _mapStateToProps(state: Object, ownProps: Props): Object {
    let { visible } = ownProps;

    // a button can be disabled/enabled if enableFeaturesBasedOnToken
    // is on or if the livestreaming is running.
    let _disabled;
    let _tooltip = '';

    if (typeof visible === 'undefined') {
        // If the containing component provides the visible prop, that is one
        // above all, but if not, the button should be autonomus and decide on
        // its own to be visible or not.
        const { enableFeaturesBasedOnToken } = state['features/base/config'];
        const { features = {} } = getLocalParticipant(state);

        if (enableFeaturesBasedOnToken) {
            _disabled = String(features.recording) === 'disabled';
            if (!visible && !_disabled) {
                _disabled = true;
                visible = true;
                _tooltip = 'dialog.recordingDisabledTooltip';
            }
        }
    }

    // disable the button if the livestreaming is running.
    if (getActiveSession(state, JitsiRecordingConstants.mode.STREAM)) {
        _disabled = true;
        _tooltip = 'dialog.recordingDisabledBecauseOfActiveLiveStreamingTooltip';
    }

    // disable the button if we are in a breakout room.
    if (isInBreakoutRoom(state)) {
        _disabled = true;
        visible = false;
    }
>>>>>>> 730eb2e04 (feat(video-local-recording): Enable users to record their conference locally.)

    return {
        _disabled,
        _isRecordingRunning: Boolean(getActiveSession(state, JitsiRecordingConstants.mode.FILE))
            || state['features/recording'].localVideoRecordingHasStarted || false,
        _tooltip,
        visible
    };
}
