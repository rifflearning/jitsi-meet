/* ******************************************************************************
 * index.js                                                                     *
 * *************************************************************************/ /**
 *
 * @fileoverview Connects LobbySidebar to redux
 *
 * Created on       May 4, 2020
 * @author          Jordan Reedie
 *
 * @copyright (c) 2020-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/
import { connect } from 'react-redux';

import { getUserEmail } from 'redux/selectors/user';
import { getDisplayName } from 'redux/selectors/chat';

import { LobbySidebar } from './LobbySidebar';

// properties common to Personal and Teams mode can go here
const mapStateToProps = state => ({
    mediaError: state.chat.getMediaError,
    volume: state.chat.volume,
    isMicMuted: state.chat.audioMuted,
    email: getUserEmail(state),
    displayName: getDisplayName(state),
});

const ConnectedLobbySidebar = connect(mapStateToProps)(LobbySidebar);

/* **************************************************************************** *
 * Module exports                                                               *
 * **************************************************************************** */
export {
    ConnectedLobbySidebar as LobbySidebar,
};
