/* global APP */

import { translate } from '../../../base/i18n';
import { IconStar } from '../../../base/icons';
import { connect } from '../../../base/redux';
import { AbstractButton } from '../../../base/toolbox/components';
import { markInterestingMoment } from '../../actions/meeting';

/**
 * Implements a React {@link Component} which displays a button
 * for marking moments
 */
class MarkInterestingMomentButton extends AbstractButton {
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
    async _handleClick() {
        const { participantId, roomId } = this.props;

        await APP.store.dispatch(markInterestingMoment(participantId, roomId));
    }

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     */
    render() {
        if (!this.props.isAnonymousUser) {
            return super.render();
        }

        return null;
    }
}

/**
 * Maps part of the redux state to the component's props.
 *
 * @param {Object} state - The redux store/state.
 * @returns {Object}
 */
function _mapStateToProps(state) {
    return {
        roomId: state['features/riff-platform'].meeting.meeting.roomId,
        participantId: state['features/riff-platform'].signIn.user.uid,
        isAnonymousUser: state['features/riff-platform'].signIn.user.isAnon,
        user: state['features/riff-platform']
    };
}

export default translate(connect(_mapStateToProps)(MarkInterestingMomentButton));
