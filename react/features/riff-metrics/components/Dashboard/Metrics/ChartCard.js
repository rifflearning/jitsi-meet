/* ******************************************************************************
 * ChartCard.jsx                                                                *
 * *************************************************************************/ /**
 *
 * @fileoverview React component for charts displayed on the dashboard
 *
 * [More detail about the file's contents]
 *
 * Created on       October 12, 2018
 * @author          Dan Calacci
 *
 * @copyright (c) 2018-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

import React from 'react';
import PropTypes from 'prop-types';
import InfoIcon from '@material-ui/icons/Info';

import { logger } from '../../../libraries/utils';

import { ChartCardInfo } from './ChartCardInfo';


/* ******************************************************************************
 * ChartCard                                                               */ /**
 *
 * React component to present a Chart on the dashboard.
 *
 ********************************************************************************/
class ChartCard extends React.Component {
    static propTypes = {

        /** Unique string usable as an element ID for the ChartCard */
        chartCardId: PropTypes.string.isRequired,

        /** Title of the card */
        title: PropTypes.string.isRequired,

        /** Description of the presented chart */
        chartInfo: PropTypes.string.isRequired,

        /** React renderable element that is the focus of this chart card, ie the
         *  actual chart, and perhaps also an a11y table representation of
         *  that chart if desired.
         */
        children: PropTypes.node.isRequired,

        /** flag for an especially long description that requires smaller text. */
        longDescription: PropTypes.bool,
    };

    /* **************************************************************************
     * constructor                                                         */ /**
     */
    constructor(props) {
        super(props);

        this.state = {
            isInfoOpen: false,
        };

        this._infoBtn = React.createRef();

        // We need to know when the info was closed after being open
        // so we can set the focus to the info button to open it again
        // but this property isn't state because we don't want to re-render
        // when it changes.
        this._infoJustClosed = false;
    }

    /* **************************************************************************
     * componentDidUpdate                                                  */ /**
     *
     * componentDidUpdate() is invoked immediately after updating occurs. This
     * method is not called for the initial render.
     *
     * Use this as an opportunity to operate on the DOM when the component has
     * been updated.
     */
    componentDidUpdate() {
        // We want to have the focus on the info button when the chart card is
        // rendered immediately after the displayed info was closed by the user
        if (this._infoJustClosed) {
            this._infoBtn.current.focus();
            this._infoJustClosed = false;
        }
    }

    /* **************************************************************************
     * render                                                              */ /**
     *
     * Required method of a React component.
     * @see {@link https://reactjs.org/docs/react-component.html#render|React.Component.render}
     */
    render() {
        logger.debug('ChartCard.render: children', this.props.children);
        const infoId = `chart-info-${this.props.chartCardId}`;

        return (
            <div className='chart-card-component card has-text-centered is-centered'>
                {/* Use a column flexbox to allow the chart to adjust to the space not
                    occupied by the card title, remember only the direct children of the
                    flex container will be adjusted. */}
                <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <div>
                        <div className='chart-card-title'>
                            <span>{this.props.title}</span>
                            <button
                                className='chart-card-toggle'
                                onClick={() => this.setState({ isInfoOpen: true })}
                                aria-describedby={infoId}
                                tabIndex='-1'
                                ref={this._infoBtn}
                            >
                                <InfoIcon/>
                            </button>
                        </div>
                    </div>
                    <div style={{ minHeight: 0, flexGrow: 1, flexShrink: 1 }}>
                        <div className='chart-card-chart card-image has-text-centered is-centered'>
                            {this.props.children}
                        </div>
                    </div>
                </div>
                {this.state.isInfoOpen &&
                    <ChartCardInfo
                        id={infoId}
                        close={() => {
                            this.setState({ isInfoOpen: false });
                            this._infoJustClosed = true;
                        }}
                        chartInfo={this.props.chartInfo}
                        longDescription={this.props.longDescription}
                    />
                }
            </div>
        );
    }
}

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    ChartCard,
};
