/* eslint-disable react/jsx-sort-props */
/* eslint-disable react/jsx-no-bind */

import { makeStyles } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import PropTypes from 'prop-types';
import React from 'react';

import { connect } from '../../base/redux';

import Header from './Header';
import Main from './Main';
import Sidebar from './Sidebar';

const useStyles = makeStyles(() => {
    return {
        root: {
            display: 'flex',
            backgroundColor: '#282725'
        }
    };
});

const App = ({ user }) => {
    const classes = useStyles();
    const [ isOpen, setIsOpen ] = React.useState(true);

    const handleSidebarOpen = () => {
        setIsOpen(true);
    };
    const handleSidebarClose = () => {
        setIsOpen(false);
    };

    const isSidebarEnabled = Boolean(user);

    return (
        <div className = { classes.root }>
            <CssBaseline />
            <Header
                handleSidebarOpen = { handleSidebarOpen }
                isOpen = { isOpen }
                isSidebarEnabled = { isSidebarEnabled } />
            {isSidebarEnabled && <Sidebar
                handleSidebarClose = { handleSidebarClose }
                isOpen = { isOpen } />}
            <Main />
        </div>
    );
};

App.propTypes = {
    user: PropTypes.object
};

const mapStateToProps = state => {
    return {
        user: state['features/riff-platform'].signIn.user
    };
};

export default connect(mapStateToProps)(App);
