/* ******************************************************************************
 * history.js                                                                   *
 * *************************************************************************/ /**
 *
 * @fileoverview Provides the singleton router browser history
 *
 * Created on       July 24, 2018
 * @author          Dan Calacci
 *
 * @copyright (c) 2018 Riff Learning,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

import { createBrowserHistory } from 'history';

const browserHistory = createBrowserHistory();

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    browserHistory,
};
