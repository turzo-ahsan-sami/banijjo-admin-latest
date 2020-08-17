import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {ToastsContainer, ToastsStore} from 'react-toasts';
import Autosuggest from 'react-autosuggest';

import "./tag.scss";


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
} from 'reactstrap';

const languages = [
  {
    name: 'C',
    year: 1972
  },
  {
    name: 'C#',
    year: 2000
  },
  {
    name: 'C++',
    year: 1983
  },
  {
    name: 'Clojure',
    year: 2007
  },
  {
    name: 'Elm',
    year: 2012
  },
  {
    name: 'Go',
    year: 2009
  },
  {
    name: 'Haskell',
    year: 1990
  },
  {
    name: 'Java',
    year: 1995
  },
  {
    name: 'Java script',
    year: 1995
  },
  {
    name: 'Perl',
    year: 1987
  },
  {
    name: 'PHP',
    year: 1995
  },
  {
    name: 'Python',
    year: 1991
  },
  {
    name: 'Ruby',
    year: 1995
  },
  {
    name: 'Scala',
    year: 2003
  }
];

// https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions#Using_Special_Characters

function escapeRegexCharacters(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// function getSuggestions(value) {
//   console.log(value);
  
//   const escapedValue = escapeRegexCharacters(value.trim());
  
//   if (escapedValue === '') {
//     return [];
//   }

//   const regex = new RegExp('^' + escapedValue, 'i');

//   // console.log(languages);

//   console.log(languages.filter(language => regex.test(language.name)));

//   return languages.filter(language => regex.test(language.name));
// }

function getSuggestionValue(suggestion) {
  return suggestion.product_name_code;
}

function renderSuggestion(suggestion) {
  return (
    <span>{suggestion.product_name_code}</span>
  );
}

class Purchase extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.toggleFade = this.toggleFade.bind(this);

    this.AddValuesRef = React.createRef();
    this.ProductSpecificationValArray = [];

    this.state = {
      productsCategory: [],
      productsSpecificationDetails: [],
      specificationDetails : [],
      ProductSpecificationValues: [],
      ProductSpecificationValuesArray: [],
      tags: '',
      collapse: true,
      fadeIn: true,
      timeout: 300,
      value: '',
      suggestions: [],
      productList: [],
      productListArray: []
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleProductChange = this.handleProductChange.bind(this);
  }

  // AUTO SUGGEST START

  onChange = (event, { newValue, method }) => {
    this.setState({
      value: newValue
    });
  };

  getSuggestions(value) {
    console.log(value);
    
    const escapedValue = escapeRegexCharacters(value.trim());
    
    if (escapedValue === '') {
      return [];
    }
  
    const regex = new RegExp('^' + escapedValue, 'i');
  
    // console.log(languages);
  
    console.log(this.state.productList);

    console.log(this.state.productListArray);

    console.log(this.state.productListArray.filter(product => regex.test(product.product_name_code)));

    console.log(languages.filter(language => regex.test(language.name)));
  
    // return languages.filter(language => regex.test(language.name));

    return this.state.productListArray.filter(product => regex.test(product.product_name_code));
  }
  
  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: this.getSuggestions(value)
    });
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  // AUTI SUGGEST END

  toggle() {
    this.setState({ collapse: !this.state.collapse });
  }

  toggleFade() {
    this.setState((prevState) => { return { fadeIn: !prevState }});
  }

  componentDidMount() {
    const userName = localStorage.getItem('userName');
    const userPassword = localStorage.getItem('userPassword');
    if(userName===null && userPassword === null)
    {
      this.props.history.push("/login");
    }
    
    fetch('/api/categories', {
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


    fetch(`/api/product_list/?id=${userName}`, {
      method: 'GET'
    })
    .then(res => {
      console.log(res);
      return res.json()
    })
    .then(products => {
      console.log('THe api response for products quesry : ', products.data); 
      this.setState({ 
        productList : products.data
      })

      let i = 0;

      while (i < this.state.productList.length) {

        let productObject = {};

        productObject.id = this.state.productList[i].id;
        productObject.product_name_code = this.state.productList[i].product_name+' - '+this.state.productList[i].product_sku;

        this.state.productListArray.push(productObject);

        ++i;
      }

      console.log('Vendor Data : ', this.state.productList);

      return false;
    });

  }

  handleAddTags (event) {
    console.log(event.target.value);

    this.setState({
      tags: event.target.value
    });

    console.log("Tag : ", this.state.Tags);

    
  }

  handleProductChange(event) {
    
    let target = event.target;
    let value = target.type === 'checkbox' ? target.checked : target.value;
    let name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleAddValues (event) {

    this.setState({
      // ProductSpecificationValuesArray: this.state.ProductSpecificationValues
    });

    this.state.ProductSpecificationValuesArray.push(this.state.ProductSpecificationValues);

    // this.ProductSpecificationValArray.push(this.state.ProductSpecificationValues);

    ReactDOM.findDOMNode(this.refs.clear).value = "";
  }

  handleAddChange (event) {
    this.setState({ ProductSpecificationValues: event.target.value });
  }

  handleDeleteButton (keyId) {
    console.log("Key for delete:",keyId);

    let ProductSpecificationValuesArray = this.state.ProductSpecificationValuesArray.filter((e, i) => i !== keyId);
    this.setState({ ProductSpecificationValuesArray : ProductSpecificationValuesArray });

    console.log(this.state.ProductSpecificationValuesArray);
    
  }

  handleSubmit(event) {
    console.log(this.state);
    event.preventDefault();

    fetch('/api/saveSpecification' , {
      method: "POST",
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(this.state)
    })
    .then((result) => result.json())
    .then((info) => { 
      if (info.success == true) {
        ToastsStore.success("Product Specification Successfully inserted !!");
        console.log(info.success);
        setTimeout(
          function() {
          // this.props.history.push("/product/products");
          window.location = '/product/products-specifications';
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

  render() {

    const { value, suggestions } = this.state;
    const inputProps = {
      placeholder: "Write Product Name",
      value,
      onChange: this.onChange
    };

    return (
      <Row>
        <ToastsContainer store={ToastsStore}/>
      <Col xs="12" md="6">
        <Card>
          <CardHeader>
            <strong>Add Product Purchase</strong> 
          </CardHeader>
          <CardBody>

            {/* <Autosuggest 
              suggestions={suggestions}
              onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
              onSuggestionsClearRequested={this.onSuggestionsClearRequested}
              getSuggestionValue={getSuggestionValue}
              renderSuggestion={renderSuggestion}
              inputProps={inputProps} 
            /> */}
            
            <Form action="" method="post" onSubmit={this.handleSubmit} onChange={this.handleProductChange} encType="multipart/form-data" className="form-horizontal">
              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="productName">Search Product</Label>
                </Col>
                <Col xs="12" md="9">
                  {/* <Input type="text" id="productName" name="productName" placeholder="Product Name" required="true" /> */}
                  <Autosuggest 
                    suggestions={suggestions}
                    onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                    onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                    getSuggestionValue={getSuggestionValue}
                    renderSuggestion={renderSuggestion}
                    inputProps={inputProps} 
                    name = {"productSearch"}
                  />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="values">Product Price</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="text" id="productPrice" name="productPrice" placeholder="Product Price" ref='clear' onChange={this.handleAddChange.bind(this)} />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="values">Product Quantity</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="text" id="productQuantity" name="productQuantity" placeholder="Product Quantity" ref='clear' onChange={this.handleAddChange.bind(this)} />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="values">Bill No</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="text" id="billNo" name="billNo" placeholder="Bill No" ref='clear' onChange={this.handleAddChange.bind(this)} />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="values">Order No</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="text" id="orderNo" name="orderNo" placeholder="Order No" ref='clear' onChange={this.handleAddChange.bind(this)} />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="values">Vat</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="text" id="vat" name="vat" placeholder="VAT %" ref='clear' onChange={this.handleAddChange.bind(this)} />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="values">Gross Total</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="text" id="grossTotal" name="grossTotal" placeholder="Gross Total" ref='clear' onChange={this.handleAddChange.bind(this)} />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="values">Pay Amount</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="text" id="payAmount" name="payAmount" placeholder="Pay Amount" ref='clear' onChange={this.handleAddChange.bind(this)} />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="values">Due Amount</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="text" id="dueAmount" name="dueAmount" placeholder="Due Amount" ref='clear' onChange={this.handleAddChange.bind(this)} />
                </Col>
              </FormGroup>
              <Button type="submit" size="sm" color="success"><i className="fa fa-dot-circle-o"></i> Submit</Button>&nbsp;
              <Button type="reset" size="sm" color="danger"><i className="fa fa-ban"></i> Reset</Button>
            </Form>
          </CardBody>
          <CardFooter>
            
          </CardFooter>
        </Card>
      </Col>

      <Col xs="12" lg="6">
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> Product Specification List
              </CardHeader>
              <CardBody>
                <Table responsive bordered>
                  <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>Product Price</th>
                    <th>Bill No</th>
                    <th>Quantity</th>
                    <th>Gross Total</th>
                    <th>Paied Amount</th>
                    <th>Due Amount</th>
                    <th>Status</th>
                  </tr>
                  </thead>
                  <tbody>

                  </tbody>
                </Table>
                <Pagination>
                  <PaginationItem><PaginationLink previous tag="button">Prev</PaginationLink></PaginationItem>
                  <PaginationItem active>
                    <PaginationLink tag="button">1</PaginationLink>
                  </PaginationItem>
                  <PaginationItem className="page-item"><PaginationLink tag="button">2</PaginationLink></PaginationItem>
                  <PaginationItem><PaginationLink tag="button">3</PaginationLink></PaginationItem>
                  <PaginationItem><PaginationLink tag="button">4</PaginationLink></PaginationItem>
                  <PaginationItem><PaginationLink next tag="button">Next</PaginationLink></PaginationItem>
                </Pagination>
              </CardBody>
            </Card>
          </Col>

      
    </Row>
    
    )
  }
}



export default Purchase;
