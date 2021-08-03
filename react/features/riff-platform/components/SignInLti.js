/* eslint-disable react/jsx-boolean-value */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/jsx-sort-props */

import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';

import { connect } from '../../base/redux';
import { meetingSuccess } from '../actions/meeting';
import { signInLtiSuccess } from '../actions/signIn';
import * as ROUTES from '../constants/routes';

const SignInLti = ({ doLtiLogin, setMeeting }) => {
    const location = useLocation();
    const history = useHistory();

    useEffect(() => {

        const queryParams = new URLSearchParams(location.search);
        const displayName = queryParams.get('name');
        const email = queryParams.get('email');
        const uid = queryParams.get('uid');
        const roomName = queryParams.get('roomName');
        const token = queryParams.get('jwtToken');

        const meetingMock = {
            _id: '6107deef54a329525c0283bc',
            roomId: roomName,
            name: roomName
        };

        const navigateToRoomName = () => history.push(`${ROUTES.WAITING}/${meetingMock._id}-${meetingMock.roomId}`);

        const user = { uid,
            email,
            displayName,
            isLti: true
        };

        setMeeting(meetingMock);
        doLtiLogin(user, token, navigateToRoomName);
    }, []);

    return (
        <div> In progress </div>
    );
};

SignInLti.propTypes = {
    doLtiLogin: PropTypes.func,
    setMeeting: PropTypes.func
};

const mapStateToProps = () => {
    return {};
};

const mapDispatchToProps = dispatch => {
    return {
        doLtiLogin: (user, token, navigateToRoomName) => dispatch(signInLtiSuccess(user, token, navigateToRoomName)),
        setMeeting: meeting => dispatch(meetingSuccess(meeting))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignInLti);
