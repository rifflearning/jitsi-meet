/* ******************************************************************************
 * index.js                                                                     *
 * *************************************************************************/ /**
 *
 * @fileoverview Connects CopyInviteButton to redux
 *
 * Created on       May 11, 2020
 * @author          Jordan Reedie
 *
 * @copyright (c) 2019-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/
import { connect } from 'react-redux';

import { getRoomId, getRoomName } from 'Redux/selectors/chat';

import { CopyInviteButton } from './CopyInviteButton';

const mapStateToProps = state => ({
    // if in teams mode, getRoomId will return null
    // in which case we will use the room name
    inviteId: getRoomId(state) || getRoomName(state),
});

const ConnectedCopyInviteButton = connect(mapStateToProps)(CopyInviteButton);

export {
    ConnectedCopyInviteButton as CopyInviteButton,
};
