/* ******************************************************************************
 * webrtc.js                                                                    *
 * *************************************************************************/ /**
 *
 * @fileoverview Create a webrtc instance that listens for webrtc events and dispatches actions
 *
 * Created on       August 9, 2018
 * @author          Dan Calacci
 * @author          Michael Jay Lippert
 * @author          Jordan Reedie
 *
 * @copyright (c) 2018-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

import SimpleWebRTC from '@rifflearning/simplewebrtc';
import sibilant from '@rifflearning/sibilant';

import { app } from 'libs/riffdata-client';
import { logger } from 'libs/utils';
import {
    addPeer,
    addSharedScreen,
    getDisplayError,
    getMediaError,
    readyToCall,
    removePeer,
    removeSharedScreen,
    saveLocalWebrtcId,
    showMeetingDoc,
    urlShareStart,
    urlShareStop,
    volumeChanged,
} from 'Redux/actions/chat';
import {
    participantLeaveRoom,
    updateRiffMeetingId,
} from 'Redux/actions/riff';
import { getUserId } from 'Redux/selectors/user';
import { getRiffAuthToken } from 'Redux/selectors/riff';


function addWebRtcListeners(nick, localVideoId, dispatch, getState) {
    let signalmasterPath = window.client_config.signalMaster.path || '';
    signalmasterPath += '/socket.io';
    // TODO this is a temporary solution to a bug
    // where, only in firefox, if you refresh the page
    // while sharing a link it does not send the urlShareStop message
    // (it works when closing the page or leaving the room?)
    // - jr 4.6.20
    let lastSharedPeerId = '';
    const webRtcConfig = {
        localVideoEl: localVideoId,
        remoteVideosEl: '', // handled by our component
        autoRequestMedia: true,
        url: window.client_config.signalMaster.url,
        nick: nick,
        socketio: {
            path: signalmasterPath,
            forceNew: true
        },
        videoCodec: 'H264',
        media: {
            audio: true,
            video: {
                // TODO - the resolution here is rather low
                // this is good for cpu limited users,
                // but in the future we would like to implement variable resolution
                // to improve visual quality for those who can afford it
                width: { ideal: 320 },
                height: { ideal: 240 },
                // firefox doesn't support requesting a framerate other than
                // that which the user's webcam can natively provide
                // chrome does not have this limitation
                frameRate: { ideal: 12, max: 30 }
            }
        },
        debug: !!window.client_config.webrtc_debug,
    };

    const webrtc = new SimpleWebRTC(webRtcConfig);

    logger.debug('Listener.WebRtc: Creating webrtc constant...', webrtc);
    // logger.debug("Local Session ID:", webrtc.connection.socket.sessionId)

    const bindSibilantToStream = function (stream) {
        const sib = new sibilant(stream);

        if (sib) {
            logger.debug('Listener.WebRtc: Registering speaking detection for stream', stream);
            // FIXME - uh, is something supposed to be happening here?
            // can we just delete this? -jr
            webrtc.stopVolumeCollection = function () {
                // sib.unbind('volumeChange');
            };

            webrtc.startVolumeCollection = function () {
                sib.bind('volumeChange', function (data) {
                    const state = getState();
                    if (!state.chat.inRoom) {
                        dispatch(volumeChanged(data));
                    }
                }.bind(getState));
            };

            webrtc.stopSibilant = function () {
                sib.unbind('stoppedSpeaking');
            };

            // use this to show user volume to confirm audio/video working
            webrtc.startVolumeCollection();

            logger.debug(`Listener.WebRtc: binding to sib stoppedSpeaking w/ room? "${getState().chat.webRtcRoom}"`);
            sib.bind('stoppedSpeaking', (data) => {
                const state = getState();
                if (state.chat.inRoom) {
                    logger.debug('Listener.WebRtc.sib.stoppedSpeaking: create utterance for user: ' +
                                 `${getUserId(state)} in room: "${state.chat.webRtcRoom}"`);
                    app.service('utterances')
                        .create({
                            participant: getUserId(state),
                            room: state.chat.webRtcRoom,
                            startTime: data.start.toISOString(),
                            endTime: data.end.toISOString(),
                            token: getRiffAuthToken(state),
                        })
                        .then(function (res) {
                            logger.debug('Listener.WebRtc.sib.stoppedSpeaking: speaking event recorded:', res);
                            dispatch(updateRiffMeetingId(res.meeting));
                            return undefined;
                        })
                        .catch(function (err) {
                            logger.error('Listener.WebRtc: ERROR', err);
                        });
                }
            });
        }
    };

    webrtc.on('videoAdded', function (video, peer) {
        // send a no-op to begin the url channel opening process
        peer.sendDirectly('url', 'noop', 'noop');
        logger.debug('Listener.WebRtc.videoAdded: added video', peer, video, 'nick:', peer.nick);
        dispatch(addPeer({ peer: peer, videoEl: video }));
        if (webrtc.sharedUrl) {
            const sharedUrl = webrtc.sharedUrl;
            // the channel takes a second to connect,
            // and it doesn't fire an event when it's successful
            // so we have to just try until we succeed or
            // exceed a reasonable max number of tries
            // -jr 3.25.20
            const maxTries = 15;
            let numTries = 0;
            const retrySendInterval = setInterval(() => {
                const sendSuccess = peer.sendDirectly('url', 'urlShareStart', sharedUrl);
                numTries++;
                if (sendSuccess || numTries >= maxTries) {
                    clearInterval(retrySendInterval);
                }
            }, 100);
        }
    });

    webrtc.on('urlShareStart', function (peer, url) {
        lastSharedPeerId = peer.id;
        dispatch(urlShareStart(url, false));
    });

    webrtc.on('urlShareStop', function () {
        dispatch(urlShareStop());
    });

    webrtc.on('videoRemoved', function (video, peer) {
        const state = getState();
        // TODO this is a [potentially temporary] fix for a bug in firefox where
        // when a user leaves the room by refreshing the page while sharing a url,
        // the webrtc data channel seems to close before successfully sending
        // the stop sharing message
        // need to consider other ways to fix this when we have more time
        // - jr 4.6.20
        if (peer.id === lastSharedPeerId && state.chat.sharedUrl) {
            dispatch(urlShareStop());
        }

        dispatch(removePeer({ peer: peer, videoEl: video }));
        if (state.chat.inRoom) {
            logger.debug('Listener.WebRtc.videoRemoved: removing participant ' +
                         `${peer.nick} from meeting ${state.riff.meetingId}`);
            const [ riffId ] = peer.nick.split('|');
            participantLeaveRoom(state.riff.meetingId, riffId);
        }
    });

    webrtc.on('screenAdded', function (video, peer) {
        logger.debug('Listener.WebRtc.screenAdded: adding shared screen!', video, 'from', peer);
        dispatch(showMeetingDoc(false));
        dispatch(addSharedScreen(video, false));
    });

    webrtc.on('screenRemoved', function (video, peer) {
        logger.debug('Listener.WebRtc.screenRemoved: removing shared screen!', { video, peer });
        dispatch(showMeetingDoc(true));
        dispatch(removeSharedScreen());
    });

    webrtc.on('localScreenAdded', function (video) {
        dispatch(showMeetingDoc(false));
        dispatch(addSharedScreen(video, true));
    });

    webrtc.on('localScreenRemoved', function (video) {
        dispatch(showMeetingDoc(true));
        dispatch(removeSharedScreen(video));
    });

    // this happens if the user ends via the chrome button
    // instead of our button
    webrtc.on('localScreenStopped', function (video) {
        dispatch(showMeetingDoc(true));
        dispatch(removeSharedScreen(video));
    });

    webrtc.on('localScreenRequestFailed', function () {
        dispatch(getDisplayError());
    });

    webrtc.on('localStreamRequestFailed', function () {
        dispatch(getMediaError(true));
    });

    webrtc.on('localStream', function (stream) {
        if (stream.active) {
            dispatch(getMediaError(false));
        }
        bindSibilantToStream(stream);
    });

    webrtc.releaseWebcam = function () {
        // we need to go through each track (audio / video) of each
        // local stream and stop them individually
        for (const stream of this.webrtc.localStreams) {
            for (const track of stream.getTracks()) {
                track.stop();
            }
        }
    };

    webrtc.changeNick = function (newNick) {
        this.config.nick = newNick;
        this.webrtc.config.nick = newNick;
    };

    webrtc.shareUrl = function (url) {
        // since this function will always be called in the context  of webrtc,
        // `this` here refers to the `webrtc` object
        // we need to keep track of the shared URL in case someone joins
        // after we've already shared it, so we can send them a new message
        this.sharedUrl = url;
        this.sendDirectlyToAll('url', 'urlShareStart', url);
    };

    webrtc.stopShareUrl = function () {
        // since this function will always be called in the context  of webrtc,
        // `this` here refers to the `webrtc` object
        this.sharedUrl = null;
        this.sendDirectlyToAll('url', 'urlShareStop', 'noop');
    };

    webrtc.on('readyToCall', function (connectionId) {
        dispatch(getMediaError(false));
        logger.debug('Listener.WebRtc.readyToCall: local webrtc connection id:', connectionId);
        dispatch(saveLocalWebrtcId(connectionId));
        dispatch(readyToCall());
    });

    return webrtc;
}

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    addWebRtcListeners,
};
