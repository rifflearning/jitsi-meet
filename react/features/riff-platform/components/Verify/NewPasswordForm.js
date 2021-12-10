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

import { connect } from '../../../base/redux';
import { resetPasswordVerify, hideResetMessage } from '../../actions/resetPassword';
import * as ROUTES from '../../constants/routes';


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

const ResetPassword = ({ doReset, hideMessage, resetPasswordError, resetingPassword, resetPasswordSuccess, token }) => {
    const classes = useStyles();
    const history = useHistory();

    const [ password, setPassword ] = useState('');
    const [ password2, setPassword2 ] = useState('');

    const [ passwordError, setPasswordError ] = useState('');
    const [ password2Error, setPassword2Error ] = useState('');

    const [ isRedirecting, setIsRedirecting ] = useState(false);

    const onChangePassword = e => setPassword(e.target.value);
    const onChangePassword2 = e => setPassword2(e.target.value);

    const isPasswordValid = () => Boolean(password.length >= 8);
    const isPassword2Valid = () => password === password2;

    const isFormValid = () => {
        let isValid = true;

        setPasswordError('');
        setPassword2Error('');

        if (!isPasswordValid()) {
            isValid = false;
            setPasswordError('Password must: have at least 8 characters');
        }
        if (!isPassword2Valid()) {
            isValid = false;
            setPassword2Error('Those passwords didn\'t match. Try again.');
        }

        return isValid;
    };

    const handleSubmit = e => {
        e.preventDefault();

        if (!isFormValid()) {
            return;
        }
        doReset({
            token,
            password
        }).then(res => {
            if (res) {
                setIsRedirecting(true);
                setTimeout(() => {
                    history.push(`${ROUTES.SIGNIN}`);
                }, 5000);
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
                    Type Your New Password
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
                                name = 'password'
                                label = 'Password'
                                type = 'password'
                                id = 'password'
                                autoComplete = 'current-password'
                                value = { password }
                                onChange = { onChangePassword }
                                error = { Boolean(passwordError) }
                                helperText = { passwordError } />
                        </Grid>
                        <Grid
                            item
                            xs = { 12 }>
                            <TextField
                                variant = 'outlined'
                                required
                                fullWidth
                                name = 'password2'
                                label = 'Confirm'
                                type = 'password'
                                id = 'password2'
                                autoComplete = 'current-password2'
                                value = { password2 }
                                onChange = { onChangePassword2 }
                                error = { Boolean(password2Error) }
                                helperText = { password2Error } />
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
    resetingPassword: PropTypes.bool,
    token: PropTypes.string
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
        doReset: obj => dispatch(resetPasswordVerify(obj)),
        hideMessage: () => dispatch(hideResetMessage())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword);
