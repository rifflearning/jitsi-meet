/* ******************************************************************************
 * SubmitButton.jsx                                                             *
 * *************************************************************************/ /**
 *
 * @fileoverview React submit button component
 *
 * Created on       March 4, 2019
 * @author          Jordan Reedie
 *
 * @copyright (c) 2019-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

import React from 'react';
import PropTypes from 'prop-types';

import { SubmitBtnContainer } from './styled';

/* ******************************************************************************
 * SubmitButton                                                            */ /**
 *
 * React submit button component
 *
 ********************************************************************************/
class SubmitButton extends React.Component {
    static propTypes = {
        /** denotes whether the button should be disabled */
        disabled: PropTypes.bool.isRequired,

        /** text to display on the button */
        btnText: PropTypes.string.isRequired,
    };

    render() {
        return (
            <SubmitBtnContainer>
                <button type="submit" disabled={this.props.disabled}>
                    {this.props.btnText}
                </button>
            </SubmitBtnContainer>
        );
    }
}

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    SubmitButton,
};
