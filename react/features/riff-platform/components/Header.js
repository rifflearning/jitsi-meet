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
