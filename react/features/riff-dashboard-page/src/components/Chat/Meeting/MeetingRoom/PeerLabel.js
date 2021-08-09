/* ******************************************************************************
 * PeerLabel.jsx                                                                *
 * *************************************************************************/ /**
 *
 * @fileoverview React component for the label below each Peer Video
 *
 * Displays the user's name & appropriate peer color
 *
 * Created on       September 12, 2019
 * @author          Jordan Reedie
 *
 * @copyright (c) 2019-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/
import React from 'react';
import PropTypes from 'prop-types';

class PeerLabel extends React.Component {
    static propTypes = {

        /** the display name of the peer */
        displayName: PropTypes.string.isRequired,

        /** the color associated with this peer in the meeting mediator */
        peerColor: PropTypes.string.isRequired,
    };

    render() {
        return (
            <div
                className='peer-label-container'
                style={{ backgroundColor: this.props.peerColor }}
            >
                {this.props.displayName}
            </div>
        );
    }
}

export {
    PeerLabel,
};
