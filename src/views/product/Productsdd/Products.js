import React, { Component } from 'react';
import {ToastsContainer, ToastsStore} from 'react-toasts';
import ImageUploader from 'react-images-upload';

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

const bgColors = { "Default": "#81b71a",
"Blue": "#00B1E1",
"Cyan": "#37BC9B",
"Green": "#8CC152",
"Red": "#E9573F",
"Yellow": "#F6BB42",
};

class Products extends Component {
  
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.toggleFade = this.toggleFade.bind(this);

    this.displaySpecificationValueData = [];
    this.displaySpecificationDetailsData = [];
    this.specficationsAll = [];
    this.specificationDetailsFull = [];

    this.state = {
      // modal
      modal: false,
      large: false,

      // for text 
      productDescriptionFull: [{title: "", description: "", descriptionImage: ""}],
      images: [{productImage: ""}],
      pictures: [],
      productSPDFull: [],
      productSPD: [],
      productSpecificationBoxFun: [],
      productSPName: [],
      deleteProduct: [],

      // for products
      products: [],
      productsCategory: [],
      productsSpecificationName: [],
      productsSpecificationDetails: [],
      vendorList: [],
      productList: [],
      newProductCode: '',
      userList: [],
      userName: '',
      userCode: '',
      showProductsSpecificationValue : this.displaySpecificationValueData,
      postProductsSpecificationValue : "",
      showDisplaySpecificationDetailsData : this.displaySpecificationDetailsData,
      postProductsSpecificationDetails : "",
      // specficationsAll : [],
      specificationDetailsFullState : {},
      vendorId: '',
      productSKUcode : '',
      user_type: '',

      details : "",

      // for checkbox
      
      collapse: true,
      fadeIn: true,
      timeout: 300
    };

    // for modal
    this.toggleLarge = this.toggleLarge.bind(this);
    this.toggleSmall = this.toggleSmall.bind(this);

    // to get data from node.js
    // this.handleGetProductCategory = this.handleGetProductCategory.bind(this);

    // to submit the data
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleProductChange = this.handleProductChange.bind(this);
    this.detailsChange = this.detailsChange.bind(this);
    this.handleSPDFullChange = this.handleSPDFullChange.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleChangeSpecification = this.handleChangeSpecification.bind(this);
  }

  componentDidMount() {
    console.log('component mount executed');

    this.state.userName = localStorage.getItem('userName');
    const userPassword = localStorage.getItem('userPassword');
    this.state.vendorId = localStorage.getItem('employee_id');
    this.state.user_type = localStorage.getItem('user_type');

    if(this.state.userName===null && userPassword === null)
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
        productsSpecificationName : specificationName.data
      })

      console.log('Specification Data : ', this.state.productsSpecificationName);
      return false;
    });

    fetch('/api/product_specification_details', {
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

      console.log('Specification Data : ', this.state.productsSpecificationDetails);
      return false;
    });

    fetch('/api/vendor_list_for_product', {
      method: 'GET'
    })
    .then(res => {
      console.log(res);
      return res.json()
    })
    .then(vendors => {
      console.log(vendors.data); 
      this.setState({ 
        vendorList : vendors.data
      })

      this.state.vendorList.map ((value, key) => {
        if (value.email == this.state.userName) {
          this.state.userCode = value.code;
        }
      })

      console.log('Vendor Data : ', this.state.vendorList);
      return false;
    });

    fetch('/api/user_list', {
      method: 'GET'
    })
    .then(res => {
      console.log(res);
      return res.json()
    })
    .then(userList => {
      console.log(userList.data); 
      this.setState({ 
        userList : userList.data
      })

      console.log('Vendor Data : ', this.state.userList);
      console.log('Local storage user name : ', this.state.userName);

      return false;
    });

    console.log('Trying to fetch product !');

    fetch(`/api/product_list/?id=${this.state.userName}`, {
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

      let countProducts = this.state.productList.length+1;

      while (countProducts.toString().length < 5) {
        countProducts = "0" + countProducts;
        console.log('product counter increment : ', countProducts.length);
      }

      console.log('product counter increment Final : ', countProducts);

      this.setState ({
        newProductCode : countProducts
      })

      console.log('Vendor Data : ', this.state.productList);

      return false;
    });

    

  }

  handleSubmit(event) {
    // alert('submit')
    event.preventDefault();
    console.log(this.state.productName);

    console.log(this.state);

    // this.state.specificationDetailsFullState = this.specificationDetailsFull;
    // console.log(this.state.specificationDetailsFullState);
    // console.log(this.specificationDetailsFull);
    
    // this.specificationDetailsFull.map ((value, key) => {
    //   console.log('value for specification details : ', value[key]);
    //   console.log('value for details : ', value[key].value);
    //   this.state.specificationDetailsFullState[key] = key +":"+ value[key].value;
    // })

    // const { categoryName, parentCategory, categoryDescription, isActive } = this.state;

    // setTimeout(
    //   function() {
        
    //     fetch('/api/saveProduct' , {
    //       method: "POST",
    //       headers: {
    //         'Content-type': 'application/json'
    //       },
    //       body: JSON.stringify(this.state)
    //     })
    //     .then((result) => result.json())
    //     .then((info) => { 
    //       if (info.success == true) {
    //         ToastsStore.success("Product Successfully inserted !!");
    //         console.log(info.success);
    //       }
    //       else {
    //         ToastsStore.warning("Product Insertion Faild. Please try again !!");
    //         console.log(info.success);
    //       }
          
    //     })

    //   }
    //   .bind(this),
    //   2000
    // );

    fetch('/api/saveProduct' , {
      method: "POST",
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(this.state)
    })
    .then((result) => result.json())
    .then((info) => { 
      if (info.success == true) {
        ToastsStore.success("Product Successfully inserted !!");
        console.log(info.success);
        console.log(info.message);
        // window.location = '/product/products';
      }
      else {
        ToastsStore.warning("Product Insertion Faild. Please try again !!");
        console.log(info.success);
        console.log(info.message);
      }
      
    })

    
  }

  handleDelete (event) {
    // let data = event.currentTarget.dataset['data-id'];

    console.log('Delete handled' );
  }

  handleProductChange(event) {
    this.setState({value: event.target.value});
    // alert(event.target.value);
    let target = event.target;
    let value = target.type === 'checkbox' ? target.checked : target.value;
    let name = target.name;

    this.setState({
      [name]: value
    });
  }

  detailsChange(event) {
    // this.setState({value: event.target.value});
    alert('Details', event.target.value);
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });

  }

  addClick(){
    this.setState(prevState => ({ 
    	productDescriptionFull: [...prevState.productDescriptionFull, { title: "", description: "", descriptionImage: "" }]
    }))
  }

  addSPDClick(e){
    console.log("SPD : ", e.target.value);
    let targetedValue = e.target.value;
    this.setState(prevState => ({ 
    	productSPDFull: [...prevState.productSPDFull, { spd: ""}]
    }))
    this.state.productSPD.push(targetedValue);
  }

  addImageClick(){
    this.setState(prevState => ({ 
    	images: [...prevState.images, { productImage: ""}]
    }))
  }

  specificationBoxFun (e) {
    console.log("specificationBoxFun : ", e.target.value);
    this.setState(prevState => ({ 
    	productSpecificationBoxFun: [...prevState.productSpecificationBoxFun]
    }))
    this.state.productSpecificationBoxFun.push(e.target.value);
  }

  createSPDUI(){
    // alert('ok')
    return this.state.productSPDFull.map((el, i) => (

      <div key={i}>
        <FormGroup row>
         <Col xs="12" md="12">
          <Input placeholder="Destails Specification" name="spd" id="SPD" onChange={this.handleSPDFullChange.bind(this, i)}/>
          <br/>
         </Col>
        </FormGroup>
      </div>          
    ))
  }
  
  createUI(){
     return this.state.productDescriptionFull.map((el, i) => (
       <div key={i}>
         <FormGroup row>
         <Col md="3">
            <Label htmlFor="description">Product Description</Label>
          </Col>
          <Col xs="12" md="9">
            <Row>
              <Col md="11">
                <Input placeholder="Title" name="title" id="title" onChange={this.handleChange.bind(this, i)} />
              </Col>
              <Col md="1">
                <span>
                  <a href="#">
                    <i className="fa fa-window-close" onClick={this.removeClick.bind(this, i)}></i>
                  </a>
                </span>&nbsp;
              </Col>
            </Row>
            <br/>
            <Row>
              <Col md="11">
                <Input type="textarea" name="description" id="description" rows="9" placeholder="Description..." onChange={this.handleChange.bind(this, i)} />
              </Col>
              <Col md="1">
                
              </Col>
            </Row>
            <br />
            <Row>
            <Col md="12" md="9">
              <Input type="file" id="descriptionImage" name="descriptionImage" onChange={this.handleChange.bind(this, i)}/>
            </Col>
            </Row>
          </Col>
         </FormGroup>
    	  
          
    	  {/* <Input type='button' value='remove' onClick={this.removeClick.bind(this, i)}/> */}
       </div>          
     ))
  }

  createImageUI(){
    return this.state.images.map((el, i) => (
      <div key={i}>
        <FormGroup row>
          <Col md="3">
            <Label htmlFor="productImage">Product Image</Label>
          </Col>
          <Col xs="12" md="8">
            <Input type="file" id="productImage" name="productImage" onChange={this.handleImageChange.bind(this, i)} />
          </Col>
          <Col md="1">
            <span>
              <a href="#">
                <i className="fa fa-window-close" onClick={this.removeImageClick.bind(this, i)}></i>
              </a>
            </span>&nbsp;
          </Col>
        </FormGroup>
      </div>          
    ))
  }

  handleChange(i, e) {
    
    const { name, value } = e.target;
    // alert(name);
    // alert(value);
    let productDescriptionFull = [...this.state.productDescriptionFull];
    productDescriptionFull[i] = {...productDescriptionFull[i], [name]: value};
    this.setState({ productDescriptionFull });
  }

  handleChangeSpecification(key, e) {

    console.log(e.target);
    console.log(key);
    let i =0;
    const { name, value } = e.target;
    console.log(name);
    console.log(value);
    let specificationDetailsFull = [...this.specificationDetailsFull];
    specificationDetailsFull = {...specificationDetailsFull, value};
    this.specificationDetailsFull[key] = specificationDetailsFull;
    this.state.specificationDetailsFullState[key] = specificationDetailsFull;
    console.log(this.specificationDetailsFull);
    // this.setState({ specificationDetailsFull });
  }

  handleSPDFullChange(i, e) {
    
    const { name, value } = e.target;
    // alert(name);
    // alert(value);
    let productSPDFull = [...this.state.productSPDFull];
    productSPDFull[i] = {...productSPDFull[i], [name]: value};
    this.setState({ productSPDFull });
  }
 
  removeClick(i){
    let productDescriptionFull = [...this.state.productDescriptionFull];
    productDescriptionFull.splice(i, 1);
    this.setState({ productDescriptionFull });
  }

  handleImageChange(i, e) {
    const { name, value } = e.target;
    let images = [...this.state.images];
    images[i] = {...images[i], [name]: value};
    this.setState({ images });
  }
 
  removeImageClick(i){
    let images = [...this.state.images];
    images.splice(i, 1);
    this.setState({ images });
  }

  toggle() {
    this.setState({ collapse: !this.state.collapse });
  }

  toggleFade() {
    this.setState((prevState) => { return { fadeIn: !prevState }});
  }

  getInitialState () {
    return {value: 'select'}
  }

  changeSpecification = (event) => {
    console.log('change specification : ', event.target.value);
    let targetedValue = event.target.value;
    var count = 0 ;
    // this.setState({specficationsAll: []});
    // this.state.specficationsAll=[];
    this.specficationsAll=[];

    this.state.productSKUcode = 'BNJ-'+this.state.userCode+'-'+this.state.newProductCode;
    

    // this.displaySpecificationDetailsData.length=0;

    console.log('Array : ', this.displaySpecificationValueData);
    
    this.setState(prevState => ({ 
    	productSPName: [...prevState.productSPName]
    }))
    this.state.productSPName.push(targetedValue);

    this.setState({value: event.target.value});

    // {
    //   this.state.specficationsAll.push(<Col md="5">{'Product Specifications '} :</Col>)
    //   this.state.productsSpecificationName.map((productsSpecificationNameValue, key) =>
      
    //     event.target.value == productsSpecificationNameValue.category_id ? 
    //     <div row>
    //       {this.state.specficationsAll.push(<Col md="5">{productsSpecificationNameValue.specification_name} :</Col>)}
    //       {
    //         JSON.parse(productsSpecificationNameValue.value).map((productsSpecificationNameValueParsed, key) =>
    //           {this.state.specficationsAll.push(<Col md="7"><input type="checkbox" name="specificationBox" value={event.target.value+" : "+productsSpecificationNameValueParsed} onClick={this.specificationBoxFun.bind(this)}/> {productsSpecificationNameValueParsed}</Col>)}
    //           )
    //       }
    //     </div>
    //     : 
    //     null
    //   )
    // }
      
        
    // {
    //   this.state.productsSpecificationDetails.map((productsSpecificationDetailsValue, key) =>
        
    //       JSON.parse(productsSpecificationDetailsValue.specification_details_name).map((productsSpecificationDetailsValueParsed, key) =>
    //         event.target.value == productsSpecificationDetailsValue.category_id ? 
    //         this.state.specficationsAll.push(<div><Label htmlFor="productSpecificationDetails">Product SpecificationDetails : </Label><Input type="text" id="detailsId" onChange={this.handleChangeSpecification.bind(this)} name="details" value={productsSpecificationDetailsValueParsed+" : "}  /><br /></div>) : 
    //         null
    //       )
    //   )
    // }

    // if (this.state.specficationsAll.length == 1) {
    //   this.state.specficationsAll.push(<div row><Col md="12"><strong>Note : </strong>No Specificaton Found For This Product Category</Col></div>);
    // }
    // this.displaySpecificationValueData.push(<hr/>);

    let counter = 0;
    let counters = 0;

    {
      this.state.productsSpecificationName.map((productsSpecificationNameValue, key) =>
      
        event.target.value == productsSpecificationNameValue.category_id ? 
          <div row>
            {this.specficationsAll.push(<Col md="3">{ counter == 0 ? 'Product Specifications ' : null }</Col>)}
            {this.specficationsAll.push(<Col md="9">{productsSpecificationNameValue.specification_name} :</Col>)}
            {++counter}
            {
              JSON.parse(productsSpecificationNameValue.value).map((productsSpecificationNameValueParsed, key) =>
                <div>
                  {this.specficationsAll.push(<Col md="3"></Col>)}
                  {this.specficationsAll.push(<Col md="9"><input type="checkbox" name="specificationBox" value={event.target.value+" : "+productsSpecificationNameValueParsed} onClick={this.specificationBoxFun.bind(this)}/> {productsSpecificationNameValueParsed}</Col>)}
                </div>
              )
            }
          </div>
        : 
        null
      )
    }
      
        
    {
      this.state.productsSpecificationDetails.map((productsSpecificationDetailsValue, key) =>
        JSON.parse(productsSpecificationDetailsValue.specification_details_name).map((productsSpecificationDetailsValueParsed, key) =>
          <div row>
            {
              event.target.value == productsSpecificationDetailsValue.category_id ? 
              // this.specficationsAll.push(<div> { counters == 0 ? <Col md="3"><Label htmlFor="productSpecificationDetails">Product Specification Details&nbsp; </Label></Col> : <Col md="3"></Col> } <Col md="9"> {productsSpecificationDetailsValueParsed}&nbsp; <Input type="text" id="detailsId" /*onChange={this.handleChangeSpecification.bind(this)}*/ name={"detailsId : "+productsSpecificationDetailsValueParsed+" "} /*value={productsSpecificationDetailsValueParsed+" : "}*/  /> </Col> </div>) : 
              <div>
                {this.specficationsAll.push(<Col md="3">{ counters == 0 ? <Label htmlFor="productSpecificationDetails">Product Specification Details&nbsp; </Label> : null }</Col>)}
                {this.specficationsAll.push(<Col md="9">{productsSpecificationDetailsValueParsed}&nbsp; <Input type="text" id="detailsId" onChange={this.handleChangeSpecification.bind(this, productsSpecificationDetailsValueParsed)} name={"detailsId"} /*value={productsSpecificationDetailsValueParsed+" : "}*/  /></Col>)}
                {++counters}
              </div>
              :null
            }
            
          </div>
          
        )
      )
    }

    if (this.specficationsAll.length == 1) {
      this.specficationsAll.push(<div row><Col md="12"><strong>Note : </strong>No Specificaton Found For This Product Category</Col></div>);
    }

  }

  changeDetailsSpecification = (event) => {
    
    console.log('change Details specification : ', event.target.value);
    this.setState({value: event.target.value});

    // this.displaySpecificationDetailsData.push(<div><Input type="text" id="detailsId" name="details" value="" /><br /></div>);
    
    {
      this.state.productsSpecificationDetails.map((productsSpecificationDetailsValue, key) =>
        
          JSON.parse(productsSpecificationDetailsValue.specification_details_name).map((productsSpecificationDetailsValueParsed, key) =>
            event.target.value == productsSpecificationDetailsValueParsed ? 
            this.displaySpecificationDetailsData.push(<div><Input type="text" id="detailsId" name="details" value={productsSpecificationDetailsValueParsed+" : "}  /><br /></div>) : 
            null
          )
      )
    }

    console.log( this.displaySpecificationDetailsData);
  }

  toggleLarge() {
    this.setState({
      large: !this.state.large,
    });
  }

  toggleSmall(event) {
    console.log('data-id : ', event.target.value);
    this.setState({
      small: !this.state.small,
    });
  }
  
  render() {

    return (
      <Row>
      <Col md="12">
        <Card>
          <CardHeader >
            <Row>
              <Col md="6"><i className="fa fa-align-justify"></i> Product List</Col>

              <Col md="6">
                  <Button color="success" onClick={this.toggleLarge} className="mr-1"> <i className="fa fa-plus-circle"></i> Add New Product</Button>
              </Col>
            </Row>
          </CardHeader>
          
          <CardBody>
            <Table responsive bordered>
              <thead>
              <tr>
                <th>Product Name</th>
                <th>Product SKU</th>
                <th>Product Category Name</th>
                <th>Vendor Name</th>
                <th>QC Status</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
              </thead>
              <tbody>
              {

                this.state.productList.map((productListValue, key) =>
                    <tr>
                      <td>{productListValue.product_name}</td>
                      <td>{productListValue.product_sku}</td>

                      {
                        this.state.productsCategory.map((productsCategoryValue, key) =>
                          productListValue.category_id == productsCategoryValue.id ? <td>{productsCategoryValue.category_name}</td> : null
                        )
                      }

                      {
                        this.state.vendorList.map((vendorListValue, key) =>
                          productListValue.vendor_id == vendorListValue.id ? <td>{vendorListValue.name}</td> : null
                        )
                      }
                      
                      <td>{productListValue.qc_status}</td>
                      <td>

                        {productListValue.status == 'active' ? <Badge color="success">Active</Badge> : <Badge color="secondary">Inactive</Badge> }
                        
                      </td>
                      <td>
                      <center>
                        <a href="#">
                          <i className="fa fa-info-circle" title="View Product Info"></i>
                        </a>&nbsp;
                        <a href="#">
                          <i className="fa fa-edit" title="Edit Product Info"></i>
                        </a>&nbsp;
                        <a href="#" onClick={this.toggleSmall.bind(this)} id="deleteIds" ref="dataIds" data-id={productListValue.id} value={productListValue.id}>
                          <i className="fa fa-window-close-o" title="Delete This Product"></i>
                        </a>
                      </center>
                      </td>
                    </tr>
                  )
              }

              {/* <tr>
                <td>Paĉjo Jadon</td>
                <td>2012/02/01</td>
                <td>Staff</td>
                <td>
                  <Badge color="danger">Banned</Badge>
                </td>
              </tr>
              <tr>
                <td>Micheal Mercurius</td>
                <td>2012/02/01</td>
                <td>Admin</td>
                <td>
                  <Badge color="secondary">Inactive</Badge>
                </td>
              </tr>
              <tr>
                <td>Ganesha Dubhghall</td>
                <td>2012/03/01</td>
                <td>Member</td>
                <td>
                  <Badge color="warning">Pending</Badge>
                </td>
              </tr>
              <tr>
                <td>Hiroto Šimun</td>
                <td>2012/01/21</td>
                <td>Staff</td>
                <td>
                  <Badge color="success">Active</Badge>
                </td>
              </tr> */}
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

      <Modal isOpen={this.state.small} toggle={this.toggleSmall}
          className={'modal-sm ' + this.props.className}>
        <ModalHeader toggle={this.toggleSmall}>Delete Product</ModalHeader>
        <ModalBody>
          <strong> 
            <center>
            Are Sure to delete this product ?
            </center>
          </strong>
        </ModalBody>
        <ModalFooter>
          <Button color="success" onClick={(e)=>{this.toggleSmall(); this.handleDelete();}}>yes</Button>{' '}
          <Button color="danger" onClick={this.toggleSmall}>No</Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={this.state.large} toggle={this.toggleLarge}
        className={'modal-lg ' + this.props.className} >
        <ToastsContainer store={ToastsStore}/>
        <ModalHeader toggle={this.toggleLarge}></ModalHeader>
        <ModalBody>
          
          {/* add new product */}
          <Row>
            <Col md="12">
              <Card>
                <CardHeader>
                  <strong>Add Product</strong> 
                </CardHeader>
                <CardBody>
                  <Form action="" method="post" encType="multipart/form-data" onSubmit={this.handleSubmit} onChange={this.handleProductChange} className="form-horizontal">
                    <FormGroup row>
                      <Col md="3">
                        <Label htmlFor="productName">Product Name</Label>
                      </Col>
                      <Col xs="12" md="9">
                        <Input type="text" id="productName" name="productName" placeholder="Product Name" />
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col md="3">
                        <Label htmlFor="productCategory">Product Category </Label>
                      </Col>
                      <Col xs="12" md="9">
                        <Input type="select" name="productCategory" onChange={this.changeSpecification} id="productCategory"  value={this.state.value}>
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
                        <Label htmlFor="productBrand">Brand Name</Label>
                      </Col>
                      <Col xs="12" md="9">
                        <Input type="text" id="productBrand" name="productBrand" placeholder="Brand Name" />
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col md="3">
                        <Label htmlFor="productPrice">Product Price</Label>
                      </Col>
                      <Col xs="12" md="9">
                        <Input type="text" id="productPrice" name="productPrice" placeholder="Product Price" />
                      </Col>
                    </FormGroup>
                    
                    {
                      this.state.user_type == 'vendor' ?
                          
                      <div>
                        <FormGroup row>
                          <Col md="3">
                            <Label htmlFor="vendorList">Vendor </Label>
                          </Col>
                          <Col xs="12" md="9">
                            <Input  type="text" id="vendorId" name="vendorId" placeholder="" readOnly="true" value={this.state.userName} />
                          </Col>
                        </FormGroup>
                      </div>
                      :
                      <div>
                        <FormGroup row>
                          <Col md="3">
                            <Label htmlFor="vendorList">Vendor List</Label>
                          </Col>
                          <Col xs="12" md="9">
                            <Input type="select" name="vendorId" id="vendorId">
                              <option value="0">Please select</option>
                              {
                                this.state.vendorList.map((vendorListValue, key) =>
                                  <option value={vendorListValue.id}> {vendorListValue.name} </option>
                                )
                              }
                            </Input>
                          </Col>
                        </FormGroup>
                      </div>
                    }

                    {
                      this.state.userList.map((userListValue, key) =>
                      userListValue.username == this.state.userName ? 
                        userListValue.user_type == 'vendor' ?
                          <div>
                            <FormGroup row>
                              <Col md="3">
                                <Label htmlFor="productSKU">Product SKU</Label>
                              </Col>
                              
                              <Col xs="12" md="9">
                                <Input type="text" id="productSKU" name="productSKU" placeholder="Product SKU" readOnly="true" value={'BNJ-'+this.state.userCode+'-'+this.state.newProductCode} />
                              </Col>
                            </FormGroup>
                          </div>
                        :
                        <div>
                          <FormGroup row>
                            <Col md="3">
                              <Label htmlFor="productSKU">Product SKU</Label>
                            </Col>
                            <Col xs="12" md="9">
                              <Input type="text" id="productSKU" name="productSKU" placeholder="Product SKU" readOnly="true" value={'BNJ-00000-00000'} />
                            </Col>
                          </FormGroup>
                        </div>
                      :
                      null
                      )
                    }

                    {/* <FormGroup row>
                      <Col md="3">
                        <Label htmlFor="productSKU">Product SKU</Label>
                      </Col>
                      <Col xs="12" md="9">
                        <Input type="text" id="productSKU" name="productSKU" placeholder="Product SKU" readOnly="true" value={'BNJ-'+this.state.userCode+'-00000'} />
                      </Col>
                    </FormGroup> */}

                    
                    {/* <FormGroup row>
                      <Col md="3">
                        <Label htmlFor="productSpecification">Product Specification</Label>
                      </Col>
                      <Col xs="12" md="9">
                        <Input type="select" name="productSpecification" id="productSpecification" onChange={this.changeSpecification} value={this.state.value}>
                          <option value="0">Please select</option>
                          {
                            this.state.productsSpecificationName.map((productsSpecificationNameValue, key) =>
                              <option key={key} value={productsSpecificationNameValue.id}> {productsSpecificationNameValue.specification_name} </option>
                            )
                          }
                        </Input>
                      </Col>
                    </FormGroup> */}

                    {/* Color according to the specificatoion */}
                    <FormGroup row style={{border: '2px', solid: '#000'}}>
                      {this.specficationsAll}
                    </FormGroup>

                    {/* <FormGroup row>
                      <Col md="3">
                        <Label htmlFor="productDetailsSpecification">Product Details Specification</Label>
                      </Col>
                      <Col xs="12" md="9">
                        <Input type="select" name="productDetailsSpecification" id="productDetailsSpecification" onChange={this.addSPDClick.bind(this)} >
                          <option value="0">Please select</option>
                          {
                            this.state.productsSpecificationDetails.map((productsSpecificationDetailsValue, key) =>
                            productsSpecificationDetailsValue.category_id == 1 ?
                              JSON.parse(productsSpecificationDetailsValue.specification_details_name).map((productsSpecificationDetailsValueParsed, key) =>
                                <option value={productsSpecificationDetailsValueParsed}> {productsSpecificationDetailsValueParsed} </option>
                              ) :
                              null
                            )
                          }
                        </Input>
                      </Col>
                    </FormGroup> */}

                    {/* Color according to the specificatoion */}
                    <FormGroup row>
                      <Col md="3">
                      </Col>
                      <Col xs="12" md="9">
                        {/* {colorMessage}
                        {sizeMessage}
                        {weightMessage} */}
                        {/* {this.createSPDUI()} */}
                      </Col>
                    </FormGroup>

                    {this.createUI()}
                    
                    <FormGroup row>
                      <Col md="3">
                        
                      </Col>
                      <Col xs="12" md="9">
                        <Button color="primary" className="btn-pill btn btn-light btn-block" size="sm" onClick={this.addClick.bind(this)}> <i className="fa fa-plus-square"></i> Add More</Button>
                        &nbsp;
                      </Col>
                    </FormGroup>

                    {this.createImageUI()}

                    <FormGroup row>
                      <Col md="3">
                        
                      </Col>
                      <Col xs="12" md="9">
                        <Button color="primary" className="btn-pill btn btn-light btn-block" size="sm" onClick={this.addImageClick.bind(this)}> <i className="fa fa-plus-square"></i> Add More</Button>
                        &nbsp;
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
          </Row>

        </ModalBody>
        {/* <ModalFooter>
          <Button color="secondary" onClick={this.toggleLarge}>Cancel</Button>
        </ModalFooter> */}
      </Modal>
      
    </Row>
    
    )
  }
}



export default Products;
