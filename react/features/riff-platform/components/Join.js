/* eslint-disable react/jsx-boolean-value */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/jsx-sort-props */

import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { connect } from '../../base/redux';
import * as ROUTES from '../constants/routes';

const useStyles = makeStyles(theme => {
    return {
        paper: {
            marginTop: theme.spacing(4),
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        },
        avatar: {
            margin: theme.spacing(1),
            backgroundColor: theme.palette.secondary.main
        },
        form: {
            width: '100%', // Fix IE 11 issue.
            marginTop: theme.spacing(1)
        },
        submit: {
            margin: theme.spacing(3, 0, 2)
        }
    };
});

const Join = ({ meetingError, user }) => {
    const [ room, setRoom ] = useState('');
    const [ roomError, setRoomError ] = useState('');

    const classes = useStyles();
    const history = useHistory();

    const onChangeRoom = e => setRoom(e.target.value);

    const isRoomValid = () => Boolean(room.length);

    const isFormValid = () => {
        let isValid = true;

        setRoomError('');

        if (!isRoomValid()) {
            isValid = false;
            setRoomError('Please, enter room');
        }

        return isValid;
    };

    const handleSubmit = e => {
        e.preventDefault();

        if (!isFormValid()) {
            return;
        }

        const param = room.split('/').pop();

        history.push(`${ROUTES.WAITING}/${param}`);
    };

    return (
        <Container
            component = 'main'
            maxWidth = 'xs'>
            <div className = { classes.paper }>
                <Typography
                    component = 'h1'
                    variant = 'h4' >
                    Join a meeting
                </Typography>
                <form
                    className = { classes.form }
                    noValidate
                    onSubmit = { handleSubmit }>
                    <TextField
                        variant = 'outlined'
                        margin = 'normal'
                        required
                        fullWidth
                        id = 'room'
                        label = 'Meeting ID or link'
                        name = 'room'
                        autoComplete = 'room'
                        autoFocus
                        value = { room }
                        onChange = { onChangeRoom }
                        error = { Boolean(roomError) }
                        helperText = { roomError } />
                    <Button
                        type = 'submit'
                        fullWidth
                        variant = 'contained'
                        color = 'primary'
                        className = { classes.submit }>
                        Join
                    </Button>
                    {meetingError
                        && <Typography color = 'error'>
                          No such meeting.
                        </Typography>
                    }
                    {meetingError && !user
                        && <Typography color = 'error'>
                          Or anonymous users are not allowed. Please SignIn or SignUp.
                        </Typography>
                    }
                </form>
            </div>
        </Container>
    );
};

Join.propTypes = {
    meetingError: PropTypes.string,
    user: PropTypes.object
};

const mapStateToProps = state => {
    return {
        meetingError: state['features/riff-platform'].meeting.error,
        user: state['features/riff-platform'].signIn.user
    };
};

export default connect(mapStateToProps)(Join);
