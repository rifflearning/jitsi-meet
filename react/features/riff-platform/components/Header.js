/* eslint-disable react/jsx-sort-props */
/* eslint-disable react/jsx-no-bind */

import { Avatar, Button, makeStyles } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';
import { useHistory } from 'react-router';

import { connect } from '../../base/redux';
import { logout } from '../actions/signIn';
import * as ROUTES from '../constants/routes';

import { drawerWidth } from './Sidebar';
window.config.clientNode = 'https://0.0.0.0:8080';

const useStyles = makeStyles(theme => {
    return {
        toolbar: {
            paddingRight: 24 // keep right padding when drawer closed
        },
        appBar: {
            zIndex: theme.zIndex.drawer + 1,
            transition: theme.transitions.create([ 'width', 'margin' ], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen
            })
        },
        appBarShift: {
            marginLeft: drawerWidth,
            width: `calc(100% - ${drawerWidth}px)`,
            transition: theme.transitions.create([ 'width', 'margin' ], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen
            })
        },
        menuButton: {
            marginRight: 36
        },
        menuButtonHidden: {
            display: 'none'
        },
        title: {
            flexGrow: 1
        }
    };
});


const Header = ({ handleSidebarOpen, isOpen, user, doLogout }) => {
    const classes = useStyles();
    const history = useHistory();

    const style = {
        display: 'flex',
        alignItems: 'center'
    };

    const isSidebarEnabled = Boolean(user);
//just for LTI testing
    const tryLtiLogin = () => {
        const API_GATEWAY_LINK = process.env.API_GATEWAY;
        const body = {
            context_id: 'course-v1:esme-learning+RIFF+RIFF',
            context_label: 'esme-learning',
            context_title: 'RIFF TEST',
            custom_cohort_id: '397',
            custom_cohort_name: '6103f3d60760b8633aff006e',
            custom_component_display_name: '\'Staging RiffEdu Communications\'',
            custom_team_id: '',
            custom_team_name: '',
            custom_user_id: '62178',
            launch_presentation_locale: 'en',
            launch_presentation_return_url: '',
            lis_person_contact_email_primary: 'devin@esmelearning.com',
            lis_person_name_family: 'Chaloux',
            lis_person_name_full: 'Devin Chaloux',
            lis_person_name_given: 'Devin',
            lis_person_sourcedid: 'DevinChaloux',
            lis_result_sourcedid: 'course-v1%3Aesme-learning%2BRIFF%2BRIFF:tahoe.appsembler.com-df3e770ad298463589e44869320caf99:ecce9f3a276c101cb5e84ce76fa38903',
            lti_message_type: 'basic-lti-launch-request',
            lti_version: 'LTI-1p0',
            oauth_callback: 'about:blank',
            oauth_consumer_key: 'testing-appsembler_8061',
            oauth_nonce: '2df7aea9b234f090bebbc8686583a2a2',
            oauth_signature: 'vH0PqYQ7HQ6jFeOdvleMcFy5qE8%3D',
            oauth_signature_method: 'HMAC-SHA1',
            oauth_timestamp: '1627400671',
            oauth_version: '1.0',
            resource_link_id: 'tahoe.appsembler.com-df3e770ad298463589e44869320caf99',
            roles: 'Administrator',
            user_id: 'ecce9f3a276c101cb5e84ce76fa38903',
            manualRedirect: 'true'
        };

        fetch(`${API_GATEWAY_LINK}/lti/launch/test`, {
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            method: 'POST',
            body: JSON.stringify(body)
        })
            .then(response => response.json())
            .then(res =>
                history.push(`${res.url}`))
        .catch(err => {
            console.log('err.status', err.status);
            console.log('err keys', Object.keys(err));
        });


        // /return await r.json();
    };

    return (
        <div>
            <CssBaseline />
            <AppBar
                position = 'absolute'
                className = { clsx(classes.appBar, isSidebarEnabled && isOpen && classes.appBarShift) }>
                <Toolbar className = { classes.toolbar }>
                    {isSidebarEnabled
                        && <IconButton
                            edge = 'start'
                            aria-label = 'open drawer'
                            onClick = { handleSidebarOpen }
                            className = {
                                clsx(classes.menuButton, isSidebarEnabled && isOpen && classes.menuButtonHidden)
                            }>
                            <MenuIcon />
                        </IconButton>
                    }
                    <Typography
                        component = 'p'
                        variant = 'h6'
                        color = 'inherit'
                        noWrap = { true }
                        className = { classes.title }>
                        RiffAnalytics
                    </Typography>
                    <div
                        style = { style }>
                        <Button
                            onClick = { () => tryLtiLogin() }
                            variant = 'outlined'>Try LTI Login </Button>
                        {isSidebarEnabled
                            && <Button onClick = { () => history.push(ROUTES.SCHEDULE) }>Schedule a meeting</Button>}
                        <Button onClick = { () => history.push(ROUTES.JOIN) }>Join a meeting</Button>
                        {/* <Button onClick={() => history.push(ROUTES.WAITING)}>Host a meeting</Button> */}
                        {!isSidebarEnabled
                            && <>
                                <Button onClick = { () => history.push(ROUTES.SIGNIN) }>Sign In</Button>
                                <Button
                                    onClick = { () => history.push(ROUTES.SIGNUP) }
                                    variant = 'outlined'>Sign Up</Button>
                            </>
                        }
                        {user?.isAnon
                            && <>
                                <Button
                                    onClick = { doLogout }
                                    variant = 'outlined'>Register</Button>
                            </>
                        }
                        {isSidebarEnabled
                            && <IconButton
                                color = 'inherit'
                                onClick = { () => history.push(ROUTES.PROFILE) }>
                                <Avatar
                                    alt = 'Me'
                                    src = '' />
                            </IconButton>
                        }
                    </div>
                </Toolbar>
            </AppBar>
        </div>
    );
};

Header.propTypes = {
    doLogout: PropTypes.func,
    handleSidebarOpen: PropTypes.func,
    isOpen: PropTypes.bool,
    user: PropTypes.object
};

const mapStateToProps = state => {
    return {
        user: state['features/riff-platform'].signIn.user
    };
};

const mapDispatchToProps = dispatch => {
    return {
        doLogout: () => dispatch(logout())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
