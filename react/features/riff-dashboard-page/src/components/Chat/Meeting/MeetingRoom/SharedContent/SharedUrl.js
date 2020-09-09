/* ******************************************************************************
 * SharedUrl.jsx                                                               *
 * *************************************************************************/ /**
 *
 * @fileoverview React component to display a shared URL in the Meeting
 *
 * The shared URL is just a common external URL that is displayed in an IFrame
 * by everyone in the meeting. It may be a google document, or anything else.
 *
 * Created on       September 20, 2019
 * @author          Jordan Reedie
 *
 * @copyright (c) 2019-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/
import React from 'react';
import PropTypes from 'prop-types';

class SharedUrl extends React.Component {
    static propTypes = {

        /** the URL to embed */
        url: PropTypes.string,
    }


    render() {
        // if embedUrl is falsy in any way, abort
        if (!this.props.url) {
            return null;
        }

        return (
            <iframe
                style={{ height: '100%', width: '100%' }}
                src={this.props.url}
                allow="autoplay"
                allowFullScreen={true}
            />
        );
    }
}

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    SharedUrl,
};
