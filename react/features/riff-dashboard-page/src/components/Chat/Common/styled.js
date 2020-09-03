/* ******************************************************************************
 * styled.js                                                                    *
 * *************************************************************************/ /**
 *
 * @fileoverview React components to apply styles that are common among
 * Chat components
 *
 * Created on       October 24, 2019
 * @author          Brec Hanson
 *
 * @copyright (c) 2019-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

import styled from 'styled-components';

import { Colors, rgbaColor } from 'libs/utils';

import { BtnDisabled } from 'Components/styled';

const MenuLabel = styled.div.attrs({
    className: 'menu-label'
})`
    font-size: ${props => props.fontSize || '14px'};
    text-transform: none;
    letter-spacing: 0em;
    overflow: hidden;
`;

const MenuLabelCentered = styled.div.attrs({
    className: 'menu-label has-text-centered'
})`
    font-size: 1em;
    text-transform: none;
    letter-spacing: 0em;
`;

const LocalMediaSidebar = styled.aside`
    width: 256px;
    border-radius: 4px;
    background-image: linear-gradient(to bottom, ${Colors.white}, ${Colors.selago});
    margin-top: 12px;
    display: flex;
    flex-direction: column;
`;

const Menu = styled.aside`
    max-width: 14em;
    padding-right: 10px;
    border-right: 1px solid ${Colors.brightPlum};
`;

const SignedInAs = styled.div`
    border-top-right-radius: 4px;
    background-color: ${Colors.riffVioletDark};
    font-size: 14px;
    line-height: 38px;
    color: ${Colors.white};
    display: flex;
    justify-content: space-between;
    padding: 0 12px;

    .anonymous {
        color: ${rgbaColor(Colors.white, 0.4)}
    }
`;

const VideoActionContainer = styled.div`
    height: 60px;
    background: ${Colors.riffVioletDark};
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 12px;

    progress {
        display: block;
        width: 100%;
        width: 160px;
        height: 16px;
        border-radius: 22px;
        overflow: hidden;

        /* Webkit browsers */
        &::-webkit-progress-bar {
            background-color: ${rgbaColor(Colors.white, 0.3)};
        }
        &::-webkit-progress-value {
            background-color: #26f783;
        }

        /* Firefox */
        &::-moz-progress-bar {
            background-color: #26f783;
        }
    }
`;

const mediaActionBtnInactiveStyle = `
    &:hover {
        background-image: linear-gradient(
            to bottom,
            ${rgbaColor(Colors.black, 0.05)},
            ${rgbaColor(Colors.black, 0.05)}),
            linear-gradient(to bottom,${Colors.white}, ${Colors.mischka});
    }
`;
const mediaActionBtnActiveStyle = `
    border: 2px solid ${rgbaColor(Colors.black, 0.15)};
    background-image: linear-gradient(121deg, #cac2cc, #f0e7f3);

    &:hover {
        border: solid 1px ${rgbaColor(Colors.black, 0.15)};
        background-image: linear-gradient(
            to bottom,
            ${rgbaColor(Colors.black, 0.1)},
            ${rgbaColor(Colors.black, 0.1)}),
            linear-gradient(121deg, #cac2cc, #f0e7f3);
    }
`;

const MediaActionBtn = styled.button`
    color: ${Colors.riffVioletDark};
    height: 36px;
    width: 60px;
    border-radius: 22px;
    border: solid 2px #0cc25d;
    background-image: linear-gradient(to bottom, ${Colors.white}, ${Colors.mischka});
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    ${props => props.inToggledState ? mediaActionBtnActiveStyle : mediaActionBtnInactiveStyle}
    ${props => props.disabled ? BtnDisabled : ''}

    svg {
        height: 24px;
        width: 24px;
    }
`;

const LocalVideoContainer = styled.div`
    height: 192px;
    overflow: hidden;

    video {
        display: block;
        height: 100%;
        width: auto;
        max-width: unset;
    }
`;

const SidebarBottomContainer = styled.div`
    padding: 20px 12px;
    border-right: 1px solid ${rgbaColor(Colors.riffViolet, 0.4)};
    border-left: 1px solid ${rgbaColor(Colors.riffViolet, 0.4)};
    flex: 1;

    p {
        border-radius: 4px;
        background-image: linear-gradient(to bottom, ${Colors.white}, ${Colors.selago});
        padding: 12px;
        font-size: 16px;
        line-height: 1.63;
        color: ${Colors.mineShaft};
    }
`;

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    LocalMediaSidebar,
    LocalVideoContainer,
    MediaActionBtn,
    Menu,
    MenuLabel,
    MenuLabelCentered,
    SidebarBottomContainer,
    SignedInAs,
    VideoActionContainer,
};
