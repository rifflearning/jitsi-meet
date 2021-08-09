import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';

import api from '../../api';

import NewPasswordForm from './NewPasswordForm';
import Text from './Text';

export default () => {
    const [ state, setstate ] = useState('');
    const history = useHistory();
    const urlParams = new URLSearchParams(history.location.search);
    const token = urlParams.get('token');
    const [ isTokenValid, setIsTokenValid ] = useState(false);

    useEffect(() => {
        if (token) {
            api.resetPasswordVerify({ token })
                .then(() => {
                    setIsTokenValid(true);
                })
                .catch(err => {
                    console.error(err);
                    setstate('Link has expired');
                });
        }
    }, []);

    if (token) {
        return <>
            {isTokenValid
                ? <NewPasswordForm token = { token } />
                : <Text text = { state || 'Verifying...' } />}
        </>;
    }

    return <Text text = 'Please check your email to reset your password.' />;
};
