/* ******************************************************************************
 * SignUpField.jsx                                                              *
 * *************************************************************************/ /**
 *
 * @fileoverview Signup form field react component
 *
 * Created on       January 7, 2020
 * @author          Michael Jay Lippert
 *
 * @copyright (c) 2020-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

import React from 'react';
import PropTypes from 'prop-types';


/* ******************************************************************************
 * SignUpField                                                             */ /**
 *
 * React component for a Signup form field
 *
 ********************************************************************************/
class SignUpField extends React.Component {
    static propTypes = {

        /** displayed name of the form field */
        labelName: PropTypes.string.isRequired,

        /** name of the input element */
        inputName: PropTypes.string.isRequired,

        /** type of the input element */
        inputType: PropTypes.string.isRequired,

        /** placeholder text for the input element */
        placeHolder: PropTypes.string.isRequired,

        /** Error if an error has occurred */
        error: PropTypes.shape({
            type: PropTypes.string,
        }),

        /** function to invoke when the input field changes */
        handleFunction: PropTypes.func.isRequired,
    };

    render() {
        let style = null;
        let describedby = null;
        let autofocus = false;

        if (this.props.error && this.props.error.type === this.props.inputName) {
            style = { backgroundColor: '#ff8982' };
            describedby = 'signup-error-notification';
            autofocus = true;
        }

        return (
            <div className='field'>
                <label className='label'>
                    {this.props.labelName} <span>{'(required)'}</span>
                </label>
                <div className='control'>
                    <input
                        className='input'
                        type={this.props.inputType}
                        name={this.props.inputName}
                        required={true}
                        placeholder={this.props.placeHolder}
                        onChange={this.props.handleFunction}
                        style={style}
                        autoFocus={autofocus}
                        aria-describedby={describedby}
                    />
                </div>
            </div>
        );
    }
}


/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    SignUpField,
};
