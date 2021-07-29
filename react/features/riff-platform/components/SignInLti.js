/* eslint-disable react/jsx-boolean-value */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/jsx-sort-props */

import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';

import { connect } from '../../base/redux';
import { signInLtiSuccess } from '../actions/signIn';
import * as ROUTES from '../constants/routes';

const SignInLti = ({ doLtiLogin }) => {
    const location = useLocation();
    const history = useHistory();

    useEffect(() => {

        const queryParams = new URLSearchParams(location.search);
        const displayName = queryParams.get('name');
        const email = queryParams.get('email');
        const uid = queryParams.get('uid');
        const meetingId = queryParams.get('meetingId');
        const token = queryParams.get('jwtToken');

        const navigateToRoomName = () => history.push(`${ROUTES.WAITING}/${meetingId}`);

        const user = { uid,
            email,
            displayName };

        doLtiLogin(user, token, navigateToRoomName);
    }, []);

    return (
        <div>
            In progress ...
        </div>
    );
};

SignInLti.propTypes = {
    doLtiLogin: PropTypes.func
};

const mapStateToProps = () => {
    return {};
};

const mapDispatchToProps = dispatch => {
    return {
        doLtiLogin: (user, token, navigateToRoomName) => dispatch(signInLtiSuccess(user, token, navigateToRoomName))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignInLti);
