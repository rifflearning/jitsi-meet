/* ******************************************************************************
 * MeetingRoom.jsx                                                              *
 * *************************************************************************/ /**
 *
 * @fileoverview React component to display remote streams and textchat
 *
 * Displays remote participants' a/v streams, as well as either the google doc
 * or shared screen (or neither)
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

import { calculateBitrate } from 'libs/utils/webrtc_utils';

import { MeetingRoomContainer } from '../styled';

import { DenseVideos } from './DenseVideos';
import { EmptyRoom } from './EmptyRoom';
import { RemoteVideos } from './RemoteVideos';
import { SharedContent } from './SharedContent';
import { TextChat } from './TextChat';

class MeetingRoom extends React.Component {
    static propTypes = {

        /** sets the outgoing bitrate limit for video streams */
        setVideoBitrateLimit: PropTypes.func.isRequired,

        /** If a Peer is sharing their screen, this will
         *   have the remote shared screen element
         *  Otherwise, this will be null
         */
        sharedScreen: PropTypes.object,

        /** list of all webrtc peers */
        webRtcPeers: PropTypes.arrayOf(PropTypes.object),

        /** If there is non-screen content to display, this is its URL */
        sharedUrl: PropTypes.string,

        /** URL should be displayed if true, not displayed if false */
        shouldDisplayUrl: PropTypes.bool.isRequired,
    };

    componentDidUpdate() {
        // we want to update the bitrate limit any time the number of peers changes
        // conveniently, the component updates every time this is the case
        // the operation is idempotent and inexpensive enough that we don't
        // mind if it runs a few times unnecessarily
        const updatedBitrate = calculateBitrate(this.props.webRtcPeers.length);
        this.props.setVideoBitrateLimit(updatedBitrate);
    }

    render() {
        // if there are no other people in the meeting room,
        // we want to just return an EmptyRoom
        if (this.props.webRtcPeers.length === 0) {
            return (<EmptyRoom/>);
        }

        const displayUrl = this.props.shouldDisplayUrl && this.props.sharedUrl;
        const sharedScreen = this.props.sharedScreen;

        // if we have no shared content to display,
        // allow the videos to use the full space of the screen
        if (!displayUrl && !sharedScreen) {
            return (
                <MeetingRoomContainer>
                    <RemoteVideos peers={this.props.webRtcPeers}/>
                    <TextChat/>
                </MeetingRoomContainer>
            );
        }

        // otherwise we should display the remote streams
        // in a quarter of the available screen space,
        // on the left, w/ the shared content taking
        // up the remaining space

        let contentType;
        let sharedContent;
        if (sharedScreen) {
            contentType = 'screen';
            sharedContent = sharedScreen;
        }
        else {
            contentType = 'url';
            sharedContent = this.props.sharedUrl;
        }

        return (
            <MeetingRoomContainer>
                <div className='columns' style={{ height: '100%' }}>
                    <div className='column is-one-quarter' style={{ padding: '0 0.25em' }}>
                        <DenseVideos peers={this.props.webRtcPeers}/>
                    </div>
                    <div className='column'>
                        <SharedContent type={contentType} content={sharedContent}/>
                    </div>
                </div>
                <TextChat/>
            </MeetingRoomContainer>
        );
    }
}


/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    MeetingRoom,
};
