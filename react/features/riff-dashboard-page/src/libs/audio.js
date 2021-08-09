/* ******************************************************************************
 * audio.js                                                                     *
 * *************************************************************************/ /**
 *
 * @fileoverview send captured audio info to the server
 *
 * Created on        August 7, 2017
 * @author           Jordan Reedie
 * @author           Dan Calacci
 *
 * @copyright (c) 2017-present Riff Learning, Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

import { logger } from './utils';

export default function captureSpeakingEvent(server, userinfo) {
    /*
     * returns a function to consume speaking data + offload it to server,
     * closing over the server + userinfo args
     */
    return function (data) {
        logger.debug('captureSpeakingEvent: userinfo', userinfo);
        server.service('utterances')
            .create({
                participant:    userinfo.username,
                room:           userinfo.roomName,
                startTime:      data.start.toISOString(),
                endTime:        data.end.toISOString(),
                token:          userinfo.token,
            })
            .then(function (res) {
                logger.debug('captureSpeakingEvent: speaking event recorded!', res);
                const start = new Date(res['startTime']);
                const end = new Date(res['endTime']);
                const duration = end - start;
                logger.debug('captureSpeakingEvent: duration', duration);
                return res;
            })
            .catch(function (err) {
                logger.error('captureSpeakingEvent: ERROR:', err);
            });
    };
}
