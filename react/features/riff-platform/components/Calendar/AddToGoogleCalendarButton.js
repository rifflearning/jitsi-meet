/* eslint-disable require-jsdoc */

import {
    Button
} from '@material-ui/core';
import Icon from '@material-ui/core/Icon';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';

import GoogleCalendarIcon from '../../../../../images/googleCalendar.svg';
import { connect } from '../../../base/redux';
import { bootstrapGoogleCalendarIntegration } from '../../actions/calendarSync';
import { isGoogleCalendarEnabled } from '../../calendarSyncFunctions';

function AddToGoogleCalendarButton({
    onAddToCalendar,
    bootstrapCalendarIntegration
}) {

    const isGoogleCalendarIntegrationEnabled = isGoogleCalendarEnabled();

    if (!isGoogleCalendarIntegrationEnabled) {
        return null;
    }

    useEffect(() => {
        bootstrapCalendarIntegration();
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
    bootstrapCalendarIntegration: PropTypes.func,
    onAddToCalendar: PropTypes.func

};

const mapStateToProps = () => {
    return { };
};

const mapDispatchToProps = dispatch => {
    return {
        bootstrapCalendarIntegration: () => dispatch(bootstrapGoogleCalendarIntegration())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddToGoogleCalendarButton);
