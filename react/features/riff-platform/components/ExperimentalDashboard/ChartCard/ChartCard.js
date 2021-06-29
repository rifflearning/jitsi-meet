/* eslint-disable react/jsx-no-bind */
import PropTypes from 'prop-types';
import React, { useState } from 'react';

import InfoIcon from '../../../assets/info.svg';

import ChartCardInfo from './ChartCardInfo';

const ChartCard = ({ chartCardId, chartInfo, children, longDescription, title }) => {
    const [ isInfoOpen, setIsInfoOpen ] = useState(false);

    return (
        <div
            className = 'chart-card-container'
            id = { chartCardId }>
            <div className = 'chart-card-box'>
                <div className = 'chart-card-title'>
                    <span>{title}</span>
                    <div
                        className = 'chart-card-icon'
                        onClick = { () => setIsInfoOpen(true) }>
                        <InfoIcon />
                    </div>
                </div>
                <div
                    className = 'chart-card-wrapper'>
                    <div className = 'chart-card'>
                        {children}
                    </div>
                </div>
            </div>
            {isInfoOpen
            && <ChartCardInfo
                chartInfo = { chartInfo }
                id = { chartCardId }
                longDescription = { longDescription }
                onClose = { () => setIsInfoOpen(false) } />
            }
        </div>
    );
};

ChartCard.propTypes = {
/** Unique string usable as an element ID for the ChartCard */
    chartCardId: PropTypes.string.isRequired,

    /** Title of the card */
    chartInfo: PropTypes.string.isRequired,

    /** Description of the presented chart */
    children: PropTypes.node.isRequired,

    /** React renderable element that is the focus of this chart card, ie the
     *  actual chart, and perhaps also an a11y table representation of
     *  that chart if desired.
     */
    longDescription: PropTypes.bool,

    /** flag for an especially long description that requires smaller text. */
    title: PropTypes.string.isRequired
};

export default ChartCard;
