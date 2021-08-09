import CloseIcon from '@material-ui/icons/Close';
import PropTypes from 'prop-types';
import React from 'react';

const ChartCardInfo = ({ chartInfo, id, longDescription, onClose }) => {
    const descClassName = longDescription ? 'info-small' : '';

    return (
        <div
            className = 'chart-card-info-container'
            id = { id }>
            <div className = 'chart-card-icon-box'>
                <div
                    className = 'chart-card-icon'
                    onClick = { onClose }>
                    <CloseIcon />
                </div>
            </div>

            <div className = { `chart-card-info-box ${descClassName}` }>
                {chartInfo}
            </div>
        </div>
    );
};

ChartCardInfo.propTypes = {
/** Description of the presented chart */
    chartInfo: PropTypes.string.isRequired,

    /** Value to use for the id of the top level element of this component */
    id: PropTypes.string.isRequired,

    /** flag for an especially long description that requires smaller text. */
    longDescription: PropTypes.bool,

    /** function to close this info component */
    onClose: PropTypes.func.isRequired
};

export default ChartCardInfo;
