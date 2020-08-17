import React, { Component } from 'react';
import {Route , withRouter, Redirect} from 'react-router-dom';
import { Link, NavLink, history } from 'react-router-dom';
// import { hashHistory } from 'react-router;'
import { Badge, UncontrolledDropdown, DropdownItem, DropdownMenu, DropdownToggle, Nav, NavItem } from 'reactstrap';
import PropTypes from 'prop-types';
import cookie from 'react-cookies';

import { AppAsideToggler, AppNavbarBrand, AppSidebarToggler } from '@coreui/react';
import logo from '../../assets/img/brand/logo_head_left.png'
import minimize_log from '../../assets/img/brand/final_image.png'
import sygnet from '../../assets/img/brand/sygnet.svg'
const base = process.env.REACT_APP_ADMIN_SERVER_URL;

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class DefaultHeader extends Component {

  constructor(props) {
    super(props);

    this.state = {
      logout: '',
      notifications: 0,
      count_sales: 0,
      count_product: 0,
      count_vendor: 0,
    };

    this.handleNotification = this.handleNotification.bind(this);

    // this.handleLogout = this.handleLogout.bind(this);
    // localStorage.clear();
    // const userName = localStorage.getItem('userName');
    // const userPassword = localStorage.getItem('userPassword');
    // if(userName=== null && userPassword === null)
    // {
    //   // this.props.history.push("/login");
    //   window.location = '/login';
    // }
    // else {
    //   this.props.history.push("/dashboard");
    // }
  }


  componentDidMount () {
    const userName = localStorage.getItem('userName');
    const userPassword = localStorage.getItem('userPassword');
    if(userName=== null && userPassword === null)
    {
      // browserHistory.push("/login");
      window.location = '/login';
    }
    // else {
    //   // browserHistory.push("/dashboard");
    //   window.location = '/dashboard';
    // }

     // else if(!isApproved){
    //   console.log('Vendor NOt approved');
    // }

    fetch(base+`/api/notifications?id=${localStorage.employee_id}`, {
      method: 'GET'
    })
    .then(res => {
      console.log(res);
      return res.json()
    })
    .then(notification => {
      console.log('total_notification : ',notification.total_notification);

      if (notification.success == true) {
          if (localStorage.user_type == 'vendor') {
              this.setState({
                  notifications: notification.vendor_notification,
                  count_sales: notification.vendor_notification
              });
          }
          else {
              this.setState({
                  notifications: notification.total_notification,
                  count_sales: notification.count_salaes,
                  count_product: notification.count_product,
                  count_vendor: notification.count_vendor,
              });
          }
      }
      else {
          console.log('Error : ', notification.error);
      }

      return false;
    });

  }

  handleNotification (event) {
      if (event.target.dataset['name'] == 'sales') {
          window.location = '/sales/sales';
      }
      else if (event.target.dataset['name'] == 'product') {
          window.location = '/product/products';
      }
      else if (event.target.dataset['name'] == 'vendor') {
          window.location = '/create-users/vendor-create';
      }
  }

  handleLogout (event) {
    // event.preventDefault();

    console.log('Handle Logout', event);
    console.log('User Name : ', localStorage.userName);

    fetch(base+`/api/user-logout/?id=${localStorage.userName}` , {
      method: "get"
    })
    .then((result) => result.json())
    .then((info) => {
      if (info.success == true) {
        console.log('Success : ', info.success);

        localStorage.clear();

        cookie.remove('token');
        cookie.remove('issuedAt');
        cookie.remove('expiresIn');

        setTimeout(
          function() {
            window.location = '/login';
            // return <Redirect to={{pathname: '/login'}} push={true}/>
            // this.props.history.push("/login");
            // hashHistory.push('/login')
          }
          .bind(this),
          1000
        );
      }
      else {
        console.log(info.success);

        localStorage.clear();

        setTimeout(
          function() {
            window.location = '/login';
            // return <Redirect to={{pathname: '/login'}} push={true}/>
            // this.props.history.push("/login");
            // hashHistory.push('/login')
          }
          .bind(this),
          1000
        );
      }

    })

  }

  handleProfile (event) {
    console.log(event.currentTarget.dataset['id']);

    // return  <Redirect  to="/create-users/user-profile" />
    this.props.history.push('/create-users/user-profile');
  }

  render() {

    // eslint-disable-next-line
    const { children, ...attributes } = this.props;

    return (
      <React.Fragment>
        <AppSidebarToggler className="d-lg-none" display="md" mobile />
        <AppNavbarBrand
          full={{ src: logo, width: 80, height: 50, alt: 'CoreUI Logo' }}
          minimized={{ src: minimize_log, width: 30, height: 30, alt: 'CoreUI Logo' }}
          href="http://banijjo.com" target="_blank" rel="noopener noreferrer"
        />
        <AppSidebarToggler className="d-md-down-none" display="lg" />

        <Nav className="d-md-down-none" navbar>
          <NavItem className="px-3">
            <NavLink to="/dashboard" className="nav-link" >Dashboard</NavLink>
          </NavItem>
          {/* <NavItem className="px-3">
            <Link to="/users" className="nav-link">Users</Link>
          </NavItem> */}
          <NavItem className="px-3">
            <NavLink to="#" className="nav-link">Settings</NavLink>
          </NavItem>
        </Nav>
        <Nav className="ml-auto" navbar>
          {/* <NavItem className="d-md-down-none">
            <NavLink to="#" className="nav-link"><i className="icon-bell"></i><Badge pill color="danger"> {this.state.notifications} </Badge></NavLink>
          </NavItem> */}

          <UncontrolledDropdown nav direction="down">
            <DropdownToggle nav>
              <i className="icon-bell"></i><Badge pill style={{backgroundColor: "red", color: "white"}}> {this.state.notifications} </Badge>
            </DropdownToggle>
            {
                localStorage.user_type === 'vendor' ?
                <DropdownMenu right>
                    <DropdownItem data-name={'sales'} onClick={this.handleNotification.bind(this)}>Sales <Badge pill style={{color: "red"}}> {this.state.count_sales} </Badge> </DropdownItem>
                </DropdownMenu>
                :
                <DropdownMenu right>
                    <DropdownItem data-name={'vendor'} onClick={this.handleNotification.bind(this)}>Vendor <Badge pill style={{color: "red"}}> {this.state.count_vendor} </Badge> </DropdownItem>
                    <DropdownItem data-name={'product'} onClick={this.handleNotification.bind(this)}>Product <Badge pill style={{color: "red"}}> {this.state.count_product} </Badge> </DropdownItem>
                    <DropdownItem data-name={'sales'} onClick={this.handleNotification.bind(this)}>Sales <Badge pill style={{color: "red"}}> {this.state.count_sales} </Badge> </DropdownItem>
                </DropdownMenu>
            }
          </UncontrolledDropdown>

          <NavItem className="d-md-down-none">
            <NavLink to="#" className="nav-link"><i className="icon-list"></i></NavLink>
          </NavItem>
          <NavItem className="d-md-down-none">
            <NavLink to="#" className="nav-link"><i className="icon-location-pin"></i></NavLink>
          </NavItem>
          <UncontrolledDropdown nav direction="down">
            <DropdownToggle nav>
              <img src={'../../assets/img/avatars/profile_demo_image_polished.png'} className="img-avatar" alt="Profile Options" />
            </DropdownToggle>
            <DropdownMenu right>
              {/* <DropdownItem header tag="div" className="text-center"><strong>Account</strong></DropdownItem>
              <DropdownItem><i className="fa fa-bell-o"></i> Updates<Badge color="info">42</Badge></DropdownItem>
              <DropdownItem><i className="fa fa-envelope-o"></i> Messages<Badge color="success">42</Badge></DropdownItem>
              <DropdownItem><i className="fa fa-tasks"></i> Tasks<Badge color="danger">42</Badge></DropdownItem>
              <DropdownItem><i className="fa fa-comments"></i> Comments<Badge color="warning">42</Badge></DropdownItem>
              <DropdownItem header tag="div" className="text-center"><strong>Settings</strong></DropdownItem> */}
              <DropdownItem data-id={localStorage.employee_id} onClick={this.handleProfile.bind(this)}><i className="fa fa-user"></i> Profile</DropdownItem>
              <DropdownItem><i className="fa fa-wrench"></i> Settings</DropdownItem>
              {/* <DropdownItem><i className="fa fa-usd"></i> Payments<Badge color="secondary">42</Badge></DropdownItem> */}
              {/* <DropdownItem><i className="fa fa-file"></i> Projects<Badge color="primary">42</Badge></DropdownItem> */}

              {/* <DropdownItem><i className="fa fa-shield"></i> Lock Account</DropdownItem> */}
              <DropdownItem onClick={this.handleLogout.bind(this) /*</DropdownMenu>e => this.props.onLogout(e)*/}><i className="fa fa-lock"></i> Logout</DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </Nav>
        <AppAsideToggler className="d-md-down-none" />
        {/*<AppAsideToggler className="d-lg-none" mobile />*/}
      </React.Fragment>
    );
  }
}

DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

export default withRouter(DefaultHeader);
