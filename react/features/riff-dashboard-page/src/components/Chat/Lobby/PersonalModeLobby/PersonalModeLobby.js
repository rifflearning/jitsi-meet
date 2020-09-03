/* ******************************************************************************
 * PersonalModeLobby.jsx                                                        *
 * *************************************************************************/ /**
 *
 * @fileoverview React component for the Chat Lobby in Personal Mode
 *
 * Presents the user with a page in which they can verify their
 * microphone & camera are working and join (or start) a meeting.
 *
 * Created on       May 3, 2020
 * @author          Jordan Reedie
 *
 * @copyright (c) 2019-present Riff Learning Inc.,
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
const HOST_NOT_JOINED_ERROR = 'The host has not started the meeting yet.';

class PersonalModeLobby extends React.Component {
    static propTypes = {

        /** the user's display name */
        displayName: PropTypes.string.isRequired,

        /** determines if the user may change the display name */
        isDisplayNameUserSettable: PropTypes.bool.isRequired,

        /** persist the changes made to displayName in redux */
        saveDisplayName: PropTypes.func.isRequired,

        /** the room ID of the meeting the user is attempting to join */
        roomId: PropTypes.string.isRequired,

        /** the room name of the meeting the user is attempting to join */
        roomName: PropTypes.string,

        /** true if there is an error requesting access to  the user's
         *  webcam or microphone
         *  false otherwise
         */
        mediaError: PropTypes.bool,

        /** true if the user is already attempting to join a room, false otherwise
         *  used to make sure we don't try to join a room twice
         */
        isJoiningRoom: PropTypes.bool.isRequired,

        /** is the user the host of the meeting */
        isHost: PropTypes.bool.isRequired,

        /** has the host started the meeting yet */
        isMeetingStarted: PropTypes.bool.isRequired,

        /** get the room name from the room Id */
        getRoomName: PropTypes.func.isRequired,

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
            meetingType: '',
            joinError: null,
        };

        this.displayNameInput = React.createRef();
    }

    componentDidMount() {
        if (this.props.roomId && !this.props.roomName) {
            // if we have a room ID but haven't got the room name,
            // we need to retrieve it
            this.props.getRoomName(this.props.roomId);
        }
        // use timeout to set focus because, on route change,
        // focus is set to body, in App.jsx
        setTimeout(() => {
            this.displayNameInput.current.focus();
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
        const { displayName, meetingType } = this.state;
        const roomName = this.props.roomName;

        if (!displayName || !roomName) {
            return;
        }

        // there is an error with the user's webcam or mic,
        // let them know and don't bother trying to join the room
        if (this.props.mediaError) {
            this.setState({ joinError: MEDIA_ERROR_WARNING });
            return;
        }

        // if the user is the host of the meeting,
        // or if the meeting has already been started,
        // they may join
        if (this.props.isHost || this.props.isMeetingStarted) {
            // persist the display name and room name to redux
            // for use down the line
            this.props.saveDisplayName(displayName);
            this.props.joinMeeting(displayName, roomName, meetingType);
        }
        else {
            this.setState({ joinError:  HOST_NOT_JOINED_ERROR });
        }
    }

    handleClearJoinError = () => {
        this.setState({ joinError: null });
    }

    render() {
        const { displayName, meetingType, joinError } = this.state;
        const { roomName, roomId } = this.props;
        // join button is disabled unless both fields have values

        // just doing this here instead of in the below if
        // so it can be declared w/ const
        const joinOrHostText = this.props.isHost ? 'host' : 'join';

        let headingText;
        if (this.props.isHost) {
            headingText = 'Host a Riff Call';
        }
        else {
            headingText = `Joining: ${roomName}`;
        }

        const isJoinButtonDisabled = !displayName || !roomId;

        return (
            <LobbyBody>
                <MediumHeading>{headingText}</MediumHeading>
                <LobbySubHeading>
                    {`Enter your name to ${joinOrHostText} a call; Add what
                      type of meeting you're having; Your metrics will automatically
                      display when the call is over.`}
                </LobbySubHeading>
                <LobbyForm onSubmit={this.handleFormSubmit}>
                    <JoinRoomErrorNotification
                        joinRoomErrorMessage={joinError}
                        clearJoinRoomError={this.handleClearJoinError}
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
                    { this.props.isHost && <RoomInvite roomName={this.props.roomId}/> }
                    <SubmitButton
                        disabled={isJoinButtonDisabled}
                        btnText={`${joinOrHostText} Meeting`}
                    />
                </LobbyForm>
            </LobbyBody>
        );
    }
}

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    PersonalModeLobby,
};
