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
  Modal,
  ModalBody,
  ModalFooter, 
  ModalHeader,
} from 'reactstrap';

import Dropdowns from '../../Base/Dropdowns';

class OrderList extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.toggleFade = this.toggleFade.bind(this);
    this.state = {
      // modal
      modal: false,
      large: false,
      // end of modal
      // dropdown
      dropdownOpen: new Array(6).fill(false),
      // end of dropdown
      collapse: true,
      fadeIn: true,
      timeout: 300
    };

    // for modal
    this.toggleLarge = this.toggleLarge.bind(this);
  }

  toggle() {
    this.setState({ 
      collapse: !this.state.collapse,
      modal: !this.state.modal,
    });
  }

  toggleLarge() {
    this.setState({
      large: !this.state.large,
    });
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
                <Col md="6"><i className="fa fa-align-justify"></i> Order List</Col>
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
                  <th><center>Order Id</center></th>
                  <th><center>Order Amount</center></th>
                  <th><center>Billing Address</center></th>
                  <th><center>Shipping Address</center></th>
                  <th><center>Order Time</center></th>
                  <th><center>Status</center></th>
                  <th><center>Order Details</center></th>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <td>N/A</td>
                  <td>N/A</td>
                  <td>N/A</td>
                  <td>N/A</td>
                  <td>N/A</td>
                  <td>
                    <Badge color="success">Active</Badge>
                  </td>
                  <td>
                    <center>
                      <a href="#" onClick={this.toggleLarge}>
                        <i className="cui-info icons font-2xl "></i>
                      </a>
                    </center>
                  </td>
                </tr>
                <tr>
                  <td>N/A</td>
                  <td>N/A</td>
                  <td>N/A</td>
                  <td>N/A</td>
                  <td>N/A</td>
                  <td>
                    <Badge color="success">Active</Badge>
                  </td>
                  <td>
                    <center>
                      <a href="#" onClick={this.toggleLarge}>
                        <i className="cui-info icons font-2xl "></i>
                      </a>
                    </center>
                  </td>
                </tr>
                <tr>
                  <td>N/A</td>
                  <td>N/A</td>
                  <td>N/A</td>
                  <td>N/A</td>
                  <td>N/A</td>
                  <td>
                    <Badge color="success">Active</Badge>
                  </td>
                  <td>
                    <center>
                      <a href="#" onClick={this.toggleLarge}>
                        <i className="cui-info icons font-2xl "></i>
                      </a>
                    </center>
                  </td>
                </tr>
                <tr>
                  <td>N/A</td>
                  <td>N/A</td>
                  <td>N/A</td>
                  <td>N/A</td>
                  <td>N/A</td>
                  <td>
                    <Badge color="danger">Inactive</Badge>
                  </td>
                  <td>
                    <center>
                      <a href="#" onClick={this.toggleLarge}>
                        <i className="cui-info icons font-2xl "></i>
                      </a>
                    </center>
                  </td>
                </tr>
                <tr>
                  <td>N/A</td>
                  <td>N/A</td>
                  <td>N/A</td>
                  <td>N/A</td>
                  <td>N/A</td>
                  <td>
                    <Badge color="success">Active</Badge>
                  </td>
                  <td>
                    <center>
                      <a href="#" onClick={this.toggleLarge}>
                        <i className="cui-info icons font-2xl "></i>
                      </a>
                    </center>
                  </td>
                </tr>
                </tbody>
              </Table>

              <Modal isOpen={this.state.large} toggle={this.toggleLarge} className={'modal-lg ' + this.props.className}>
                <ModalHeader toggle={this.toggleLarge}>Order Details</ModalHeader>
                <ModalBody>
                  <Table responsive bordered>
                    <thead>
                      <tr>
                        <th><center>Order Id</center></th>
                        <th><center>Product Id</center></th>
                        <th><center>Product Discount</center></th>
                        <th><center>Quantity</center></th>
                        <th><center>Status</center></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>N/A</td>
                        <td>N/A</td>
                        <td>N/A</td>
                        <td>N/A</td>
                        <td>
                          <Badge color="success">Active</Badge>
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </ModalBody>
                <ModalFooter>
                  <Button color="success" onClick={this.toggleLarge}>Aprrove</Button>{' '}
                  <Button color="danger" onClick={this.toggleLarge}>Cancel</Button>
                </ModalFooter>
              </Modal>

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

export default OrderList;
