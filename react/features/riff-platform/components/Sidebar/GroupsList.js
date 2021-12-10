/* eslint-disable react/jsx-sort-props */
/* eslint-disable react/jsx-no-bind */

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import SchoolIcon from '@material-ui/icons/School';
import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import * as ROUTES from '../../constants/routes';

export default () => {
    const history = useHistory();
    const { pathname } = useLocation();
    const isSelected = path => pathname === path;

    return (
        <div>
            <ListItem
                button = { true }
                onClick = { () => history.push(ROUTES.MEETINGS_HARVARD) }
                selected = { isSelected(ROUTES.MEETINGS_HARVARD) }>
                <ListItemIcon>
                    <SchoolIcon />
                </ListItemIcon>
                <ListItemText primary = 'Negotiations (winter)' />
            </ListItem>
        </div>
    );
};
