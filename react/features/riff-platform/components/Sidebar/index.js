/* global process */
/* eslint-disable react/jsx-sort-props */
/* eslint-disable react/jsx-no-bind */

import { makeStyles } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';

import GroupsList from './GroupsList';
import MainListItems from './ListItems';

export const drawerWidth = 240;

const useStyles = makeStyles(theme => {
    return {
        toolbarIcon: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 8px',
            ...theme.mixins.toolbar
        },
        drawerPaper: {
            position: 'relative',
            whiteSpace: 'nowrap',
            width: drawerWidth,
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen
            })
        },
        drawerPaperClose: {
            overflowX: 'hidden',
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen
            }),
            width: theme.spacing(7),
            [theme.breakpoints.up('sm')]: {
                width: theme.spacing(9)
            }
        }
    };
});

const Sidebar = ({ handleSidebarClose, isOpen }) => {
    const classes = useStyles();

    const drawerClass = {
        paper: clsx(classes.drawerPaper, !isOpen && classes.drawerPaperClose)
    };

    return (
        <Drawer
            variant = 'permanent'
            classes = { drawerClass }
            open = { isOpen }>
            <div className = { classes.toolbarIcon }>
                <img
                    src = '/images/watermark.png'
                    height = '54' />
                <IconButton onClick = { handleSidebarClose }>
                    <ChevronLeftIcon />
                </IconButton>
            </div>
            <Divider />
            <List><MainListItems /></List>
            <Divider />
            {process.env.DISABLE_GROUPS !== 'true'
                && <List><GroupsList /></List>
            }
        </Drawer>
    );
};

Sidebar.propTypes = {
    handleSidebarClose: PropTypes.func,
    isOpen: PropTypes.bool
};

export default Sidebar;

