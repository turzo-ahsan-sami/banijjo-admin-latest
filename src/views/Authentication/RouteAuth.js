import React, { Component }  from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import cookie from 'react-cookies';

import {logoutFunction} from '../../views/DynamicLogout/Logout';

const RouteAuth = ({ component: Component, ...props }) => {
  let myAuth = true;
  console.log('Route Auth executing');
  return (
    <Route
      {...props}
      render={innerProps =>
        myAuth == true ?
            <Component {...innerProps} />
            :
            <Redirect to="/login" />
      }
    />
  );
};

// class RouteAuth extends Component {
//   constructor(props) {
//     super(props);
//   }
//
//
//
// }
//
export default RouteAuth;
