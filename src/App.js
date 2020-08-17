import React, { Component } from 'react';
import { BrowserRouter, HashRouter, Redirect, Route, Switch } from 'react-router-dom';
// import { renderRoutes } from 'react-router-config';
import cookie from 'react-cookies';
import Rogister from './views/Pages/Rogistar';
import {ToastsContainer, ToastsStore} from 'react-toasts';

import './App.scss';

// import RouteAuth from './views/Authentication/RouteAuth';

import {logoutFunction} from './views/DynamicLogout/Logout';

const loading = () => <div className="animated fadeIn pt-3 text-center">Loading...</div>;

// Containers
const DefaultLayout = React.lazy(() => import('./containers/DefaultLayout'));

// Pages
const Login = React.lazy(() => import('./views/Pages/Login'));
const Register = React.lazy(() => import('./views/Pages/Register'));
const ResetPassword = React.lazy(() => import('./views/Pages/ResetPassword'));
const Page404 = React.lazy(() => import('./views/Pages/Page404'));
const Page500 = React.lazy(() => import('./views/Pages/Page500'));

// src\views\ResetPasssword\ResetPassword.js

const PrivateRoute = ({ component: Component, ...props }) => {
  let myAuth = true;

  console.log('Private Route Working .....');

  if (document.cookie.indexOf('token') !== -1) {

    let issuedAt = cookie.load('issuedAt');
    let expiresIn = cookie.load('expiresIn');
    let currentTime = Date.now();
    let compare = Number(issuedAt) + Number(expiresIn);

    console.log('Compare Value : ' + compare + ' Current Time : ' + currentTime);

    if (compare <= currentTime) {

      ToastsStore.warning('Your session is expired. PLease Login again !');

      logoutFunction(cookie.load('userId'));

      return (null);

      // return (
      //   <Route
      //     {...props}
      //     render={innerProps =>
      //       myAuth ?
      //           <Component {...innerProps} />
      //           :
      //           <Redirect to="/login" />
      //     }
      //   />
      // );
    }
    else {

      return (
        <Route
          {...props}
          render={innerProps =>
            myAuth ?
                <Component {...innerProps} />
                :
                <Redirect to="/" />
          }
        />

      );
    }

  }
  else {

    return (
      <Route
        {...props}
        render={innerProps =>
          myAuth ?
              <Component {...innerProps} />
              :
              <Redirect to="/login" />
        }
      />
    );

  }


};

class App extends Component {

  componentDidMount() {
    console.log('Working App.js .....');
  }



  render() {
    return (
      <BrowserRouter>
          <React.Suspense fallback={loading()}>
            <ToastsContainer store={ToastsStore}/>
            <Switch>
              <Route exact path="/login" name="Login Page" render={props => <Login {...props}/>} />
              <Route exact path="/register" name="Register Page" render={props => <Register {...props}/>} />
              <Route exact path="/resetpassword/:email" name="Reset Password" render={props => <ResetPassword {...props}/>} />
              <Route exact path="/rogister" name="Rogister Page" render={props => <Rogister {...props}/>} />
              <Route exact path="/404" name="Page 404" render={props => <Page404 {...props}/>} />
              <Route exact path="/500" name="Page 500" render={props => <Page500 {...props}/>} />

              {/* <Route path="/" name="Home" render={props => <DefaultLayout {...props}/>} /> */}
              <PrivateRoute path="/" name="Home" component={DefaultLayout} />
              {/* <Route exact path="/" name="Login Page" render={props => <Login {...props}/>} /> */}
            </Switch>
          </React.Suspense>
      </BrowserRouter>
    );
  }
}

export default App;
