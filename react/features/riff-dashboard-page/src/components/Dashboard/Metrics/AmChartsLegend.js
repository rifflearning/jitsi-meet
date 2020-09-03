/* ******************************************************************************
 * AmChartsLegend.js                                                            *
 * *************************************************************************/ /**
 *
 * @fileoverview React component for an amcharts graph legend
 *
 * Created on       April 25, 2020
 * @author          Brec Hanson
 *
 * @copyright (c) 2020-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

import React from 'react';
import PropTypes from 'prop-types';

import { GraphTypes } from 'libs/utils/constants';

class AmChartsLegend extends React.Component {
    static propTypes = {
        /** Used to fetch the legend items. */
        getLegendItems: PropTypes.func.isRequired,

        /** A unique graph type for this graph */
        graphType: PropTypes.oneOf(Object.values(GraphTypes)).isRequired,

        /** A JavaScript Date object indicating the last time the legend was updated.
         * This gets updated in the parent when we want to re-render this legend.
         */
        // eslint-disable-next-line react/no-unused-prop-types
        updatedLegendAt: PropTypes.instanceOf(Date).isRequired,
    };

    render() {
        const {
            graphType,
            getLegendItems,
        } = this.props;

        return (
            <div className={`amcharts-legend-container ${graphType}`}>
                {getLegendItems()}
            </div>
        );
    }
}

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    AmChartsLegend,
};
