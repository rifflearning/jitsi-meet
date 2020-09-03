/* ******************************************************************************
 * RoomInvite.jsx                                                               *
 * *************************************************************************/ /**
 *
 * @fileoverview React component for getting a room invitation link
 *
 * If there is a valid room name, an invitation to that room on this
 * site will be displayed along with a copy to clipboard button.
 *
 * Created on       April 9, 2020
 * @author          Michael Jay Lippert
 *
 * @copyright (c) 2020-present Riff Analytics,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

import React from 'react';
import PropTypes from 'prop-types';
import copyToClipboard from 'copy-to-clipboard';
import LinkIcon from '@material-ui/icons/Link';

import { Routes } from 'Redux/constants';
import { getIsPersonalMode } from 'Redux/selectors/config';

import {
    ActionBtn,
    InviteText,
    RoomInviteBtn,
} from './styled';


/* ******************************************************************************
 * RoomInvite                                                               */ /**
 *
 * React component for getting a room invitation link
 *
 * Presents a button that is enabled if there is a valid room name.
 * Clicking the button w/ toggle displaying an invitation link to that room
 * on this site along with a copy to clipboard button.
 *
 ********************************************************************************/
class RoomInvite extends React.Component {
    static propTypes = {

        /** The room name for the invitation */
        roomName: PropTypes.string.isRequired,
        disabled: PropTypes.bool,
    };

    /* **************************************************************************
     * constructor                                                         */ /**
     */
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            isCopyClicked: false,
        };

        this._toggleOpen = this._toggleOpen.bind(this);
    }

    /* **************************************************************************
     * componentDidUpdate                                                  */ /**
     *
     * componentDidUpdate() is invoked immediately after updating occurs. This
     * method is not called for the initial render.
     *
     * Use this as an opportunity to operate on the DOM when the component has
     * been updated.
     */
    componentDidUpdate(/* prevProps */) {
        // if the roomName becomes invalid make sure the state is not open
        if (!this._isValidRoomName() && this.state.open) {
            this.setState({ open: false }); // eslint-disable-line react/no-did-update-set-state
        }
    }

    /* **************************************************************************
     * render                                                              */ /**
     *
     * Required method of a React component.
     * @see {@link https://reactjs.org/docs/react-component.html#render|React.Component.render}
     */
    render() {
        const showInviteBtn = (
            <RoomInviteBtn
                type='button'
                onClick={this._toggleOpen}
                disabled={this.props.disabled}
            >
                {'Show Invite Link'}
                <LinkIcon/>
            </RoomInviteBtn>
        );


        return (
            <>
                { this.state.open ? this._getInviteLink() : showInviteBtn }
            </>
        );
    }

    /* **************************************************************************
     * _toggleOpen                                                         */ /**
     *
     * Toggle the open state showing/hiding the room invite link
     */
    _toggleOpen() {
        // we can just always set isCopyClicked to false here, it doesn't matter
        // if it gets set to false twice
        this.setState({ open: !this.state.open, isCopyClicked: false });
    }

    /* **************************************************************************
     * _isValidRoomName                                                    */ /**
     *
     * Determine if the props room name is valid for creating a link.
     *
     * @returns {boolean}
     */
    _isValidRoomName() {
        return Boolean(this.props.roomName);

    }

    /* **************************************************************************
     * _copyClick                                                          */ /**
     *
     * Returns a function that will copy the link to the clipboard and updates state
     *
     * @returns {function}
     */
    _copyClick(inviteHref) {
        return () => {
            copyToClipboard(inviteHref);
            if (!this.state.isCopyClicked) {
                this.setState({ isCopyClicked: true });
            }
        };
    }

    /* **************************************************************************
     * _getInviteLink                                                      */ /**
     *
     * Get the invitation link to display. Returns null if the invitation
     * link cannot or should not be displayed.
     *
     * @returns {?ReactNode}
     */
    _getInviteLink() {
        if (!this.state.open || !this._isValidRoomName()) {
            return null;
        }

        const inviteLinkUrl = new URL(document.location.href);
        if (getIsPersonalMode()) {
            inviteLinkUrl.pathname = `${Routes.Join}/${this.props.roomName}`;

        }
        else {
            inviteLinkUrl.pathname = Routes.Chat;
            inviteLinkUrl.search = '';
            inviteLinkUrl.searchParams.set('room', this.props.roomName);
        }
        const inviteHref = inviteLinkUrl.href;

        const inviteLink = (
            <div className='columns is-gapless is-marginless'>
                <div className='column'>
                    <InviteText
                        readOnly={true}
                        value={inviteHref}
                    />
                </div>
                <div className='column is-narrow is-paddingless'>
                    <ActionBtn
                        type='button'
                        onClick={this._copyClick(inviteHref)}
                    >
                        {this.state.isCopyClicked ? 'Copied' : 'Copy'}
                    </ActionBtn>
                </div>
                <div className='column is-narrow is-paddingless'>
                    <ActionBtn
                        type='button'
                        onClick={this._toggleOpen}
                    >
                        {'Close'}
                    </ActionBtn>
                </div>
            </div>
        );

        return inviteLink;
    }
}


/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    RoomInvite,
};
