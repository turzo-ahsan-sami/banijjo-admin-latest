import React, { Component, lazy, Suspense } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Alert,
  Badge,
  Button,
  ButtonDropdown,
  ButtonGroup,
  ButtonToolbar,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardTitle,
  Col,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Progress,
  Row,
  Table,
} from 'reactstrap';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import { getStyle, hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities'
const base = process.env.REACT_APP_ADMIN_SERVER_URL;


class DashboardInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dropdownOpen: false,
      radioSelected: 2,
      dashboardPurchase: 0,
      dashboardSells: 0,
      dashboardStock: 0,
      dashboardDue: 0,
      isApproved: false
    };
    // localStorage.clear();

    console.log('DashboardInfo is loading..');
  }

  componentDidMount () {
    const userName = localStorage.getItem('userName');
    const userPassword = localStorage.getItem('userPassword');
    if(localStorage.getItem('userName')===null)
    {
      this.props.history.push("/login");
    }

    this.setState({
        isApproved : localStorage.user_status=='approved'?true:false
    })

    console.log('User Name : ', userName);
    console.log('User Password : ', userPassword);
  }

  render() {

    return (
      <div className="animated fadeIn">
        <Row>
            <Col xs="12" style={{backgroundColor: "#009345", color: "white", textAlign: "center", fontWeight: "bold"}}>
                Hey ! Your account need to get the approval from the admin !
            </Col>
        </Row>

      </div>
    );
  }
}

export default DashboardInfo;
