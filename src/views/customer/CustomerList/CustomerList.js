import React, { Component } from 'react';
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Pagination, PaginationItem, PaginationLink, Table,
  Collapse,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Fade,
  Form,
  FormGroup,
  FormText,
  FormFeedback,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupButtonDropdown,
  InputGroupText,
  Label,
  Row,
} from 'reactstrap';

import Dropdowns from '../../Base/Dropdowns';

class CustomerList extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.toggleFade = this.toggleFade.bind(this);
    this.state = {
      dropdownOpen: new Array(6).fill(false),
      collapse: true,
      fadeIn: true,
      timeout: 300
    };
  }

  toggle() {
    this.setState({ collapse: !this.state.collapse });
  }

  toggleFade() {
    this.setState((prevState) => { return { fadeIn: !prevState }});
  }

  toggle(i) {
    const newArray = this.state.dropdownOpen.map((element, index) => {
      return (index === i ? !element : false);
    });
    this.setState({
      dropdownOpen: newArray,
    });
  }

  render() {

    return (
      <Row>
        <Col md="12">
          <Card>
            <CardHeader>

              <Row>
                <Col md="6"><i className="fa fa-align-justify"></i> Customer List</Col>
                <Col md="6">
                  <Dropdown isOpen={this.state.dropdownOpen[0]} toggle={() => {
                    this.toggle(0);
                  }}>

                    <DropdownToggle caret>
                      Sort By Status Wise
                    </DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem header>Select</DropdownItem>
                      {/* <DropdownItem disabled>Action</DropdownItem> */}
                      <DropdownItem>All</DropdownItem>
                      {/* <DropdownItem divider /> */}
                      <DropdownItem>Active</DropdownItem>
                      <DropdownItem>Inactive</DropdownItem>
                    </DropdownMenu>

                  </Dropdown>
                </Col>
              </Row>
              
            </CardHeader>
            <CardBody>
              <Table responsive bordered>
                <thead>
                <tr>
                  <th>Customer Name</th>
                  <th>Email</th>
                  <th>Address</th>
                  <th>Phone Number</th>
                  <th>Status</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <td>Pompeius René</td>
                  <td>N/A</td>
                  <td>N/A</td>
                  <td>N/A</td>
                  <td>
                    <Badge color="success">Active</Badge>
                  </td>
                </tr>
                <tr>
                  <td>Paĉjo Jadon</td>
                  <td>N/A</td>
                  <td>N/A</td>
                  <td>N/A</td>
                  <td>
                    <Badge color="success">Active</Badge>
                  </td>
                </tr>
                <tr>
                  <td>Micheal Mercurius</td>
                  <td>N/A</td>
                  <td>N/A</td>
                  <td>N/A</td>
                  <td>
                    <Badge color="success">Active</Badge>
                  </td>
                </tr>
                <tr>
                  <td>Ganesha Dubhghall</td>
                  <td>N/A</td>
                  <td>N/A</td>
                  <td>N/A</td>
                  <td>
                    <Badge color="danger">Inactive</Badge>
                  </td>
                </tr>
                <tr>
                  <td>Hiroto Šimun</td>
                  <td>N/A</td>
                  <td>N/A</td>
                  <td>N/A</td>
                  <td>
                    <Badge color="success">Active</Badge>
                  </td>
                </tr>
                </tbody>
              </Table>
              <Pagination>
                <PaginationItem><PaginationLink previous tag="button">Prev</PaginationLink></PaginationItem>
                <PaginationItem active>
                  <PaginationLink tag="button">1</PaginationLink>
                </PaginationItem>
                <PaginationItem className="page-item"><PaginationLink tag="button">2</PaginationLink></PaginationItem>
                <PaginationItem><PaginationLink tag="button">3</PaginationLink></PaginationItem>
                <PaginationItem><PaginationLink tag="button">4</PaginationLink></PaginationItem>
                <PaginationItem><PaginationLink next tag="button">Next</PaginationLink></PaginationItem>
              </Pagination>
            </CardBody>
          </Card>
        </Col>
    </Row>
    
    )
  }
}



export default CustomerList;
