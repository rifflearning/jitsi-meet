/* ******************************************************************************
 * TextChat.jsx                                                                 *
 * *************************************************************************/ /**
 *
 * @fileoverview React component for TextChat (connected)
 *
 * This both defines the TextChat component and connects it to Redux
 * TextChat allows users to have a text-based chat component alongside their
 * video
 *
 * NOTE - I have left this largely intact, I'm not sure what we want to do with
 * it going forward -jr 6.20.19
 *
 * NOTE2 - I did some work to match our style, converting TextChat to a class
 * using the logger, adding prop-types.
 * but the connection to redux should still be separated out as should the
 * created styled components, remove use of underscore, there are more props
 * mapped from redux state than are needed!... -mjl 2019-07-22
 *
 * Created on       October 15, 2018
 * @author          Dan Calacci
 * @author          Jordan Reedie
 * @author          Michael Jay Lippert
 *
 * @copyright (c) 2018-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import {
    Widget,
    addResponseMessage,
    addUserMessage,
    dropMessages,
} from 'react-chat-widget';
import 'react-chat-widget/lib/styles.css';

import { logger } from 'libs/utils';
import { sendTextChatMsg, setTextChatBadge } from 'Redux/actions/textchat';
import { getUserId } from 'Redux/selectors/user';
import { getRiffMeetingId } from 'Redux/selectors/riff';
import { getRoomName } from 'Redux/selectors/chat';

const RiffChat = styled.div`
    .rcw-conversation-container > .rcw-header {
        background-color: rgb(138,106,148);
    }

    .rcw-message > .rcw-client {
        background-color: rgb(138,106,148);
        color: #fff;
        word-wrap: break-word;
    }

    .rcw-launcher {
        background-color: rgb(138,106,148);
    }
`;

/* ******************************************************************************
 * TextChat                                                                */ /**
 *
 * React component to show text messages between meeting attendees
 *
 ********************************************************************************/
class TextChat extends React.Component {
    static propTypes = {

        /** the participant ID of the current user */
        uid: PropTypes.string.isRequired,

        /** the room name of the meeting in progress that the text chat is associated with */
        roomName: PropTypes.string.isRequired,

        /** the list of all text messages for the meeting */
        messages: PropTypes.arrayOf(PropTypes.shape({
            participant: PropTypes.string.isRequired,
            name: PropTypes.string,
            message: PropTypes.string.isRequired,
        })).isRequired,

        /** the notification badge used to indicate unread messages */
        badge: PropTypes.bool.isRequired,

        /** Remove the notification badge if it is displayed */
        removeBadge: PropTypes.func.isRequired,

        /** distribute a new message entered by the user to the other participants */
        handleNewUserMessage: PropTypes.func.isRequired,

        /** dispatch redux action (TODO: remove the need for this prop -mjl 2019-07-22) */
        dispatch: PropTypes.func.isRequired,
    };

    /* **************************************************************************
     * componentDidMount                                                   */ /**
     *
     * Lifecycle method of a React component.
     * This is invoked immediately after a component is mounted (inserted into the
     * tree). Initialization that requires DOM nodes should go here.
     *
     * @see {@link https://reactjs.org/docs/react-component.html#componentdidmount|React.Component.componentDidMount}
     */
    componentDidMount() {
        dropMessages();
        for (const m of this.props.messages) {
            if (m.participant === this.props.uid) {
                addUserMessage(m.message);
            }
            else {
                addResponseMessage(`**${m.name}**: ${m.message}`);
            }
        }
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
    componentDidUpdate(prevProps) {
        logger.debug('TextChat.componentDidUpdate: updating text chat component...', this.props.messages);
        function arrayDiff(a, b) {
            return [
                ...a.filter(x => !b.includes(x)),
                ...b.filter(x => !a.includes(x))
            ];
        }
        const notUser = uid => msg => msg.participant !== uid;

        if (this.props.messages !== prevProps.messages && this.props.messages.length > 0) {
            const newMessages = arrayDiff(this.props.messages, prevProps.messages)
                .filter(notUser(this.props.uid));
            logger.debug('TextChat.componentDidUpdate: new messages:', newMessages);
            for (const m of newMessages) {
                addResponseMessage(`**${m.name}**: ${m.message}`);
                this.props.dispatch(setTextChatBadge(true));
            }
        }

        if (this.props.messages.length === 0) {
            logger.debug('TextChat.componentDidUpdate: props messages EMPTY, clearing messages on chat component.');
            dropMessages();
        }
    }

    /* **************************************************************************
     * render                                                              */ /**
     *
     * Required method of a React component.
     * @see {@link https://reactjs.org/docs/react-component.html#render|React.Component.render}
     */
    render() {
        return (
            <RiffChat onClick={() => this.props.removeBadge()}>
                <Widget
                    handleNewUserMessage={this.props.handleNewUserMessage}
                    onClick={() => this.props.removeBadge()}
                    title={this.props.roomName}
                    subtitle=''
                    badge={this.props.badge}
                />
            </RiffChat>
        );
    }
}

const mapStateToProps = state => ({
    messages: state.chat.textchat.messages,
    roomName: getRoomName(state),
    badge: state.chat.textchat.badge,
    uid: getUserId(state),
    meetingId: getRiffMeetingId(state),
});

const mapDispatchToProps = dispatch => ({
    dispatch,
    removeBadge: () => {
        logger.debug('TextChat.removeBadge: removing badge...');
        dispatch(setTextChatBadge(false));
    }
});

const mapMergeProps = (stateProps, dispatchProps, ownProps) => ({
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    handleNewUserMessage: (event) => {
        dispatchProps.dispatch(sendTextChatMsg(
            event,
            stateProps.uid,
            stateProps.meetingId
        ));
    }
});

const ConnectedTextChat = connect(
    mapStateToProps,
    mapDispatchToProps,
    mapMergeProps)(TextChat);

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    ConnectedTextChat as TextChat,
};
