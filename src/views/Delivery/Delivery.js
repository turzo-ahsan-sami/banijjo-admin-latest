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


class Delivery extends Component {
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
      sales_bill_no: [],
      deliverChargeList: [],
      deliveryUpdateList: [],
      deleteIdClicked: -1,
      userType: '',
      empId: -1,
      chalanNo: '',
      products: [],
      productsAppend: [],
      productsSlelected: [],
      deliveryList: [],
      statusValues: []
    };

    this.handleSalesBillNoGet = this.handleSalesBillNoGet.bind(this);
    this.handleDeliveryAndChargeGet = this.handleDeliveryAndChargeGet.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleChalanNo = this.handleChalanNo.bind(this);

    this.toggleSmall = this.toggleSmall.bind(this);

  }

  toggleSmall(event) {

    console.log(event.currentTarget.dataset['clicked']);

    if (event.currentTarget.dataset['clicked'] == 'permited') {
      console.log('condition applied');

      fetch(base+`/api/delete-delivery-system/?id=${this.state.deleteIdClicked}`, {
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

              window.location = '/delivery/add-new-delivery';
            }
            .bind(this),
            3000
          );
        }
        else {

          if (deleteVatTax.status == 403) {
            console.log(deleteVatTax);

            ToastsStore.warning('Your session is expired. Please Login again');

            setTimeout(()=> {
              logoutFunction(localStorage.userName);
            }, 1000);

          }
          else {
            ToastsStore.success("Something went wrong at the time of vat tax deleting !!");
          }
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
    // this.setState({
    //   updateFeatureProducts: event.currentTarget.dataset['id']
    // })


    fetch(base+`/api/edit-delivery-system/?id=${event.currentTarget.dataset['id']}`, {
      method: 'GET',
      headers: {
        'Authorization': 'Atiq '+cookie.load('token')
      },
    })
    .then(res => {
      console.log(res);
      return res.json()
    })
    .then(deliveryEdit => {
      console.log('Category Order List Value : ', deliveryEdit.data);

      let deliveryUpdateList = [];

      let status_delivery = -1;

      for (let i = 0; i < deliveryEdit.data.length; i++) {
        console.log('check Infos : ', deliveryEdit.data[i]);

        if (deliveryEdit.data[i].delivery_status == 'processing') {
          status_delivery = 2;
        }
        else if (deliveryEdit.data[i].delivery_status == 'delivered') {
          status_delivery = 3;
        }
        else if (deliveryEdit.data[i].delivery_status == 'rejected') {
          status_delivery = 4;
        }

        this.state.products.push(<div><Input type="checkbox" name="products" style={{marginLeft: "0.10rem"}} value={deliveryEdit.data[i].productId} checked/> <div style={{marginLeft: "20px"}}>{deliveryEdit.data[i].product_name}</div>  </div>);

        // this.setState({
        //   productsAppend: this.state.products
        // })

        let dateTime = deliveryEdit.data[i].delivery_date.split(" ")
        console.log('Only Date', dateTime[0]);

        let statusValues = [];
        statusValues[2] = "processing";
        statusValues[3] = "delivered";
        statusValues[4] = "rejected";

        setTimeout(() => {
          this.setState({
            statusValues: statusValues
          });
          console.log('array status from states : ', this.state.statusValues);
        }, 500);

        setTimeout(() => {
          this.setState({
            salesBillNo: deliveryEdit.data[i].sales_bill_no_id,
            chalanNo: deliveryEdit.data[i].chalan_no,
            date: dateTime[0],
            status: status_delivery,
            productsAppend: this.state.products
          });
        }, 1000);

        this.setState({
          isUpdateCalled: 1
        })

        console.log('All states after update clicked', this.state);

        setTimeout(() => {
          console.log('Status ', this.state.status);
          console.log('status_delivery ', status_delivery);
        }, 1500);


      }

      // this.setState({
      //   deliveryUpdateList : deliveryUpdateList
      // })
      return false;
    });


  }

  componentDidMount() {
    console.log('component mount executed');

    let statusValues = [];
    statusValues[2] = "processing";
    statusValues[4] = "rejected";

    const userName = localStorage.getItem('userName');
    const userPassword = localStorage.getItem('userPassword');
    if(userName===null && userPassword === null)
    {
      this.props.history.push("/login");
    }

    this.setState({
      userType: localStorage.getItem('user_type'),
      empId: localStorage.getItem('employee_id'),

    });

    console.log('array status : ', statusValues);

    this.handleSalesBillNoGet();
    this.handleDeliveryAndChargeGet();
    this.handleChalanNo();
    this.handleDeliveryList();

    setTimeout(() => {
      this.setState({
        statusValues: statusValues
      });
      console.log('array status from states : ', this.state.statusValues);
    }, 1000);


  }

  handleDeliveryList(){
    fetch(base+'/api/get-delivery-list', {
      method: 'GET'
    })
    .then(res => {
      console.log(res);
      return res.json()
    })
    .then(deliveryList => {
      console.log('Delivery List : ', deliveryList.data);

      this.setState({
        deliveryList: deliveryList.data
      })

      console.log('Delivery List : ', this.state.deliveryList);

      return false;
    });
  }

  handleChalanNo() {
    fetch(base+'/api/get-chalan-bill-no', {
      method: 'GET'
    })
    .then(res => {
      console.log(res);
      return res.json()
    })
    .then(chalan_no => {
      console.log('Chalan No : ', chalan_no.data);

      this.setState({
        chalanNo: chalan_no.data
      })

      return false;
    });
  }

  handleSalesBillNoGet() {
    console.log('Get sales bill no ...');
    console.log('User Type : ', localStorage.getItem('user_type'));
    console.log('User Id : ', localStorage.getItem('employee_id'));

    fetch(base+`/api/sales-bill-no/?userType=${localStorage.getItem('user_type')}&empId=${localStorage.getItem('employee_id')}`, {
      method: 'GET'
    })
    .then(res => {
      console.log(res);
      return res.json()
    })
    .then(sales_bill_no => {
      // console.log('Sales Bill No id : ', sales_bill_no.data[0].id);
      console.log('Sales Bill : ', sales_bill_no.data);

      this.setState({
        sales_bill_no : sales_bill_no.data
      })

      console.log('Sales Bill From States : ', this.state.sales_bill_no);

      return false;
    });
    // .then(console.log(response));
  }

  handleDeliveryAndChargeGet() {
    fetch(base+'/api/get-delivery-charge', {
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

    if ((this.state.chalanNo != undefined) && (this.state.productsSlelected != undefined) && (this.state.status != undefined) && (this.state.salesBillNo != undefined) && (this.state.date != undefined)) {
      if (this.state.isUpdateCalled == 1) {
        console.log('Update Called');
        console.log('Need to update : ', this.state);

        fetch(base+'/api/update_delivery_system' , {
          method: "POST",
          headers: {
            'Content-type': 'application/json',
            'Authorization': 'Atiq '+cookie.load('token')
          },
          body: JSON.stringify(this.state)
        })
        .then((result) => result.json())
        .then((info) => {
          console.log(info);

          if (info.success == true) {
            ToastsStore.success("Delivery Successfully updated !!");
            console.log(info.success);

            setTimeout(
              function() {
                window.location = '/delivery/add-new-delivery';
              }
              .bind(this),
              3000
            );
          }
          else {

            if (info.status == 403) {
              console.log(info);

              ToastsStore.warning('Your session is expired. Please Login again');

              setTimeout(()=> {
                logoutFunction(localStorage.userName);
              }, 1000);

            }
            else {
              ToastsStore.warning("Delivery Update Faild. Please try again !!");
              console.log(info.success);
            }
          }

        })
      }
      else {
        console.log('Trying to submit !');
        fetch(base+'/api/save_delivery_system' , {
          method: "POST",
          headers: {
            'Content-type': 'application/json',
            'Authorization': 'Atiq '+cookie.load('token')
          },
          body: JSON.stringify(this.state)
        })
        .then((result) => result.json())
        .then((info) => {
          console.log(info);

          if (info.success == true) {
            ToastsStore.success("Delivery Successfully inserted !!");
            console.log(info.success);

            setTimeout(
              function() {
                window.location = '/delivery/add-new-delivery';
              }
              .bind(this),
              3000
            );
          }
          else {

            if (info.status == 403) {
              console.log(info);

              ToastsStore.warning('Your session is expired. Please Login again');

              setTimeout(()=> {
                logoutFunction(localStorage.userName);
              }, 1000);

            }
            else {
              ToastsStore.warning("Delivery Insertion Faild. Please try again !!");
              console.log(info.success);
            }
          }

        })
      }
    }
    else {
      ToastsStore.warning("New Delivery and Charge insertion failed. Please fill up all the required filed first !!");
    }


  }

  handleChange(event) {
    console.log('vendor ID : ', event.target.value);

    let productId = event.target.value;

    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    console.log('Name : ', name);
    console.log('value : ', value);

    if (name == 'products') {
      this.state.productsSlelected.push(productId);
    }

    console.log('Selected Product : ', this.state.productsSlelected);

    this.setState({
      [name]: value
    });
  }

  handleSalesBillWiseProduct(event) {
    console.log('Sales Bill Id : ', event.target.value);

    fetch(base+`/api/get-product-sales-bill-wise/?billId=${event.target.value}`, {
      method: 'GET'
    })
    .then(res => {
      console.log(res);
      return res.json()
    })
    .then(products => {
      console.log('Products : ', products.data);

      this.setState({
        products : []
      })
      //

      this.productCheckList(products.data);

      return false;
    });

  }

  productCheckList(event) {
    this.state.products = [];

    for (var i = 0; i < event.length; i++) {

      console.log('Products : ', event[i].product_name);
      console.log('Product Info : ', event[i]);
      this.state.products.push(<div><Input type="checkbox" name="products" style={{marginLeft: "0.10rem"}} value={event[i].productId} /> <div style={{marginLeft: "20px"}}>{event[i].product_name}</div>  </div>);
    }

    this.setState({
      productsAppend: this.state.products
    })

    console.log('Products FROM States : ', this.state.productsAppend);
  }

  toggle() {
    this.setState({ collapse: !this.state.collapse });
  }

  toggleFade() {
    this.setState((prevState) => { return { fadeIn: !prevState }});
  }

  handleReset () {
    window.location = '/delivery/add-new-delivery';

    console.log('Reset Called');
  }

  render() {

    return (
      <Row>
      <Col xs="12" md="6">
        <Card>
          <CardHeader>
            <strong>Add New Delivery</strong>
          </CardHeader>
          <ToastsContainer store={ToastsStore}/>
          <CardBody>
            <Form action="" method="post" encType="multipart/form-data" onSubmit={this.handleSubmit} onChange={this.handleChange} className="form-horizontal">

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="salesBillNo">Sales Bill No</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="select" name="salesBillNo" id="salesBillNo" value={this.state.salesBillNo} onChange={this.handleSalesBillWiseProduct.bind(this)} >
                    <option value="0">Please select</option>
                    {
                      this.state.sales_bill_no.map((sales_bill_no_value, key) =>
                        <option value={sales_bill_no_value.id}> {sales_bill_no_value.sales_bill_no} </option>
                      )
                    }
                  </Input>
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="chalanNo">Chalan No</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="text" name="chalanNo" id="chalanNo" readOnly value={this.state.chalanNo}>

                  </Input>
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="type">Products</Label>
                </Col>
                <Col xs="12" md="9">
                  {this.state.productsAppend}
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="maxRange">Delivery Status</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="select" name="status" id="status" value={this.state.status} onChange={this.handleChange.bind(this)}>
                    <option value="0">Please select</option>

                    {
                      this.state.statusValues.map((values, key) =>
                        <option value={key}> {values} </option>
                      )
                    }

                  </Input>
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="date">Delivery Date</Label>
                </Col>
                <Col xs="12" md="9">
                {
                  this.state.isUpdateCalled == 0 ?
                  <Input type="date" name="date" id="date" value={this.state.value} onChange={this.handleChange.bind(this)}>

                  </Input>
                  :
                  <Input type="text" name="date" id="date" value={this.state.date} readOnly>

                  </Input>
                }

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
                <Button type="reset" size="sm" color="danger" onClick={this.handleReset}><i className="fa fa-ban"></i> Reset</Button>
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
                <i className="fa fa-align-justify"></i> Product Delivery List
              </Col>
              <Col md="6">

              </Col>
            </Row>
          </CardHeader>

          <CardBody>
          <Table responsive bordered>
            <thead>
              <tr>
                <th>Chalan No</th>
                <th>Delivery Date</th>
                <th>Delivery Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
                {
                  this.state.deliveryList.map((deliveryList_value, key) =>
                    <tr>
                      {/*<td>
                        {
                          this.state.parentCategory.map((parentCategory_value, key) =>
                            parentCategory_value.id == deliverChargeList_value.category_id ?
                              <div>{parentCategory_value.category_name}</div>
                            :
                              null
                          )
                        }
                      </td>*/}
                      <td>{deliveryList_value.chalan_no}</td>
                      <td>{deliveryList_value.delivery_date}</td>
                      <td>{deliveryList_value.delivery_status}</td>
                      <td>
                        <center>
                          <a href="#" ref="updateId" data-id={deliveryList_value.id} onClick={this.updateClicked.bind(this)}>
                            <i className="fa fa-edit fa-lg"  title="Edit Specification Details Info" aria-hidden="true" style={{color: '#009345'}}></i>
                          </a>&nbsp;&nbsp;
                          <a href="#">
                            <i className="fa fa-trash fa-lg" data-id={deliveryList_value.id} onClick={this.deleteClicked.bind(this)} title="Delete This Delivery List" aria-hidden="true" style={{color: '#EB1C22'}}></i>
                          </a>
                        </center>
                      </td>
                    </tr>
                  )
                }
            </tbody>
          </Table>
        </CardBody>
      </Card>
    </Col>


    <Modal isOpen={this.state.small} toggle={this.toggleSmall}
           className={'modal-sm ' + this.props.className}>
      <ModalHeader toggle={this.toggleSmall}>Delete</ModalHeader>
      <ModalBody>
        Do you want to delete this Delivery ?
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



export default Delivery;
