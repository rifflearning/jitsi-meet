/* ******************************************************************************
 * styled.js                                                                    *
 * *************************************************************************/ /**
 *
 * @fileoverview React components to apply styling to the footer component
 *
 * Created on       April 16, 2020
 * @author          Brec Hanson
 *
 * @copyright (c) 2020-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

import styled from 'styled-components';

import { LightBtn } from 'Components/styled';

import { Colors } from 'libs/utils';

const FooterContainer = styled.div`
    height: 80px;
    background-image: linear-gradient(to bottom, #faeefd, ${Colors.white});

    .footer-inner {
        display: flex;
        justify-content: space-between;
        max-width: 1440px;
        padding: 0 144px;
        margin: 0 auto;

        .footer-left {
            display: flex;
            justify-content: flex-start;
            align-items: flex-start;
            .copyright {
                margin-top: 24px;
                color: ${Colors.tundora};
                font-size: 14px;
                line-height: 1.43;
            }
        }

        .footer-right {
            display: flex;
            justify-content: flex-end;
            align-items: flex-start;

            .contact-btn {
                ${LightBtn}
                margin-top: 12px;

                a {
                    color: ${Colors.mineShaft};
                    display: block;
                }
            }
            .privacy-policy-link {
                margin-left: 12px;
                margin-top: 24px;
                color: ${Colors.denim};
                text-decoration: underline;
            }
        }
    }

`;

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    FooterContainer,
};
