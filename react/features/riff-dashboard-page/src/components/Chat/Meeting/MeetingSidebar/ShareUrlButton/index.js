/* ******************************************************************************
 * index.js                                                                     *
 * *************************************************************************/ /**
 *
 * @fileoverview Connects ShareUrlButton to redux
 *
 * Created on       March 18, 2020
 * @author          Jordan Reedie
 *
 * @copyright (c) 2020-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/
import { connect } from 'react-redux';

import {
    urlShareStart,
    urlShareStop,
} from 'redux/actions/chat';

import { logger } from 'libs/utils';

import { ShareUrlButton } from './ShareUrlButton';

const mapStateToProps = state => ({
    isUserSharing: state.chat.isUserSharing,
    sharedScreen: state.chat.sharedScreen,
    sharedUrl: state.chat.sharedUrl,
});

const mapDispatchToProps = dispatch => ({
    handleShareUrl: (webrtc, url) => {
        let urlObj;
        try {
            urlObj = new URL(url);
        }
        catch (err) {
            logger.info('Invalid URL entered: ', url);
            alert('Please enter a valid URL');
        }
        // TODO consider moving  webrtc actions somewhere else
        webrtc.shareUrl(urlObj.href);
        dispatch(urlShareStart(url, true));
    },
    handleStopShareUrl: (webrtc) => {
        webrtc.stopShareUrl();
        dispatch(urlShareStop());
    },
});

const ConnectedShareUrlButton = connect(
    mapStateToProps,
    mapDispatchToProps
)(ShareUrlButton);

export {
    ConnectedShareUrlButton as ShareUrlButton
};
