/* ******************************************************************************
 * styled.js                                                                    *
 * *************************************************************************/ /**
 *
 * @fileoverview React components to apply styling to CopyInviteButton components
 *
 * Created on       May 12, 2020
 * @author          Jordan Reedie
 *
 * @copyright (c) 2020-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/
import styled from 'styled-components';

import { LightBtn } from 'Components/styled';

const CopyInviteBtn = styled.button`
    ${LightBtn}
    min-width: 200px;
`;

export {
    CopyInviteBtn,
};
