// @flow

import { translate } from '../../../base/i18n';
import { IconStar } from '../../../base/icons';
import { connect } from '../../../base/redux';
import { AbstractButton, type AbstractButtonProps } from '../../../base/toolbox/components';
import { showInterestingMomentMarkedNotification } from '../../actions';
import { markInterestingMoment } from '../../functions.web';

type Props = AbstractButtonProps & {

    /**
     * The Redux dispatch function.
     */
    dispatch: Function,

    /**
     * The ID of the participant.
     */
    participantId: String,

    /**
     * The ID of the room
     */
    roomId: String
};

/**
 * Implements a React {@link Component} which displays a button for disabling the camera of
 * every participant (except the local one)
 */
class MarkInterestingMomentButton extends AbstractButton<Props, *> {
    accessibilityLabel = 'toolbar.accessibilityLabel.markInterestingMoment';
    icon = IconStar;
    label = 'toolbar.markInterestingMoment';
    tooltip = 'toolbar.markInterestingMoment';

    /**
     * Handles clicking / pressing the button, and opens a confirmation dialog.
     *
     * @private
     * @returns {void}
     */
    _handleClick() {
        const { dispatch, participantId, roomId } = this.props;

        dispatch(showInterestingMomentMarkedNotification());
        markInterestingMoment(participantId, roomId);
    }
}

/**
 * Maps part of the redux state to the component's props.
 *
 * @param {Object} state - The redux store/state.
 * @returns {Object}
 */
function _mapStateToProps(state: Object) {
    return {
        roomId: state['features/riff-platform'].meeting.meeting.roomId,
        participantId: state['features/riff-platform'].signIn.user.uid
    };
}

export default translate(connect(_mapStateToProps)(MarkInterestingMomentButton));
