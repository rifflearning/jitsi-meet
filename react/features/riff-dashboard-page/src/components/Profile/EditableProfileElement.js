/* ******************************************************************************
 * EditableProfileElement.jsx                                                   *
 * *************************************************************************/ /**
 *
 * @fileoverview React component for the VerifiedProfile
 *
 * [More detail about the file's contents]
 *
 * Created on       May 28, 2019
 * @author          Brec Hanson
 *
 * @copyright (c) 2019-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

import React from 'react';
import PropTypes from 'prop-types';

import { BasicProfileElement } from './BasicProfileElement';

class EditableProfileElement extends React.Component {
    static propTypes = {

        /** A string to be used as a label for the text input */
        fieldName: PropTypes.string.isRequired,

        /** A string to be used as the contents of the text input */
        fieldInput: PropTypes.string.isRequired,

        /** A function to be invoked when the user edits the text in the text input */
        handleInput: PropTypes.func.isRequired,
    };

    render() {
        return (
            <BasicProfileElement fieldName={this.props.fieldName}>
                <input
                    className='input'
                    type='text'
                    value={this.props.fieldInput}
                    onChange={this.props.handleInput}
                />
            </BasicProfileElement>
        );
    }
}

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    EditableProfileElement,
};
