/* ******************************************************************************
 * styled.js                                                                    *
 * *************************************************************************/ /**
 *
 * @fileoverview React components to apply styling to meeting components
 *
 * Created on       April 18, 2020
 * @author          Brec Hanson
 *
 * @copyright (c) 2020-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/

import styled from 'styled-components';

import { PurpleBtn, navHeight } from 'Components/styled';
import { NavBar } from 'Components/NavBar/styled';

import { Colors } from 'libs/utils';


const MeetingContainer = styled.div`
    background-image: linear-gradient(to bottom, ${Colors.white}, ${Colors.selago});
    display: flex;
    min-height: calc(100vh - ${navHeight});
`;

const MeetingNavBar = styled(NavBar)`
    max-width: unset;

    .left-container {
        display: flex;
        justify-content: space-between;
        width: 50%;

        .room-name-container {
            font-size: 28px;
            font-weight: 600;
            line-height: 1.43;
            display: flex;
            align-items: center;

            i {
                font-family: AppleColorEmoji;
            }

            .room-name {
                margin-left: 12px;
                color: ${Colors.mineShaft};
            }
        }
    }

    .action-btn-container {
        display: flex;
    }
`;

const LeaveRoomBtnContainer = styled.div`
    ${PurpleBtn}
    margin-left: 12px;
`;

const MeetingRoomContainer = styled.div`
    margin: 12px 10px 20px;
    height: 100%;
    flex: 100%;
`;

const RemoteVideoRow = styled.div`
    display: flex;
    justify-content: space-between;
    flex: 100%;
    flex-wrap: wrap;

    .peer-video-container {
        /* add margin-left to all elements but first in a row*/
        &:nth-child(n+2) {
            margin-left: 5px;
        }
    }

    /* add margin-top to all elements in second row */
    margin-top: ${props => props.rowNum === 2 ? '5px' : '0'}
`;

const PeerVideoContainer = styled.div`
    flex: 1;
    overflow: hidden;
    height: ${props => props.videoHeight};
    position: relative;

    video {
        display: block;
        width: 100%;
        height: 100%;
        border-radius: 4px;
    }
`;

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    LeaveRoomBtnContainer,
    MeetingContainer,
    MeetingNavBar,
    MeetingRoomContainer,
    PeerVideoContainer,
    RemoteVideoRow,
};
