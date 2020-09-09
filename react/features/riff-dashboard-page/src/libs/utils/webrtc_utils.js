/* ******************************************************************************
 * webrtc_utils.js                                                              *
 * *************************************************************************/ /**
 *
 * @fileoverview Utilities for Riff's use of WebRTC
 *
 * Created on       July 18, 2019
 * @author          Michael Jay Lippert
 *
 * @copyright (c) 2019-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

/** The separator character in a riff webrtc nick between the riff id and the display name */
const NICK_SEPARATOR = '|';

/** The minimum acceptable bitrate for a single stream */
const MIN_BITRATE = 300; // kbps

/** The maximum allowable total bandwidth consumed by all streams
 *  given that our requirements state a minimum bandwidth
 *  of 3 megabits per second, so we come in just a bit below that
 */
const MAX_BANDWIDTH = 2700; // kbps

/* ******************************************************************************
 * WebRtcNick                                                              */ /**
 *
 * The WebRtc nick field is used by Riff to store both the riff id and the
 * display name as a string.
 * WebRtcNick can be used to extract the id and display name, or to combine
 * them into the WebRtc nick string.
 *
 * You can create an instance of a WebRtcNick with either the nick string
 * or both the id and display name, and use toString to get the nick, or the
 * riffId or displayName getters.
 * Or if you prefer, use one of the static methods: create, getIdAndDisplayName,
 * getId or getDisplayName;
 *
 ********************************************************************************/
class WebRtcNick {

    /* **************************************************************************
     * constructor                                                         */ /**
     *
     * WebRtcNick class constructor.
     */
    constructor(...args) {
        this._riffId = null;
        this._displayName = null;

        // instance properties
        if (args.length === 1 && typeof args[0] === 'string') {
            // a single string argument is a riff webrtc nick string
            [ this._riffId, this._displayName ] = WebRtcNick.getIdAndDisplayName(args[0]);
        }
        else if (args.length === 2 && typeof args[0] === 'string' && typeof args[1] === 'string') {
            // 2 string arguments means the 1st is the riff ID and the 2nd is the display name
            [ this._riffId, this._displayName ] = args;
        }
        else {
            throw new TypeError(`Incorrect arguments for creating a WebRtcNick (${args})`);
        }
    }

    toString() {
        return this._riffId + NICK_SEPARATOR + this._displayName;
    }

    /*
     * WebRtcNick property getters/setters
     */

    get riffId() {
        return this._riffId;
    }

    get displayName() {
        return this._displayName;
    }

    /*
     * WebRtcNick static methods
     */

    /* **************************************************************************
     * create (static)                                                     */ /**
     *
     * Combine the given id and display name into a single string for use as
     * a webrtc 'nick'.
     *
     * @param {string} id
     * @param {string} displayName
     *
     * @returns {string} nick containing the given id and display name in a format
     *      which can be parsed back into its parts.
     */
    static create(id, displayName) {
        // TODO: some error checks, say for the NICK_SEPARATOR in the values
        return new WebRtcNick(id, displayName).toString();
    }

    /* **************************************************************************
     * getIdAndDisplayName (static)                                        */ /**
     *
     * Split a peer's webrtc 'nick' into its two parts:
     *  the user's display name and their riff ID
     *
     *  returns an array with the riff id in the first position
     *  and the display name in the second
     *
     * @param {string} nick - a webrtc 'nick' set by a Riff peer
     *
     * @returns {Array<string>} with the 1st element the id and the 2nd the
     *      display name.
     */
    static getIdAndDisplayName(nick) {
        return nick.split(NICK_SEPARATOR);
    }

    /* **************************************************************************
     * getId (static)                                                      */ /**
     *
     * Take a peer's webrtc 'nick' and return the peer's riff ID
     *
     * @param {string} nick
     *
     * @returns {string} the riff Id extracted from the webrtc nick.
     */
    static getId(nick) {
        return WebRtcNick.getIdAndDisplayName(nick)[0];
    }

    /* **************************************************************************
     * getDisplayName (static)                                             */ /**
     *
     * Take a peer's webrtc 'nick' and return the peer's displayName
     *
     * @param {string} nick
     *
     * @returns {string} the display name extracted from the webrtc nick.
     */
    static getDisplayName(nick) {
        return WebRtcNick.getIdAndDisplayName(nick)[1];
    }
}

/**
 * Convert a peer array into a readable string listing those peers
 * using their nicknames.
 * Useful for a11y aria labels.
 *
 * examples:
 * 0 peers: 'Nobody else is here.'
 * 1 peer : 'Gerald is in the room.'
 * 2 peers: 'Aretha and Patty are in the room.'
 * 3 peers: 'Gerald, Tony and Markus are in the room.'
 * 4 peers: 'Liz, Gerald, Rebecca and Markus are in the room.'
 */
function readablePeers(peers) {
    // No peers is easy
    if (peers.length === 0) {
        return 'Nobody else is here.';
    }

    const readableSuffix = 'in the room.';
    const peerNames = peers.map(p => WebRtcNick.getDisplayName(p.nick));

    // 1 peer is easy
    if (peerNames.length === 1) {
        return `${peerNames[0]} is ${readableSuffix}`;
    }

    // comma separate all names except the last one which is separated by 'and'
    const readablePeerList = [ peerNames.slice(0, -1).join(', '), peerNames.slice(-1) ].join(' and ');

    // multiple peers
    return `${readablePeerList} are ${readableSuffix}`;
}

/**
 * Returns the appropriate bitrate (kbps) for the video streams
 * based on the number of other peers in the meeting
 * (e.g. if 2 total people are in a meeting, peerCount is 1)
 */
function calculateBitrate(peerCount) {
    // if we have four or more peers,
    // we just want to use the lowest possible bitrate
    // to avoid any cpu limitations
    if (peerCount >= 4) {
        return MIN_BITRATE;
    }

    return MAX_BANDWIDTH / peerCount;
}

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    WebRtcNick,
    readablePeers,
    calculateBitrate,
};
