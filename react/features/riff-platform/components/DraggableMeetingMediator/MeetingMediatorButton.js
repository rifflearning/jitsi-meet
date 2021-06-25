/* eslint-disable max-len */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable import/order*/

import EqualizerIcon from '@material-ui/icons/Equalizer';
import PropTypes from 'prop-types';
import React from 'react';

import { connect } from '../../../base/redux';
import ToolbarButton from '../../../toolbox/components/web/ToolbarButton';
import { toggleMeetingMediator } from '../../actions/meetingMediator';
import { OverflowMenuItem } from '../../../base/toolbox/components';
import { setOverflowMenuVisible } from '../../../toolbox/actions';

const MeetingMediatorButton = ({ isOpen, toggleMediator, isOverflowMenu, overflowMenuVisible, closeOverflowMenuIfOpen }) => {

    const doToggleMeetingMediator = () => {
        toggleMediator();
        overflowMenuVisible && closeOverflowMenuIfOpen();
    };

    return (
        isOverflowMenu
            ? <OverflowMenuItem
                accessibilityLabel = 'Toggle meeting mediator'
                icon = { EqualizerIcon }
                key = 'meeting-mediator'
                onClick = { doToggleMeetingMediator }
                text = { `${isOpen ? 'Close' : 'Open'} Meeting Mediator` } />
            : <ToolbarButton
                accessibilityLabel = 'Toggle meeting mediator'
                icon = { EqualizerIcon }
                key = 'meeting-mediator'
                onClick = { doToggleMeetingMediator }
                text = { `${isOpen ? 'Close' : 'Open'} Meeting Mediator` }
                toggled = { isOpen } />
    );
};

MeetingMediatorButton.propTypes = {
    closeOverflowMenuIfOpen: PropTypes.func,
    isOpen: PropTypes.bool,
    isOverflowMenu: PropTypes.bool,
    overflowMenuVisible: PropTypes.bool,
    toggleMediator: PropTypes.func
};


const mapStateToProps = state => {
    return {
        isOpen: state['features/riff-platform'].meetingMediator.isOpen,
        overflowMenuVisible: state['features/toolbox'].overflowMenuVisible
    };
};

const mapDispatchToProps = dispatch => {
    return {
        toggleMediator: () => dispatch(toggleMeetingMediator()),
        closeOverflowMenuIfOpen: () => dispatch(setOverflowMenuVisible(false))

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MeetingMediatorButton);
