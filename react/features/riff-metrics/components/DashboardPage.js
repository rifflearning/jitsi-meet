/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-native/no-color-literals */
import { createBrowserHistory } from 'history';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { Router } from 'react-router';

import { connect } from '../../base/redux';
import { getMeetingData } from '../actions';

import { SpeakingTime } from './Dashboard/Metrics';
import { NavBar } from './NavBar';

const browserHistory = createBrowserHistory();

const DashboardPage = ({ getData }) => {
    useEffect(() => {
        getData();
    }, []);

    return (
        <div
            style = {{
                backgroundColor: '#ffffff',
                minHeight: '100vh',
                width: '100vw',
                position: 'absolute',
                left: 0,
                top: 0 }}>
            <Router history = { browserHistory }>
                <NavBar activeRoute = '/riffs' />
            </Router>

            <div
                style = {{ height: '70vh',
                    width: '50vw' }}>
                <SpeakingTime
                    eventTypes = { [] }
                    graphType = 'speaking_time' />
            </div>
        </div>
    );
};

const mapStateToProps = () => {
    return {};
};

const mapDispatchToProps = dispatch => {
    return {
        getData: () => dispatch(getMeetingData())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DashboardPage);

DashboardPage.propTypes = {
    getData: PropTypes.func.isRequired
};
