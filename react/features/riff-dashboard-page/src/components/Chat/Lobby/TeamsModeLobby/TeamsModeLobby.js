/* ******************************************************************************
 * TeamsModeLobby.jsx                                                           *
 * *************************************************************************/ /**
 *
 * @fileoverview React component for the Chat Lobby in Teams Mode
 *
 * Presents the user with a page in which they can enter the details of and
 * join a meeting.
 *
 * Created on       May 4, 2020
 * @author          Jordan Reedie
 *
 * @copyright (c) 2020-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

import React from 'react';
import PropTypes from 'prop-types';

import { logger } from 'libs/utils';

import {
    LobbyBody,
    LobbyForm,
    LobbySubHeading,
} from '../styled';

import { MediumHeading } from 'Components/styled';
import { FormField } from 'Components/Common/Form/FormField';
import { SubmitButton } from 'Components/Common/Form/SubmitButton';


import { JoinRoomErrorNotification } from '../JoinRoomErrorNotification';
import { RoomInvite } from '../RoomInvite';

const MEDIA_ERROR_WARNING = 'Make sure your camera and microphone are ready.';

class TeamsModeLobby extends React.Component {
    static propTypes = {

        /** the user's display name */
        displayName: PropTypes.string.isRequired,

        /** determines if the user may change the display name */
        isDisplayNameUserSettable: PropTypes.bool.isRequired,

        /** persist the changes made to displayName in redux */
        saveDisplayName: PropTypes.func.isRequired,

        /** the room name of the meeting the user is attempting to join */
        roomName: PropTypes.string,

        /** determines if the user may change the room name */
        isRoomNameUserSettable: PropTypes.bool.isRequired,

        /** persist the changes made to roomName in redux */
        saveRoomName: PropTypes.func.isRequired,

        /** true if there is an error requesting access to  the user's
         *  webcam or microphone
         *  false otherwise
         */
        mediaError: PropTypes.bool,

        /** true if the user is already attempting to join a room, false otherwise
         *  used to make sure we don't try to join a room twice
         */
        isJoiningRoom: PropTypes.bool.isRequired,

        /** either joins an ongoing meeting or starts a new one */
        joinMeeting: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);

        // Defining state from props is frequently considered an anti-pattern
        // @see {@link https://medium.com/@justintulk/react-anti-patterns-props-in-initial-state-28687846cc2e
        //            |React Anti-Patterns: Props in Initial State}
        // but we are doing this here deliberately, although it may warrant further thought.
        this.state = {
            displayName: props.displayName,
            roomName: props.roomName,
            meetingType: '',
            joinError: null,
        };

        this.roomNameInput = React.createRef();
        this.displayNameInput = React.createRef();
    }

    componentDidMount() {
        // use timeout to set focus because, on route change,
        // focus is set to body, in App.jsx
        setTimeout(() => {
            if (this.props.roomName) {
                this.displayNameInput.current.focus();
            }
            else {
                this.roomNameInput.current.focus();
            }
        }, 100);
    }

    handleFieldChange = (field, event) => {
        this.setState({ [field]: event.target.value });
    }

    handleFormSubmit = (e) => {
        e.preventDefault();

        // isJoiningRoom is true if the user is already attempting to join a room
        // make sure we don't do anything if that happens
        // TODO - we can probably just handle this in local state honestly, but
        // I don't want to rip it out of redux until I consider it more thoroughly
        // - jr 4.14.2019
        if (this.props.isJoiningRoom) {
            logger.debug('Lobby.handleFormSubmit: Attempted to join room more than once, abort!');
            return;
        }
        const { displayName, roomName, meetingType } = this.state;

        if (!displayName || !roomName) {
            return;
        }

        // there is an error with the user's webcam or mic,
        // let them know and don't bother trying to join the room
        if (this.props.mediaError) {
            this.setState({ joinError: MEDIA_ERROR_WARNING });
            return;
        }

        // persist the display name and room name to redux
        // for use down the line
        this.props.saveDisplayName(displayName);
        this.props.saveRoomName(roomName);

        this.props.joinMeeting(displayName, roomName, meetingType);
    }

    handleClearJoinError = () => {
        this.setState({ joinError: null });
    }

    render() {
        const { displayName, roomName, meetingType, joinError } = this.state;
        // join button is disabled unless both fields have values
        const isJoinButtonDisabled = !displayName || !roomName;
        const isInviteButtonDisabled = !roomName;

        return (
            <LobbyBody>
                <MediumHeading>{'Join a Riff Call'}</MediumHeading>
                <LobbySubHeading>
                    {`Enter a room name and your name to join a call; Add what
                            type of meeting you're having; Your metrics will automatically
                            display when the call is over.`}
                </LobbySubHeading>
                <LobbyForm onSubmit={this.handleFormSubmit}>
                    <JoinRoomErrorNotification
                        joinRoomErrorMessage={joinError}
                        clearJoinRoomError={this.handleClearJoinError}
                    />
                    <FormField
                        value={roomName}
                        readOnly={!this.props.isRoomNameUserSettable}
                        isRequired={true}
                        labelName='Room Name'
                        inputName='room'
                        inputType='text'
                        placeHolder=''
                        handleFunction={e => this.handleFieldChange('roomName', e)}
                        error={this.state.error}
                        instructionalText={'Enter the room name for this call'}
                        inputRef={this.roomNameInput}
                    />
                    <FormField
                        value={displayName}
                        readOnly={!this.props.isDisplayNameUserSettable}
                        isRequired={true}
                        labelName='Your Name'
                        inputName='name'
                        inputType='text'
                        placeHolder=''
                        handleFunction={e => this.handleFieldChange('displayName', e)}
                        error={this.state.error}
                        instructionalText={'Type your name'}
                        inputRef={this.displayNameInput}
                    />
                    <FormField
                        isRequired={false}
                        labelName='Meeting Type'
                        inputName='name'
                        inputType='text'
                        placeHolder=''
                        handleFunction={e => this.handleFieldChange('meetingType', e)}
                        error={this.state.error}
                        instructionalText={'Enter what your meeting is about, e.g. design review'}
                        value={meetingType}
                    />
                    <SubmitButton
                        disabled={isJoinButtonDisabled}
                        btnText={'Join Room'}
                    />
                    <RoomInvite disabled={isInviteButtonDisabled} roomName={roomName}/>
                </LobbyForm>
            </LobbyBody>
        );
    }
}

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    TeamsModeLobby,
};
