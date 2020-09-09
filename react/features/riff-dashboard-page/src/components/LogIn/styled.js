/* ******************************************************************************
 * styled.js                                                                    *
 * *************************************************************************/ /**
 *
 * @fileoverview React components to apply styling to login components
 *
 * [More detail about the file's contents]
 *
 * Created on       March 5, 2019
 * @author          Jordan Reedie
 *
 * @copyright (c) 2019-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

import styled from 'styled-components';

import { Colors } from 'libs/utils';

import {
    footerHeight,
    gutterWidth,
    navHeight,
    siteMaxWidth,
} from 'Components/styled';

const LogInViewContainer = styled.div`
      background-image: linear-gradient(to bottom, ${Colors.white}, ${Colors.selago});

    .inner {
        max-width: ${siteMaxWidth};
        min-height: calc(100vh - ${navHeight} - ${footerHeight});
        margin: 0 auto;
        padding: 60px ${gutterWidth};
        display: flex;
        align-items: center;

        .form-container {
            margin-left: 60px;
        }

        .promo-image {
            width: 45%
        }
    }
`;

const LogInFormContainer = styled.div`
    font-size: 16px;
    line-height: 1.63;

    .sub-heading {
        margin: 24px 0;
        font-size: 20px;
        line-height: 1.4;
    }

    .sign-up-prompt {
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
`;

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    LogInFormContainer,
    LogInViewContainer,
};
