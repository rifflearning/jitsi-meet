import React from 'react';
import { Route, Switch } from 'react-router';

import * as ROUTES from '../../constants/routes';

import VerifyReset from './VerifyReset';
import VerifySignUp from './VerifySignUp';

export default () => (
    <Switch>
        <Route path = { `${ROUTES.VERIFY}${ROUTES.SIGNUP}` }>
            <VerifySignUp />
        </Route>
        <Route path = { `${ROUTES.VERIFY}${ROUTES.RESETPASSWORD}` }>
            <VerifyReset />
        </Route>
    </Switch>
);
