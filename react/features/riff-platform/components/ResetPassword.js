/* eslint-disable react/jsx-boolean-value */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/jsx-sort-props */

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Alert from '@material-ui/lab/Alert';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Link as LinkTo, useHistory } from 'react-router-dom';

import { connect } from '../../base/redux';
import { resetPassword, hideResetMessage } from '../actions/resetPassword';
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
            marginTop: theme.spacing(3)
        },
        submit: {
            margin: theme.spacing(3, 0, 2)
        }
    };
});

const ResetPassword = ({ doReset, hideMessage, resetPasswordError, resetingPassword, resetPasswordSuccess }) => {
    const classes = useStyles();
    const history = useHistory();

    const [ email, setEmail ] = useState('');
    const [ emailError, setEmailError ] = useState('');
    const [ isRedirecting ] = useState(false);

    const onChangeEmail = e => setEmail(e.target.value);

    // eslint-disable-next-line max-len
    const isEmailValid = () => Boolean(email.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/));

    const isFormValid = () => {
        let isValid = true;

        setEmailError('');

        if (!isEmailValid()) {
            isValid = false;
            setEmailError('Email is invalid');
        }

        return isValid;
    };


    const handleSubmit = e => {
        e.preventDefault();

        if (!isFormValid()) {
            return;
        }
        doReset({
            email
        }).then(res => {
            if (res) {
                history.push(`${ROUTES.VERIFY}${ROUTES.RESETPASSWORD}`);
            }
        });
    };

    useEffect(() => () => hideMessage(), []);

    return (
        <Container
            component = 'main'
            maxWidth = 'xs'>
            { resetPasswordError && <Alert severity = 'error'>{resetPasswordError}</Alert> }
            { resetPasswordSuccess && <Alert severity = 'success'>{resetPasswordSuccess}</Alert> }
            <div className = { classes.paper }>
                <Avatar className = { classes.avatar }>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography
                    component = 'h1'
                    variant = 'h5'>
                    Type your email address
                </Typography>
                <form
                    className = { classes.form }
                    noValidate
                    onSubmit = { handleSubmit }>
                    <Grid
                        container
                        spacing = { 2 }>
                        <Grid
                            item
                            xs = { 12 }>
                            <TextField
                                variant = 'outlined'
                                required
                                fullWidth
                                id = 'email'
                                label = 'Email Address'
                                name = 'email'
                                autoComplete = 'email'
                                value = { email }
                                onChange = { onChangeEmail }
                                error = { Boolean(emailError) }
                                helperText = { emailError } />
                        </Grid>
                    </Grid>
                    <Button
                        type = 'submit'
                        fullWidth
                        variant = 'contained'
                        color = 'primary'
                        className = { classes.submit }
                        disabled = { resetingPassword || isRedirecting }>
                        Reset Password
                    </Button>
                    <Grid
                        container
                        justify = 'flex-end'>
                        <Grid item>
                            <LinkTo to = '/signup'>
                              Don't have an account? Sign Up
                            </LinkTo>
                        </Grid>
                    </Grid>
                </form>
            </div>
        </Container>
    );
};

ResetPassword.propTypes = {
    doReset: PropTypes.func,
    hideMessage: PropTypes.func,
    resetPasswordError: PropTypes.string,
    resetPasswordSuccess: PropTypes.string,
    resetingPassword: PropTypes.bool
};

const mapStateToProps = state => {
    return {
        resetPasswordError: state['features/riff-platform'].resetPassword.error,
        resetingPassword: state['features/riff-platform'].resetPassword.loading,
        resetPasswordSuccess: state['features/riff-platform'].resetPassword.success
    };
};

const mapDispatchToProps = dispatch => {
    return {
        doReset: obj => dispatch(resetPassword(obj)),
        hideMessage: () => dispatch(hideResetMessage())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword);
