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


class VatTax extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.toggleFade = this.toggleFade.bind(this);

    this.state = {
      collapse: true,
      fadeIn: true,
      timeout: 300,
      isUpdateClicked: false,
      updateFeatureProducts: 0,
      productSlectionError: '',
      parentCategory: [],
      deliverChargeList: [],
      PurchaseList: [],
      deleteIdClicked: -1,
      CategoryList: '',
      vat: '',
      tax: '',
      date: '',
      editID: ''
    };

    this.handleCategoriesGet = this.handleCategoriesGet.bind(this);
    this.handleDeliveryAndChargeGet = this.handleDeliveryAndChargeGet.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.toggleSmall = this.toggleSmall.bind(this);

    this.handleGetEditForm = this.handleGetEditForm.bind(this);

  }

  handleReset () {
      window.location = '/vat-tax/add-vat-tax';
  }

  handleGetEditForm (event) {
      this.setState({
          editID: event.currentTarget.dataset['id']
      });

      fetch(base+`/api/getVatAndTaxData/?id=${event.currentTarget.dataset['id']}`, {
        method: 'GET'
      })
      .then(res => {
        return res.json()
      })
      .then(vatTax => {
        console.log(vatTax.data);

        if (vatTax.success ==true) {

            this.setState({
                CategoryList: vatTax.data[0].category_id,
                vat: vatTax.data[0].vat,
                tax: vatTax.data[0].tax,
                date: vatTax.data[0].effective_date.split(" ")[0],
                isUpdateClicked: true
            });

            setTimeout(() => {
                if (window.location.host == 'admin.banijjo.com.bd') {
                    this.setState({
                        date: vatTax.data[0].effective_date.split("T")[0],
                    })
                }
                else if (window.location.host == 'localhost:3005') {
                    this.setState({
                        date: vatTax.data[0].effective_date.split(" ")[0],
                    })
                }
            }, 50);
        }
        else {
            ToastsStore.warning(vatTax.message);
        }

        console.log('States Value : ', this.state);

        return false;
      });
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

    this.handleCategoriesGet();
    this.handleDeliveryAndChargeGet();

  }

  handleCategoriesGet() {
    fetch(base+'/api/parent-categories', {
      method: 'GET'
    })
    .then(res => {
      console.log(res);
      return res.json()
    })
    .then(parentCategory => {
      console.log(parentCategory.data);

      this.setState({
        parentCategory : parentCategory.data
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
        console.log('Trying to submit !');
        fetch(base+'/api/save_vat_tax' , {
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
            ToastsStore.success("Vat Tax Successfully inserted !!");
            console.log(info.success);

            setTimeout(
              function() {
                window.location = '/vat-tax/add-vat-tax';
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
              ToastsStore.warning("Vat Tax Insertion Faild. Please try again !!");
              console.log(info.success);
            }
          }

      });
    }
    else {
      ToastsStore.warning("New Vat Tax insertion failed. Please fill up all the required filed first !!");
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
            <strong>Add New Vat & Tax</strong>
          </CardHeader>
          <ToastsContainer store={ToastsStore}/>
          <CardBody>
            <Form action="" method="post" encType="multipart/form-data" onSubmit={this.handleSubmit} onChange={this.handleChange} className="form-horizontal">

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="vendorIdList">Category</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="select" name="CategoryList" id="CategoryList" value={this.state.CategoryList} onChange={this.handleChange.bind(this)}>
                    <option value="0">Please select</option>
                    {
                      this.state.parentCategory.map((productsCategoryValue, key) =>
                        <option value={productsCategoryValue.id}> {productsCategoryValue.category_name} </option>
                      )
                    }
                  </Input>
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="vat">Vat</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="text" name="vat" id="vat" value={this.state.vat} onChange={this.handleChange.bind(this)}>

                  </Input>
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="tax">Tax</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="text" name="tax" id="tax" value={this.state.tax} onChange={this.handleChange.bind(this)}>

                  </Input>
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="date">Effective Date</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="date" name="date" id="date" value={this.state.date} onChange={this.handleChange.bind(this)}>

                  </Input>
                </Col>
              </FormGroup>

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
          <CardFooter>

          </CardFooter>
        </Card>
      </Col>

      <Col xs="12" lg="6">
        <Card>
          <CardHeader>
            <Row>
              <Col md="6">
                <i className="fa fa-align-justify"></i> Product Vat & Tex List
              </Col>
              <Col md="6">

              </Col>
            </Row>
          </CardHeader>

          <CardBody>
          <Table responsive bordered>
            <thead>
              <tr>
                <th>Category Name</th>
                <th>Vat</th>
                <th>Tax</th>
                <th>Effective Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
                {
                  this.state.deliverChargeList.map((deliverChargeList_value, key) =>
                    <tr>
                      <td>
                        {
                          this.state.parentCategory.map((parentCategory_value, key) =>
                            parentCategory_value.id == deliverChargeList_value.category_id ?
                              <div>{parentCategory_value.category_name}</div>
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
                            <i className="fa fa-edit fa-lg"  title="Edit Details Info" aria-hidden="true" style={{color: '#009345'}} data-id={deliverChargeList_value.id} onClick={this.handleGetEditForm.bind(this)}></i>
                        </a>&nbsp;
                          <a href="#">
                            <i className="fa fa-trash fa-lg" data-id={deliverChargeList_value.id} onClick={this.deleteClicked.bind(this)} title="Delete This Specification Details" aria-hidden="true" style={{color: '#EB1C22'}}></i>
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



export default VatTax;
