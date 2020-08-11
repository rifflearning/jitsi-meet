/* ******************************************************************************
 * styled.js                                                                    *
 * *************************************************************************/ /**
 *
 * @fileoverview React components to apply styling to NavBar components
 *
 * Created on       Oct 07, 2019
 * @author          Brec Hanson
 *
 * @copyright (c) 2019-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

import styled from 'styled-components';

import { Colors, rgbaColor } from '../../libraries/utils';
import { LightBtn, PurpleBtn } from '../styled';


const NavBar = styled.nav.attrs({
    className: 'navbar is-transparent'
})`
    background-color: ${rgbaColor(Colors.white, 0)};
    max-height: unset;
    max-width: 1440px;
    margin: 0 auto;
    margin-top: 12px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    flex-wrap: wrap;
    padding: 10px 48px;
    box-sizing: border-box;


    .riff-logo {
        flex: 114px 0 0;

        a {
            display: block;

            img {
                  display: block;
            }
        }
    }

    .navbar-burger {
        background: none;
        border: none;
    }
`;

const ProfileBtn = styled.button`
    ${LightBtn}
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 0 12px;
    margin: 0;

    i {
        height: 24px;
        width: 24px;

        svg {
            display: block;
        }

        &.avatar-icon {
            color: ${Colors.riffVioletDark};
        }

        &.arrow-icon {
            color: ${Colors.mineShaft};
        }
    }

    .username {
        margin: 0 6px;
        font-size: 16px;
        font-weight: 600;
        line-height: 1.63;
        color: ${rgbaColor(Colors.black, 0.87)};
    }
`;

const DesktopMenu = styled.div`
    display: flex;

    .nav-route-btns {
        display: flex;

        a {
            display: flex;
            align-items: center;
            background: ${Colors.white};
            font-size: 14px;
            line-height: 2.57;
            letter-spacing: 2px;
            color: ${Colors.mineShaft};
            text-transform: uppercase;
            padding: 0 11px;
            box-sizing: border-box;

            &.is-active {
                border-bottom: 3px solid ${Colors.riffViolet};
                font-weight: 600;
            }
        }
    }

    .sign-in-btn {
        ${LightBtn}
    }

    .sign-up-btn {
        ${PurpleBtn}
        margin-left: 12px;
    }

    @media screen and (max-width: 959px) {
        display: none;
    }
`;

const MobileMenu = styled.div`
    display: flex;
    flex: 100%;

    .navbar-menu {
        flex: 1;
    }

    a {
        font-size: 14px;
        font-weight: normal;
        line-height: 2.57;
        color: ${Colors.mineShaft};
        text-transform: uppercase;
        padding: 0 11px;
        letter-spacing: 2px;
        display: block;
        border: none;
    }

    @media screen and (min-width: 960px) {
        display: none;
    }
`;

const ProfileBtnContainer = styled.div`
    position: relative;
    margin-left: 12px;
`;

const Dropdown = styled.div`
    z-index: -1;
    opacity: ${props => props.expanded ? '1' : '0'};
    top: calc(100% + 4px);
    height: ${props => props.expanded ? 'auto' : '0'};
    overflow: hidden;
    width: 100%;
    position: absolute;
    left: 0;
    padding: 0;
    background: ${Colors.white};
    border-radius: 4px;
    border: solid 1px ${rgbaColor(Colors.riffViolet, 0.2)};
    box-shadow: 0 2px 4px -1px ${
    rgbaColor(Colors.black, 0.2)},
        0 1px 10px 0 rgba(0, 0, 0, 0.12),
        0 4px 5px 0 ${rgbaColor(Colors.black, 0.14)};

    .dropdown-items {
        a {
            font-size: 16px;
            line-height: 1.63;
            color: ${Colors.mineShaft};
            padding: 8px;
            display: block;

            &:first-of-type {
                border-bottom: 1px solid ${Colors.lightGrey};
            }

            &:last-of-type {
                color: ${Colors.deepRed};
            }
        }
    }
`;

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    DesktopMenu,
    Dropdown,
    MobileMenu,
    NavBar,
    ProfileBtn,
    ProfileBtnContainer
};
