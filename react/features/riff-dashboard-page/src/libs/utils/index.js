/* ******************************************************************************
 * utils.js                                                                     *
 * *************************************************************************/ /**
 *
 * @fileoverview general utility functions
 *
 * This index file doesn't define ANY utility files it just collects all the
 * utility functions from the other utility files and exports them so they
 * are available from a single simple import.
 *
 * Created on        August , 2017
 * @author           Jordan Reedie
 * @author           Michael Jay Lippert
 * @author           Brec Hanson
 *
 * @copyright (c) 2017-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

import { logger } from './logger';
import {
    cmpObjectProp,
    countByPropertyValue,
    groupByPropertyValue,
    mapObject,
    reverseCmp,
} from './collection_utils';
import {
    Colors,
    PeerColors,
    getColorForOther,
    getColorForSelf,
    getColorMap,
    getCountOtherColors,
    rgbaColor,
} from './colors';
import {
    formatDuration,
    getDurationInSeconds,
} from './time_utils';
import {
    WebRtcNick,
    readablePeers,
} from './webrtc_utils';
import {
    firebaseCreateUser,
    firebaseLogin,
    firebaseLogout,
    firebaseSendResetLink,
    firebaseSetCurUserDisplayName,
} from './firebase_utils';
import {
    addA11yBrowserAlert,
    isCSSAnimationsSupported,
    isScreenShareSourceAvailable,
    setWindowScrolling,
} from './browser_utils';
import {
    validateEmail,
} from './user_utils';
import { surveys } from './survey';
import { computeUtterancePairwiseRelations } from './analysis_utils';
import { convertYoutubeToEmbedLink } from './url_utils';


/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    logger,
    countByPropertyValue,
    groupByPropertyValue,
    mapObject,
    cmpObjectProp,
    reverseCmp,
    Colors,
    PeerColors,
    getColorForOther,
    getColorForSelf,
    getColorMap,
    getCountOtherColors,
    rgbaColor,
    formatDuration,
    getDurationInSeconds,
    WebRtcNick,
    readablePeers,
    firebaseCreateUser,
    firebaseLogin,
    firebaseLogout,
    firebaseSendResetLink,
    firebaseSetCurUserDisplayName,
    addA11yBrowserAlert,
    isCSSAnimationsSupported,
    isScreenShareSourceAvailable,
    setWindowScrolling,
    validateEmail,
    surveys,
    computeUtterancePairwiseRelations,
    convertYoutubeToEmbedLink,
};
