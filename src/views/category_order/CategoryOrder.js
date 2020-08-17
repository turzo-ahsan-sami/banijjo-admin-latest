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
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from 'reactstrap';

const base = process.env.REACT_APP_ADMIN_SERVER_URL;


class CategoryOrder extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.toggleFade = this.toggleFade.bind(this);
    this.state = {
      categoriesCategory: [],
      collapse: true,
      fadeIn: true,
      timeout: 300,
      vendorList: [],
      CategoryListArray: [],
      PurchaseList: [],
      feature_name: [],
      feature_categories_list: [],
      limitExitMessageString: '',
      categoryOrderList: [],
      effectiveDate: '',
      effectiveDatePrint: ''
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.toggleSmall = this.toggleSmall.bind(this);

  }

  toggleSmall(event) {

    if (event == 'deleteCategoryOrderListPermitted') {
      fetch(base+'/api/category_order_list_delete', {
        method: 'GET',
        headers: {'Authorization': 'Atiq '+cookie.load('token')}
      })
      .then(res => {
        console.log(res);
        return res.json()
      })
      .then(info => {

        if (info.success == true) {
          ToastsStore.success("Navbar Category Order Successfully deleted !!");
          console.log(info.success);
          this.state.PurchaseList = [];
          this.getCategoryOrderList();

          this.setState({
            small: !this.state.small,
          });
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
            ToastsStore.warning("Navbar Category Order delete Faild. Please try again !!");
            console.log(info.success);
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

  getFilterCategory (event) {

    console.log('Filter categories !');

    fetch(base+`/api/search_filter_categories/`, {
      method: 'GET',
      headers: {'Authorization': 'Atiq '+cookie.load('token')}
    })
    .then(res => {
      console.log(res);
      return res.json()
    })
    .then(categories => {
      console.log('The api response for categories quesry : ', categories.data);

      this.setState({
        CategoryList : categories.data
      })

      this.state.CategoryListArray = [];

      let i = 0;
      let j = 0;

      console.log('Array Length : ', this.state.CategoryList.length);

      while (j < categories.data.length) {
        console.log('Array Values : ', categories.data[j]);

        if (categories.data[j]) {
          console.log(categories.data[j].id);
          let categoryObject = {};

          categoryObject.id = categories.data[j].id;
          categoryObject.product_name_code = categories.data[j].category_name;

          this.state.CategoryListArray.push(categoryObject);
        }
        else {
          console.log('Nullable');
        }

        ++j;
      }

      this.setState({
        CategoryListArray: this.state.CategoryListArray
      })

      console.log('Product List : ', this.state.CategoryListArray);

      return false;
    });


  }

  searchCategory (event) {
    console.log('Searched value : ', event.target.value);

    console.log('categoryList Name : ', this.state.categoryList);
    console.log('vendorList Name : ', this.state.vendorIdList);

    let target = event.target;
    let value = target.value;
    let name = target.name;

    this.setState({
      [name]: value
    });

    if ( event.target.value != '') {

      fetch(base+`/api/search_category_for_order_list/?search_string=${event.target.value}`, {
        method: 'GET',
        headers: {'Authorization': 'Atiq '+cookie.load('token')}
      })
      .then(res => {
        console.log(res);
        return res.json()
      })
      .then(categories => {
        console.log('The api response for categories quesry : ', categories.data);

        this.setState({
          CategoryList : categories.data
        })

        this.state.CategoryListArray = [];

        let i = 0;
        let j = 0;

        console.log('Array Length : ', this.state.CategoryList.length);

        while (j < categories.data.length) {
          console.log('Array Values : ', categories.data[j]);

          if (categories.data[j]) {
            console.log(categories.data[j].id);
            let categoryObject = {};

            categoryObject.id = categories.data[j].id;
            categoryObject.product_name_code = categories.data[j].category_name;

            this.state.CategoryListArray.push(categoryObject);
          }
          else {
            console.log('Nullable');
          }

          ++j;
        }

        console.log('Product List : ', this.state.CategoryListArray);

        return false;
      });

    }
    else {
      this.state.CategoryListArray = [];

      console.log('Product List : ', this.state.CategoryListArray);
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

    this.setState({
      categoryName : value
    })

    this.state.CategoryListArray = [];

    console.log(this.state.productName);
  }

  addClick(){
    console.log('OK');
    console.log(this.state.PurchaseList);

    if (this.state.PurchaseList.length < 10) {
      let categoryListObject = {};

      categoryListObject.categoryName = this.state.categoryName;
      categoryListObject.categoryId = this.state.id;

      this.state.PurchaseList.push(categoryListObject);
    }
    else {
      this.limitExitMessage ();
    }

    console.log('List : ', this.state.PurchaseList);

    this.setState({
      categoryName : ''
    })

    console.log('Add : ', this.addPurchase);

  }

  limitExitMessage () {
    this.state.limitExitMessageString = 'Limitation crossed ! Maximum size is 10 !';
  }

  deletePurchaseItem (key) {

    let PurchaseList = [...this.state.PurchaseList];
    PurchaseList.splice(key, 1);

    console.log('after splicing ', PurchaseList);

    this.setState({
      PurchaseList: PurchaseList
    })

    if (PurchaseList.length < 10) {
      // this.state.limitExitMessageString = '';
      console.log('The length is : ', PurchaseList.length );
      this.setState({
        limitExitMessageString: ''
      })
    }

    console.log('Limit exit message : ', this.state.PurchaseList.length);

    console.log('Purchase List : ', this.state.PurchaseList);

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
        categoriesCategory : users.data
      })
      return false;
    });

    this.getCategoryOrderList();

  }

  getCategoryOrderList () {
    fetch(base+'/api/category_order_list', {
      method: 'GET'
    })
    .then(res => {
      console.log(res);
      return res.json()
    })
    .then(categoryOrderList => {
      console.log('Category Order List Value : ', categoryOrderList.data);
      // this.setState({
      //   categoryOrderList : categoryOrderList.data,
      //   effectiveDatePrint : categoryOrderList.data[0].effectiveDate
      // });

      if (categoryOrderList.data.length > 0) {
        this.setState({
          categoryOrderList : categoryOrderList.data,
          effectiveDatePrint: categoryOrderList.data[0].effectiveDate
        })
      }

      // console.log('effective date : ', categoryOrderList.data[0].effectiveDate);
      return false;
    });
  }

  updateClicked () {

    fetch(base+'/api/category_order_list', {
      method: 'GET'
    })
    .then(res => {
      console.log(res);
      return res.json()
    })
    .then(categoryOrderList => {
      console.log('Category Order List Value : ', categoryOrderList.data);

      let PurchaseList = [];

      for (let i = 0; i < categoryOrderList.data.length; i++) {
        console.log('category name : ', categoryOrderList.data[i].category_name);

        let categoryListObject = {};

        categoryListObject.categoryName = categoryOrderList.data[i].category_name;
        categoryListObject.categoryId = categoryOrderList.data[i].category_id;

        PurchaseList.push(categoryListObject);

      }

      this.setState({
        PurchaseList : PurchaseList,
        effectiveDate: categoryOrderList.data[0].effectiveDate
      })
      return false;
    });
  }

  deleteItem () {
    fetch(base+'/api/category_order_list_delete', {
      method: 'GET',
      headers: {'Authorization': 'Atiq '+cookie.load('token')}
    })
    .then(res => {
      console.log(res);
      return res.json()
    })
    .then(info => {

      if (info.success == true) {
        ToastsStore.success("Navbar Category Order Successfully deleted !!");
        console.log(info.success);
        this.state.PurchaseList = [];
        this.setState({
          PurchaseList: []
        })
        this.getCategoryOrderList();
      }
      else {
        ToastsStore.warning("Navbar Category Order delete Faild. Please try again !!");
        console.log(info.success);
      }

      return false;
    });
  }

  handleSubmit(event) {
    event.preventDefault();

    console.log('Submitted Values : ', this.state.PurchaseList.length);

    if (this.state.PurchaseList.length == 10) {
      if (this.state.effectiveDate) {
        fetch(base+'/api/save_selected_category_order' , {
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
            ToastsStore.success("Navbar Category Order Successfully inserted !!");
            console.log(info.success);
            this.state.PurchaseList = [];
            this.state.effectiveDate = '';
            this.setState({
              limitExitMessageString: ''
            })
            this.getCategoryOrderList();
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
              ToastsStore.warning("Navbar Category Order Insertion Faild. Please try again !!");
              console.log(info.success);
            }
          }
  
        })
      }
      else {
        console.log('Please give the effective date');

        ToastsStore.warning('Please set an effective date for the feature category !');
      }
      
    }
    else {
      ToastsStore.warning('Limitation Issue !! The size is : '+this.state.PurchaseList.length+' Need At Least 10');
      console.log('Limitation Issue !! The size is : ', this.state.PurchaseList.length);
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

    console.log('Category : ', this.state.categoryName);
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
            <strong>Add New Navbar Category Order</strong>
          </CardHeader>
          <ToastsContainer store={ToastsStore}/>
          <CardBody>
            <Form action="" method="post" encType="multipart/form-data" onSubmit={this.handleSubmit} onChange={this.handleChange} className="form-horizontal">

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="categoryName">Category Name</Label>
                </Col>
                <Col xs="12" md="8">
                  <Input type="text" id="categoryName" name="categoryName" value={this.state.categoryName} onChange={this.searchCategory.bind(this)} onClick={this.getFilterCategory.bind(this)} placeholder="Category Search" />
                </Col>
                <Col md="1">
                  <center>
                    <Label htmlFor="add"> <a href="#"  onClick={this.addClick.bind(this)}> <i className="fa fa-plus-square" style={{paddingTop: '11px'}}></i>  </a> </Label>&nbsp;
                  </center>

                  {/* <Label htmlFor="productName"> <a href="#"> <i className="fa fa-window-close" style={{paddingTop: '11px'}}></i> </a> </Label>                 */}
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="categoryName">Effective Date</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="date" id="date-input" name="effectiveDate" value={this.state.effectiveDate} placeholder="date" />
                </Col>
              </FormGroup>

              {
                this.state.limitExitMessageString != '' ?
                <p style={{color: 'red'}}>
                  {this.state.limitExitMessageString}
                </p>
                :
                null
              }

              {
                this.state.CategoryListArray.length != 0 ?
                  <div row style={{overflow: 'scroll', height: '250px'}}>
                    <Col xs="12" md="12">
                      {
                        this.state.CategoryListArray.map((values, key) =>
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
                    <Label htmlFor="categoryName">Selected Categories Name</Label>
                  </Col>
                </FormGroup>
                :
                null
              }

              {
                this.state.PurchaseList.map((purchaseValues, key1) =>
                  <FormGroup row>
                    <Col md="11">
                      <Input type="text" readOnly value={purchaseValues.categoryName}/>
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
                <Button type="submit" size="sm" color="success"><i className="fa fa-dot-circle-o"></i> Submit</Button>&nbsp;

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
                <i className="fa fa-align-justify"></i>Navbar Category Order
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
                <th>Effective Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
              </thead>
              <tbody>

                {
                  <tr>
                    <td>
                      {
                        this.state.categoryOrderList.length > 0 ?
                          this.state.categoryOrderList.map((categoryOrderListValue, key) =>
                            <li>{categoryOrderListValue.category_name}</li>
                          )
                        :
                        <center style={{color: 'red', marginTop: '50%', marginBottom: '50%'}}>
                          No Data Found !
                        </center>
                      }
                    </td>
                    <td ><center style={{marginTop: '50%', marginBottom: '50%'}}>{this.state.effectiveDatePrint}</center></td>
                    <td>
                      {
                        this.state.categoryOrderList.length > 0 ?
                          <center>
                            <i class="fa fa-check fa-lg" style={{color: '#009345', marginTop: '50%', marginBottom: '50%'}}></i>
                          </center>
                        :
                        null
                      }
                    </td>
                    <td>
                      {
                        this.state.categoryOrderList.length > 0 ?
                          <center style={{marginTop: '50%', marginBottom: '50%'}}>
                            <a href="#" ref="updateId" onClick={this.updateClicked.bind(this)}>
                              <i className="fa fa-edit fa-lg"  title="Edit Specification Details Info" aria-hidden="true" style={{color: '#009345'}}></i>
                            </a>&nbsp;&nbsp;
                            <a href="#" onClick={(e)=>{this.toggleSmall('getDeleteModal')}}>
                              <i className="fa fa-trash fa-lg" title="Delete This Specification Details" aria-hidden="true" style={{color: '#EB1C22'}}></i>
                            </a>
                          </center>
                        :
                        null
                      }

                    </td>
                  </tr>
                }

              </tbody>
            </Table>
          </CardBody>

        </Card>
      </Col>

      <Modal isOpen={this.state.small} toggle={this.toggleSmall}
        className={'modal-sm ' + this.props.className}>
      <ModalHeader toggle={this.toggleSmall}> Delete Specification Details </ModalHeader>
      <ModalBody>
        <strong>
        <center>
          Are Sure to delete this category list order ?
        </center>
        </strong>
      </ModalBody>
      <ModalFooter>
        <Button color="success" onClick={(e)=>{this.toggleSmall('deleteCategoryOrderListPermitted')}} >yes</Button>{' '}
        <Button color="danger" onClick={(e)=>{this.toggleSmall('deleteCategoryOrderListDenied')}} >No</Button>
      </ModalFooter>
      </Modal>

    </Row>
    )
  }
}



export default CategoryOrder;
