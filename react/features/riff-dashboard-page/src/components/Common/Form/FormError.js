/* ******************************************************************************
 * FormError.jsx                                                                *
 * *************************************************************************/ /**
 *
 * @fileoverview Form error message react component
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

import ErrorIcon from '@material-ui/icons/Error';

import {
    FormErrorContainer,
} from './styled';


/* ******************************************************************************
 * FormError                                                               */ /**
 *
 * React component for an error message in a form
 *
 ********************************************************************************/
class FormError extends React.Component {
    static propTypes = {
        /** the form error object */
        error: PropTypes.shape({
            message: PropTypes.string,
        }),
    };

    render() {
        if (this.props.error === null) return null;

        return (
            <FormErrorContainer id='form-error-message'>
                <i className='error-icon'>
                    <ErrorIcon/>
                </i>
                <p>{this.props.error.message}</p>
            </FormErrorContainer>
        );
    }
}


/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    FormError,
};
