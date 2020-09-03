/* ******************************************************************************
 * IFrameOverlay.jsx                                                            *
 * *************************************************************************/ /**
 *
 * @fileoverview React IFrame overlay component
 *
 * This is a generic iframe overlay component currently only used by the
 * Dashboard to present a post-meeting survey to the user.
 *
 * Created on       November 27, 2019
 * @author          Brec Hanson
 *
 * @copyright (c) 2019-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

import React from 'react';
import PropTypes from 'prop-types';
import CloseIcon from '@material-ui/icons/Close';

import { logger } from 'libs/utils';

import {
    IFrameOverlayContainer,
    IFrameOverlayIframe,
    OverlayCloseBtn,
} from './styled';

/* ******************************************************************************
 * IFrameOverlay                                                           */ /**
 *
 * React component to display a url in an IFrame
 *
 ********************************************************************************/
class IFrameOverlay extends React.Component {
    static propTypes = {
        /** The source URL to be loaded in the iframe */
        src: PropTypes.string.isRequired,

        /** function to invoke to close the overlay */
        close: PropTypes.func.isRequired,
    };

    /* **************************************************************************
     * render                                                              */ /**
     *
     * Required method of a React component.
     * @see {@link https://reactjs.org/docs/react-component.html#render|React.Component.render}
     */
    render() {
        logger.debug('IFrameOverlay.render');
        return (
            <IFrameOverlayContainer>
                <OverlayCloseBtn onClick={this.props.close}>
                    <CloseIcon/>
                </OverlayCloseBtn>
                <IFrameOverlayIframe
                    src={this.props.src}
                />
            </IFrameOverlayContainer>
        );
    }
}

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    IFrameOverlay,
};
