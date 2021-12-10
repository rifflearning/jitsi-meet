import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';

import { connect } from '../../../base/redux';
import { signInSuccess } from '../../actions/signIn';
import api from '../../api';
import * as ROUTES from '../../constants/routes';

import Text from './Text';


const VerifySignUp = ({ doSignIn }) => {
    const [ state, setstate ] = useState('');
    const history = useHistory();
    const urlParams = new URLSearchParams(history.location.search);
    const token = urlParams.get('token');

    useEffect(() => {
        let t = null;

        if (token) {
            api.signUpVerify(token).then(res => {
                setstate('Email submitted, logging in...');

                t = setTimeout(() => doSignIn(res.token).then(prevPath => {
                    if (prevPath) {
                        history.push(`${ROUTES.WAITING}${prevPath}`);
                    }
                }), 1000);
            })
            .catch(err => {
                console.error(err);
                setstate('Link has expired');
            });
        }

        return () => {
            clearInterval(t);
        };
    }, []);

    if (token) {
        return <Text text = { state || 'Verifying...' } />;
    }

    return <Text text = 'Please check your email to complete registration.' />;
};

VerifySignUp.propTypes = {
    doSignIn: PropTypes.func
};

const mapStateToProps = () => {
    return {};
};

const mapDispatchToProps = dispatch => {
    return {
        doSignIn: token => dispatch(signInSuccess(token))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(VerifySignUp);
