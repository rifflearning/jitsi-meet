/* eslint-disable require-jsdoc */

import { Button } from '@material-ui/core';
import Icon from '@material-ui/core/Icon';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';

import OutlookCalendarIcon from '../../../../../images/outlookIcon.svg';
import { connect } from '../../../base/redux';
import { bootstrapMsCalendarIntegration } from '../../actions/calendarSync';
import { isMsCalendarEnabled } from '../../calendarSyncFunctions';

function AddToMsCalendarButton({
    onAddToCalendar,
    bootstrapCalendarIntegration
}) {

    const isMsCalendarIntegartionEnabled = isMsCalendarEnabled();

    if (!isMsCalendarIntegartionEnabled) {
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
            startIcon = { <Icon><OutlookCalendarIcon /></Icon> }
            variant = 'outlined' >Outlook Calendar</Button>
    );
}

AddToMsCalendarButton.propTypes = {
    bootstrapCalendarIntegration: PropTypes.func,
    onAddToCalendar: PropTypes.func
};

const mapStateToProps = () => {

    return { };
};

const mapDispatchToProps = dispatch => {
    return {
        bootstrapCalendarIntegration: () => dispatch(bootstrapMsCalendarIntegration())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddToMsCalendarButton);
