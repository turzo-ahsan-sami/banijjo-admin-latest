import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {ToastsContainer, ToastsStore} from 'react-toasts';

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
class ProductSpecifications extends Component {
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
      timeout: 300
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleProductChange = this.handleProductChange.bind(this);
  }

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

    fetch('/api/product_specification_names', {
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
      console.log('Specification : ', this.state.productsSpecificationDetails)
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

    return (
      <Row>
        <ToastsContainer store={ToastsStore}/>
      <Col xs="12" md="6">
        <Card>
          <CardHeader>
            <strong>Add Product Specification</strong> 
          </CardHeader>
          <CardBody>
            <Form action="" method="post" onSubmit={this.handleSubmit} onChange={this.handleProductChange} encType="multipart/form-data" className="form-horizontal">
              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="name">Specification Name</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="text" id="name" name="name" placeholder="Name" required="true" />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="values">Specification Vales</Label>
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
                  <div row>
                    {
                      this.state.ProductSpecificationValuesArray.map((ProductSpecificationVal, key) =>
                        
                        <Button style={{paddingLeft:"10px",marginLeft:"10px"}} className="btn-pill btn btn-dark" type="button" size="sm" color="primary" id="tagButton" value={key} onClick={this.handleDeleteButton.bind(this,key)}> {ProductSpecificationVal} <i style={{color:'red'}} className="fa fa-close"></i> </Button> 

                      )
                    }
                  </div>
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="categoryId">Select Product Category</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="select" name="categoryId" id="categoryId">
                    <option value="0">Please select</option>
                    {
                      this.state.productsCategory.map((productsCategoryValue, key) =>
                        <option value={productsCategoryValue.id}> {productsCategoryValue.category_name} </option>
                      )
                    }
                  </Input>
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="select">Status</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="select" name="select" id="select">
                    <option value="2">Active</option>
                    <option value="3">Inactive</option>
                  </Input>
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
                    <th>Specification Name</th>
                    <th>Specification Category</th>
                    <th>Values</th>
                    <th>Status</th>
                  </tr>
                  </thead>
                  <tbody>

                  {
                    this.state.productsSpecificationDetails.map((productsSpecificationDetailsValue, key) =>
                      <tr>
                        <td>{productsSpecificationDetailsValue.specification_name}</td>
                        {/* <td>{productsSpecificationDetailsValue.category_id}</td> */}
                        {
                          this.state.productsCategory.map((productsCategoryValue, key) =>
                            productsSpecificationDetailsValue.category_id == productsCategoryValue.id ? <td>{productsCategoryValue.category_name}</td> : null
                          )
                        }
                        <td>
                          {
                            JSON.parse(productsSpecificationDetailsValue.value).map((productsSpecificationDetailsValueParsed, key) =>
                              <div>
                                - {productsSpecificationDetailsValueParsed}
                                
                              </div>
                            )
                          }
                        </td>
                        
                        <td>
                          <Badge color="success">Active</Badge>
                        </td>
                      </tr>
                    )
                  }

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



export default ProductSpecifications;
