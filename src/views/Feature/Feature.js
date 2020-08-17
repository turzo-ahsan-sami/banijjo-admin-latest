import React, { Component } from 'react';
import {ToastsContainer, ToastsStore} from 'react-toasts';
import cookie from 'react-cookies';

import {logoutFunction} from '../DynamicLogout/Logout';

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
  ListGroupItem
} from 'reactstrap';

const base = process.env.REACT_APP_ADMIN_SERVER_URL;


class Feature extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.toggleFade = this.toggleFade.bind(this);
    this.state = {
      productsCategory: [],
      collapse: true,
      fadeIn: true,
      timeout: 300,
      vendorList: [],
      productListArray: [],
      PurchaseList: [],
      feature_name: [],
      feature_products_list: [],
      isUpdateCalled: 0,
      updateFeatureProducts: 0,
      productSlectionError: ''
    };

    this.handleGet = this.handleGet.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);

  }

  getFilterProducts (event) {

    console.log('Filter Products !');

    fetch(base+`/api/search_filter_products/?vendorId=${this.state.vendorIdList}&categoryList=${this.state.categoryList}`, {
      method: 'GET',
      headers: {'Authorization': 'Atiq '+cookie.load('token')}
    })
    .then(res => {
      console.log(res);
      return res.json()
    })
    .then(products => {
      console.log('The api response for products quesry : ', products.data);

      this.setState({
        productList : products.data
      })

      this.state.productListArray = [];

      let i = 0;
      let j = 0;

      console.log('Array Length : ', this.state.productList.length);

      while (j < products.data.length) {
        console.log('Array Values : ', products.data[j]);

        if (products.data[j]) {
          console.log(products.data[j].id);
          let productObject = {};

          productObject.id = products.data[j].id;
          productObject.product_name_code = products.data[j].product_name+' - '+products.data[j].product_sku;
          productObject.productImage = products.data[j].home_image;

          this.state.productListArray.push(productObject);
        }
        else {
          console.log('Nullable');
        }

        ++j;
      }

      this.setState({
        productListArray: this.state.productListArray
      })

      console.log('Product List : ', this.state.productListArray);

      return false;
    });


  }

  searchProduct (event) {
    console.log('Searched value : ', event.target.value);

    console.log('categoryList Name : ', this.state.categoryList);
    console.log('vendorList Name : ', this.state.vendorIdList);
    console.log('token : ', cookie.load('token'));

    let target = event.target;
    let value = target.value;
    let name = target.name;

    this.setState({
      [name]: value
    });

    if ( event.target.value != '') {
      console.log('Event Values : ', event.target.value);
      fetch(base+`/api/search_feature_products/?id=${event.target.value}&vendorId=${this.state.vendorIdList}&categoryList=${this.state.categoryList}`, {
        method: 'GET',
        headers: {'Authorization': 'Atiq '+cookie.load('token')}
      })
      .then(res => {
        console.log(res);
        return res.json()
      })
      .then(products => {
        console.log('The api response for products quesry : ', products.data);

        this.setState({
          productList : products.data
        })

        this.state.productListArray = [];

        let i = 0;
        let j = 0;

        console.log('Array Length : ', this.state.productList.length);

        while (j < products.data.length) {
          console.log('Array Values : ', products.data[j]);

          if (products.data[j]) {
            console.log(products.data[j].id);
            let productObject = {};

            productObject.id = products.data[j].id;
            productObject.product_name_code = products.data[j].product_name+' - '+products.data[j].product_sku;
            productObject.productImage = products.data[j].home_image;

            this.state.productListArray.push(productObject);
          }
          else {
            console.log('Nullable');
          }

          ++j;
        }

        console.log('Product List : ', this.state.productListArray);

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

    this.setState({
      ['productImage']: event.target.dataset.image
    });

    this.state.productListArray = [];

    console.log(this.state.productName);
  }

  addClick(){
    console.log('OK');
    console.log('Feature Product : ', this.state.PurchaseList);
    console.log('Product Name : ', this.state.productName);

    if (typeof this.state.productName != 'undefined' && this.state.productName != '') {
      let purchaseObject = {};

      purchaseObject.productName = this.state.productName;
      purchaseObject.vendorId = this.state.vendorIdList;
      purchaseObject.categoryId = this.state.categoryList;
      purchaseObject.featureId = this.state.featureName;
      purchaseObject.productId = this.state.id;
      purchaseObject.productImage = this.state.productImage;

      console.log('Image : ', this.state.home_image);

      this.state.PurchaseList.push(purchaseObject);

      this.setState({
        PurchaseList: this.state.PurchaseList,
        productSlectionError: ''
      });

      console.log('Feature Product : ', this.state.PurchaseList);

      this.state.productName = '';
      this.state.productQuantity= '';
      this.state.productPrice= '';
      this.state.totalPrice= '';
      this.state.id='';
    }
    else {
      this.setState({
        productSlectionError: 'You need to select product'
      })
    }


  }

  deletePurchaseItem (key) {

    let PurchaseList = [...this.state.PurchaseList];
    PurchaseList.splice(key, 1);
    this.setState({ PurchaseList },()=>{
      let grandQuantity = 0;
      let grandTotal = 0;

      for (let i = 0; i < this.state.PurchaseList.length; i++) {
        grandQuantity += Number(this.state.PurchaseList[i].productQuantity);
        grandTotal += Number(this.state.PurchaseList[i].totalPrice);
      }

      this.state.grandTotalQuantity = grandQuantity;
      this.state.grandTotalPrice = grandTotal;
    });

    console.log('Purchase List : ', this.state.PurchaseList);

    console.log('New grand total quantity : ', this.state.grandTotalQuantity);
    console.log('New grand total price : ', this.state.grandTotalPrice);
  }

  deleteClicked (event) {
    console.log(event.currentTarget.dataset['id']);

    fetch(base+`/api/delete_feature_products/?id=${event.currentTarget.dataset['id']}`, {
      method: 'GET',
      headers: {'Authorization': 'Atiq '+cookie.load('token')}
    })
    .then(res => {
      console.log(res);
      return res.json()
    })
    .then(feature_products => {

      if (feature_products.success == true) {
        ToastsStore.success("Feature Products Successfully deleted !!");
        console.log(feature_products.message);

        setTimeout(
          function() {
            window.location = '/feature/feature';
          }
          .bind(this),
          3000
        );
      }
      else {

        if (feature_products.status == 403) {
          console.log(feature_products);

          ToastsStore.warning('Your session is expired. Please Login again');

          setTimeout(()=> {
            logoutFunction(localStorage.userName);
          }, 1000);

        }
        else {
          ToastsStore.warning("Feature delete Faild. Please try again !!");
          console.log(feature_products.success);
        }
      }

      return false;
    });

  }

  updateClicked (event) {
    console.log(event.currentTarget.dataset['id']);
    this.setState({
      updateFeatureProducts: event.currentTarget.dataset['id']
    })
    fetch(base+`/api/get_feature_products_for_update/?id=${event.currentTarget.dataset['id']}`, {
      method: 'GET'
    })
    .then(res => {
      console.log(res);
      return res.json()
    })
    .then(feature_products => {
      console.log(JSON.parse(feature_products.data[0].feature_products));
      this.state.PurchaseList = [];

      var parsedFeaturedProducts = JSON.parse(feature_products.data[0].feature_products);

      for(let i = 0; i < parsedFeaturedProducts.length; i++) {
        this.state.productName = parsedFeaturedProducts[i].productName;
        this.state.vendorIdList = parsedFeaturedProducts[i].vendorId;
        this.state.categoryList = parsedFeaturedProducts[i].categoryId;
        this.state.featureName = parsedFeaturedProducts[i].featureId;
        this.state.id = parsedFeaturedProducts[i].productId;
        this.state.productImage = parsedFeaturedProducts[i].productImage;

        this.addClick();
      }

      this.setState({
        isUpdateCalled: 1
      })

      // this.setState({
      //   productsCategory : feature_products.data
      // })
      //
      // this.state.productName;
      // this.state.vendorIdList;
      // this.state.categoryList;
      // this.state.featureName;
      // this.state.id;
      // this.state.productImage;
      //
      // this.addClick();

      return false;
    });

  }

  componentDidMount() {
    console.log('component mount executed');

    const userName = localStorage.getItem('userName');
    const userPassword = localStorage.getItem('userPassword');
    if(userName===null && userPassword === null)
    {
      this.props.history.push("/login");
    }

    fetch(base+'/api/categories', {
      method: 'GET'
    })
    .then(res => {
      console.log(res);
      return res.json()
    })
    .then(users => {
      console.log(users.data);
      this.setState({
        productsCategory : users.data
      })
      return false;
    });

    fetch(base+'/api/feature_name', {
      method: 'GET'
    })
    .then(res => {
      console.log(res);
      return res.json()
    })
    .then(feature_name => {
      console.log(feature_name.data);
      this.setState({
        feature_name : feature_name.data
      })
      return false;
    });

    fetch(base+'/api/vendor_list_for_product', {
      method: 'GET'
    })
    .then(res => {
      console.log(res);
      return res.json()
    })
    .then(vendor => {
      console.log(vendor.data);
      this.setState({
        vendorList : vendor.data
      })

      return false;
    });

    fetch(base+'/api/feature_products_list', {
      method: 'GET'
    })
    .then(res => {
      console.log(res);
      return res.json()
    })
    .then(feature_products_list => {
      console.log(feature_products_list.data);
      this.setState({
        feature_products_list : feature_products_list.data
      })

      return false;
    });

  }

  handleGet(event) {
    fetch(base+'/api/categories', {
      method: 'GET'
    })
    .then(res => {
      console.log(res);
      return res.json()
    })
    .then(users => {
      console.log(users.data);
      this.setState({ users })
      return false;
    });
    // .then(console.log(response));
  }

  handleSubmit(event) {
    event.preventDefault();

    console.log('Submitted Values : ', this.state);

    if (this.state.PurchaseList.length > 0) {
      if (this.state.isUpdateCalled == 1 && this.state.updateFeatureProducts != 0) {
        console.log('Update Called');

        fetch(base+'/api/update_feature_products' , {
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
            ToastsStore.success("Feature Products Successfully inserted !!");
            console.log(info.success);

            setTimeout(
              function() {
                window.location = '/feature/feature';
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
              ToastsStore.warning("Feature Products Update Faild. Please try again !!");
              console.log(info.success);
            }
          }

        })
      }
      else {
        fetch(base+'/api/save_feature_products' , {
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
            ToastsStore.success("Feature Products Successfully inserted !!");
            console.log(info.success);

            setTimeout(
              function() {
                window.location = '/feature/feature';
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
              ToastsStore.warning("Feature Products Insertion Faild. Please try again !!");
              console.log(info.success);
            }
          }

        })
      }
    }
    else {
      ToastsStore.warning("Feature Products Insertion Faild. Please Select Products First !!");
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
            <strong>Add New Feature Products</strong>
          </CardHeader>
          <ToastsContainer store={ToastsStore}/>
          <CardBody>
            <Form action="" method="post" encType="multipart/form-data" onSubmit={this.handleSubmit} onChange={this.handleChange} className="form-horizontal">

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="featureName">Feature Name</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="select" name="featureName" id="featureName" value={this.state.featureName} onChange={this.handleChange.bind(this)}>
                    <option value="0">Please select</option>
                    {
                      this.state.feature_name.map((feature_name_value, key) =>
                        <option value={feature_name_value.id}> {feature_name_value.name} </option>
                      )
                    }
                  </Input>
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="vendorIdList">Vendor List</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="select" name="vendorIdList" id="vendorIdList" value={this.state.value} onChange={this.handleChange.bind(this)}>
                    <option value="0">Please select</option>
                    {
                      this.state.vendorList.map((vendorListValue, key) =>
                        <option value={vendorListValue.id}> {vendorListValue.name} </option>
                      )
                    }
                  </Input>
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="categoryList">Category List</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="select" name="categoryList" id="categoryList" value={this.state.value} onChange={this.handleChange.bind(this)}>
                    <option value="0">Please select</option>
                    {
                      this.state.productsCategory.map((productsCategoryValue, key) =>
                        // productsCategory.parent_category_id == productsCategoryValue.id ? productsCategoryValue.category_name : null
                        <option value={productsCategoryValue.id}> {productsCategoryValue.category_name} </option>
                      )
                    }
                  </Input>
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="categoryName">Product Name</Label>
                </Col>
                <Col xs="12" md="8">
                  <Input type="text" id="productName" name="productName" value={this.state.productName} onChange={this.searchProduct.bind(this)} onClick={this.getFilterProducts.bind(this)} placeholder="Product Name or SKU" />
                </Col>
                <Col md="1">
                  <center>
                    <Label htmlFor="add"> <a href="#"  onClick={this.addClick.bind(this)}> <i className="fa fa-plus-square" style={{paddingTop: '11px'}}></i>  </a> </Label>&nbsp;
                  </center>


                </Col>
                <p style={{color: 'red'}}>
                  {this.state.productSlectionError}
                </p>
              </FormGroup>

              {/* <div row style={{overflow: 'scroll', height: '200px'}}>
                <Col xs="12" md="12">
                  {
                    this.state.productListArray.length != 0 ?

                    this.state.productListArray.map((values, key) =>
                      <ListGroupItem tag="button" name="productName" onClick={this.handleSearchText.bind(this)} data-id={values.id} data-value={values.product_name_code}  action>{values.product_name_code}</ListGroupItem>
                    ) :
                    null
                  }
                </Col>
              </div> */}

              {
                this.state.productListArray.length != 0 ?
                  <div row style={{overflow: 'scroll', height: '250px'}}>
                    <Col xs="12" md="12">
                      {
                        this.state.productListArray.map((values, key) =>
                          <ListGroupItem tag="button" name="productName" onClick={this.handleSearchText.bind(this)} data-id={values.id} data-value={values.product_name_code} data-image={values.productImage}  action>{values.product_name_code}</ListGroupItem>
                        )
                      }
                    </Col>
                  </div>
                :
                null
              }

              {
                this.state.PurchaseList.length > 0 ?
                <FormGroup row style={{backgroundColor: 'gray', paddingTop: '5px', color: 'white', textAlign: 'center'}}>
                  <Col md="12">
                    <Label htmlFor="categoryName">Selected Products Name</Label>
                  </Col>
                </FormGroup>
                :
                null
              }

              {
                this.state.PurchaseList.map((purchaseValues, key1) =>
                  <FormGroup row>
                    <Col md="11">
                      <Input type="text" readOnly value={purchaseValues.productName}/>
                    </Col>
                    <Col md="1">
                    <center>
                      <Label htmlFor="close" name="close" onClick={this.deletePurchaseItem.bind(this,key1)} > <a href="#"> <i className="fa fa-window-close" style={{paddingTop: '11px'}}></i> </a> </Label>
                    </center>

                    </Col>
                  </FormGroup>
                )
              }

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
          {/* <Button type="submit" size="sm" color="primary"><i className="fa fa-dot-circle-o"></i> Submit</Button>&nbsp;
            <Button type="button" size="sm" color="primary" onClick={this.handleGet}><i className="fa fa-dot-circle-o"></i> Get Data</Button>&nbsp;
            <Button type="reset" size="sm" color="danger"><i className="fa fa-ban"></i> Reset</Button> */}
          </CardFooter>
        </Card>
      </Col>

      <Col xs="12" lg="6">
            <Card>
              <CardHeader>
                <Row>
                  <Col md="6">
                    <i className="fa fa-align-justify"></i> Feature Product List
                  </Col>
                  <Col md="6">
                    {/* <Button type="button" size="sm" color="primary" onClick={this.handleGet}><i className="fa fa-dot-circle-o"></i> Get Data</Button>&nbsp; */}
                  </Col>
                </Row>
              </CardHeader>

              <CardBody>
                <Table responsive bordered>
                  <thead>
                  <tr>
                    <th>Feature Name</th>
                    <th>Vendor Name</th>
                    <th>Product Name</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                  </thead>
                  <tbody>

                    {
                      this.state.feature_products_list.map((feature_products_list_value, key) =>
                        <tr>
                          <td>{ feature_products_list_value.name }</td>
                          <td></td>
                          <td>
                            {
                              JSON.parse(feature_products_list_value.feature_products).map((feature_products_json_value, key) =>

                                <div>
                                  <li>
                                    {feature_products_json_value.productName}
                                  </li>
                                </div>
                              )
                            }
                          </td>
                          <td>
                            {
                              feature_products_list_value.status == 1 ?
                                <center>
                                  <i class="fa fa-check fa-lg" style={{color: '#009345'}}></i>
                                </center>
                              :
                              <center>
                                <i class="fa fa-times fa-lg" style={{color: 'red'}}></i>
                              </center>
                            }
                          </td>
                          <td>
                            <center>
                              <a href="#" ref="updateId" data-id={feature_products_list_value.id} onClick={this.updateClicked.bind(this)}>
                                <i className="fa fa-edit fa-lg"  title="Edit Specification Details Info" aria-hidden="true" style={{color: '#009345'}}></i>
                              </a>&nbsp;&nbsp;
                              <a href="#">
                                <i className="fa fa-trash fa-lg" data-id={feature_products_list_value.id} onClick={this.deleteClicked.bind(this)} title="Delete This Specification Details" aria-hidden="true" style={{color: '#EB1C22'}}></i>
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


    </Row>
    )
  }
}



export default Feature;
