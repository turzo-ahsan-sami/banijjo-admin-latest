import React, { Component } from 'react';
import {ToastsContainer, ToastsStore} from 'react-toasts';
import cookie from 'react-cookies';

import {logoutFunction} from './../DynamicLogout/Logout';

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
  ListGroupItem,
  Modal, ModalBody, ModalFooter, ModalHeader
} from 'reactstrap';

const base = process.env.REACT_APP_ADMIN_SERVER_URL;


class VendorPayment extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.toggleFade = this.toggleFade.bind(this);

    this.state = {
      collapse: true,
      fadeIn: true,
      timeout: 300,
      isUpdateCalled: 0,
      updateFeatureProducts: 0,
      productSlectionError: '',
      vendorList: [],
      deliverChargeList: [],
      PurchaseList: [],
      deleteIdClicked: -1,
    };

    this.handleVendors = this.handleVendors.bind(this);
    this.handleDeliveryAndChargeGet = this.handleDeliveryAndChargeGet.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.toggleSmall = this.toggleSmall.bind(this);

  }

  toggleSmall(event) {

    console.log(event.currentTarget.dataset['clicked']);

    if (event.currentTarget.dataset['clicked'] == 'permited') {
      console.log('condition applied');

      fetch(base+`/api/delete-vat-tax/?id=${this.state.deleteIdClicked}`, {
        method: 'GET',
        headers: { 'Authorization': 'Atiq '+cookie.load('token') }
      })
      .then(res => {
        console.log(res);
        return res.json()
      })
      .then(deleteVatTax => {
        console.log(deleteVatTax);

        if (deleteVatTax.success == true) {
          ToastsStore.success("Vat Tax deleted successfully !!");

          setTimeout(
            function() {
              this.setState({
                small: !this.state.small,
              });

              window.location = '/vat-tax/add-vat-tax';
            }
            .bind(this),
            3000
          );
        }
        else {
          ToastsStore.success("Something went wrong at the time of vat tax deleting !!");
        }

        return false;
      });

    }
    if (event.currentTarget.dataset['clicked'] == 'denied') {
      console.log('condition denied');

      this.setState({
        small: !this.state.small,
      });
    }

  }

  deleteClicked (event) {
    console.log(event.currentTarget.dataset['id']);

    this.setState({
      small: !this.state.small,
      deleteIdClicked: event.currentTarget.dataset['id']
    });

  }

  updateClicked (event) {
    console.log(event.currentTarget.dataset['id']);
    this.setState({
      updateFeatureProducts: event.currentTarget.dataset['id']
    })


  }

  componentDidMount() {
    console.log('component mount executed');

    const userName = localStorage.getItem('userName');
    const userPassword = localStorage.getItem('userPassword');
    if(userName===null && userPassword === null)
    {
      this.props.history.push("/login");
    }

    this.handleVendors();
    this.handleDeliveryAndChargeGet();

  }

  handleVendors() {
    fetch(base+'/api/vendor-payment-vendors', {
      method: 'GET'
    })
    .then(res => {
      console.log(res);
      return res.json()
    })
    .then(vendorList => {
      console.log(vendorList.data);

      this.setState({
        vendorList : vendorList.data
      })

      return false;
    });
    // .then(console.log(response));
  }

  handleDeliveryAndChargeGet() {
    fetch(base+'/api/get-vat-tax', {
      method: 'GET'
    })
    .then(res => {
      console.log(res);
      return res.json()
    })
    .then(deliverChargeList => {
      console.log(deliverChargeList.data);

      this.setState({
        deliverChargeList : deliverChargeList.data
      })

      return false;
    });
  }

  handleSubmit(event) {
    event.preventDefault();

    console.log('Submitted Values : ', this.state);

    if ((this.state.CategoryList != undefined) && (this.state.vat != undefined) && (this.state.tax != undefined) && (this.state.date != undefined)) {
      if (this.state.isUpdateCalled == 1 && this.state.updateFeatureProducts != 0) {
        console.log('Update Called');

        // fetch(base+'/api/update_feature_products' , {
        //   method: "POST",
        //   headers: {
        //     'Content-type': 'application/json',
        //     'Authorization': 'Atiq '+cookie.load('token')
        //   },
        //   body: JSON.stringify(this.state)
        // })
        // .then((result) => result.json())
        // .then((info) => {
        //   console.log(info);
        //
        //   if (info.success == true) {
        //     ToastsStore.success("Feature Products Successfully inserted !!");
        //     console.log(info.success);
        //
        //     setTimeout(
        //       function() {
        //         window.location = '/feature/feature';
        //       }
        //       .bind(this),
        //       3000
        //     );
        //   }
        //   else {
        //     ToastsStore.warning("Feature Products Insertion Faild. Please try again !!");
        //     console.log(info.success);
        //   }
        //
        // })
      }
      else {
        // console.log('Trying to submit !');
        // fetch(base+'/api/save_vat_tax' , {
        //   method: "POST",
        //   headers: {
        //     'Content-type': 'application/json',
        //     'Authorization': 'Atiq '+cookie.load('token')
        //   },
        //   body: JSON.stringify(this.state)
        // })
        // .then((result) => result.json())
        // .then((info) => {
        //   console.log(info);
        //
        //   if (info.success == true) {
        //     ToastsStore.success("Deliver Charges Successfully inserted !!");
        //     console.log(info.success);
        //
        //     setTimeout(
        //       function() {
        //         window.location = '/vat-tax/add-vat-tax';
        //       }
        //       .bind(this),
        //       3000
        //     );
        //   }
        //   else {
        //     ToastsStore.warning("Deliver Charges Insertion Faild. Please try again !!");
        //     console.log(info.success);
        //   }
        //
        // })
      }
    }
    else {
      ToastsStore.warning("Vendor Payment is failed because of the delivery status !!");
    }


  }

  handleChange(event) {
    console.log('vendor ID : ', event.target.value);

    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    // alert(value)
    // alert(name)

    this.setState({
      [name]: value
    });
  }

  toggle() {
    this.setState({ collapse: !this.state.collapse });
  }

  toggleFade() {
    this.setState((prevState) => { return { fadeIn: !prevState }});
  }

  render() {

    return (
      <Row>
      <Col xs="12" md="6">
        <Card>
          <CardHeader>
            <strong>Add Vendor payment</strong>
          </CardHeader>
          <ToastsContainer store={ToastsStore}/>
          <CardBody>
            <Form action="" method="post" encType="multipart/form-data" onSubmit={this.handleSubmit} onChange={this.handleChange} className="form-horizontal">

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="vendorId">Vendor Name</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="select" name="vendorId" id="vendorId" value={this.state.value} onChange={this.handleChange.bind(this)}>
                    <option value="0">Please select</option>
                    {
                      this.state.vendorList.map((vendorListValue, key) =>
                        <option value={vendorListValue.vendor_id}> {vendorListValue.name} </option>
                      )
                    }
                  </Input>
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="amount">Amount</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="text" name="amount" id="amount" value={this.state.value} onChange={this.handleChange.bind(this)}>

                  </Input>
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="tax">Bill No</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="text" name="tax" id="tax" value={this.state.value} onChange={this.handleChange.bind(this)}>

                  </Input>
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="date">Date</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="date" name="date" id="date" value={this.state.value} onChange={this.handleChange.bind(this)}>

                  </Input>
                </Col>
              </FormGroup>

              <center>
                {
                  this.state.isUpdateCalled == 0 ?
                  <Button type="submit" size="sm" color="success"><i className="fa fa-dot-circle-o"></i> Submit</Button>
                  :
                  <Button type="submit" size="sm" color="success"><i className="fa fa-dot-circle-o"></i> Update</Button>
                }
                &nbsp;
                <Button type="reset" size="sm" color="danger"><i className="fa fa-ban"></i> Reset</Button>
              </center>


            </Form>
          </CardBody>
          <CardFooter>

          </CardFooter>
        </Card>
      </Col>

      <Col xs="12" lg="6">
        <Card>
          <CardHeader>
            <Row>
              <Col md="6">
                <i className="fa fa-align-justify"></i> Vendor payment List
              </Col>
              <Col md="6">

              </Col>
            </Row>
          </CardHeader>

          <CardBody>
          <Table responsive bordered>
            <thead>
              <tr>
                <th>Vendor Name</th>
                <th>Payed Amount</th>
                <th>Bill No</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
                {/*{
                  this.state.deliverChargeList.map((deliverChargeList_value, key) =>
                    <tr>
                      <td>
                        {
                          this.state.vendorList.map((vendorList_value, key) =>
                            vendorList_value.id == deliverChargeList_value.category_id ?
                              <div>{vendorList_value.category_name}</div>
                            :
                              null
                          )
                        }
                      </td>
                      <td>{deliverChargeList_value.vat}</td>
                      <td>{deliverChargeList_value.tax}</td>
                      <td>{deliverChargeList_value.effective_date}</td>
                      <td>
                        <center>
                          <a href="#">
                            <i className="fa fa-trash fa-lg" data-id={deliverChargeList_value.id} onClick={this.deleteClicked.bind(this)} title="Delete This Specification Details" aria-hidden="true" style={{color: '#EB1C22'}}></i>
                          </a>
                        </center>
                      </td>
                    </tr>
                  )
                }*/}
            </tbody>
          </Table>
        </CardBody>
      </Card>
    </Col>


    <Modal isOpen={this.state.small} toggle={this.toggleSmall}
           className={'modal-sm ' + this.props.className}>
      <ModalHeader toggle={this.toggleSmall}>Delete</ModalHeader>
      <ModalBody>
        Do you want to delete this vat tax ?
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={this.toggleSmall} data-clicked="permited">Delete</Button>{' '}
        <Button color="secondary" onClick={this.toggleSmall} data-clicked="denied">Cancel</Button>
      </ModalFooter>
    </Modal>


  </Row>
    )
  }
}



export default VendorPayment;
