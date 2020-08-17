import React, { Component, Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import * as router from 'react-router-dom';
import { Container } from 'reactstrap';

import {
  AppAside,
  AppFooter,
  AppHeader,
  AppSidebar,
  AppSidebarFooter,
  AppSidebarForm,
  AppSidebarHeader,
  AppSidebarMinimizer,
  AppBreadcrumb2 as AppBreadcrumb,
  AppSidebarNav2 as AppSidebarNav,
} from '@coreui/react';
// sidebar nav config
import navigation from '../../_nav';
import navigationVendor from '../../_navVendor';
// routes config
import routes from '../../routes';
import banijjoNav from './banijjo.css';
import './AnchorTag.css'

const DefaultAside = React.lazy(() => import('./DefaultAside'));
const DefaultFooter = React.lazy(() => import('./DefaultFooter'));
const DefaultHeader = React.lazy(() => import('./DefaultHeader'));
const isAuth = localStorage.user_status=="approved"?true:false;
const waitingAuth = localStorage.user_status=="completed"?true:false;
const userType = localStorage.user_type;
const userStatus = localStorage.user_status;

class DefaultLayout extends Component {
  constructor(props) {
    super(props);

    console.log('Default layout loading..');
    if(!isAuth){
        if (!waitingAuth) {
            this.props.history.push("/rogister");
        }
    }

  }
  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>
  waiting = () => <div className="animated fadeIn pt-1 text-center">Please wait...</div>

  signOut(e) {
    e.preventDefault()
    this.props.history.push('/login')
  }

  render() {
    return (
      <div className="app">
        <AppHeader fixed>
          <Suspense  fallback={this.loading()}>
            <DefaultHeader/>
          </Suspense>
        </AppHeader>
        <div className="app-body">
          <AppSidebar fixed display="lg">
            <AppSidebarHeader />
            <AppSidebarForm />
            <Suspense>
              {
                userType == 'super_admin'?
                <AppSidebarNav navConfig={navigation} {...this.props} router={router}/>
                :
                userType == 'admin'?
                <AppSidebarNav navConfig={navigation} {...this.props} router={router}/>
                :
                userType == 'admin_manager'?
                <AppSidebarNav navConfig={navigation} {...this.props} router={router}/>
                :
                <AppSidebarNav navConfig={navigationVendor} {...this.props} router={router}/>
              }
            </Suspense>
            {/* <AppSidebarFooter /> */}
            <AppSidebarMinimizer />
          </AppSidebar>
          <main className="main">
            <AppBreadcrumb appRoutes={routes} router={router} className="homeTag"/>
            <Container fluid>
                {
                    isAuth == true ?
                        <Suspense fallback={this.loading()}>
                          <Switch>
                            {
                              routes.map((route, idx) => {
                                // if(isAuth){
                                  if (userType == 'super_admin' || userType == 'admin' || userType == 'admin_manager') {
                                    return route.component ? (

                                      <Route
                                          key={idx}
                                          path={route.path}
                                          exact={route.exact}
                                          name={route.name}
                                          render={props => (
                                          <route.component {...props} />
                                          )} />
                                    ) : (null);
                                  }
                                  else if (userType == 'vendor' && userStatus == 'approved' && (route.name == 'Products' || route.name == 'Dashboard' || route.name == 'Purchase' || route.name == 'ProductSpecificationDetails' || route.name == 'User Profile' || route.name == 'Discount' || route.name == 'Sales Info')) {
                                    return route.component ? (

                                      <Route
                                          key={idx}
                                          path={route.path}
                                          exact={route.exact}
                                          name={route.name}
                                          render={props => (
                                          <route.component {...props} />
                                          )} />
                                    ) : (null);
                                  }
                                  else if (userType == 'delivery_man' && (route.name == 'Dashboard')) {
                                    return route.component ? (

                                      <Route
                                          key={idx}
                                          path={route.path}
                                          exact={route.exact}
                                          name={route.name}
                                          render={props => (
                                          <route.component {...props} />
                                          )} />
                                    ) : (null);
                                  }
                                // }
                            })
                            }
                            <Redirect from="/" to="/dashboard" />
                          </Switch>
                        </Suspense>
                    :
                    <Suspense fallback={this.loading()}>
                      <Switch>
                            {
                                routes.map((route, idx) => {
                                  if (userType == 'vendor' && userStatus == 'completed' && route.name == 'DashboardInfo' ) {
                                    return route.component ? (

                                      <Route
                                          key={idx}
                                          path={route.path}
                                          exact={route.exact}
                                          name={route.name}
                                          render={props => (
                                          <route.component {...props} />
                                          )} />
                                    ) : (null);
                                  }
                                })
                            }
                          <Redirect from="/" to="/DashboardInfo" />
                      </Switch>
                    </Suspense>
                }

            </Container>
          </main>
          <AppAside fixed>
            <Suspense fallback={this.loading()}>
              <DefaultAside />
            </Suspense>
          </AppAside>
        </div>
        <AppFooter>
          <Suspense fallback={this.loading()}>
            <DefaultFooter />
          </Suspense>
        </AppFooter>
      </div>
    );
  }
}

export default DefaultLayout;
