/* ******************************************************************************
 * styled.js                                                                    *
 * *************************************************************************/ /**
 *
 * @fileoverview React components to apply styling to lobby components
 *
 * Created on       October 22, 2019
 * @author          Brec Hanson
 *
 * @copyright (c) 2019-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

import styled from 'styled-components';

import { Colors } from 'libs/utils';

import {
    BtnDisabled,
    BtnHover,
    LightBtn,
    navHeight,
    siteMaxWidth,
} from 'Components/styled';
import { TextInput } from 'Components/Common/Form/styled';

const RoomInviteBtn = styled.button`
    ${LightBtn}
    width: 100%;
    margin-top: 14px !important;
    border: none;
    position: relative;
    color: ${Colors.riffVioletDark};
    ${BtnHover}
    svg {
        position: absolute;
        top: 25%;
        right: 10px;
    }
    &:disabled {
        ${BtnDisabled}
        &:hover {
            opacity: 1;
        }
    }

`;

const ActionBtn = styled.button`
    ${LightBtn}
    vertical-align: middle;
    margin-left: 5px;
    margin-top: 18px;
    ${BtnHover}
`;

const InviteText = styled(TextInput)`
    margin-top: 18px;
    font-size: 1rem;
    padding: 7px 11px;
    width: 100%;
`;

const LobbyContainer = styled.div`
    background-image: linear-gradient(to bottom, ${Colors.white}, ${Colors.selago});

    .inner {
        min-height: calc(100vh - ${navHeight});
        max-width: ${siteMaxWidth};
        margin: 0 auto;
        display: flex;
    }
`;

const LobbyBody = styled.main`
    max-width: 532px;
    margin-top: 18px;
    padding-bottom: 60px;
    padding-left: 47px;

    @media (max-width: 768px) {
        padding-left: 24px;
        padding-right: 24px;
    }
`;

const LobbySubHeading = styled.div`
    font-size: 16px;
    line-height: 1.63;
    margin: 20px 0;

    @media (max-width: 768px) {
        margin: 16px 0;
    }
`;

const LobbyForm = styled.form`
`;

const ErrorNotification = styled.div.attrs({
    className: 'notification is-warning has-text-centered'
})`
    margin-top: 10px;
`;

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    ActionBtn,
    ErrorNotification,
    InviteText,
    LobbyBody,
    LobbyContainer,
    LobbyForm,
    LobbySubHeading,
    RoomInviteBtn,
};
