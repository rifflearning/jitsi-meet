/* ******************************************************************************
 * index.js                                                                     *
 * *************************************************************************/ /**
 *
 * @fileoverview Connects ScreenShareButton to redux
 *
 * Created on       March 23, 2020
 * @author          Jordan Reedie
 *
 * @copyright (c) 2020-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/
import { connect } from 'react-redux';

import {
    removeSharedScreen,
    shareScreen,
} from 'redux/actions/chat';

import { logger } from 'libs/utils';

import { ScreenShareButton } from './ScreenShareButton';

const mapStateToProps = state => ({
    isUserSharing: state.chat.isUserSharing,
    sharedUrl: state.chat.sharedUrl,
    sharedScreen: state.chat.sharedScreen,
});

const mapDispatchToProps = dispatch => ({
    handleScreenShareClick: (isUserSharing, sharedScreen, sharedUrl, webrtc) => {
        // if the user is currently sharing their screen, we want to stop
        if (isUserSharing) {
            dispatch(removeSharedScreen());
            webrtc.stopScreenShare();
        }
        // if someone is already sharing
        // do nothing and log it
        else if (sharedScreen || sharedUrl) {
            logger.debug('someone else is already sharing!');
        }
        else {
            logger.debug('Sharing screen!');
            dispatch(shareScreen());
            webrtc.shareScreen({ audio: false });
        }
    },
});

const ConnectedScreenShareButton = connect(
    mapStateToProps,
    mapDispatchToProps
)(ScreenShareButton);

export {
    ConnectedScreenShareButton as ScreenShareButton
};
