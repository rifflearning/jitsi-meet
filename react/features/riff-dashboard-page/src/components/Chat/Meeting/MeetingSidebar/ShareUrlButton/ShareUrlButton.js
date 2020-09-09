/* ******************************************************************************
 * ShareUrlButton.jsx                                                         *
 * *************************************************************************/ /**
 *
 * @fileoverview React component for button to share URLs with the meeting
 *
 * If the button is clicked, it does the following:
 *  - If someone else is sharing a URL, nothing (button is disabled)
 *  - If no one is share a URL, shares a URL with the meeting participants
 *    (to be displayed automatically in the shared doc space)
 *  - If the user who clicks the button is sharing a URL already, the user stops
 *    sharing the URL
 *
 * Created on       March 18, 2020
 * @author          Jordan Reedie
 *
 * @copyright (c) 2020-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/
import React from 'react';
import PropTypes from 'prop-types';
import LinkIcon from '@material-ui/icons/Link';
import LinkOffIcon from '@material-ui/icons/LinkOff';

import { MediaActionBtn } from '../../../Common/styled';

class ShareUrlButton extends React.Component {
    static propTypes = {

        /** our webrtc object */
        webrtc: PropTypes.object.isRequired,

        /** is the user currently sharing */
        isUserSharing: PropTypes.bool.isRequired,

        /**
         * if someone is sharing their screen, this will be truthy
         * if no one is sharing their screen, this will be falsy (null)
         */
        sharedScreen: PropTypes.object,

        /**
         * if someone is sharing a url, this will be truthy
         * if no one is sharing a url, this will be falsy (null)
         */
        sharedUrl: PropTypes.string,

        /** handles sharing urls */
        handleShareUrl: PropTypes.func.isRequired,

        /** handles stopping shared urls */
        handleStopShareUrl: PropTypes.func.isRequired,
    }

    render() {
        let icon = <LinkIcon/>;
        let disabled = false;
        let ariaLabel = 'Share Link';
        let onClick = null;
        const isSharingLink = this.props.isUserSharing && this.props.sharedUrl;

        if (isSharingLink) {
            icon = <LinkOffIcon/>;
            ariaLabel = 'Stop Sharing Link';
            onClick = () => this.props.handleStopShareUrl(this.props.webrtc);
        }
        else if (this.props.sharedUrl || this.props.sharedScreen) {
            disabled = true;
            ariaLabel = 'Can\'t Share While Other User is Sharing';
            onClick = null;
        }
        else {
            onClick = () => {
                const url = prompt('Enter the URL you\'d like to share');
                if (url !== null) {
                    this.props.handleShareUrl(this.props.webrtc, url);
                }
            };
        }

        return (
            <MediaActionBtn
                inToggledState={isSharingLink !== false}
                onClick={onClick}
                disabled={disabled}
                aria-label={ariaLabel}
                title={ariaLabel}
            >
                {icon}
            </MediaActionBtn>
        );

    }
}

export {
    ShareUrlButton,
};
