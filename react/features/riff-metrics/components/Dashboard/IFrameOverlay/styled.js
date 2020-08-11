/* ******************************************************************************
 * styled.js                                                                    *
 * *************************************************************************/ /**
 *
 * @fileoverview React components to apply styling to IFrameOverlay components
 *
 * Created on       November 27, 2019
 * @author          Brec Hanson
 * @author          Michael Jay Lippert
 *
 * @copyright (c) 2019-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

import styled from 'styled-components';

import { Colors, rgbaColor } from '../../../libraries/utils';

const IFrameOverlayContainer = styled.div`
    z-index: 40;
    top: 0;
    left: 0;
    position: fixed;
    width: 100%;
    height: 100%;
    background-color: ${rgbaColor(Colors.purplishWhite, 0.7)};
`;

// The width is set to 800px because the qualtrics survey we're going to put
// in the iframe has its body hard-coded to 770px
// To center the survey we set the left position as the width of the window minus
// the width of the iframe divided by 2. And then because the shadow pushes the
// iframe a little to the right we subtract 8px more to get it centered.
const IFrameOverlayIframe = styled.iframe`
    position: absolute;
    top: 10%;
    left: calc(50vw - 408px);
    width: 800px;
    height: 85%;
    background-color: ${Colors.purplishWhite};

    -webkit-box-direction: normal;
    -webkit-box-orient: vertical;
    box-shadow: rgba(0, 0, 0, 0.15) 0px 2px 8px;
`;

// Position the button inside the right edge of the Iframe
//   = left of iframe + width of iframe - width of button - space for the scroll bar and a little padding
// the top of the button at the top of the iframe (the -4px was determined experimentally)
const OverlayCloseBtn = styled.button`
    z-index: 11;
    position: absolute;
    top: calc(10% - 4px);
    left: calc(50vw + 328px);
    color: ${Colors.black};
    background: none;
    border: none;
    cursor: pointer;

    svg {
      width: 2em;
      height: 2em;
    }
`;

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    IFrameOverlayContainer,
    IFrameOverlayIframe,
    OverlayCloseBtn
};
