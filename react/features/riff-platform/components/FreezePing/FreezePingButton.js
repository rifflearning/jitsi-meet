/* eslint-disable max-len */
/* eslint-disable import/order */
/* eslint-disable padding-line-between-statements */
/* eslint-disable react/sort-prop-types */
/* eslint-disable object-property-newline */
/* eslint-disable react/jsx-no-bind */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from '../../../base/redux';
import { playSound } from '../../../base/sounds';
import { showNotification } from '../../../../features/notifications';
import { toggleFreezePing } from '../../actions/freezePing';
import ToolbarButton from '../../../toolbox/components/web/ToolbarButton';
import UpdateIcon from '@material-ui/icons/Update';
import {
    PING_PERIOD,
    PING_MSG_SOUND_ID,
    NOTIFICATION_DESCRIPTION,
    NOTIFICATION_TITLE
} from './constants';


const FreezePingButton = ({ isActive, isSharingScreen, toggle, ping, notify }) => {
    const [ intervalId, setIntervalId ] = useState(null);
    const [ pageIsVisible, setPageIsVisible ] = useState(true);

    useEffect(() => {
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                setPageIsVisible(true);
            } else {
                setPageIsVisible(false);
            }
        });
    }, []);

    useEffect(() => {
        if (isActive && !pageIsVisible && !isSharingScreen) {
            const id = setInterval(() => ping(PING_MSG_SOUND_ID), PING_PERIOD);
            setIntervalId(id);
        } else {
            clearInterval(intervalId);
        }
    }, [ isActive, pageIsVisible, isSharingScreen ]);

    const toggleWithNotificationIfSwitchingOff = () => {
        toggle();

        if (isActive) {
            notify(NOTIFICATION_DESCRIPTION, NOTIFICATION_TITLE);
        }
    };

    return (
        <ToolbarButton
            accessibilityLabel = 'Toggle Freeze Ping'
            icon = { UpdateIcon }
            onClick = { () => toggleWithNotificationIfSwitchingOff() }
            toggled = { isActive }
            tooltip = 'Enable / Disable Freeze Ping' />
    );
};

FreezePingButton.propTypes = {
    isActive: PropTypes.bool,
    isSharingScreen: PropTypes.bool,
    toggle: PropTypes.func,
    ping: PropTypes.func,
    notify: PropTypes.func
};

const mapStateToProps = state => {
    return {
        isActive: state['features/riff-platform'].freezePing.isActive,
        isSharingScreen: state['features/base/conference'].isSharingScreen
    };
};

const mapDispatchToProps = dispatch => {
    return {
        toggle: () => dispatch(toggleFreezePing()),
        ping: soundId => dispatch(playSound(soundId)),
        notify: (description, title) => dispatch(showNotification({ descriptionKey: description, titleKey: title }))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(FreezePingButton);
