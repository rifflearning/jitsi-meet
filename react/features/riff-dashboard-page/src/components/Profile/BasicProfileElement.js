/* ******************************************************************************
 * BasicProfileElement.jsx                                                      *
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


class BasicProfileElement extends React.Component {
    static propTypes = {

        /** A string to be used as a label for the text input */
        fieldName: PropTypes.string.isRequired,

        /** The renderable body of the profile element (JSX) */
        children: PropTypes.element.isRequired,
    };

    render() {
        return (
            <div style={{ marginBottom: '15px' }}>
                <h6 className='is-size-5 text-bold'>{this.props.fieldName}</h6>
                {this.props.children}
            </div>
        );
    }
}

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    BasicProfileElement,
};
