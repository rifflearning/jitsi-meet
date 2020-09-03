/* ******************************************************************************
 * index.js                                                                     *
 * *************************************************************************/ /**
 *
 * @fileoverview index file for SharedContent
 *
 * We don't actually need to connect any redux state to the SharedContent component
 * so we just re-export it here for consistency.
 *
 * Created on       March 19, 2020
 * @author          Jordan Reedie
 *
 * @copyright (c) 2020-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/
import { SharedContent } from './SharedContent';

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    SharedContent,
};
