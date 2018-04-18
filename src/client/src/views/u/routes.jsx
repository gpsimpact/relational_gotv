import React from 'react';
import { Route, Switch, Redirect } from 'react-router';
import FourOhFour from '../routes/404';
import { isLoggedIn, extractOrgs } from '../../utils/auth';
import UserAllowedOrgs from './UserAllowedOrgs';
import UserHome from './UserHome';
import Settings from './Settings';

export const Routes = () => {
  if (isLoggedIn()) {
    const orgs = extractOrgs();
    return (
      <Switch>
        <Route
          exact
          path="/u/"
          render={() => {
            if (orgs.length > 1) {
              return <UserAllowedOrgs orgs={orgs} />;
            }
            return <Redirect to={`/u/${orgs[0]}`} />;
          }}
        />
        <Route exact path="/u/settings" component={Settings} />
        <Route exact path="/u/:orgSlug" component={UserHome} />
        <Route component={FourOhFour} />
      </Switch>
    );
  }
  return <Redirect to="/login" />;
};

// <Route exact path="/u/:orgSlug" component={UserHome} />
//   <Route exact path="/u/pv/:pvid" component={PvIndex} />
