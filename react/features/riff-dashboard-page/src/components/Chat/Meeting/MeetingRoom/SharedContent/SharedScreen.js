/* ******************************************************************************
 * SharedScreen.jsx                                                             *
 * *************************************************************************/ /**
 *
 * @fileoverview React component for a remote shared screen stream
 *
 * Add a peer's shared screen to the dom.
 *
 * Created on       January 17, 2019
 * @author          Jordan Reedie
 *
 * @copyright (c) 2019-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/
import React from 'react';
import PropTypes from 'prop-types';

import { PeerVideo } from '../PeerVideo';

class SharedScreen extends React.Component {
    static propTypes = {

        /** the video element (of the shared screen) we are adding to the DOM */
        video: PropTypes.instanceOf(Element),
    };

    render() {
        // if the video is falsy in any way, abort
        if (!this.props.video) {
            return null;
        }

        return (
            <PeerVideo
                key="shared_screen"
                id="shared_screen"
                type="screen"
                video={this.props.video}
            />
        );
    }
}

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    SharedScreen,
};
