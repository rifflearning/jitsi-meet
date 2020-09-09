/* ******************************************************************************
 * d3.js                                                                        *
 * *************************************************************************/ /**
 *
 * @fileoverview Aggregate the d3 microlibraries that this project uses
 *
 * Collect all the d3 microlibraries that this project uses under a single
 * d3 namespace without importing the d3 kitchen sink package.
 *
 *   import d3 from './d3';
 *
 * Created on       October 15, 2018
 * @author          Michael Jay Lippert
 *
 * @copyright (c) 2018 Riff Learning,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

import * as d3Selection from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Transition from 'd3-transition';
import * as d3Time from 'd3-time';
import * as d3TimeFormat from 'd3-time-format';
import * as d3Axis from 'd3-axis';

const d3 = Object.assign({},
                         d3Selection,
                         d3Scale,
                         d3Transition,
                         d3Time,
                         d3TimeFormat,
                         d3Axis,
                        ); // eslint-disable-line indent

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export default d3; // still needed by the mm.coffee require
export {
    d3,
};
