import React, { Component } from 'react';
import {ToastsContainer, ToastsStore} from 'react-toasts';
import cookie from 'react-cookies';

import {logoutFunction} from '../../DynamicLogout/Logout';

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

class Promocode extends Component {

  constructor(props) {
    super(props);

    this.state = {
      modal: false,
      small: false,
      collapse: true,
      fadeIn: true,
      timeout: 300,
      vendorList: [],
      userType: '',
      vendorId: -1,
      discountList: [],
      promocodeListPrint: [],
      isUpdateCalled: 0,
      checkAllOrNot: true,
      productsCategory: [],
      productList: [],
      productListArray: [],
      deleteId: -1,
      confirmDelete: '',
      isMultiple: 2,
      userId: -1,
      promocode: '',
      isUpdateClicked: false,
      editID: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.toggleSmall = this.toggleSmall.bind(this);

    this.handleGetEditForm = this.handleGetEditForm.bind(this);
  }

  handleReset () {
      window.location = '/discount-promocode/add-new-promocode';
  }

  handleGetEditForm (event) {
      this.setState({
          editID: event.currentTarget.dataset['id']
      });

      fetch(base+`/api/getPromocodeData/?id=${event.currentTarget.dataset['id']}`, {
        method: 'GET'
      })
      .then(res => {
        return res.json()
      })
      .then(promocode => {
        console.log(promocode.data);

        if (promocode.success ==true) {

            this.setState({
                isUpdateClicked: true,
                promocode: promocode.data[0].promo_code,
                invoiceamount: promocode.data[0].invoice_amount,
                promoAmount: promocode.data[0].promo_amount,
                promoPercantage: promocode.data[0].promo_percantage,
                dateFrom: promocode.data[0].effective_from.split(" ")[0],
                dateTo: promocode.data[0].effective_to.split(" ")[0],
                isMultiple: promocode.data[0].isMultiple == 'yes' ? 1 : 2,
                times: promocode.data[0].times
            });
        }
        else {
            ToastsStore.warning(promocode.message);
        }

        console.log('States Value : ', this.state);

        return false;
      });
  }

  toggleSmall(event) {

    if (event == 'Confirm') {
      console.log('Confirmation worked!');

      fetch(base+`/api/deletePromocode/?id=${this.state.deleteId}`, {
        method: 'GET',
        headers: { 'Authorization': 'Atiq '+cookie.load('token') }
      })
      .then(res => {
        console.log(res);
        return res.json()
      })
      .then(deletedInfo => {
        console.log('Deleted Info : ', deletedInfo);

        if (deletedInfo.success == true) {
          ToastsStore.success("Promocode Successfully deleted !!");

          this.setState({
            small: !this.state.small,
          });

          this.handlePromocodeList();
          this.handlePromocode();
        }
        else {

          if (deletedInfo.status == 403) {
            console.log(deletedInfo);

            ToastsStore.warning('Your session is expired. Please Login again');

            setTimeout(()=> {
              logoutFunction(localStorage.userName);
            }, 1000);

          }
          else {
            ToastsStore.success("Promocode did not delete. please try again !!");
          }
        }

        return false;
      });

    }
    else {
      this.setState({
        small: !this.state.small,
      });
    }

  }

  componentDidMount() {
    console.log('component mount executed');

    const userName = localStorage.getItem('userName');
    const userPassword = localStorage.getItem('userPassword');
    this.state.userType = localStorage.getItem('user_type');
    this.state.userId = localStorage.getItem('employee_id');

    if(userName===null && userPassword === null)
    {
      this.props.history.push("/login");
    }

    this.handlePromocodeList();
    this.handlePromocode();

  }

  handlePromocode() {
    fetch(base+`/api/promocode/?id=${this.state.vendorId}&userType=${this.state.userType}`, {
      method: 'GET'
    })
    .then(res => {
      console.log(res);
      return res.json()
    })
    .then(promocode => {
      console.log('Created Promocode : ', promocode.data);
      this.setState({
        promocode : promocode.data
      })

      return false;
    });
  }

  handlePromocodeList() {
    fetch(base+`/api/promocodeList/?id=${this.state.vendorId}&userType=${this.state.userType}`, {
      method: 'GET'
    })
    .then(res => {
      console.log(res);
      return res.json()
    })
    .then(promocodeList => {
      console.log('Prmocode List : ', promocodeList.data);
      this.setState({
        promocodeListPrint : promocodeList.data
      })

      return false;
    });
  }

  handleChange(event) {
    console.log('vendor ID : ', event.target.value);

    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    if (name == 'checkAllProduct') {
      this.setState({
        checkAllOrNot: !this.state.checkAllOrNot,
        discountList: []
      })
    }

    if (name == 'discountProvider') {
      this.setState({
        vendorId: localStorage.getItem('employee_id'),
        vendorName: localStorage.getItem('userName')
      })
    }

    // alert(value)
    // alert(name)

    this.setState({
      [name]: value
    });
  }

  /* DELETE ITEMS FROM THE LIST */

  deleteDiscountListItem (key) {
    console.log('Key : ', key);
    let discountList = [...this.state.discountList];
    discountList.splice(key, 1);

    this.setState({
      discountList : discountList
    })

    console.log('discount List : ', discountList);

    console.log('discount List state : ', this.state.discountList);
  }

  handleSubmit(event) {
    console.log(this.state);
    event.preventDefault();

    fetch(base+'/api/save_promocode' , {
      method: "POST",
      headers: {
        'Content-type': 'application/json',
        'Authorization': 'Atiq '+cookie.load('token')
      },
      body: JSON.stringify(this.state)
    })
    .then((result) => result.json())
    .then((info) => {
      if (info.success == true) {
        ToastsStore.success("Promocode has Successfully inserted !!");
        console.log(info.success);
        setTimeout(
          function() {
          window.location = '/discount-promocode/add-new-promocode';
          }
          .bind(this),
          2000
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
          ToastsStore.warning("Discount Insertion Faild. Please try again !!");
          console.log(info);
        }
      }
    })
  }

  deleteClicked (event) {
    console.log('Dataset Value : ', event.currentTarget.dataset['id']);
    this.setState({
      deleteId : event.currentTarget.dataset['id'],
    });

    setTimeout(() => {
      this.toggleSmall();
      console.log('Dataset Value deleteId : ', this.state.deleteId);
    }, 200);



    // this.toggleSmall();
  }

  deleteConfirm (event) {
    this.setState({
      confirmDelete : event.currentTarget.dataset['buttonType'],
    });

    setTimeout(() => {
      this.toggleSmall();
      console.log('confirmDelete : ', this.state.confirmDelete);
    }, 200);

    console.log('Dataset Value deleteConfirm event : ', this.state.deleteId);
  }

  render() {
    return (
      <Row>
        <Col xs="12" md="6">
          <Card>
            <CardHeader>
                {
                    this.state.isUpdateClicked == true ?
                    <strong>Update Promocode</strong>
                    :
                    <strong>Add New Promocode</strong>
                }

            </CardHeader>
            <ToastsContainer store={ToastsStore}/>
            <CardBody>
            <Form action="" method="post" encType="multipart/form-data" onSubmit={this.handleSubmit} onChange={this.handleChange} className="form-horizontal">

            <FormGroup row>
              <Col md="3">
                <Label htmlFor="promocode">Promocode</Label>
              </Col>
              <Col xs="12" md="9">
                <Input type="text" name="promocode" id="promocode" readOnly value={this.state.promocode} onChange={this.handleChange.bind(this)}>
                </Input>
              </Col>
            </FormGroup>

            <FormGroup row>
              <Col md="3">
                <Label htmlFor="invoiceamount">Invoice Amount</Label>
              </Col>
              <Col xs="12" md="9">
                <Input type="text" name="invoiceamount" id="invoiceamount" value={this.state.invoiceamount} onChange={this.handleChange.bind(this)}>
                </Input>
              </Col>
            </FormGroup>

            <FormGroup row>
              <Col md="3">
                <Label htmlFor="promoAmount">Promo Amount</Label>
              </Col>
              <Col xs="12" md="9">
                <Input type="text" name="promoAmount" id="promoAmount" value={this.state.promoAmount} onChange={this.handleChange.bind(this)}>
                </Input>
              </Col>
            </FormGroup>

            <FormGroup row>
              <Col md="3">
                <Label htmlFor="promoPercantage">Promo Percantage</Label>
              </Col>
              <Col xs="12" md="9">
                <Input type="text" name="promoPercantage" id="promoPercantage" value={this.state.promoPercantage} onChange={this.handleChange.bind(this)}>
                </Input>
              </Col>
            </FormGroup>

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="dateFrom">Effective Date From</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="date" name="dateFrom" id="dateFrom" value={this.state.dateFrom} onChange={this.handleChange.bind(this)}>

                  </Input>
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="dateTo">Effective Date To</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="date" name="dateTo" id="dateTo" value={this.state.dateTo} onChange={this.handleChange.bind(this)}>

                  </Input>
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="isMultiple">Is Multiple</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="select" name="isMultiple" id="isMultiple" value={this.state.isMultiple} onChange={this.handleChange.bind(this)}>
                  <option value="0">Please select</option>
                  <option value="1">Yes</option>
                  <option value="2">No</option>
                  </Input>
                </Col>
              </FormGroup>

              {
                this.state.isMultiple == 1?
                <FormGroup row>
                  <Col md="3">
                    <Label htmlFor="dateTo">Times</Label>
                  </Col>
                  <Col xs="12" md="9">
                    <Input type="text" name="times" id="times" value={this.state.times} onChange={this.handleChange.bind(this)}>

                    </Input>
                  </Col>
                </FormGroup>
                :
                null
              }

              <center>
                {
                  this.state.isUpdateClicked == false ?
                  <Button type="submit" size="sm" color="success"><i className="fa fa-dot-circle-o"></i> Submit</Button>
                  :
                  <Button type="submit" size="sm" color="success"><i className="fa fa-dot-circle-o"></i> Update</Button>
                }
                &nbsp;
                <Button type="reset" size="sm" color="danger" onClick={this.handleReset}><i className="fa fa-ban"></i> Reset</Button>
              </center>


            </Form>
            </CardBody>
          </Card>
        </Col>

        <Col xs="12" md="6">
          <Card>
            <CardHeader>
              <i className="fa fa-align-justify"></i> <strong>Promocode List</strong>
            </CardHeader>
            <ToastsContainer store={ToastsStore}/>
            <CardBody>

              <Table responsive bordered >
                <thead>
                  <tr>
                    <th>Prmocode</th>
                    <th>Effective From</th>
                    <th>Effective To</th>
                    <th>Invoice Amount</th>
                    <th>Promo Amount</th>
                    <th>Promo Percantage</th>
                    <th>Is Multiple</th>
                    <th>Times</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {
                    this.state.promocodeListPrint.map((promocodeListPrintValue, key) =>
                      <tr>
                        <td>{promocodeListPrintValue.promo_code}</td>
                        <td>{promocodeListPrintValue.effective_from}</td>
                        <td>{promocodeListPrintValue.effective_to}</td>
                        <td>{promocodeListPrintValue.invoice_amount}</td>
                        <td>{promocodeListPrintValue.promo_amount}</td>
                        <td>{promocodeListPrintValue.promo_percantage}</td>
                        <td>{promocodeListPrintValue.isMultiple}</td>
                        <td>{promocodeListPrintValue.times}</td>
                        <td>
                          <center>
                          <a href="#">
                              <i className="fa fa-edit fa-lg"  title="Edit Details Info" aria-hidden="true" style={{color: '#009345'}} data-id={promocodeListPrintValue.id} onClick={this.handleGetEditForm.bind(this)}></i>
                          </a>&nbsp;&nbsp;
                            <a href="#">
                              <i className="fa fa-trash fa-lg" data-id={promocodeListPrintValue.id} onClick={this.deleteClicked.bind(this)} title="Delete This Discount" aria-hidden="true" style={{color: '#EB1C22'}}></i>
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
          <ModalHeader toggle={this.toggleSmall}>Delete Discount</ModalHeader>
          <ModalBody>
            Are you sure to delete this discount ?
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={(e)=>{this.toggleSmall('Confirm')}} >Delete</Button>{' '}
            <Button color="secondary" onClick={this.toggleSmall} >Cancel</Button>
          </ModalFooter>
        </Modal>

      </Row>
    )
  }

}

export default Promocode;
