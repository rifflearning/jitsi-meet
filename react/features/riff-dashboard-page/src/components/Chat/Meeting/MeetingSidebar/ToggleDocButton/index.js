/* ******************************************************************************
 * index.js                                                                     *
 * *************************************************************************/ /**
 *
 * @fileoverview Connects ToggleDocButton to redux
 *
 * Created on       November 8, 2019
 * @author          Jordan Reedie
 *
 * @copyright (c) 2019-present Riff Learning Inc.,
 *            MIT License (see https://opensource.org/licenses/MIT)
 *
 * ******************************************************************************/
import { connect } from 'react-redux';

import {
    showMeetingDoc,
} from 'Redux/actions/chat';

import { ToggleDocButton } from './ToggleDocButton';

const mapStateToProps = state => ({
    shouldDisplayDoc: state.chat.shouldDisplayDoc,
});

const mapDispatchToProps = dispatch => ({
    showDoc: (show) => {
        dispatch(showMeetingDoc(show));
    },
});

const ConnectedToggleDocButton = connect(
    mapStateToProps,
    mapDispatchToProps
)(ToggleDocButton);

export {
    ConnectedToggleDocButton as ToggleDocButton
};
