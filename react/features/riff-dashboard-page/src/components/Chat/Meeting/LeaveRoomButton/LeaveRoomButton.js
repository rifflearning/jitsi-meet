/* ******************************************************************************
 * LeaveRoomButton.jsx                                                          *
 * *************************************************************************/ /**
 *
 * @fileoverview React component for the 'Leave Room' Button
 *
 * The Leave Room button handles all the methods in which a user
 * can leave the room - clicking the button, navigating to a different
 * part of the site (e.g. 'My Riffs'), refreshing the page, and closing the tab
 *
 * Created on       June 5, 2019
 * @author          Jordan Reedie
 *
 * @copyright (c) 2019-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/
import React from 'react';
import PropTypes from 'prop-types';

import { LeaveRoomBtnContainer } from '../styled';

import { logger } from 'libs/utils';

class LeaveRoomButton extends React.Component {
    static propTypes = {

        /** handles all behavior associated with leaving a room */
        leaveRoom: PropTypes.func.isRequired,
    }

    constructor(props) {
        super(props);
        this.onBeforeUnload = this.onBeforeUnload.bind(this);
        this.onUnload = this.onUnload.bind(this);
        this.onClick = this.onClick.bind(this);

        // we need to track if the user left via
        // button click or navigation away from page
        // (to prevent calling leaveRoom twice)
        this.buttonClicked = false;
    }

    /**
     * Warn the user that they will be leaving the page
     * if they attempt to close / refresh the tab
     */
    onBeforeUnload(event) {
        event.preventDefault();
        logger.debug('LeaveRoomButton.onBeforeUnload:', event);
        event.returnValue = 'If you leave, you\'ll have to re-join the room.';
        return true;
    }

    onUnload() {
        if (!this.buttonClicked) {
            this.props.leaveRoom();
        }
    }

    componentDidMount() {
        // we want to catch the case where the user just closes the tab
        // or refreshes the page and ask them to make sure
        window.addEventListener('beforeunload', this.onBeforeUnload);
        window.addEventListener('unload', this.onUnload);
    }

    componentWillUnmount() {
        window.removeEventListener('beforeunload', this.onBeforeUnload);
        window.removeEventListener('unload', this.onUnload);
    }

    onClick() {
        this.buttonClicked = true;
        this.props.leaveRoom();
    }

    render() {
        return (
            <LeaveRoomBtnContainer
                onClick={this.onClick}
            >
                {'Leave Room'}
            </LeaveRoomBtnContainer>
        );
    }
}

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    LeaveRoomButton,
};
