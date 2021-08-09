/* ******************************************************************************
 * styled.js                                                                    *
 * *************************************************************************/ /**
 *
 * @fileoverview React components to apply styling to top level App component
 *
 * Created on       March 25, 2020
 * @author          Michael Jay Lippert
 *
 * @copyright (c) 2020-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

import styled from 'styled-components';

import { Colors } from 'libs/utils';

const SkipContent = styled.div.attrs({
    className: 'skip-content'
})`
    padding: 6px;
    position: absolute;
    top: -40px;
    left: 0px;
    border-right: 1px solid #4a4a4a;
    border-bottom: 1px solid #4a4a4a;
    border-bottom-right-radius: 3px;
    background:  ${Colors.purpleWhite};
    -webkit-transition: top .5s ease-out;
    transition: top .5s ease-out;
    z-index: 100;

    a {
        padding: 3px;
    }

    &:focus-within {
        top: 0px;
    }
`;

const LoadingTextAlt = styled.footer.attrs({
    className: 'loading-text-alt'
})`
    color: ${Colors.lightRoyal};
    font-size: 20px;
`;

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    LoadingTextAlt,
    SkipContent,
};
