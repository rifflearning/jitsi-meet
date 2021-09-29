// @flow

import _ from 'lodash';

import { participantLeaveRoom } from '../../../features/riff-platform/actions/sibilantActions';
import { createToolbarEvent, sendAnalytics } from '../../analytics';
import { appNavigate } from '../../app/actions';
import { disconnect } from '../../base/connection';
import { translate } from '../../base/i18n';
import { connect } from '../../base/redux';
import { AbstractHangupButton } from '../../base/toolbox/components';
import type { AbstractButtonProps } from '../../base/toolbox/components';

/**
 * The type of the React {@code Component} props of {@link HangupButton}.
 */
type Props = AbstractButtonProps & {

    /**
     * The redux {@code dispatch} function.
     */
    dispatch: Function,

    /**
     * The id for this meeting
     */
    meetingId: string,

    /**
     * The id for this participant
     */
    participantId: string,
};

/**
 * Component that renders a toolbar button for leaving the current conference.
 *
 * @extends AbstractHangupButton
 */
class HangupButton extends AbstractHangupButton<Props, *> {
    _hangup: Function;
    onUnload: Function;

    accessibilityLabel = 'toolbar.accessibilityLabel.hangup';
    label = 'toolbar.hangup';
    tooltip = 'toolbar.hangup';

    /**
     * Initializes a new HangupButton instance.
     *
     * @param {Props} props - The read-only properties with which the new
     * instance is to be initialized.
     */
    constructor(props: Props) {
        super(props);

        this.onUnload = this.onUnload.bind(this);

        this._hangup = _.once(() => {
            sendAnalytics(createToolbarEvent('hangup'));

            // FIXME: these should be unified.
            if (navigator.product === 'ReactNative') {
                this.props.dispatch(appNavigate(undefined));
            } else {
                this.props.dispatch(disconnect(true));
            }
        });
    }

    /**
     * Handles closing the meeting's tab.
     *
     * @returns {Promise}.
     */
    onUnload() {
        return participantLeaveRoom(this.props.meetingId, this.props.participantId);
    }

    /**
     * Adds event listener for onUnload.
     *
     * @returns {void}
     */
    componentDidMount() {
        window.addEventListener('unload', this.onUnload);
    }

    /**
     * Removes event listener for onUnload.
     *
     * @returns {void}
     */
    componentWillUnmount() {
        window.removeEventListener('unload', this.onUnload);
    }

    /**
     * Helper function to perform the actual hangup action.
     *
     * @override
     * @protected
     * @returns {void}
     */
    _doHangup() {
        this._hangup();
    }
}

const mapStateToProps = state => {
    return {
        meetingId: state['features/riff-platform'].riff.roomId,
        participantId: state['features/riff-platform'].signIn.user.uid
    };
};

export default translate(connect(mapStateToProps)(HangupButton));
