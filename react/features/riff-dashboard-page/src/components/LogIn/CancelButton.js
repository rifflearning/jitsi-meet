/* ******************************************************************************
 * CancelButton.jsx                                                             *
 * *************************************************************************/ /**
 *
 * @fileoverview React cancel button component
 *
 * Created on       January 6, 2020
 * @author          Michael Jay Lippert
 *
 * @copyright (c) 2020-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

import React from 'react';
import PropTypes from 'prop-types';


/* ******************************************************************************
 * CancelButton                                                            */ /**
 *
 * React cancel button component
 *
 ********************************************************************************/
class CancelButton extends React.Component {
    static propTypes = {
        /** function to invoke when the button is clicked */
        handleCancelClick: PropTypes.func.isRequired,
    };

    render() {
        return (
            <div className='field' style={{ display: 'inline-block', marginRight: '10px' }}>
                <div className='control'>
                    <button
                        className='button'
                        aria-label='Cancel'
                        type='button'
                        onClick={this.props.handleCancelClick}
                    >
                        {'Cancel'}
                    </button>
                </div>
            </div>
        );
    }
}

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    CancelButton,
};
