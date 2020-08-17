import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {ToastsContainer, ToastsStore} from 'react-toasts';
import { MDBDataTable } from 'mdbreact';

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
} from 'reactstrap';

const base = process.env.REACT_APP_ADMIN_SERVER_URL; 

class ProductSpecificationDetails extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.toggleFade = this.toggleFade.bind(this);
    this.state = {
      modal: false,
      large: false,
      productsCategory: [],
      productsCategoryList: [],
      productsSpecificationDetails: [],
      ProductSpecificationValuesArray: [],
      productSpecificationDetailsArray: [],
      specificationPaginateArray: [],
      productSpecificationlength: '',
      selectedPageNumber: 1,
      slelectedRowsNumber: 5,
      rangeStart: 1,
      rangeEnd: 3,
      morePaginate: 0,
      nextMoreRangeCount: 1,
      prevMoreRangeCount: 0,
      paginationLength: 3,
      getUpdateID: '',
      getDeleteId: '',
      collapse: true,
      fadeIn: true,
      timeout: 300,
      individualSpecificationDetails: [],
      updateProductSpecificationValuesArray: [],
      isUpdateButtonClicked: 0,
      isResetClicked: 0,
      isSpecificationDeleted: 0,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleProductChange = this.handleProductChange.bind(this);
    this.resetClicked = this.resetClicked.bind(this);

    this.handleUpdateSpecificationDetails = this.handleUpdateSpecificationDetails.bind(this);

    this.toggleSmall = this.toggleSmall.bind(this);
  }

  toggle() {
    this.setState({ collapse: !this.state.collapse });
  }

  toggleFade() {
    this.setState((prevState) => { return { fadeIn: !prevState }});
  }

  toggleSmall(event) {

    console.log('Name : ', event);
    // delete or update id

    if (event == 'deleteSpecificationDetailsPermitted') {
      console.log('data-id : ', event);

      fetch(base+`/api/deleteSpecificationDelete/?id=${this.state.getDeleteId}`, {
        method: 'GET'
      })
      .then(res => {
        console.log(res);
        return res.json()
      })
      .then(deletedInfo => {
        console.log('Deleted Info : ', deletedInfo); 

        ToastsStore.success("Product Specification Details Successfully deleted !!");

        this.setState({
          small: !this.state.small,
        });

        this.handleGenarateDataTable();

        return false;
      });
    }
    else if (event == 'deleteSpecificationDetailsDenied') {
      console.log('data-id : ', event);

      this.state.getDeleteId = 0;

      this.setState({
        small: !this.state.small,
      });
    }
    
  }

  deleteItem (event) {
    console.log('delete Item function called !');
    this.state.getDeleteId = event.currentTarget.dataset['id'];
    this.setState({
      small: !this.state.small,
    });
  }

  componentDidMount() {
    const userName = localStorage.getItem('userName');
    const userPassword = localStorage.getItem('userPassword');

    this.state.rangeEnd = this.state.paginationLength;

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
    .then(category => {
      console.log(category.data); 
      this.setState({ 
        productsCategory : category.data
      })
      
      return false;
    });

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
        productsCategoryList : categoryList
      })

      console.log('Category List final state : ', categoryList);
      
      return false;
    });

    this.handleGenarateDataTable();

  }

  handleUpdateSpecificationDetails (event) {
    console.log('Specification Event value is : ', event);
    // this.setState({
    //   ProductSpecificationValuesArray: JSON.parse(event)
    // })

    console.log('The Array Value before parse is : ', this.state.ProductSpecificationValuesArray);

    if (this.state.ProductSpecificationValuesArray.length == 0 && this.state.isSpecificationDeleted == 0) {
      this.state.ProductSpecificationValuesArray = JSON.parse(event);
    }

    console.log('The parse Value is : ', this.state.ProductSpecificationValuesArray);
  }

  handleGenarateDataTable () {
    fetch(base+'/api/product_specification_details', {
      method: 'GET'
    })
    .then(res => {
      console.log(res);
      return res.json()
    })
    .then(specificationName => {
      console.log(specificationName.data); 
      this.setState({ 
        productsSpecificationDetails : specificationName.data
      })
      this.setState({
        productSpecificationlength: this.state.productsSpecificationDetails.length/5
      })

      this.state.nextMoreRangeCount = this.state.rangeEnd;

      let paginateArray = [];

      let totalPagination = Math.ceil(specificationName.specification_details_count/this.state.slelectedRowsNumber);

      console.log('Total Pagination is : ', totalPagination);

      console.log('Total Pagination is : ', specificationName.specification_details_count);

      for (let i = 1; i <= totalPagination; i++) {
        paginateArray[i] = i;
      }

      this.setState({
        specificationPaginateArray: paginateArray
      })

      console.log('Paginate Array : ', paginateArray, 'length: ', this.state.productSpecificationlength);

      console.log('Specification : ', this.state.productsSpecificationDetails);

      return false;
    });
  }

  handleMorePaginateNumber (event) {
    this.state.prevMoreRangeCount = Number(this.state.rangeStart);
    console.log(this.state.prevMoreRangeCount);

    this.state.rangeStart = Number(this.state.rangeEnd) + Number(1);
    this.state.rangeEnd = Number(this.state.rangeEnd) + Number(this.state.rangeEnd);

    this.state.nextMoreRangeCount = this.state.rangeEnd;

    // CHANGE PAGINATE NUMBERS

    this.state.selectedPageNumber = Number(this.state.rangeStart);

    console.log('Next More Range Count : ', this.state.nextMoreRangeCount);

    console.log('Selected Total Rows : ', this.state.slelectedRowsNumber);

    console.log('Selected Page Number : ', this.state.selectedPageNumber);

    fetch(base+`/api/details_specification_paginate/?rows=${this.state.slelectedRowsNumber}&page_number=${this.state.selectedPageNumber}&field_name=${event.target.name}`, {
      method: 'GET'
    })
    .then(res => {
      console.log(res);
      return res.json()
    })
    .then(specificationDetails => {
      console.log('The api response for products quesry : ', specificationDetails.data);

      this.setState({ 
        productsSpecificationDetails : specificationDetails.data
      })

      let paginateArray = [];

      let totalPagination = Math.ceil(specificationDetails.specification_details_count/this.state.slelectedRowsNumber);

      console.log('Total Pagination is : ', totalPagination);

      console.log('Total Pagination is : ', specificationDetails.specification_details_count);

      for (let i = 1; i <= totalPagination; i++) {
        paginateArray[i] = i;
      }

      this.setState({
        specificationPaginateArray: paginateArray
      })

      return false;
    });

    // END

    console.log('range start : ', this.state.rangeStart);
    console.log('range end : ', this.state.rangeEnd);
  }

  handlePrevMorePaginateNumber (event) {
    console.log('range start : ', this.state.rangeStart);
    console.log('range end : ', this.state.rangeEnd);
    console.log('Get Previous Pagenumber');

    this.state.rangeEnd =  Number(this.state.rangeStart) - Number(1);
    this.state.rangeStart = Number(this.state.rangeStart) - Number(this.state.paginationLength);

    // CHANGE PAGINATE NUMBERS

    this.state.selectedPageNumber = Number(this.state.rangeStart);
    this.state.nextMoreRangeCount = this.state.rangeEnd;

    console.log('Next More Range Count : ', this.state.nextMoreRangeCount);

    console.log('Selected Total Rows : ', this.state.slelectedRowsNumber);

    console.log('Selected Page Number : ', this.state.selectedPageNumber);

    this.state.prevMoreRangeCount = Number(this.state.rangeStart) - Number(1);

    fetch(base+`/api/details_specification_paginate/?rows=${this.state.slelectedRowsNumber}&page_number=${this.state.selectedPageNumber}&field_name=${event.target.name}`, {
      method: 'GET'
    })
    .then(res => {
      console.log(res);
      return res.json()
    })
    .then(specificationDetails => {
      console.log('The api response for products quesry : ', specificationDetails.data);

      this.setState({ 
        productsSpecificationDetails : specificationDetails.data
      })

      let paginateArray = [];

      let totalPagination = Math.ceil(specificationDetails.specification_details_count/this.state.slelectedRowsNumber);

      console.log('Total Pagination is : ', totalPagination);

      console.log('Total specifacation details for paginate  is : ', specificationDetails.specification_details_count);

      for (let i = 1; i <= totalPagination; i++) {
        paginateArray[i] = i;
      }

      this.setState({
        specificationPaginateArray: paginateArray
      })

      return false;
    });

    // END

  }

  handlePagianteNumber (event) {
    console.log(event.target.name);
    console.log(event.target.value);

    if (event.target.name == 'paginateNumber') {

      this.state.slelectedRowsNumber = event.target.value;

      this.state.selectedPageNumber = 1;

      this.state.rangeStart = 1;

      this.state.rangeEnd = this.state.paginationLength;

      this.state.prevMoreRangeCount = 0;

      this.state.nextMoreRangeCount = this.state.paginationLength;

      console.log('Selected Total Rows : ', this.state.slelectedRowsNumber);

      console.log('Selected Page Number : ', this.state.selectedPageNumber);

      fetch(base+`/api/details_specification_paginate/?rows=${this.state.slelectedRowsNumber}&page_number=${this.state.selectedPageNumber}&field_name=${event.target.name}`, {
        method: 'GET'
      })
      .then(res => {
        console.log(res);
        return res.json()
      })
      .then(specificationDetails => {
        console.log('The api response for products quesry : ', specificationDetails.data);

        this.setState({ 
          productsSpecificationDetails : specificationDetails.data
        })

        let paginateArray = [];
  
        let totalPagination = Math.ceil(specificationDetails.specification_details_count/this.state.slelectedRowsNumber);
  
        console.log('Total Pagination is : ', totalPagination);
  
        console.log('Total Pagination is : ', specificationDetails.specification_details_count);
  
        for (let i = 1; i <= totalPagination; i++) {
          paginateArray[i] = i;
        }
  
        this.setState({
          specificationPaginateArray: paginateArray
        })
  
        return false;
      });

    }
    else if (event.target.name == 'search') {

      this.state.selectedPageNumber = 1;

      this.state.rangeStart = 1;

      this.state.rangeEnd = this.state.paginationLength;

      this.state.prevMoreRangeCount = 0;

      this.state.nextMoreRangeCount = this.state.paginationLength;

      console.log('Selected Total Rows : ', this.state.slelectedRowsNumber);

      console.log('Selected Page Number : ', this.state.selectedPageNumber);

      fetch(base+`/api/details_specification_paginate/?rows=${this.state.slelectedRowsNumber}&page_number=${this.state.selectedPageNumber}&field_name=${event.target.name}&search_value=${event.target.value}`, {
        method: 'GET'
      })
      .then(res => {
        console.log(res);
        return res.json()
      })
      .then(specificationDetails => {
        console.log('The api response for products quesry : ', specificationDetails.data);

        this.setState({ 
          productsSpecificationDetails : specificationDetails.data
        })

        let paginateArray = [];
  
        let totalPagination = Math.ceil(specificationDetails.specification_details_count/this.state.slelectedRowsNumber);
  
        console.log('Total Pagination is : ', totalPagination);
  
        console.log('Total Pagination is : ', specificationDetails.specification_details_count);
  
        for (let i = 1; i <= totalPagination; i++) {
          paginateArray[i] = i;
        }
  
        this.setState({
          specificationPaginateArray: paginateArray
        })
  
        return false;
      });
    }
    else if (event.target.name == 'prevPage'){
      console.log('Range Start : ', this.state.rangeStart);
      console.log('Range End : ', this.state.rangeEnd);

      this.state.selectedPageNumber = Number(this.state.selectedPageNumber) - Number(event.target.value);

      if (this.state.selectedPageNumber <= 0) {
        this.state.selectedPageNumber = 1;
      }

      if (this.state.rangeStart > this.state.selectedPageNumber) {
        this.state.rangeStart = Number(this.state.rangeStart) - Number(this.state.paginationLength);
        this.state.prevMoreRangeCount = Number(this.state.rangeStart) - Number(1);
        if ( this.state.rangeStart <= 0 ) {
          this.state.rangeStart = 1;
          this.state.prevMoreRangeCount = 0;
        }
        
        this.state.rangeEnd = Number(this.state.rangeEnd) - Number(this.state.paginationLength);
        this.state.nextMoreRangeCount = this.state.rangeEnd;
      }

      console.log('Selected Total Rows : ', this.state.slelectedRowsNumber);

      console.log('Selected Page Number : ', this.state.selectedPageNumber);

      fetch(base+`/api/details_specification_paginate/?rows=${this.state.slelectedRowsNumber}&page_number=${this.state.selectedPageNumber}&field_name=${event.target.name}`, {
        method: 'GET'
      })
      .then(res => {
        console.log(res);
        return res.json()
      })
      .then(specificationDetails => {
        console.log('The api response for products quesry : ', specificationDetails.data);

        this.setState({ 
          productsSpecificationDetails : specificationDetails.data
        })

        let paginateArray = [];
  
        let totalPagination = Math.ceil(specificationDetails.specification_details_count/this.state.slelectedRowsNumber);
  
        console.log('Total Pagination is : ', totalPagination);
  
        console.log('Total Pagination is : ', specificationDetails.specification_details_count);
  
        for (let i = 1; i <= totalPagination; i++) {
          paginateArray[i] = i;
        }
  
        this.setState({
          specificationPaginateArray: paginateArray
        })
  
        return false;
      });

    }
    else if (event.target.name == 'nextPage'){
      console.log('Range Start : ', this.state.rangeStart);
      console.log('Range End : ', this.state.rangeEnd);
      
      this.state.selectedPageNumber = Number(this.state.selectedPageNumber) + Number(event.target.value);

      if (this.state.selectedPageNumber == this.state.specificationPaginateArray.length) {
        this.state.selectedPageNumber = Number(this.state.selectedPageNumber) - Number(1);
        console.log('page Number is equal to the total length : ', this.state.specificationPaginateArray);
      }

      if (this.state.rangeEnd < this.state.selectedPageNumber) {
        this.state.rangeStart = this.state.selectedPageNumber;
        this.state.prevMoreRangeCount = Number(this.state.selectedPageNumber) - Number(1);
        this.state.rangeEnd = Number(this.state.rangeEnd) + Number(this.state.paginationLength);
        this.state.nextMoreRangeCount = this.state.rangeEnd;
      }

      console.log('Selected Total Rows : ', this.state.slelectedRowsNumber);

      console.log('Selected Page Number : ', this.state.selectedPageNumber);

      console.log('Paginate Array : ', this.state.specificationPaginateArray.length);

      fetch(base+`/api/details_specification_paginate/?rows=${this.state.slelectedRowsNumber}&page_number=${this.state.selectedPageNumber}&field_name=${event.target.name}`, {
        method: 'GET'
      })
      .then(res => {
        console.log(res);
        return res.json()
      })
      .then(specificationDetails => {
        console.log('The api response for products quesry : ', specificationDetails.data);

        this.setState({ 
          productsSpecificationDetails : specificationDetails.data
        })

        let paginateArray = [];
  
        let totalPagination = Math.ceil(specificationDetails.specification_details_count/this.state.slelectedRowsNumber);
  
        console.log('Total Pagination is : ', totalPagination);
  
        console.log('Total Pagination is : ', specificationDetails.specification_details_count);
  
        for (let i = 1; i <= totalPagination; i++) {
          paginateArray[i] = i;
        }
  
        this.setState({
          specificationPaginateArray: paginateArray
        })
  
        return false;
      });

    }
    else {

      this.state.selectedPageNumber = event.target.value;

      console.log('Selected Total Rows : ', this.state.slelectedRowsNumber);

      console.log('Selected Page Number : ', this.state.selectedPageNumber);

      fetch(base+`/api/details_specification_paginate/?rows=${this.state.slelectedRowsNumber}&page_number=${this.state.selectedPageNumber}&field_name=${event.target.name}`, {
        method: 'GET'
      })
      .then(res => {
        console.log(res);
        return res.json()
      })
      .then(specificationDetails => {
        console.log('The api response for products quesry : ', specificationDetails.data);

        this.setState({ 
          productsSpecificationDetails : specificationDetails.data
        })

        let paginateArray = [];
  
        let totalPagination = Math.ceil(specificationDetails.specification_details_count/this.state.slelectedRowsNumber);
  
        console.log('Total Pagination is : ', totalPagination);
  
        console.log('Total Pagination is : ', specificationDetails.specification_details_count);
  
        for (let i = 1; i <= totalPagination; i++) {
          paginateArray[i] = i;
        }
  
        this.setState({
          specificationPaginateArray: paginateArray
        })
  
        return false;
      });

    }

    
    
  }

  handleAddValues (event) {

    this.setState({
      // ProductSpecificationValuesArray: this.state.ProductSpecificationValues
    });

    this.state.ProductSpecificationValuesArray.push(this.state.ProductSpecificationValues);

    // this.ProductSpecificationValArray.push(this.state.ProductSpecificationValues);

    this.state.isSpecificationDeleted = 0;

    ReactDOM.findDOMNode(this.refs.clear).value = "";
  }

  handleDeleteButton (keyId) {
    console.log("Key for delete:",keyId);

    let ProductSpecificationValuesArrays = this.state.ProductSpecificationValuesArray.filter((e, i) => i !== keyId);
    console.log(ProductSpecificationValuesArrays);
    this.setState({ ProductSpecificationValuesArray : ProductSpecificationValuesArrays });

    this.state.isSpecificationDeleted = 1;

    console.log(this.state.ProductSpecificationValuesArray);
    
  }

  handleAddChange (event) {
    this.setState({ ProductSpecificationValues: event.target.value });
  }

  handleProductChange(event) {
    // this.setState({value: event.target.value});
    // alert(event.target.value);
    let target = event.target;
    let value = target.type === 'checkbox' ? target.checked : target.value;
    let name = target.name;

    this.setState({
      [name]: value
    });
  }

  updateClicked (event) {
    // this.state.isUpdateButtonClicked = 1;
    this.setState({
      isUpdateButtonClicked: 1
    })

    this.state.getUpdateID = event.currentTarget.dataset['id'];
    this.state.isSpecificationDeleted = 0;

    fetch(base+`/api/get_individual_specification_details/?id=${this.state.getUpdateID}`, {
      method: 'GET'
    })
    .then(res => {
      console.log(res);
      return res.json()
    })
    .then(individualSpecificationDetails => {
      console.log('Return Specification value is : ', individualSpecificationDetails.data[0].id); 

      // this.setState({
      //   large: !this.state.large,
      // });

      this.setState({
        individualSpecificationDetails: individualSpecificationDetails.data
      })

      // this.state.ProductSpecificationValuesArray = JSON.parse(this.state.individualSpecificationDetails[0].specification_details_name);

      console.log('ID From State : ', this.state.individualSpecificationDetails[0].category_id);

      // console.log('Datails Array : ', this.state.ProductSpecificationValuesArray);
      
      return false;
    });
    
  }

  resetClicked () {
    // this.state.isResetClicked = 1;
    console.log('Reset Clicked');
    this.setState({
      isUpdateButtonClicked: 0
    })

    this.state.individualSpecificationDetails = [];
    this.state.ProductSpecificationValuesArray= [];
    
  }

  handleSubmit(event) {
    console.log(this.state);
    console.log('Update Button Clicked : ', this.state.isUpdateButtonClicked);
    event.preventDefault();

    if (this.state.isUpdateButtonClicked == 1) {
      fetch(base+'/api/updateSpecificationDetails' , {
        method: "POST",
        headers: {
          'Content-type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          ProductSpecificationValuesArray: this.state.ProductSpecificationValuesArray, 
          getUpdateID: this.state.getUpdateID
        })
      })
      .then((result) => result.json())
      .then((info) => { 
        if (info.success == true) {
          ToastsStore.success("Product Specification Details Successfully updated !!");
          console.log(info.success);
          console.log(info.result);

          console.log(info.data); 
          this.setState({ 
            productsSpecificationDetails : info.data
          })
          this.setState({
            productSpecificationlength: this.state.productsSpecificationDetails.length/5
          })

          this.state.nextMoreRangeCount = this.state.rangeEnd;

          let paginateArray = [];

          let totalPagination = Math.ceil(info.specification_details_count/5);

          console.log('Total Pagination is : ', totalPagination);

          console.log('Total Pagination is : ', info.specification_details_count);

          for (let i = 1; i <= totalPagination; i++) {
            paginateArray[i] = i;
          }

          this.setState({
            specificationPaginateArray: paginateArray
          })

          console.log('Paginate Array : ', paginateArray, 'length: ', this.state.productSpecificationlength);

          console.log('Specification : ', this.state.productsSpecificationDetails);

          this.state.ProductSpecificationValuesArray = [];

          this.setState({
            isUpdateButtonClicked: 0
          })
      
          this.state.individualSpecificationDetails = [];

        }
        else {
          ToastsStore.warning("Product Insertion Faild. Please try again !!");
          console.log(info.success);
        }
        
      })
    }
    else {
      fetch(base+'/api/saveSpecificationDetails' , {
        method: "POST",
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(this.state)
      })
      .then((result) => result.json())
      .then((info) => { 
        if (info.success == true) {
          ToastsStore.success("Product Specification Details Successfully inserted !!");
          console.log(info.success);
          this.handleGenarateDataTable();

          this.setState({
            ProductSpecificationValues: [],
            ProductSpecificationValuesArray: []
          })
          
          setTimeout(
            function() {
            // this.props.history.push("/product/products");
            // window.location = '/product/products-specification-details';
            }
            .bind(this),
            3000
          );
        }
        else {
          ToastsStore.warning("Product Insertion Faild. Please try again !!");
          console.log(info.success);
        }
        
      })
    }

    
  }

  render() {

    return (
      <Row>
        <ToastsContainer store={ToastsStore}/>
      <Col xs="12" md="6">
        <Card>
          <CardHeader>
            <strong>Add Product Specification Details</strong> 
          </CardHeader>
          <CardBody>
            
            <Form action="" method="post" onSubmit={this.handleSubmit} onChange={this.handleProductChange} encType="multipart/form-data" className="form-horizontal">

              {/* <FormGroup row>
                <Col md="3">
                  <Label htmlFor="specification_details_name">Specification Details Name</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="textarea" id="specification_details_name" name="specification_details_name" placeholder="Details Name" />
                </Col>
              </FormGroup> */}

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="values">Specification Details Name</Label>
                </Col>
                <Col xs="12" md="7">
                  <Input type="text" id="values" name="values" placeholder="values" ref='clear' onChange={this.handleAddChange.bind(this)} />
                </Col>
                <Col xs="12" md="2">
                  <Button block color="ghost-primary" onClick={this.handleAddValues.bind(this)}> Add </Button>
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col md="3">
                  &nbsp;
                </Col>

                <Col xs="12" md="9">
                  {
                    this.state.isUpdateButtonClicked == 0 ? 
                      <div row>
                        {
                          this.state.ProductSpecificationValuesArray.map((ProductSpecificationVal, key) =>

                            <Button style={{paddingLeft:"10px",marginLeft:"10px"}} className="btn-pill btn btn-dark" type="button" size="sm" color="primary" id="tagButton" value={key} onClick={this.handleDeleteButton.bind(this,key)}> {ProductSpecificationVal} <i style={{color:'red'}} className="fa fa-close"></i> </Button> 

                          )
                        }
                      </div>
                    :
                      this.state.individualSpecificationDetails.length > 0 ?
                        <div>
                          <div>
                            {
                              this.handleUpdateSpecificationDetails(this.state.individualSpecificationDetails[0].specification_details_name)
                            }
                          </div>
                          <div row>
                            {
                              this.state.ProductSpecificationValuesArray.map((ProductSpecificationVal, key) =>

                                <Button style={{paddingLeft:"10px",marginLeft:"10px"}} className="btn-pill btn btn-dark" type="button" size="sm" color="primary" id="tagButton" value={key} onClick={this.handleDeleteButton.bind(this,key)}> {ProductSpecificationVal} <i style={{color:'red'}} className="fa fa-close"></i> </Button> 

                              )
                            }
                          </div>
                        </div>
                      :
                        null
                  }
                  
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="categoryId">Select Product Category</Label>
                </Col>
                {
                  this.state.isUpdateButtonClicked == 0 ? 
                    <Col xs="12" md="9">
                      <Input type="select" name="categoryId" id="categoryId">
                        <option value="0">Please select</option>
                        {
                          this.state.productsCategoryList.map((productsCategoryListValue, key) =>
                            <option value={key}> {productsCategoryListValue} </option>
                          )
                        }
                      </Input>
                    </Col>
                  :
                  <Col xs="12" md="9">
                    {
                      this.state.productsCategoryList.map((productsCategoryListValue, key) =>
                      this.state.individualSpecificationDetails.length > 0 ?

                        key == this.state.individualSpecificationDetails[0].category_id ?
                        <Input type="text" name="categoryId" id="categoryId" readOnly value={productsCategoryListValue}>
                        </Input>
                        :
                        null
                      :
                      null
                      )
                    }
                    
                  </Col>
                }
                
              </FormGroup>

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="select">Status</Label>
                </Col>
                {
                  this.state.isUpdateButtonClicked == 0 ? 
                  <Col xs="12" md="9">
                    <Input type="select" name="select" id="select">
                      <option value="2">Active</option>
                      <option value="3">Inactive</option>
                    </Input>
                  </Col>
                  :
                  <Col xs="12" md="9">
                    <Input type="text" name="status" readOnly  id="status" value="Active">
                    </Input>
                  </Col>
                }
                
              </FormGroup>
              {
                this.state.isUpdateButtonClicked == 0 ? 
                <Button type="submit" size="sm" name="submitButtonClicked" color="success"><i className="fa fa-dot-circle-o"></i> Submit </Button>
                :
                <Button type="submit" size="sm" name="updateButtonClicked" color="success"><i className="fa fa-dot-circle-o"></i> Update </Button>
              }
              &nbsp;
              <Button type="reset" size="sm" name="resetButtonClicked" onClick={this.resetClicked} color="danger"> <i className="fa fa-ban"></i> Reset</Button>
            </Form>
          </CardBody>
          <CardFooter>
            
          </CardFooter>
        </Card>
      </Col>

      <Col xs="12" lg="6">
            
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> Product Specification Details List
              </CardHeader>
              <CardBody>

                <FormGroup row>
                  <Col md="3">
                    <Input type="select" name="paginateNumber" id="paginateNumber" onChangeCapture={this.handlePagianteNumber.bind(this)}>
                      <option value="5">5</option>
                      <option value="10">10</option>
                      <option value="20">20</option>
                      <option value="50">50</option>
                      <option value="100">100</option>
                    </Input>
                  </Col>
                  <Col xs="12" md="3">
                    
                  </Col>
                  <Col xs="12" md="6">
                    <Input type="text" id="search" name="search" placeholder="Search" ref='clear' onChangeCapture={this.handlePagianteNumber.bind(this)}/>
                  </Col>
                </FormGroup>


                <Table responsive bordered>
                  <thead>
                    <tr>
                      <th>Category Name</th>
                      <th>Specification Details Name</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>

                  {
                    this.state.productsSpecificationDetails.map((productsSpecificationDetailsValue, key) =>
                      <tr>

                        {
                          this.state.productsCategory.map((productsCategoryValue, key) =>
                            productsSpecificationDetailsValue.category_id == productsCategoryValue.id ? <td>{productsCategoryValue.category_name}</td> : null
                          )
                        }
                        
                        <td>
                          {
                            JSON.parse(productsSpecificationDetailsValue.specification_details_name).map((productsSpecificationDetailsValueParsed, key) =>
                              <div>
                                - {productsSpecificationDetailsValueParsed}
                              </div>
                            )
                          }
                        </td>
                        
                        <td>
                          {/* <Badge color="success" style={{marginTop: '50%', marginBottom: '50%'}}>Active</Badge> */}
                          <center>
                          <i class="fa fa-check fa-lg" style={{color: '#009345', marginTop: '50%', marginBottom: '50%'}}></i>
                          </center>
                          
                        </td>
                        <td>
                          <center>
                            <a href="#" id="updateId" name="update"  onClick={this.updateClicked.bind(this)} ref="updateId" data-name="update" data-id={productsSpecificationDetailsValue.id}>
                              <i className="fa fa-edit fa-lg"  title="Edit Specification Details Info" aria-hidden="true" style={{color: '#009345', marginTop: '50%', marginBottom: '50%'}}></i>
                            </a>&nbsp;&nbsp;
                            <a href="#" onClick={this.deleteItem.bind(this)} id="deleteIds" ref="dataIds" data-name={'deleteSpecificationDetails'} data-id={productsSpecificationDetailsValue.id}>
                              <i className="fa fa-trash fa-lg" title="Delete This Specification Details" aria-hidden="true" style={{color: '#EB1C22', marginTop: '50%', marginBottom: '50%'}}></i>
                            </a>
                          </center>
                        </td>
                      </tr>
                    )
                  }

                  </tbody>
                </Table>
                {/* <Pagination>
                  <PaginationItem><PaginationLink previous tag="button">Prev</PaginationLink></PaginationItem>
                  <PaginationItem active>
                    <PaginationLink tag="button">1</PaginationLink>
                  </PaginationItem>
                  <PaginationItem className="page-item"><PaginationLink tag="button">2</PaginationLink></PaginationItem>
                  <PaginationItem><PaginationLink tag="button">3</PaginationLink></PaginationItem>
                  <PaginationItem><PaginationLink tag="button">4</PaginationLink></PaginationItem>
                  <PaginationItem><PaginationLink next tag="button">Next</PaginationLink></PaginationItem>
                </Pagination> */}
                <Pagination>
                  <PaginationItem>
                    <PaginationLink tag="button" name="prevPage" value="1" onClick={this.handlePagianteNumber.bind(this)}> Prev </PaginationLink>
                  </PaginationItem>
                  {
                    this.state.specificationPaginateArray.map((specificationPaginateArrayValue, key) => 
                      Number(this.state.prevMoreRangeCount) == specificationPaginateArrayValue ?
                        <PaginationItem>
                          <PaginationLink tag="button" name="morePrevPage" value="1" onClick={this.handlePrevMorePaginateNumber.bind(this)}> ... </PaginationLink>
                        </PaginationItem>
                      :
                      ((this.state.rangeStart <= specificationPaginateArrayValue) && (this.state.rangeEnd >= specificationPaginateArrayValue)) ? 
                          this.state.selectedPageNumber == specificationPaginateArrayValue ?
                          <PaginationItem active>
                            <PaginationLink tag="button" name="pageNumber" value={specificationPaginateArrayValue} onClick={this.handlePagianteNumber.bind(this)}> {specificationPaginateArrayValue} </PaginationLink>
                          </PaginationItem>
                          :
                          <PaginationItem >
                            <PaginationLink tag="button" name="pageNumber" value={specificationPaginateArrayValue} onClick={this.handlePagianteNumber.bind(this)}> {specificationPaginateArrayValue} </PaginationLink>
                          </PaginationItem>
                        : 
                          Number(Number(this.state.nextMoreRangeCount) + Number(1)) == Number(specificationPaginateArrayValue) ?
                            <PaginationItem>
                              <PaginationLink tag="button" name="moreNextPage" value="1" onClick={this.handleMorePaginateNumber.bind(this)}> ... </PaginationLink>
                            </PaginationItem>
                          :
                          null
                    )
                  }
                  <PaginationItem>
                    <PaginationLink tag="button" name="nextPage" value="1" onClick={this.handlePagianteNumber.bind(this)}> Next </PaginationLink>
                  </PaginationItem>
                  
                </Pagination>
              </CardBody>
            </Card>
          </Col>

      <Modal isOpen={this.state.small} toggle={this.toggleSmall}
        className={'modal-sm ' + this.props.className}>
      <ModalHeader toggle={this.toggleSmall}> Delete Specification Details </ModalHeader>
      <ModalBody>
        <strong> 
        <center>
          Are Sure to delete this Specification Details ?
        </center>
        </strong>
      </ModalBody>
      <ModalFooter>
        <Button color="success" onClick={(e)=>{this.toggleSmall('deleteSpecificationDetailsPermitted')}} >yes</Button>{' '}
        <Button color="danger" onClick={(e)=>{this.toggleSmall('deleteSpecificationDetailsDenied')}} >No</Button>
      </ModalFooter>
      </Modal>
    </Row>
    
    )
  }
}



export default ProductSpecificationDetails;
