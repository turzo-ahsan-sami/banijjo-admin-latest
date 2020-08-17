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


class DeliveryAndCharge extends Component {
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
      parentCategory: [],
      deliverChargeList: [],
      PurchaseList: [],
      deleteIdClicked: -1
    };

    this.handleCategoriesGet = this.handleCategoriesGet.bind(this);
    this.handleDeliveryAndChargeGet = this.handleDeliveryAndChargeGet.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.toggleSmall = this.toggleSmall.bind(this);

  }

  toggleSmall(event) {

    console.log(event.currentTarget.dataset['clicked']);

    if (event.currentTarget.dataset['clicked'] == 'permited') {
      console.log('condition applied');

      fetch(base+`/api/delete-delivery-charge/?id=${this.state.deleteIdClicked}`, {
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

              window.location = '/deliver-and-charge/add-deliver-and-charge';
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

    if ((this.state.CategoryList != undefined) && (this.state.maxRange != undefined) && (this.state.type != undefined) && (this.state.date != undefined)) {
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
        console.log('Trying to submit !');
        fetch(base+'/api/save_delivery_charge' , {
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
            ToastsStore.success("Deliver Charges Successfully inserted !!");
            console.log(info.success);

            setTimeout(
              function() {
                window.location = '/deliver-and-charge/add-deliver-and-charge';
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
              ToastsStore.warning("Deliver Charges Insertion Faild. Please try again !!");
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
            <strong>Add New Delivery & Charges</strong>
          </CardHeader>
          <ToastsContainer store={ToastsStore}/>
          <CardBody>
            <Form action="" method="post" encType="multipart/form-data" onSubmit={this.handleSubmit} onChange={this.handleChange} className="form-horizontal">

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="vendorIdList">Category</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="select" name="CategoryList" id="CategoryList" value={this.state.value} onChange={this.handleChange.bind(this)}>
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
                  <Label htmlFor="type">Type</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="select" name="type" id="type" value={this.state.value} onChange={this.handleChange.bind(this)}>
                    <option value="0">Please select</option>
                    <option value="Piece">Piece</option>
                    <option value="Weight">Weight</option>

                  </Input>
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="maxRange">Max Range</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="text" name="maxRange" id="maxRange" value={this.state.value} onChange={this.handleChange.bind(this)}>

                  </Input>
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="charge">Charge</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="text" name="charge" id="charge" value={this.state.value} onChange={this.handleChange.bind(this)}>

                  </Input>
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="date">Effective Date</Label>
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
                <i className="fa fa-align-justify"></i> Product Delivery & Charge List
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
                <th>Type</th>
                <th>Max Range</th>
                <th>Charge</th>
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
                      <td>{deliverChargeList_value.type}</td>
                      <td>{deliverChargeList_value.max_range}</td>
                      <td>{deliverChargeList_value.charge}</td>
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
        Do you want to delete this Delivery Charge ?
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



export default DeliveryAndCharge;
