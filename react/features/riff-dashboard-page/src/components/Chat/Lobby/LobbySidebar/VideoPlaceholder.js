/* ******************************************************************************
 * VideoPlaceHolder.jsx                                                         *
 * *************************************************************************/ /**
 *
 * @fileoverview React component to display a placeholder for user's webcam
 *
 * This placeholder is to be displayed if the user has not granted
 * permission to access their webcam/mic, or if there is any error
 * in our attempts to gain access to it
 *
 * Created on       May 13, 2019
 * @author          Jordan Reedie
 *
 * @copyright (c) 2019-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/
import React from 'react';

import { Placeholder } from './styled';

class VideoPlaceholder extends React.Component {

    render() {
        return (
            <Placeholder>
                <p>
                    {'Your video doesn\'t seem to be enabled'}
                </p>
            </Placeholder>
        );
    }
}

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    VideoPlaceholder,
};
