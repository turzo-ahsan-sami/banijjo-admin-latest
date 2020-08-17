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

class Discount extends Component {

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
      discountListPrint: [],
      isUpdateCalled: 0,
      checkAllOrNot: true,
      productsCategory: [],
      productList: [],
      productListArray: [],
      deleteId: -1,
      confirmDelete: '',
      editID: '',
      isUpdateClicked: false,
      discountProvider: '',
      vendorId: '',
      type: '',
      dateFrom: '',
      dateTo: '',
      categoryId: '',
      checkAllProduct: '',
      discountProviderArray: [],
      typeArray: []
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.toggleSmall = this.toggleSmall.bind(this);

    this.handleGetEditForm = this.handleGetEditForm.bind(this);
  }

  handleReset () {
      window.location = '/discount-promocode/add-new-discount';
  }

  handleGetEditForm (event) {
      this.setState({
          editID: event.currentTarget.dataset['id']
      });

      fetch(base+`/api/getDiscountData/?id=${event.currentTarget.dataset['id']}`, {
        method: 'GET'
      })
      .then(res => {
        return res.json()
      })
      .then(discount => {
        console.log(discount.data);
        console.log('Host Name : ', window.location.host);

        if (discount.success ==true) {
            let products = JSON.parse(discount.data[0].product_id);

            this.setState({
                isUpdateClicked: true,
                discountProvider: discount.data[0].discount_owner == 'admin'? 1 : 2,
                vendorId: discount.data[0].discount_owner_id,
                vendorName: discount.data[0].discount_owner_id == 0 ? 'admin' : 'vendor',
                type: discount.data[0].discount_type == 'amount'? 1 : 2,

                categoryId: discount.data[0].category_id,
                checkAllProduct: '',
                // productName: products[0].productName,
                // id: products[0].id,
                // amountOrPurchase: products[0].discount,
            });

            setTimeout(()=>{
                for (var i = 0; i < products.length; i++) {
                    let purchaseObject = {};

                    purchaseObject.productName = products[i].productName;
                    purchaseObject.amountOrPercantage = products[i].discount;
                    purchaseObject.id = products[i].id;

                    this.state.discountList.push(purchaseObject);
                }

                if (window.location.host == 'admin.banijjo.com.bd') {
                    this.setState({
                        dateFrom: discount.data[0].effective_from.split("T")[0],
                        dateTo: discount.data[0].effective_to.split("T")[0],
                    })
                }
                else if (window.location.host == 'localhost:3005') {
                    this.setState({
                        dateFrom: discount.data[0].effective_from.split(" ")[0],
                        dateTo: discount.data[0].effective_to.split(" ")[0],
                    })
                }
            }, 50);

            setTimeout(()=> {
                this.setState({
                    discountList: this.state.discountList
                });
                console.log('Discount List : ', this.state.discountList);
            }, 200);
        }
        else {
            ToastsStore.warning(discount.message);
        }

        console.log('States Value : ', this.state);

        return false;
      });
  }

  toggleSmall(event) {

    if (event == 'Confirm') {
      console.log('Confirmation worked!');

      fetch(base+`/api/deleteDiscount/?id=${this.state.deleteId}`, {
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
          ToastsStore.success("Discount Successfully deleted !!");

          this.setState({
            small: !this.state.small,
          });

          this.handleDiscountList();
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
            ToastsStore.success("Discount did not delete. please try again !!");
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

        this.state.discountProviderArray[1]= 'Admin';
        this.state.discountProviderArray[2]= 'Vendor';

        this.state.typeArray[1] = 'Amount';
        this.state.typeArray[2] = 'Percentage';

        this.setState({
            discountProviderArray: this.state.discountProviderArray,
            typeArray: this.state.typeArray
        })

    const userName = localStorage.getItem('userName');
    const userPassword = localStorage.getItem('userPassword');
    this.state.userType = localStorage.getItem('user_type');

    // setTimeout(() => {
    //   this.setState({
    //     userType: this.state.userType
    //   })
    // }, 500);

    if (localStorage.getItem('user_type') == "vendor") {
      setTimeout(() => {
        this.setState({
          vendorId: localStorage.getItem('employee_id'),
          vendorName: localStorage.getItem('userName'),
          discountProvider: 'vendor',
          discountProviderId: 2
        })
      }, 500);
    }

    if(userName===null && userPassword === null)
    {
      this.props.history.push("/login");
    }

    this.handleDiscountList();
    this.handleCategories();
    this.handleVendors();

  }

  handleDiscountList() {
    fetch(base+`/api/discountList/?id=${localStorage.getItem('employee_id')}&userType=${this.state.userType}`, {
      method: 'GET'
    })
    .then(res => {
      console.log(res);
      return res.json()
    })
    .then(discountList => {
      console.log('Discount List : ', discountList.data);
      this.setState({
        discountListPrint : discountList.data
      })

      return false;
    });
  }

  handleCategories() {
    console.log('Categories method called !');

    // fetch(base+'/api/categories', {
    //   method: 'GET'
    // })
    // .then(res => {
    //   console.log(res);
    //   return res.json()
    // })
    // .then(category => {
    //   console.log(category.data);
    //   this.setState({
    //     productsCategory : category.data
    //   })
    //
    //   return false;
    // });

    fetch(base+'/api/specialCategoryListForSpecification', {
      method: 'GET'
    })
    .then(res => {
      console.log('Response From Special Category : ', res);
      return res.json()
    })
    .then(category => {
      let categoryList = [];
      console.log('Category List Name : ');
      console.log('Category List : ', category.data);

      for ( let i = 0; i < category.data.length; i++) {
        if (category.data[i] != null) {
          categoryList[i] = category.data[i];
        }
      }

      console.log('Category List updated : ', categoryList);

      this.setState({
        productsCategory : categoryList
      })

      console.log('Category List final state : ', categoryList);

      return false;
    });
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

  /* ADD PRODUCT TO THE LIST */

  addClick(){
    console.log('OK');
    console.log(this.state.discountList);
    console.log('Amount or Percantage : ', this.state.amountOrPercantage);

    let purchaseObject = {};

    purchaseObject.productName = this.state.productName;
    purchaseObject.amountOrPercantage = this.state.amountOrPercantage;
    purchaseObject.id = this.state.id;

    this.state.discountList.push(purchaseObject);

    console.log(this.state.discountList);

    this.state.productName = '';
    this.state.amountOrPercantage= '';
    this.state.id='';

    this.setState({
      amountOrPercantage: ''
    })

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

  /* AUTO SUGGEST START */

  searchProduct (event) {
    console.log('Searched value : ', event.target.value);

    let target = event.target;
    let value = target.value;
    let name = target.name;

    this.setState({
      [name]: value
    });

    if ( event.target.value != '') {

      fetch(base+`/api/search_products_for_discount/?id=${event.target.value}&vendorId=${this.state.vendorId}&categoryid=${this.state.categoryId}`, {
        method: 'GET',
        headers: {'Authorization': 'Atiq '+cookie.load('token')}
      })
      .then(res => {
        console.log(res);
        return res.json()
      })
      .then(products => {
          if (products.success == true) {
              console.log('The api response for products quesry : ', products.data);

              this.setState({
                productList : products.data
              })

              this.state.productListArray = [];

              let i = 0;
              let j = 0;

              console.log('Array Length : ', this.state.productList.length);

              while (j < products.data.length) {
                if (products.data[i]) {
                  console.log(products.data[j].id);
                  let productObject = {};

                  productObject.id = products.data[j].id;
                  productObject.product_name_code = products.data[j].product_name+' - '+products.data[j].product_sku;

                  this.state.productListArray.push(productObject);
                }
                else {
                  console.log('Nullable');
                }

                ++j;
              }

              console.log('Product List : ', this.state.productListArray);
          }
          else {
              console.log('Error : ', products.data);
          }


        return false;
      });

    }
    else {
      this.state.productListArray = [];

      console.log('Product List : ', this.state.productListArray);
    }

  }

  handleSearchText (event) {
    console.log(event.target.dataset.value);
    console.log(event.target.dataset.id);

    let target = event.target.dataset;
    let value = target.value;
    let name = event.target.name;

    console.log(name);
    console.log(event.target.name);
    console.log(value);

    this.setState({
      [name]: value
    });

    this.setState({
      ['id']: event.target.dataset.id
    });

    this.state.productListArray = [];

    console.log(this.state.productName);
  }

  handleSubmit(event) {
    console.log(this.state);
    event.preventDefault();

    fetch(base+'/api/save_discount' , {
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
        ToastsStore.success("Discount has Successfully inserted !!");
        console.log(info.success);
        setTimeout(
          function() {
          window.location = '/discount-promocode/add-new-discount';
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
                    this.state.isUpdateClicked == false ?
                    <strong>Add New Discount</strong>
                    :
                    <strong>Update Discount</strong>
                }

            </CardHeader>
            <ToastsContainer store={ToastsStore}/>
            <CardBody>
            <Form action="" method="post" encType="multipart/form-data" onSubmit={this.handleSubmit} onChange={this.handleChange} className="form-horizontal">

            {
              this.state.userType == 'super_admin' ?
              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="discountProvider">Discount Provider</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="select" name="discountProvider" id="discountProvider" value={this.state.discountProvider} onChange={this.handleChange.bind(this)}>
                    <option value="0">Please select</option>
                    {
                      this.state.discountProviderArray.map((discountProviderValue, key) =>
                        <option value={key}> {discountProviderValue} </option>
                      )
                    }
                  </Input>
                </Col>
              </FormGroup>
              :
              this.state.userType == 'admin' ?
              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="discountProvider">Discount Provider</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="select" name="discountProvider" id="discountProvider" value={this.state.value} onChange={this.handleChange.bind(this)}>
                    <option value="0">Please select</option>
                    {
                      this.state.discountProviderArray.map((discountProviderValue, key) =>
                        <option value={key}> {discountProviderValue} </option>
                      )
                    }
                  </Input>
                </Col>
              </FormGroup>
              :
              this.state.userType == 'admin_manager' ?
              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="discountProvider">Discount Provider</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="select" name="discountProvider" id="discountProvider" value={this.state.value} onChange={this.handleChange.bind(this)}>
                    <option value="0">Please select</option>
                    {
                      this.state.discountProviderArray.map((discountProviderValue, key) =>
                        <option value={key}> {discountProviderValue} </option>
                      )
                    }
                  </Input>
                </Col>
              </FormGroup>
              :
              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="discountProvider">Discount Provider</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="text" name="discountProvider" id="discountProvider" readOnly value={this.state.discountProvider} onChange={this.handleChange.bind(this)}>
                  </Input>
                  <Input type="hidden" name="discountProviderId" id="discountProviderId" readOnly value={this.state.discountProviderId} onChange={this.handleChange.bind(this)}>
                  </Input>
                </Col>
              </FormGroup>
            }

            {/*CHECK USER TYPE*/}

            {
              this.state.userType == 'super_admin' ?
                this.state.discountProvider == '1' ?
                <FormGroup row>
                  <Col md="3">
                    <Label htmlFor="vendorId">Vendor Name</Label>
                  </Col>
                  <Col xs="12" md="9">
                    <Input type="text" readOnly name="name" id="name" value={this.state.vendorName} onChange={this.handleChange.bind(this)}>
                    </Input>
                    <Input type="hidden" readOnly name="vendorId" id="vendorId" value={this.state.vendorId} onChange={this.handleChange.bind(this)}>
                    </Input>
                  </Col>
                </FormGroup>
                :
                <FormGroup row>
                  <Col md="3">
                    <Label htmlFor="vendorId">Vendor Name</Label>
                  </Col>
                  <Col xs="12" md="9">
                    <Input type="select" name="vendorId" id="vendorId" value={this.state.vendorId} onChange={this.handleChange.bind(this)}>
                      <option value="0">Please select</option>
                      {
                        this.state.vendorList.map((vendorListValue, key) =>
                          <option value={vendorListValue.vendor_id}> {vendorListValue.name} </option>
                        )
                      }
                    </Input>
                  </Col>
                </FormGroup>
              :
              this.state.userType == 'admin' ?
                this.state.discountProvider == '1' ?
                <FormGroup row>
                  <Col md="3">
                    <Label htmlFor="vendorId">Vendor Name</Label>
                  </Col>
                  <Col xs="12" md="9">
                    <Input type="text" readOnly name="name" id="name" value={this.state.vendorName} onChange={this.handleChange.bind(this)}>
                    </Input>
                    <Input type="hidden" readOnly name="vendorId" id="vendorId" value={this.state.vendorId} onChange={this.handleChange.bind(this)}>
                    </Input>
                  </Col>
                </FormGroup>
                :
                <FormGroup row>
                  <Col md="3">
                    <Label htmlFor="vendorId">Vendor Name</Label>
                  </Col>
                  <Col xs="12" md="9">
                    <Input type="select" name="vendorId" id="vendorId" value={this.state.vendorId} onChange={this.handleChange.bind(this)}>
                      <option value="0">Please select</option>
                      {
                        this.state.vendorList.map((vendorListValue, key) =>
                          <option value={vendorListValue.vendor_id}> {vendorListValue.name} </option>
                        )
                      }
                    </Input>
                  </Col>
                </FormGroup>
              :
              this.state.userType == 'admin_manager' ?
                this.state.discountProvider == '1' ?
                <FormGroup row>
                  <Col md="3">
                    <Label htmlFor="vendorId">Vendor Name</Label>
                  </Col>
                  <Col xs="12" md="9">
                    <Input type="text" readOnly name="name" id="name" value={this.state.vendorName} onChange={this.handleChange.bind(this)}>
                    </Input>
                    <Input type="hidden" readOnly name="vendorId" id="vendorId" value={this.state.vendorId} onChange={this.handleChange.bind(this)}>
                    </Input>
                  </Col>
                </FormGroup>
                :
                <FormGroup row>
                  <Col md="3">
                    <Label htmlFor="vendorId">Vendor Name</Label>
                  </Col>
                  <Col xs="12" md="9">
                    <Input type="select" name="vendorId" id="vendorId" value={this.state.vendorId} onChange={this.handleChange.bind(this)}>
                      <option value="0">Please select</option>
                      {
                        this.state.vendorList.map((vendorListValue, key) =>
                          <option value={vendorListValue.vendor_id}> {vendorListValue.name} </option>
                        )
                      }
                    </Input>
                  </Col>
                </FormGroup>
              :
              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="vendorId">Vendor Name</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="text" readOnly name="name" id="name" value={this.state.vendorName} onChange={this.handleChange.bind(this)}>
                  </Input>
                  <Input type="hidden" name="vendorId" id="vendorId" readOnly value={this.state.vendorId} onChange={this.handleChange.bind(this)}>
                  </Input>
                </Col>
              </FormGroup>
            }
            {/*END OF USER TYPE CHECKING*/}

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="type">Type</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="select" name="type" id="type" value={this.state.type} onChange={this.handleChange.bind(this)}>
                    <option value="0">Please select</option>
                    {
                      this.state.typeArray.map((typeArrayValue, key) =>
                        <option value={key}> {typeArrayValue} </option>
                      )
                    }
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
                  <Label htmlFor="categoryId">Category</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="select" name="categoryId" id="categoryId" value={this.state.categoryId} onChange={this.handleChange.bind(this)}>
                    <option value="0">Please select</option>
                    {
                      this.state.productsCategory.map((productsCategoryValue, key) =>
                        <option value={key}> {productsCategoryValue} </option>
                      )
                    }
                  </Input>
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="checkAllProduct">Check All Products</Label>
                </Col>
                <Col xs="12" md="3">
                  <Input style={{marginLeft: "-0.25rem"}} type="checkbox" name="checkAllProduct" id="checkAllProduct" value={this.state.checkAllProduct} onChange={this.handleChange.bind(this)} />
                </Col>
                <Col xs="12" md="6">
                  {' [ If you are going to set all the products at a time. ]'}
                </Col>
              </FormGroup>

              {
                this.state.checkAllOrNot == true ?
                  <React.Fragment>
                    <FormGroup row style={{backgroundColor: 'gray', paddingTop: '5px', color: 'white'}}>
                      <Col md="5">
                        <Label htmlFor="productName">Search Product</Label>
                      </Col>
                      <Col md="5">
                        <Label htmlFor="productName">Amount/Percantage</Label>
                      </Col>

                      <Col md="2">
                        <Label htmlFor="productName"> Action </Label>
                      </Col>
                    </FormGroup>

                    <FormGroup row>
                      <Col xs="12" md="5">
                      <Input type="text" id="productName" name="productName" placeholder="Product Name" onChange={this.searchProduct.bind(this)} value={this.state.productName}/>
                        <Input type="hidden" id="productName" name="productName" placeholder="Product Name" onChange={this.searchProduct.bind(this)} value={this.state.id}/>
                      </Col>

                      <Col xs="12" md="5">
                        <Input type="text" id="amountOrPercantage" name="amountOrPercantage" placeholder="Amount/Percantage" ref='clear' onChange={this.handleChange.bind(this)} value={this.state.amountOrPurchase}/>
                      </Col>

                      <Col md="2">
                      <center>
                        <Label htmlFor="add"> <a href="#"  onClick={this.addClick.bind(this)}> <i className="fa fa-plus-square" style={{paddingTop: '11px'}}></i>  </a> </Label>&nbsp;
                      </center>

                        {/* <Label htmlFor="productName"> <a href="#"> <i className="fa fa-window-close" style={{paddingTop: '11px'}}></i> </a> </Label>                 */}
                      </Col>
                    </FormGroup>
                  </React.Fragment>
                :
                <FormGroup row>
                  <Col xs="12" md="3">
                    <Label htmlFor="amountOrPercantageForAll">Amount/Percantage</Label>
                  </Col>
                  <Col xs="12" md="9">
                    <Input type="text" name="amountOrPercantageForAll" id="amountOrPercantageForAll" placeholder="Amount/Percantage" value={this.state.value} onChange={this.handleChange.bind(this)}></Input>
                  </Col>
                </FormGroup>
              }

              <FormGroup row>
                <Col xs="12" md="12">
                  {/* <table> */}

                    {
                      this.state.productListArray.length != 0 ?

                      this.state.productListArray.map((values, key) =>

                        <ListGroupItem tag="button" name="productName" onClick={this.handleSearchText.bind(this)} data-id={values.id} data-value={values.product_name_code}  action>{values.product_name_code}</ListGroupItem>
                      ) :
                      null
                    }
                  {/* </table> */}
                </Col>
              </FormGroup>

              {
                this.state.discountList.map((discountListValues, key1) =>
                  <FormGroup row>
                    <Col md="5">
                      <Input type="text" readOnly value={discountListValues.productName}/>
                    </Col>

                    <Col md="5">
                      <Input type="text" readOnly value={discountListValues.amountOrPercantage} />
                    </Col>

                    <Col md="2">
                      <Label htmlFor="close" name="close" onClick={this.deleteDiscountListItem.bind(this, key1)} > <a href="#"> <i className="fa fa-window-close" style={{paddingTop: '11px'}}></i> </a> </Label>
                    </Col>
                  </FormGroup>
                )
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
              <i className="fa fa-align-justify"></i> <strong>Discount List</strong>
            </CardHeader>
            <ToastsContainer store={ToastsStore}/>
            <CardBody>

              <Table responsive bordered >
                <thead>
                  <tr>
                    <th>Discount Owner</th>
                    <th>Discount Type</th>
                    <th>Discount Infos</th>
                    <th>Effective From</th>
                    <th>Effective To</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {
                    this.state.discountListPrint.map((discountListPrintValue, key) =>
                      <tr>
                        <td>{discountListPrintValue.discount_owner}</td>
                        <td>{discountListPrintValue.discount_type}</td>
                        <td>
                          {
                            JSON.parse(discountListPrintValue.product_id).map((ProductInfo, key1) =>
                              <div>
                                <li>
                                  <strong>Product Name:</strong> {ProductInfo.productName}<br/>
                                  <strong>Discount:</strong>  {ProductInfo.discount}
                                </li>
                              </div>
                            )
                          }
                        </td>
                        <td>{discountListPrintValue.effective_from}</td>
                        <td>{discountListPrintValue.effective_to}</td>
                        <td>{discountListPrintValue.status}</td>
                        <td>
                          <center>
                            <a href="#" ref="updateId" data-id={discountListPrintValue.id} onClick={this.handleGetEditForm.bind(this)}>
                              <i className="fa fa-edit fa-lg"  title="Edit Specification Details Info" aria-hidden="true" style={{color: '#009345'}}></i>
                            </a>&nbsp;&nbsp;
                            <a href="#">
                              <i className="fa fa-trash fa-lg" data-id={discountListPrintValue.id} onClick={this.deleteClicked.bind(this)} title="Delete This Discount" aria-hidden="true" style={{color: '#EB1C22'}}></i>
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

export default Discount;
