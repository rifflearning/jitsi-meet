/* eslint-disable max-len */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable import/order*/

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from '../../../base/redux';
import { toggleFreezePing } from '../../actions/freezePing';
import ToolbarButton from '../../../toolbox/components/web/ToolbarButton';
import { playSound } from '../../../base/sounds';
import UpdateIcon from '@material-ui/icons/Update';
import { PING_PERIOD, PING_MSG_SOUND_ID } from './constants';


const FreezePingButton = ({ isActive, toggle, ping }) => {

    const [ intervalId, setIntervalId ] = useState(null);
    const [ pageIsVisible, setPageIsVisible ] = useState(true);

    useEffect(() => {
        document.addEventListener("visibilitychange", () => {
            if (document.visibilityState === 'visible') {
                setPageIsVisible(true);
            } else {
                setPageIsVisible(false);
            }
        });
    }, []);

    useEffect(() => {
        if (isActive && !pageIsVisible) {
            const id = setInterval(() => ping(PING_MSG_SOUND_ID), PING_PERIOD);
            setIntervalId(id);
        } else {
            clearInterval(intervalId);
        }
    }, [isActive, pageIsVisible]);

    return (
        <ToolbarButton
            accessibilityLabel = 'Toggle freeze ping'
            icon = { UpdateIcon }
            onClick = { () => toggle() }
            toggled = { isActive }
            tooltip = 'Start / Stop freeze ping' />
    );
};

FreezePingButton.propTypes = {
    isActive: PropTypes.bool,
    toggle: PropTypes.func,
    ping: PropTypes.func
};

const mapStateToProps = state => {
    return {
        isActive: state['features/riff-platform'].freezePing.isActive
    };
};

const mapDispatchToProps = dispatch => {
    return {
        toggle: () => dispatch(toggleFreezePing()),
        ping: (soundId) => dispatch(playSound(soundId)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(FreezePingButton);
