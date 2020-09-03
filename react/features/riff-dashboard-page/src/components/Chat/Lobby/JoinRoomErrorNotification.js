/* ******************************************************************************
 * JoinRoomErrorNotification.jsx                                                *
 * *************************************************************************/ /**
 *
 * @fileoverview React component to display a join room error
 *
 * Notifies the user of an error that occurred when attempting to join a room,
 * whether that was because the input fields were not properly filled out
 * or there was an error getting their media
 *
 * Created on       May 15, 2019
 * @author          Jordan Reedie
 *
 * @copyright (c) 2019-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/
import React from 'react';
import PropTypes from 'prop-types';

import { ErrorNotification } from './styled';


class JoinRoomErrorNotification extends React.Component {
    static propTypes = {

        /** Error message to be displayed to user */
        joinRoomErrorMessage: PropTypes.string,

        /** function to hide join room error message */
        clearJoinRoomError: PropTypes.func.isRequired,
    };

    render() {
        if (!this.props.joinRoomErrorMessage) {
            return null;
        }

        return (
            <ErrorNotification>
                <button
                    className='delete'
                    onClick={this.props.clearJoinRoomError}
                    aria-label='Close form error message'
                />
                {this.props.joinRoomErrorMessage}
            </ErrorNotification>
        );
    }
}

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    JoinRoomErrorNotification,
};
