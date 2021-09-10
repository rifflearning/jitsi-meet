/* eslint-disable react/jsx-no-bind */
import { Radio, RadioGroup, FormControlLabel, Grid, Box } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

import { connect } from '../../../base/redux';
import { getUserPersonalMeetingRoom } from '../../actions/personalMeeting';
import Meeting from '../Meeting/Meeting';
import Scheduler from '../Scheduler';
import StyledPaper from '../StyledPaper';

const CreateMeeting = ({
    personalMeeting,
    fetchPersonalMeeting,
    error,
    loading }) => {
    const [ selectedValue, setSelectedValue ] = useState('personalRoom');

    const handleChange = event => {
        setSelectedValue(event.target.value);
    };

    useEffect(() => {
        if (!personalMeeting?.id) {
            fetchPersonalMeeting();
        }
    }, []);

    return (
        <div>
            <RadioGroup
                name = 'createMeeting'
                onChange = { handleChange }
                row = { true }
                value = { selectedValue }>
                <FormControlLabel
                    control = { <Radio /> }
                    label = 'Personal Room'
                    value = 'personalRoom' />
                <FormControlLabel
                    control = { <Radio /> }
                    label = 'Schedule a meeting'
                    value = 'scheduler' />

            </RadioGroup>
            <Box pt = { 2 }>
                {selectedValue === 'personalRoom'
                    ? <Grid
                        item = { true }
                        xs = { 12 }>
                        <StyledPaper>
                            <Meeting
                                error = { error }
                                loading = { loading }
                                meeting = { personalMeeting } />
                        </StyledPaper>
                    </Grid>
                    : <Scheduler />
                }
            </Box>
        </div>
    );
};

CreateMeeting.propTypes = {
    error: PropTypes.string,
    fetchPersonalMeeting: PropTypes.func,
    loading: PropTypes.bool,
    personalMeeting: PropTypes.object
};

const mapStateToProps = state => {
    return {
        personalMeeting: state['features/riff-platform'].personalMeeting.meeting,
        loading: state['features/riff-platform'].personalMeeting.loading,
        error: state['features/riff-platform'].personalMeeting.error
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchPersonalMeeting: () => dispatch(getUserPersonalMeetingRoom())
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(CreateMeeting);
