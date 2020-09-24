/* ******************************************************************************
 * styled.js                                                                    *
 * *************************************************************************/ /**
 *
 * @fileoverview React components to apply styling to form components
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

import { BtnDisabled, PurpleBtn } from 'Components/styled';

const FormFieldContainer = styled.div`
    margin-bottom: 20px;

    @media (max-width: 768px) {
        margin-bottom: 12px;
    }
`;

const FieldLabel = styled.label`
    font-size: 16px;
    line-height: 26px;
    display: block;
    margin-bottom: 4px;
    color: ${Colors.white};

    .is-required {
        color: ${Colors.deepRed};
    }
`;

const TextInput = styled.input`
    height: 44px;
    border-radius: 4px;
    box-shadow: inset 0 2px 2px 0 ${rgbaColor(Colors.black, 0.15)};
    border: solid 1px ${rgbaColor(Colors.riffViolet, 0.6)};
    background-color: ${Colors.white};

    ${props => props.isErrored === true ?
        `
            border: 2px solid ${Colors.deepRed};
            background: ${Colors.linen};
        `
        :
        ''
}
`;

const InstructionalText = styled.label`
    font-size: 16px;
    line-height: 26px;
    display: block;
    margin-bottom: 4px;
`;

const FormErrorContainer = styled.div`
    background: ${Colors.linen};
    height: 50px;
    border-radius: 4px;
    border-left: 3px solid ${Colors.deepRed};
    display: flex;
    align-items: center;
    margin-bottom: 24px;

    .error-icon {
        width: 24px;
        height: 24px;
        margin: 0 12px;
        color: ${Colors.deepRed};
    }

    p {
        font-size: 16px;
        line-height: 1.63;
        color: ${Colors.mineShaft}
    }
`;

const SubmitBtnContainer = styled.div`
    flex: 100%;
    padding: 0;

    button {
        ${PurpleBtn}
        width: 100%;

        &:disabled {
            ${BtnDisabled}
        }
    }
`;

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    FieldLabel,
    InstructionalText,
    FormErrorContainer,
    FormFieldContainer,
    SubmitBtnContainer,
    TextInput,
};
