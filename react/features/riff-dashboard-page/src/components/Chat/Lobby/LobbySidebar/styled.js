/* ******************************************************************************
 * styled.js                                                                    *
 * *************************************************************************/ /**
 *
 * @fileoverview React components to apply styling to lobby sidebar components
 *
 * Created on       May 13, 2020
 * @author          Jordan Reedie
 *
 * @copyright (c) 2020-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

import styled from 'styled-components';

import { Colors } from 'libs/utils';

const Placeholder = styled.div`
    width: 256px;
    height: 192px;
    background-image: linear-gradient(to bottom, #e0c7e8, #bd95cc);
    display: flex;
    align-items: center;
    justify-content: center;

    p {
        font-size: 16px;
        font-weight: 600;
        line-height: 1.63;
        color: ${Colors.mineShaft};
        padding: 0 12px;
        margin: 0 12px;
        text-align: center;
    }
`;

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    Placeholder,
};
