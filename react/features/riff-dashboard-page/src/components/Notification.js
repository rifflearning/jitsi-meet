/* ******************************************************************************
 * Notification.jsx                                                             *
 * *************************************************************************/ /**
 *
 * @fileoverview React component for displaying a notification
 *
 * [More detail about the file's contents]
 *
 * Created on       May 29, 2019
 * @author          Brec Hanson
 *
 * @copyright (c) 2019-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

import React from 'react';
import PropTypes from 'prop-types';

class Notification extends React.Component {
    static propTypes = {

        /** true when the notification should be displayed */
        show: PropTypes.bool.isRequired,

        /** additional class name to be set on the top element of this notification */
        type: PropTypes.string.isRequired,

        /** The renderable body of the notification (numbers, strings, elements...) */
        children: PropTypes.node,

        /** Function to be invoked when the user requests that the notification be dismissed */
        onClose: PropTypes.func.isRequired,

        /** CSS style object for the top element of this notification */
        style: PropTypes.object,
    };

    render() {
        if (!this.props.show) {
            return null;
        }

        return (
            <div className={`notification ${this.props.type}`} style={this.props.style}>
                <button className='delete' onClick={this.props.onClose}/>
                {this.props.children}
            </div>
        );
    }
}

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    Notification,
};
