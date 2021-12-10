
import Tooltip from '@atlaskit/tooltip';
import PropTypes from 'prop-types';
import React from 'react';

import { getParticipantDisplayName } from '../../base/participants';
import { connect } from '../../base/redux';
import { LAYOUTS } from '../../video-layout';


const DisplayParticipantNameIndicator = ({ tooltipPosition = 'bottom', participantDisplayName, tileView }) => {
    let displayName = participantDisplayName;
    let usernameContainerClassName = '';

    if (tileView === LAYOUTS.VERTICAL_FILMSTRIP_VIEW) {
        displayName = participantDisplayName.split(' ')[0];
        usernameContainerClassName = 'username-indicator-filmstrip-view';
    }

    return (
        <div className = { `indicator-container username-indicator-container ${usernameContainerClassName}` }>
            <Tooltip
                content = { 'Participant name' }
                position = { tooltipPosition }>
                <span
                    className = { 'username-indicator' }>
                    {displayName}
                </span>
            </Tooltip>
        </div>
    );
};

DisplayParticipantNameIndicator.propTypes = {
    participantDisplayName: PropTypes.string,
    tileView: PropTypes.string,
    tooltipPosition: PropTypes.string
};

const mapStateToProps = (state, ownProps) => {
    const { participantId } = ownProps;

    return {
        participantDisplayName: getParticipantDisplayName(state, participantId) || ''
    };
};

export default connect(mapStateToProps)(DisplayParticipantNameIndicator);
