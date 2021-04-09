/* global process */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable react/jsx-sort-props */
/* eslint-disable react/no-multi-comp */

import { makeStyles } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import PropTypes from 'prop-types';
import React from 'react';
import {
    Switch,
    Route, Redirect
} from 'react-router-dom';

import { connect } from '../../base/redux';
import DashboardPage from '../../riff-dashboard-page/src/dashboard-page';
import * as ROUTES from '../constants/routes';

import EditMeeting from './EditMeeting';
import Footer from './Footer';
import Join from './Join';
import Meeting from './Meeting';
import MeetingEndedPage from './MeetingEndedPage';
import AllMeetings from './Meetings';
import Profile from './Profile';
import ResetPassword from './ResetPassword';
import Scheduler from './Scheduler';
import SignIn from './SignIn';
import SignUp from './SignUp';
import Verify from './Verify';
import Waiting from './Waiting';

const useStyles = makeStyles(theme => {
    return {
        appBarSpacer: theme.mixins.toolbar,
        content: {
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column'
        },
        container: {
            paddingTop: theme.spacing(4),
            paddingBottom: theme.spacing(4),
            flex: 1,
            display: 'flex',
            flexDirection: 'column'
        },
        mainContainer: {
            flex: 1
        }
    };
});

// eslint-disable-next-line require-jsdoc
function Meetings() {
    return (
        <Switch>
            <Route
                exact = { true }
                path = { ROUTES.MEETINGS } >
                <AllMeetings />
            </Route>
            <Switch>
                <Route
                    exact = { true }
                    path = { `${ROUTES.MEETINGS}/:meetingId` }>
                    <Meeting />
                </Route>
                <Route path = { `${ROUTES.MEETINGS}/:meetingId/edit` } >
                    <EditMeeting />
                </Route>
            </Switch>
        </Switch>
    );
}

const Main = ({ user }) => {
    const classes = useStyles();

    const loggedInRoutes = (
        <Switch>
            <Route
                exact = { true }
                path = { ROUTES.PROFILE } >
                <Profile />
            </Route>
            <Route
                component = { DashboardPage }
                path = { ROUTES.DASHBOARD } />
            <Route
                path = { ROUTES.MEETINGS }
                component = { Meetings } />
            {process.env.DISABLE_GROUPS !== 'true'
                && <Route
                    path = { ROUTES.MEETINGS_HARVARD }
                    // eslint-disable-next-line react/jsx-no-bind
                    component = { () => <AllMeetings isGroup = { true } /> } />
            }
            <Route path = { ROUTES.SCHEDULE } >
                <Scheduler />
            </Route>
            <Redirect to = { ROUTES.PROFILE } />
        </Switch>
    );

    const authRoutes = (
        <Switch>
            <Route
                path = { ROUTES.SIGNIN } >
                <SignIn />
            </Route>
            <Route
                path = { ROUTES.SIGNUP } >
                <SignUp />
            </Route>
            <Route
                path = { ROUTES.VERIFY } >
                <Verify />
            </Route>
            <Route path = { ROUTES.RESETPASSWORD } >
                <ResetPassword />
            </Route>
            <Route path = { ROUTES.MEETING_ENDED } >
                <MeetingEndedPage />
            </Route>
            <Redirect to = { ROUTES.SIGNIN } />
        </Switch>
    );

    return (
        <main className = { classes.content }>
            <div className = { classes.appBarSpacer } />
            <Container
                maxWidth = 'lg'
                className = { classes.container }>
                <div className = { classes.mainContainer }>
                    <Switch>
                        <Route
                            exact = { true }
                            path = { ROUTES.JOIN } >
                            <Join />
                        </Route>
                        <Route path = { `${ROUTES.WAITING}/:meetingId` } >
                            <Waiting />
                        </Route>

                        {user ? loggedInRoutes : authRoutes}
                    </Switch>
                </div>
                <Box pt = { 4 }>
                    <Footer />
                </Box>
            </Container>
        </main>
    );
};

Main.propTypes = {
    user: PropTypes.object
};

const mapStateToProps = state => {
    return {
        user: state['features/riff-platform'].signIn.user
    };
};

export default connect(mapStateToProps)(Main);
