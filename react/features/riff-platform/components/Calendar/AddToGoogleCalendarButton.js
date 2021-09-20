/* eslint-disable require-jsdoc */

import {
    Button
} from '@material-ui/core';
import Icon from '@material-ui/core/Icon';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';

import GoogleCalendarIcon from '../../../../../images/googleCalendar.svg';
import { connect } from '../../../base/redux';
import { bootstrapCalendarIntegration } from '../../actions/calendarSync';
import { isGoogleCalendarEnabled } from '../../calendarSyncFunctions';

function AddToGoogleCalendarButton({
    onAddToCalendar,
    bootstrapGoogleCalendarIntegration
}) {

    const isGoogleCalendarIntegrationEnabled = isGoogleCalendarEnabled();

    if (!isGoogleCalendarIntegrationEnabled) {
        return null;
    }

    useEffect(() => {
        bootstrapGoogleCalendarIntegration();
    }, []);


    return (
        <Button
            color = 'default'
            // eslint-disable-next-line react/jsx-no-bind
            onClick = { onAddToCalendar }
            startIcon = { <Icon><GoogleCalendarIcon /></Icon> }
            variant = 'outlined'>Google Calendar</Button>
    );
}

AddToGoogleCalendarButton.propTypes = {
    bootstrapGoogleCalendarIntegration: PropTypes.func,
    onAddToCalendar: PropTypes.func

};

const mapStateToProps = () => {
    return { };
};

const mapDispatchToProps = dispatch => {
    return {
        bootstrapGoogleCalendarIntegration: () => dispatch(bootstrapCalendarIntegration())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddToGoogleCalendarButton);
