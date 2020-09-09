/* ******************************************************************************
 * styled.js                                                                    *
 * *************************************************************************/ /**
 *
 * @fileoverview React components to apply styling to signup components
 *
 * Note: this is currently almost identical to LogIn/styled.js
 *
 * Created on       January 7, 2020
 * @author          Michael Jay Lippert
 *
 * @copyright (c) 2020-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

import styled from 'styled-components';

import { Colors, rgbaColor } from 'libs/utils';

import {
    footerHeight,
    gutterWidth,
    navHeight,
    siteMaxWidth,
} from 'Components/styled';

const SignUpViewContainer = styled.div`
    background-image: linear-gradient(to bottom, ${Colors.white}, ${Colors.selago});

    .inner {
        max-width: ${siteMaxWidth};
        min-height: calc(100vh - ${navHeight} - ${footerHeight});
        margin: 0 auto;
        padding: 60px ${gutterWidth};
        display: flex;
        align-items: center;

        .form-container {
            margin-right: 60px;

            .sub-heading-2 {
                font-size: 16px;
                line-height: 1.63;
                margin-bottom: 24px;
            }

            .sub-heading {
                margin: 24px 0;
                font-size: 20px;
                line-height: 1.4;
            }

            .sign-in-prompt {
                margin-top: 24px;
                color: ${Colors.mineShaft};
            }

            .forgot-password {
                margin-bottom: 24px;
            }

            a {
                color: ${Colors.denim};
                text-decoration: underline;
            }

            .terms-container {
                background: ${Colors.selago};
                height: 52px;
                font-size: 16px;
                line-height: 1.63;
                display: flex;
                align-items: center;
                margin-bottom: 24px;
                border-radius: 4px;
                border: solid 1px ${rgbaColor(Colors.riffViolet, 0.4)};

                input {
                    margin: 0 12px;
                    width: 14px;
                    height: 14px;
                }
            }
        }

        .promo-image {
            width: 45%
        }
    }
`;


/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    SignUpViewContainer,
};
