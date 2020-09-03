/* ******************************************************************************
 * ChartCardInfo.jsx                                                            *
 * *************************************************************************/ /**
 *
 * @fileoverview React component for the chart info on a chart card
 *
 * Created on       June 5, 2019
 * @author          Michael Jay Lippert
 *
 * @copyright (c) 2019-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

import React from 'react';
import PropTypes from 'prop-types';
import CloseIcon from '@material-ui/icons/Close';

/* ******************************************************************************
 * ChartCardInfo                                                           */ /**
 *
 * React component used by ChartCard to present the chart description.
 *
 ********************************************************************************/
class ChartCardInfo extends React.Component {
    static propTypes = {

        /** Value to use for the id of the top level element of this component */
        id: PropTypes.string.isRequired,

        /** Description of the presented chart */
        chartInfo: PropTypes.string.isRequired,

        /** function to close (actually remove) this info component */
        close: PropTypes.func.isRequired,

        /** flag for an especially long description that requires smaller text. */
        longDescription: PropTypes.bool,
    };

    /* **************************************************************************
     * constructor                                                         */ /**
     */
    constructor(props) {
        super(props);

        /** The top level node of this ChartCardInfo */
        this._infoNode = React.createRef();
    }

    /* **************************************************************************
     * componentDidMount                                                   */ /**
     *
     * Lifecycle method of a React component.
     * This is invoked immediately after a component is mounted (inserted into the
     * tree). Initialization that requires DOM nodes should go here.
     *
     * Set the focus to this component when it is mounted (for a11y purposes).
     *
     * @see {@link https://reactjs.org/docs/react-component.html#componentdidmount|React.Component.componentDidMount}
     */
    componentDidMount() {
        this._infoNode.current.focus();
    }

    /* **************************************************************************
     * render                                                              */ /**
     *
     * Required method of a React component.
     * @see {@link https://reactjs.org/docs/react-component.html#render|React.Component.render}
     */
    render() {
        let chartInfo = <div className='chart-card-info is-size-6'>{this.props.chartInfo}</div>;

        if (this.props.longDescription) {
            chartInfo = <div className='chart-card-info-small is-size-7'>{this.props.chartInfo}</div>;
        }

        return (
            <div
                id={this.props.id}
                className='chart-card-info-component chart-info-div'
                ref={this._infoNode}
                tabIndex='-1'
            >
                <button className='chart-card-toggle' onClick={this.props.close}>
                    <CloseIcon/>
                </button>
                {chartInfo}
            </div>
        );
    }
}

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    ChartCardInfo,
};
