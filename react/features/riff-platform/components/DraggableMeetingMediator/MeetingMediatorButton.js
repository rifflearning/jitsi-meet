/* eslint-disable react/jsx-no-bind */
/* eslint-disable import/order*/

import EqualizerIcon from '@material-ui/icons/Equalizer';
import PropTypes from 'prop-types';
import React from 'react';

import { connect } from '../../../base/redux';
import { toggleMeetingMediator } from '../../actions/meetingMediator';
import ToolboxItem from '../../../base/toolbox/components/ToolboxItem.web';
import { setOverflowMenuVisible } from '../../../toolbox/actions';

const MeetingMediatorButton = ({ isOpen, toggleMediator, overflowMenuVisible, closeOverflowMenuIfOpen, showLabel }) => {

    const doToggleMeetingMediator = () => {
        toggleMediator();
        overflowMenuVisible && closeOverflowMenuIfOpen();
    };

    return (
        <ToolboxItem
            accessibilityLabel = 'Toggle meeting mediator'
            icon = { EqualizerIcon }
            label = { `${isOpen ? 'Close' : 'Open'} Meeting Mediator` }
            onClick = { doToggleMeetingMediator }
            showLabel = { showLabel } />
    );
};

MeetingMediatorButton.propTypes = {
    closeOverflowMenuIfOpen: PropTypes.func,
    isOpen: PropTypes.bool,
    overflowMenuVisible: PropTypes.bool,
    showLabel: PropTypes.bool,
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
