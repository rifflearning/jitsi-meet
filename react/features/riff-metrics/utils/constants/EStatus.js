/* ******************************************************************************
 * EStatus.js                                                                   *
 * *************************************************************************/ /**
 *
 * @fileoverview constants that represent the status of a dataset
 *
 * Created on       November 4, 2019
 * @author          Brec Hanson
 *
 * @copyright (c) 2019-present Riff Learning, Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

/** Status enum of valid dataset statuses */
const EStatus = {
    /** The "item" has been requested to be loaded, and loading is in process.
     *  This is also used as the initial state before loading has started
     */
    LOADING: 'loading',

    /** The "item" has been successfully loaded and is available from the state */
    LOADED:  'loaded',

    /** The "item" failed to load and is not available from the state */
    ERROR:   'error',
};

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    EStatus,
};
