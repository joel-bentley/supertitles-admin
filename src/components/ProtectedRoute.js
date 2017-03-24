import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { isAuthenticated } from '../util/firebase';

const ProtectedRoute = ({ component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      isAuthenticated()
        ? React.createElement(component, props)
        : <Redirect
            to={{
              pathname: '/login',
            }}
          />}
  />
);

export default ProtectedRoute;
