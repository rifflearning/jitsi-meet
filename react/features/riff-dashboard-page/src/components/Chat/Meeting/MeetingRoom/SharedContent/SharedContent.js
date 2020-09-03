/* ******************************************************************************
 * SharedContent.jsx                                                             *
 * *************************************************************************/ /**
 *
 * @fileoverview React component for displaying shared content
 *
 * Currently supports:
 *  - Shared screen streams
 *  - Shared URLs
 *  - Preconfigured URLs
 *
 * Created on       March 19, 2020
 * @author          Jordan Reedie
 *
 * @copyright (c) 2020-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/
import React from 'react';
import PropTypes from 'prop-types';

import { SharedUrl } from './SharedUrl';
import { SharedScreen } from './SharedScreen';

class SharedContent extends React.Component {
    static propTypes = {

        /** The type of content we are displaying. one of:
         *  - 'url'
         *  - 'screen'
         */
        type: PropTypes.string.isRequired,

        /** if we have a 'screen' type, this will contain the screen stream.
         *  if we have a 'url' type, this will contain the url
         */
        content: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.instanceOf(Element),
        ]).isRequired,

    }

    render() {
        switch (this.props.type) {
            case 'url':
                return <SharedUrl url={this.props.content}/>;
            case 'screen':
                return <SharedScreen video={this.props.content}/>;
            default:
                // should never occur, but just in case
                return null;
        }
    }
}

export {
    SharedContent,
};
