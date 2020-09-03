/* ******************************************************************************
 * CopyInviteButton.jsx                                                         *
 * *************************************************************************/ /**
 *
 * @fileoverview React component for the 'Copy Invite' Button
 *
 * Created on       May 11, 2020
 * @author          Jordan Reedie
 *
 * @copyright (c) 2020-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/
import React from 'react';
import PropTypes from 'prop-types';
import copyToClipboard from 'copy-to-clipboard';

import { Routes } from 'redux/constants';
import { getIsPersonalMode } from 'redux/selectors/config';

import { CopyInviteBtn } from './styled';

class CopyInviteButton extends React.Component {
    static propTypes = {

        /** invite id for the meeting */
        inviteId: PropTypes.string.isRequired,
    }

    constructor(props) {
        super(props);
        this.state = {
            wasCopied: false,
        };

        // for managing the reset state timeout
        // so we can clear it if we need to
        this.timeout = null;
        this.copyUrl = this.copyUrl.bind(this);
        this.initUrl();
    }

    initUrl() {
        const inviteLinkUrl = new URL(document.location.href);
        if (getIsPersonalMode()) {
            inviteLinkUrl.pathname = `${Routes.Join}/${this.props.inviteId}`;
        }
        else {
            inviteLinkUrl.pathname = Routes.Chat;
            inviteLinkUrl.search = '';
            inviteLinkUrl.searchParams.set('room', this.props.inviteId);
        }

        this.inviteUrl = inviteLinkUrl.href;
    }

    copyUrl() {
        // clear the last timeout so we restart the timer instead of adding another
        if (this.timeout !== null) {
            clearTimeout(this.timeout);
        }
        this.setState({ wasCopied: true });
        copyToClipboard(this.inviteUrl);
        // set a timeout to set wasCopied back to false, so
        // the button doesn't say 'copied' forever
        // 5 seconds seems like a good amount of time
        const resetCopyStateTimeout = 5000;
        this.timeout = setTimeout(() => this.setState({ wasCopied: false }), resetCopyStateTimeout);
    }

    render() {
        const btnText = `${this.state.wasCopied ? 'Copied' : 'Copy'} Invite URL`;
        return (
            <CopyInviteBtn onClick={this.copyUrl}>
                {btnText}
            </CopyInviteBtn>
        );
    }
}

export {
    CopyInviteButton,
};
