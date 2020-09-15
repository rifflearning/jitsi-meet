/* ******************************************************************************
 * index.js                                                                     *
 * *************************************************************************/ /**
 *
 * @fileoverview Styled.js mixins for use accross the riff platform
 *
 * Created on       April 16, 2020
 * @author          Brec Hanson
 *
 * @copyright (c) 2020-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

import styled from 'styled-components';

import { Colors, rgbaColor } from 'libs/utils';

const siteMaxWidth = '1440px';
const gutterWidth = '144px';
const navHeight = '90px'; // currently just an approximation: contents ~55px 20px padding 12px margin + a little extra
const footerHeight = '80px';

const RiffBtn = `
    height: 44px;
    cursor: pointer;
    border-radius: 4px;
    text-transform: uppercase;
    color: inherit;
    padding: 0 16px;
    display: block;
    font-size: 16px;
    line-height: 44px;
    font-weight: 600;
    letter-spacing: 1px;
    text-align: center;
    border: none;
`;

const PurpleBtn = `
    ${RiffBtn}
    color: ${Colors.white};
    background-image: linear-gradient(to bottom, ${Colors.riffViolet}, ${Colors.riffVioletDark});
`;

const LightBtn = `
    ${RiffBtn}
    border: solid 1px ${rgbaColor(Colors.riffViolet, 0.6)};
    background-image: linear-gradient(to bottom, ${Colors.white}, ${Colors.mischka});
`;

const BtnDisabled = `
    background: #edeeef;
    color: #5a5a5a;
    cursor: not-allowed;
`;

const BtnHover = `
    transition: opacity .2s;
    &:hover {
        opacity: .8;
    }
`;


const LargeHeading = styled.h1`
    /* Use !important to override bulma styles */
    font-size: 34pt!important;
    font-weight: bold;
    line-height: 1.2!important;
    color: ${Colors.white};

    @media (max-width: 768px) {
        font-size: 28pt!important;
    }
`;

const MediumHeading = styled.h2`
    /* Use !important to override bulma styles */
    font-size: 28pt!important;
    font-weight: 600;
    line-height: 1.43!important;
    letter-spacing: normal;

    @media (max-width: 768px) {
        font-size: 24pt!important;
    }
`;

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    BtnDisabled,
    footerHeight,
    gutterWidth,
    RiffBtn,
    PurpleBtn,
    LargeHeading,
    LightBtn,
    MediumHeading,
    navHeight,
    siteMaxWidth,
    BtnHover,
};
