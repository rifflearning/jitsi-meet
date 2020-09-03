/* ******************************************************************************
 * FormField.jsx                                                                *
 * *************************************************************************/ /**
 *
 * @fileoverview Form field react component
 *
 * Created on       April 16, 2020
 * @author          Brec Hanson
 *
 * @copyright (c) 2020-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

import React from 'react';
import PropTypes from 'prop-types';

import {
    FieldLabel,
    FormFieldContainer,
    InstructionalText,
    TextInput,
} from './styled';

/* ******************************************************************************
 * FormField                                                               */ /**
 *
 * React component for a form field
 *
 ********************************************************************************/
class FormField extends React.Component {
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

        /** denotes whether this field is required to have a value or selection */
        isRequired: PropTypes.bool.isRequired,

        /** instructional text for the user relating to the input element */
        instructionalText: PropTypes.string,

        /** denotes whether this field is read only */
        readOnly: PropTypes.bool,

        /** a React ref for the input */
        inputRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),

        /** the current value of the input element */
        value: PropTypes.string.isRequired,
    };

    render() {
        let isErrored = false;
        let describedby = null;
        let autofocus = false;

        if (this.props.error && this.props.error.type === this.props.inputName) {
            describedby = 'form-error-message';
            autofocus = true;
            isErrored = true;
        }

        const inputId = `${this.props.inputName}-input`;

        return (
            <FormFieldContainer>
                <FieldLabel htmlFor={inputId}>
                    {this.props.labelName}
                    {this.props.isRequired &&
                        <>
                            {' ('}
                            <span className='is-required'>
                                {'* Required'}
                            </span>
                            {')'}
                        </>
                    }
                </FieldLabel>
                {[ 'text', 'password' ].includes(this.props.inputType) &&
                    <TextInput
                        value={this.props.value}
                        id={inputId}
                        className='input'
                        type={this.props.inputType}
                        name={this.props.inputName}
                        required={this.props.isRequired}
                        placeholder={this.props.placeHolder}
                        onChange={this.props.handleFunction}
                        autoFocus={autofocus}
                        aria-describedby={describedby}
                        isErrored={isErrored}
                        readOnly={this.props.readOnly === true}
                        ref={this.props.inputRef !== undefined ? this.props.inputRef : null}
                    />
                }
                {this.props.instructionalText !== undefined &&
                    <InstructionalText htmlFor={inputId}>
                        {this.props.instructionalText}
                    </InstructionalText>
                }
            </FormFieldContainer>
        );
    }
}


/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    FormField,
};
