/* eslint-disable react/jsx-boolean-value */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/jsx-sort-props */

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Container from '@material-ui/core/Container';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Link as LinkTo, useHistory } from 'react-router-dom';

import { connect } from '../../base/redux';
import { signUp } from '../actions/signUp';
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

const SignUp = ({ doRegister, signUpError, signingUp }) => {
    const classes = useStyles();
    const history = useHistory();

    const [ name, setName ] = useState('');
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ password2, setPassword2 ] = useState('');
    const [ policy, setPolicy ] = useState(false);

    const [ nameError, setNameError ] = useState('');
    const [ emailError, setEmailError ] = useState('');
    const [ passwordError, setPasswordError ] = useState('');
    const [ password2Error, setPassword2Error ] = useState('');
    const [ policyError, setPolicyError ] = useState('');

    const onChangeName = e => setName(e.target.value);
    const onChangeEmail = e => setEmail(e.target.value);
    const onChangePassword = e => setPassword(e.target.value);
    const onChangePassword2 = e => setPassword2(e.target.value);
    const onChangePolicy = e => setPolicy(e.target.checked);

    const isNameValid = () => Boolean(name.length);
    // eslint-disable-next-line max-len
    const isEmailValid = () => Boolean(email.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/));

    // const isPasswordValid = () => Boolean(password.match(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/));
    const isPasswordValid = () => Boolean(password.length >= 8);
    const isPassword2Valid = () => password === password2;
    const isPolicyValid = () => policy;

    const isFormValid = () => {
        let isValid = true;

        setNameError('');
        setEmailError('');
        setPasswordError('');
        setPassword2Error('');
        setPolicyError('');

        if (!isNameValid()) {
            isValid = false;
            setNameError('Name is invalid');
        }
        if (!isEmailValid()) {
            isValid = false;
            setEmailError('Email is invalid');
        }
        if (!isPasswordValid()) {
            isValid = false;
            // eslint-disable-next-line max-len
            // setPasswordError('Password must: have at least 8 characters, at least 1 letter (a, b, c...), at least 1 number (1, 2, 3...), include both uppercase and lowercase characters');
            setPasswordError('Password must: have at least 8 characters');
        }
        if (!isPassword2Valid()) {
            isValid = false;
            setPassword2Error('Those passwords didn\'t match. Try again.');
        }
        if (!isPolicyValid()) {
            isValid = false;
            setPolicyError('You must agree to Riff Terms of Service and Privacy Policy.');
        }

        return isValid;
    };

    const handleSubmit = e => {
        e.preventDefault();

        if (!isFormValid()) {
            return;
        }
        doRegister({
            name,
            email,
            password
        }).then(res => {
            if (res) {
                history.push(`${ROUTES.VERIFY}${ROUTES.SIGNUP}`);
            }
        });
    };

    return (
        <Container
            component = 'main'
            maxWidth = 'xs'>
            <div className = { classes.paper }>
                <Avatar className = { classes.avatar }>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography
                    component = 'h1'
                    variant = 'h5'>
                    Sign up
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
                                autoFocus
                                variant = 'outlined'
                                required
                                fullWidth
                                id = 'name'
                                label = 'Full Name'
                                name = 'name'
                                autoComplete = 'name'
                                value = { name }
                                onChange = { onChangeName }
                                error = { Boolean(nameError) }
                                helperText = { nameError } />
                        </Grid>
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
                        <Grid
                            item
                            xs = { 12 }>
                            <FormControl
                                required
                                error = { Boolean(policyError) }
                                component = 'fieldset'
                                className = { classes.formControl }>
                                <FormControlLabel
                                    required
                                    control = { <Checkbox
                                        value = 'agreeTermsAndPolicy'
                                        checked = { policy }
                                        color = 'primary'
                                        onChange = { onChangePolicy } /> }
                                    label = 'I agree to Riff Terms of Service and Privacy Policy.' />
                                <FormHelperText>{policyError}</FormHelperText>
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Button
                        type = 'submit'
                        fullWidth
                        variant = 'contained'
                        color = 'primary'
                        className = { classes.submit }
                        disabled = { signingUp }>
                        Sign Up
                    </Button>
                    <Typography color = 'error'>
                        {signUpError}
                    </Typography>
                    <Grid
                        container
                        justify = 'flex-end'>
                        <Grid item>
                            <LinkTo to = '/login'>
                                Already have an account? Sign in
                            </LinkTo>
                        </Grid>
                    </Grid>
                </form>
            </div>
        </Container>
    );
};

SignUp.propTypes = {
    doRegister: PropTypes.func,
    signUpError: PropTypes.string,
    signingUp: PropTypes.bool
};

const mapStateToProps = state => {
    return {
        signUpError: state['features/riff-platform'].signUp.error,
        signingUp: state['features/riff-platform'].signUp.loading
    };
};

const mapDispatchToProps = dispatch => {
    return {
        doRegister: obj => dispatch(signUp(obj))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
