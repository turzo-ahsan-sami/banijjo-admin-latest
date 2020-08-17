import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {ToastsContainer, ToastsStore} from 'react-toasts';
import cookie from 'react-cookies';

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
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ListGroupItem,
} from 'reactstrap';

const base = process.env.REACT_APP_ADMIN_SERVER_URL;

class SalesReturn extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modal: false,
      large: false,

      tags: '',
      collapse: true,
      fadeIn: true,
      timeout: 300,
      userName: '',
      currentDate: '',
      sales: [],
      product_info: [],
      editID: 0,
      customer_info: [],
      employee_id: 0,
      vendor_id: 0,
      sales_info: '',
      serialNo: 0
    };

    this.toggleLargeView = this.toggleLargeView.bind(this);
  }

  componentDidMount() {
    const userName = localStorage.getItem('userName');
    const userPassword = localStorage.getItem('userPassword');

    this.state.userName = userName;

    let tempDate = new Date();
    let date = tempDate.getFullYear() + '-' + (tempDate.getMonth()+1) + '-' + tempDate.getDate();

    this.state.currentDate = date;

    if(userName===null && userPassword === null)
    {
      this.props.history.push("/login");
    }

    if (localStorage.user_type == 'vendor') {
        fetch(base+`/api/vendor_sales_info?id=${localStorage.employee_id}`, {
          method: 'GET'
        })
        .then(res => {
          console.log(res);
          return res.json()
        })
        .then(sales => {
          console.log('Sales : ',sales.sales);

          this.setState({
              sales: sales.sales,
          })

          return false;
        });
    }
    else if (localStorage.user_type != 'vendor' && localStorage.user_type != 'delivery_man') {
        fetch(base+'/api/sales_info', {
          method: 'GET'
        })
        .then(res => {
          console.log(res);
          return res.json()
        })
        .then(sales => {
          console.log('Sales : ',sales.sales);

          this.setState({
              sales: sales.sales,
          })

          return false;
        });
    }

  }

  toggleLarge (event, value) {
      console.log('Event value : ', event);

      if (event == 'Yes') {
          // this.setState({
          //     large: !this.state.large,
          // });
            if (localStorage.user_type == 'vendor') {
                fetch(base+'/api/accept_sale', {
                    method: 'POST',
                    headers: {'Content-type': 'application/json'},
                    body: JSON.stringify(this.state)
                })
                .then(res => {
                    return res.json()
                })
                .then(sales => {
                    console.log(sales);
                    if (sales.success == true) {
                        ToastsStore.success("Sales Confirmed !!");

                        setTimeout(()=>{
                            this.setState({
                                product_info: [],
                                customer_info: [],
                                editID: 0,
                                large: !this.state.large,
                            });

                            window.location = '/sales/sales';
                        }, 1000)

                    }
                    else {
                        ToastsStore.warning("Sales Confirmation Failed !!");
                    }

                    return false;
                });
            }
            else {
                fetch(base+'/api/confirm_sale', {
                    method: 'POST',
                    headers: {'Content-type': 'application/json'},
                    body: JSON.stringify(this.state)
                })
                .then(res => {
                    return res.json()
                })
                .then(sales => {
                    console.log(sales);
                    if (sales.success == true) {
                        ToastsStore.success("Sales Confirmed !!");

                        setTimeout(()=>{
                            this.setState({
                                product_info: [],
                                customer_info: [],
                                editID: 0,
                                large: !this.state.large,
                            });

                            window.location = '/sales/sales';
                        }, 1000)

                    }
                    else {
                        ToastsStore.warning("Sales Confirmation Failed !!");
                    }

                    return false;
                });
            }

      }
      else if (event == 'Yes accept') {
        console.log('admin accepted the product as vendor_id', value);

        fetch(base+`/api/accept_sale_by_admin?editID=${this.state.editID}&vendor_id=${value}`, {
            method: 'POST',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify(this.state)
        })
        .then(res => {
            return res.json()
        })
        .then(sales => {
            console.log(sales);
            if (sales.success == true) {
                ToastsStore.success("Sales Confirmed !!");

                setTimeout(()=>{
                    this.setState({
                        product_info: [],
                        customer_info: [],
                        editID: 0,
                        large: !this.state.large,
                    });

                    window.location = '/sales/sales';
                }, 1000)

            }
            else {
                ToastsStore.warning("Sales Confirmation Failed !!");
            }

            return false;
        });
      }
      else if (event == 'Yes processing vendor') {
        fetch(base+`/api/processing_sale?editID=${this.state.editID}&vendor_id=${value}`, {
            method: 'POST',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify(this.state)
        })
        .then(res => {
            return res.json()
        })
        .then(sales => {
            console.log(sales);
            if (sales.success == true) {
                ToastsStore.success("Processing Confirmed !!");

                setTimeout(()=>{
                    this.setState({
                        product_info: [],
                        customer_info: [],
                        editID: 0,
                        large: !this.state.large,
                    });

                    window.location = '/sales/sales';
                }, 1000)

            }
            else {
                ToastsStore.warning("Failed !!");
            }

            return false;
        });
      }
      else if (event == 'Yes processing') {
        fetch(base+`/api/processing_sale?editID=${this.state.editID}&vendor_id=${value}`, {
            method: 'POST',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify(this.state)
        })
        .then(res => {
            return res.json()
        })
        .then(sales => {
            console.log(sales);
            if (sales.success == true) {
                ToastsStore.success("Processing Confirmed !!");

                setTimeout(()=>{
                    this.setState({
                        product_info: [],
                        customer_info: [],
                        editID: 0,
                        large: !this.state.large,
                    });

                    window.location = '/sales/sales';
                }, 1000)

            }
            else {
                ToastsStore.warning("Failed !!");
            }

            return false;
        });
      }
      else if (event == 'Yes ready to deliver') {
        fetch(base+`/api/ready_to_deliver_sale?editID=${this.state.editID}&vendor_id=${value}`, {
            method: 'POST',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify(this.state)
        })
        .then(res => {
            return res.json()
        })
        .then(sales => {
            console.log(sales);
            if (sales.success == true) {
                ToastsStore.success("Ready To Delivery Confirmed !!");

                setTimeout(()=>{
                    this.setState({
                        product_info: [],
                        customer_info: [],
                        editID: 0,
                        large: !this.state.large,
                    });

                    window.location = '/sales/sales';
                }, 1000)

            }
            else {
                ToastsStore.warning("Failed !!");
            }

            return false;
        });
      }
      else if (event == 'Yes on going') {
        fetch(base+`/api/on_going_sale?editID=${this.state.editID}&vendor_id=${value}`, {
            method: 'POST',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify(this.state)
        })
        .then(res => {
            return res.json()
        })
        .then(sales => {
            console.log(sales);
            if (sales.success == true) {
                ToastsStore.success("On Going Confirmed !!");

                setTimeout(()=>{
                    this.setState({
                        product_info: [],
                        customer_info: [],
                        editID: 0,
                        large: !this.state.large,
                    });

                    window.location = '/sales/sales';
                }, 1000)

            }
            else {
                ToastsStore.warning("Failed !!");
            }

            return false;
        });
      }
      else if (event == 'Yes delivered') {
        fetch(base+`/api/delivered_sale?editID=${this.state.editID}&vendor_id=${value}`, {
            method: 'POST',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify(this.state)
        })
        .then(res => {
            return res.json()
        })
        .then(sales => {
            console.log(sales);
            if (sales.success == true) {
                ToastsStore.success("Delivered Confirmed !!");

                setTimeout(()=>{
                    this.setState({
                        product_info: [],
                        customer_info: [],
                        editID: 0,
                        large: !this.state.large,
                    });

                    window.location = '/sales/sales';
                }, 1000)

            }
            else {
                ToastsStore.warning("Failed !!");
            }

            return false;
        });
      }
      else if (event == 'Yes returned') {
        fetch(base+`/api/returned_sale?editID=${this.state.editID}&vendor_id=${value}`, {
            method: 'POST',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify(this.state)
        })
        .then(res => {
            return res.json()
        })
        .then(sales => {
            console.log(sales);
            if (sales.success == true) {
                ToastsStore.success("Returned Confirmed !!");

                setTimeout(()=>{
                    this.setState({
                        product_info: [],
                        customer_info: [],
                        editID: 0,
                        large: !this.state.large,
                    });

                    window.location = '/sales/sales';
                }, 1000)

            }
            else {
                ToastsStore.warning("Failed !!");
            }

            return false;
        });
      }
      else if (event == 'No') {
          this.setState({
              product_info: [],
              customer_info: [],
              large: !this.state.large,
          });
      }
  }

  toggleLargeView (event) {
      console.log('Sales Id : ', event.currentTarget.dataset['id']);
      console.log('Event value : ', event);

      this.setState({
          editID: event.currentTarget.dataset['id'],
          employee_id: localStorage.employee_id
      });

      fetch(base+`/api/sales_details_info?id=${event.currentTarget.dataset['id']}&userId=${localStorage.employee_id}`, {
        method: 'GET'
      })
      .then(res => {
        console.log(res);
        return res.json()
      })
      .then(sales => {
        console.log('Sales Details : ',sales.sales_details);
        console.log('Sales Info : ',sales.sales_info);
        console.log('product_info : ',sales.product_info);
        console.log('customer_info : ',sales.customer_info);

        this.setState({
            product_info: sales.product_info,
            customer_info: sales.customer_info,
            sales_info: sales.sales_info,
            large: !this.state.large
        })

        return false;
      });

  }

  render() {

    return (
      <Row>
        <ToastsContainer store={ToastsStore}/>

      <Col xs="12" md="12">
        <Card>
          <CardHeader>
            {/* <i className="fa fa-align-justify"></i> Product Specification List */}
            <Row>
              <Col md="6"><i className="fa fa-align-justify"></i> Sales Info</Col>
              <Col md="6"></Col>
            </Row>
          </CardHeader>
          <CardBody>
            <Table responsive bordered>
              <thead>
              <tr>
                <th>Sales Bill No</th>
                <th>Sales Date</th>
                <th>Quantity</th>
                <th>Total Amount</th>
                <th>Discount</th>
                <th>Promo code</th>
                <th>Sales Type</th>
                <th>EMI</th>
                <th>Confirmation</th>
                <th>Action</th>
              </tr>
              </thead>
              <tbody>
                  {
                      this.state.sales.map((sales_info, key) =>
                            <tr>
                                <td>{sales_info.sales_bill_no}</td>
                                <td>{sales_info.sales_date}</td>
                                <td>{sales_info.total_sales_quantity}</td>
                                <td>{sales_info.total_sales_amount}</td>
                                <td>{sales_info.discount_amount}</td>
                                <td>{localStorage.user_type != 'vendor' ?sales_info.promo_code: null}</td>
                                <td>{sales_info.sales_type}</td>
                                <td>{sales_info.isEMI}</td>
                                <td>
                                    {
                                        sales_info.isConfirmed == 'False' ?
                                        <center> <i class="fa fa-times fa-lg" style={{color: 'red'}}></i> </center>
                                        :
                                        <center> <i class="fa fa-check fa-lg" style={{color: '#009345'}}></i>  </center>
                                    }
                                </td>
                                <td>
                                    <center>
                                        <a href="#">
                                          <i className="fa fa-info-circle fa-lg" data-id={sales_info.id} data-info={'eidt_info'} data-viewclicked={'viewclicked'}  title="View Details Info" aria-hidden="true" style={{color: '#009345'}} onClick={this.toggleLargeView.bind(this)}></i>
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

      {/* CONFIRMATION WINDOW */}

      <Modal isOpen={this.state.large} toggle={this.toggleLarge}
             className={'modal-lg ' + this.props.className}>
        <ModalHeader toggle={this.toggleLarge}> {localStorage.user_type != 'vendor' ? 'Confirm Sell' : 'Accept Sell'} </ModalHeader>
        <ModalBody>

            <div>
                <div style={{backgroundColor: "#D6D4D4"}}>
                    <h4 style={{marginLeft: "15px", paddingTop: "12px"}}>Customer Info</h4>
                    <hr />
                    {/* <table style={{marginLeft: "30px"}}> */}
                    <Table responsive bordered>
                        <tr>
                            <td>Name </td>
                            <td>{this.state.customer_info.name}</td>
                        </tr>
                        <tr>
                            <td>Email </td>
                            <td>{this.state.customer_info.email}</td>
                        </tr>
                        <tr>
                            <td>Phone Number </td>
                            <td>{this.state.customer_info.phone_number}</td>
                        </tr>
                        <tr>
                            <td>Address </td>
                            <td>{this.state.customer_info.address}</td>
                        </tr>
                    </Table>
                </div>

                <hr />
                <div style={{backgroundColor: "#D6D4D4"}}>
                    <h4 style={{marginLeft: "15px"}}>Order Info</h4>
                </div>

                <div>
                    <Table responsive bordered>
                        <tr>
                            <td>Bill No </td>
                            <td>{this.state.sales_info.sales_bill_no}</td>
                        </tr>
                        <tr>
                            <td>Date </td>
                            <td>{this.state.sales_info.sales_date}</td>
                        </tr>
                        <tr>
                            <td>Transaction Type</td>
                            <td>{this.state.sales_info.sales_type}</td>
                        </tr>
                    </Table>
                </div>

                <div style={{backgroundColor: "#D6D4D4"}}>
                    <h4 style={{marginLeft: "15px"}}>Product Info</h4>
                </div>

                <Table responsive bordered>
                    <tr>
                        <td>SL</td>
                        <td>Product Name</td>
                        <td>Details</td>
                        <td>Quantity</td>
                        <td>Unite Price</td>
                        <td>Discount Amount</td>
                        <td>Total Price</td>
                        <td>Delivery Charge</td>
                        <td>Accepted</td>
                    </tr>
                    <tbody>
                    {
                        this.state.product_info.map((productValue, key) =>
                        <React.Fragment>
                            <tr>
                                <td>{++this.state.serialNo}</td>
                                <td>{productValue.product_name}</td>
                                <td>
                                <strong>Brand:</strong> {productValue.brand} <br />
                                <strong>Color:</strong> {productValue.color} <br />
                                <strong>Size:</strong> {productValue.size}
                                </td>
                                <td>{productValue.sales_product_quantity}</td>
                                <td>{productValue.unitPrice}</td>
                                <td>{productValue.discounts_amount}</td>
                                <td>{productValue.total_amount}</td>
                                <td>{productValue.deliveryCharge}</td>
                                <td style={{color: productValue.is_accepted == 'False'? "red": "green"}}> {productValue.is_accepted == 'True' ? 'Yes' : 'No'} </td>
                            </tr>
                            <tr>
                                <td colSpan="9" style={{textAlign: "right"}}>
                                    {productValue.user_type == 'admin' ? productValue.is_accepted == 'True' ? productValue.delivery_status == 'sold' ?  <Button color="success" onClick={(e)=>{this.toggleLarge('Yes processing', productValue.vendor_id)}} >Processing</Button> : null : <Button color="success" onClick={(e)=>{this.toggleLarge('Yes accept', productValue.vendor_id)}} >Accept</Button> : null}
                                    {productValue.user_type == 'admin_manager' ? productValue.is_accepted == 'True' ? productValue.delivery_status == 'sold' ? <Button color="success" onClick={(e)=>{this.toggleLarge('Yes processing', productValue.vendor_id)}} >Processing</Button> : null : <Button color="success" onClick={(e)=>{this.toggleLarge('Yes accept', productValue.vendor_id)}} >Accept</Button> : null}
                                    {productValue.user_type == 'vendor' ? productValue.is_accepted == 'True' ? productValue.delivery_status == 'sold' ? <Button color="success" onClick={(e)=>{this.toggleLarge('Yes processing vendor', productValue.vendor_id)}} >Processing</Button> : null : <Button color="success" onClick={(e)=>{this.toggleLarge('Yes', '')}} >Accept</Button> : null}
                                    {productValue.delivery_status == 'processing' ? <Button color="success" onClick={(e)=>{this.toggleLarge('Yes ready to deliver', productValue.vendor_id)}} >Ready To Deliver</Button> : null}
                                    {productValue.delivery_status == 'ready to deliver' ? <Button color="success" onClick={(e)=>{this.toggleLarge('Yes on going', productValue.vendor_id)}} >On Going</Button> : null}
                                    {productValue.delivery_status == 'on going' ?  <Button color="success" onClick={(e)=>{this.toggleLarge('Yes delivered', productValue.vendor_id)}} >Deliverd</Button>: null}
                                    {' '}{productValue.delivery_status == 'on going' ? <Button color="danger" onClick={(e)=>{this.toggleLarge('Yes returned', productValue.vendor_id)}} >Returned</Button> : null}
                                </td>
                            </tr>
                        </React.Fragment>
                        )
                    }
                    </tbody>
                            
                </Table>
            </div>

        </ModalBody>
        <ModalFooter>
            {
                localStorage.user_type != 'vendor' ?
                <Button color="success" onClick={(e)=>{this.toggleLarge('Yes', '')}} >Yes</Button>
                :
                null
            }
          {' '}
          <Button color="danger" onClick={(e)=>{this.toggleLarge('No', '')}} >No</Button>
        </ModalFooter>
      </Modal>

    </Row>

    )
  }
}



export default SalesReturn;
