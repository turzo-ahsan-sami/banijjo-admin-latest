import React, { Component } from 'react';
import {ToastsContainer, ToastsStore} from 'react-toasts';
import ImageUploader from 'react-images-upload';
import axios from 'axios';
import cookie from 'react-cookies';

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
  ListGroupItem,
} from 'reactstrap';

const base = process.env.REACT_APP_ADMIN_SERVER_URL;
const publicUrl = process.env.REACT_APP_PUBLIC_URL;

class OptionalBannerProducts extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.toggleFade = this.toggleFade.bind(this);
    this.state = {
      imageName: '',
      image: [],
      bannerImagesPreview:'',
      incrementState: -1,
      banner: [],
      collapse: true,
      fadeIn: true,
      timeout: 300,
      imgWidth: 0,
      imgHeight: 0,
      isSubmitAllowed: true,
      exportToken: '',
      getDeleteId: -1,
      isDeleteClicked: '',
      categoryList: [],
      vendorList: [],
      productListArray: [],
      searchedProductList: [],
      selectedProductList: [],
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.toggleSmall = this.toggleSmall.bind(this);

  }

  componentDidMount() {
    // const { path } = './src/views/Pages/Login';
    // import (`${path}`)
    // .then(exportToken => this.setState({ exportToken: exportToken }))
    console.log('component mount executed ');
    // console.log('Exported Token : ', userExportedJWToken);

    const userName = localStorage.getItem('userName');
    const userPassword = localStorage.getItem('userPassword');
    if(userName===null && userPassword === null)
    {
      this.props.history.push("/login");
    }

    console.log('token in cookies : ', cookie.load('token'));

    // `/api/banner/?id=${cookie.load('token')}`
    // '/api/banner'

    fetch(base+'/api/specialCategoryListForCategory', {
      method: 'GET',
      headers: new Headers({
        'Authorization': 'Atiq '+cookie.load('token')
      })
    })
    .then(res => {
      console.log(res);
      return res.json()
    })
    .then(categoryList => {
      console.log(categoryList.data);
      this.setState({
        categoryList : categoryList.data
      })
      return false;
    });

    fetch(base+'/api/vendor_list_for_product', {
      method: 'GET',
      headers: new Headers({
        'Authorization': 'Atiq '+cookie.load('token')
      })
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

    fetch(base+'/api/banner', {
      method: 'GET',
      headers: new Headers({
        'Authorization': 'Atiq '+cookie.load('token')
      })
    })
    .then(res => {
      console.log(res);
      return res.json()
    })
    .then(banner => {
      console.log(banner.data);
      this.setState({
        banner : banner.data
      })
      return false;
    });

  }

  handleSubmit(event) {
    event.preventDefault();
    console.log('State values are : ', this.state);
    console.log('Image File : ', this.state.image[0]);

    const data = new FormData(event.target);
    if(this.state.image.length>0){
      console.log('has value');
      for (const file of this.state.image) {
        data.append('imageFile', file)
      }
    }
    else{
      console.log('no value');
      data.append('imageFile', false);
    }

    data.append('productsInfos', JSON.stringify(this.state.selectedProductList));
    // data.append('image', JSON.stringify(this.state.imageName));
    // data.append('description', JSON.stringify(this.state.description));
    // data.append('url', JSON.stringify(this.state.url));

    axios({
      method: 'post',
      url: base+'/api/saveSubBanner',
      data: data,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data',
        'Authorization': 'Atiq '+cookie.load('token')
      }
    })
    .then(function (response) {
      console.log(response);
      //handle success
      console.log(response);
      if(response.data.success==true){
        ToastsStore.success(response.data.message);
        setTimeout(
          function() {
            // window.location = '/banner/add-sub-banner';
          }
          .bind(this),
          3000
          );
        }
      })
      .catch(function (response) {
        ToastsStore.success(response.data.message);
        console.log(response);
      });

  }



  handleChange(event) {

    if (event.target.name == 'image') {
      console.log('Image : ', event.target.name);

      let reader = new FileReader();
      let file = event.target.files[0];

      console.log(file);

      this.state.image.push(file);

      // STARTED FOR IMAGE FILE SIZE
      let img = document.createElement('img');

      img.src = URL.createObjectURL(event.target.files[0]);

      let imgWidth = 0, imgHeight = 0;

      console.log(img);

      console.log('before onload function : executed')
      img.onload = function() {
        console.log(img.width+' - '+img.height);

        imgWidth = img.width;
        imgHeight = img.height;
      };

      // start image dimesion limitation

      // setTimeout(() => {
      //
      //   if (imgWidth == 568 && imgHeight == 314) {
      //     this.setState({
      //       imgWidth: imgWidth,
      //       imgHeight: imgHeight,
      //       isSubmitAllowed: true
      //     })
      //   }
      //   else {
      //     this.setState({
      //       imgWidth: imgWidth,
      //       imgHeight: imgHeight,
      //       isSubmitAllowed: false
      //     })
      //   }
      // }, 1000);

      // ended image dimesion limitation

      // this.setState({
      //   imgWidth: img.onload = () => img.width
      // })
      //
      // console.log('From Calback function : ', this.state.imgWidth);

      // END OF IMAGE FILE SIZE

      // MAIN IMAGE FILE WORKS----------------

      console.log('outside Width : '+imgWidth+' height : '+imgHeight);

      this.setState({
        incrementState: ++this.state.incrementState,
        imageName: event.target.files[0].name
      })

      reader.onloadend = () => {
        this.setState({ bannerImagesPreview: [ ...this.state.bannerImagesPreview, reader.result] });
      }

      reader.readAsDataURL(file);

      console.log('File event : ', event.target.files[0].name);
      console.log(this.state.bannerImagesPreview);
      console.log(this.state.image);
    }
    else {
      console.log('else working for', event.target.name);
      const target = event.target;
      const value = target.type === 'checkbox' ? target.checked : target.value;
      const name = target.name;

      this.setState({
        [name]: value
      });
    }

  }

  toggle() {
    this.setState({ collapse: !this.state.collapse });
  }

  toggleFade() {
    this.setState((prevState) => { return { fadeIn: !prevState }});
  }

  toggleSmall(event) {
    if (event == 'deleteBannerPermitted') {
      console.log('deleteBannerPermitted ...');

      fetch(base+`/api/bannerDelete/?id=${this.state.getDeleteId}`, {
        method: 'GET',
        headers: {
          'Authorization': 'Atiq '+cookie.load('token')
        }
      })
      .then(res => {
        // console.log(res);
        return res.json()
      })
      .then(banner => {
        console.log(banner.data);
        if (banner.success == true) {
          ToastsStore.success(banner.message);

          this.setState({
            banner : banner.data
          })

          setTimeout(() => {
            this.setState({
              small: !this.state.small,
            });

          }, 1000);

        }
        else {
          ToastsStore.success(banner.message);
        }


        // console.log('Vendor Data : ', this.state.vendorList);
        return false;
      });

    }
    else {
      this.setState({
        small: !this.state.small
      })
    }
  }

  deleteItem (event) {
    console.log('Delete item..');
    this.state.getDeleteId = event.currentTarget.dataset['id'];
    this.state.isDeleteClicked = event.currentTarget.dataset['deleteclicked'];

    setTimeout(() => {
      this.setState({
        small: !this.state.small,
      });
      console.log('Delete Id : ', this.state.getDeleteId);
    }, 200);
  }

  // AUTO SUGGEST START

  searchProduct (event) {
    console.log('Searched value : ', event.target.value);
    console.log('Vendor Id : ', this.state.vendorId);

    let target = event.target;
    let value = target.value;
    let name = target.name;

    this.setState({
      [name]: value
    });

    if ( event.target.value != '') {

      fetch(base+`/api/search_products_for_discount/?id=${event.target.value}&vendorId=${this.state.vendorId}&categoryid=${this.state.categoryValue}`, {
        method: 'GET',
        headers: {'Authorization': 'Atiq '+cookie.load('token')}
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

        this.state.productListArray = [];

        let i = 0;

        console.log('Array Length : ', this.state.productList.length);

        while (i < this.state.productList.length) {

          let productObject = {};

          productObject.id = this.state.productList[i].id;
          productObject.product_name_code = this.state.productList[i].product_name+' - '+this.state.productList[i].product_sku;

          this.state.productListArray.push(productObject);
          console.log('i : ', i);
          ++i;
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

    this.state.productListArray = [];

    console.log(this.state.productName);
  }

  // AUTO SUGGEST END

  addClick(){
    console.log('OK');
    console.log(this.state.searchedProductList);

    let purchaseObject = {};

    purchaseObject.productName = this.state.productName;

    this.state.searchedProductList.push(purchaseObject);

    console.log(this.state.searchedProductList);

    this.state.productName = '';

    let productInfos = {};

    productInfos.productId = this.state.id;
    productInfos.categoryId = this.state.categoryValue;
    productInfos.vendorId = this.state.vendorId;

    this.state.selectedProductList.push(productInfos);

    // console.log(this.addPurchase);
    console.log('selectedProductList : ', this.state.selectedProductList);

  }

  deletePurchaseItem (key) {

    let searchedProductList = [...this.state.searchedProductList];
    searchedProductList.splice(key, 1);

    let selectedProductListInfos = [...this.state.selectedProductList];
    selectedProductListInfos.splice(key, 1);

    setTimeout(()=>{
      console.log('Purchase List : ', searchedProductList);

      console.log('selectedProduct List : ', this.state.selectedProductList);

      this.setState({
        searchedProductList : searchedProductList,
        selectedProductList: selectedProductListInfos,
      });
    }, 50);

    setTimeout(()=>{

      console.log('selectedProduct List : ', this.state.selectedProductList);
    }, 100);

    console.log('Purchase List : ', this.state.searchedProductList);


  }

  render() {

    return (
      <Row>
      <ToastsContainer store={ToastsStore}/>
      <Col xs="12" md="6">
        <Card>
          <CardHeader>
            <strong>Add New Sub Banner</strong>
          </CardHeader>
          <CardBody>
            <Form action="" method="post" encType="multipart/form-data" onSubmit={this.handleSubmit} onChange={this.handleChange} className="form-horizontal">

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="categoryName">Category</Label>
                </Col>
                <Col xs="12" md="9">
                  {/* <Input type="text" id="name" name="name" value={this.state.value} data-name={'name'}  required="true" placeholder="Product" /> */}
                  <Input type="select" name="categoryValue" id="categoryValue" value={this.state.categoryValue} onChange={this.handleChange}>
                    <option value="0">Please select</option>
                    {
                      this.state.categoryList.map((categoryListValue, key) =>
                        categoryListValue != null ? <option value={key}> {categoryListValue} </option> : null
                      )
                    }
                  </Input>
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="categoryName">Vendor</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="select" name="vendorId" id="vendorId" value={this.state.vendorId} onChange={this.handleChange}>
                    <option value="0">Please select</option>
                    {
                      this.state.vendorList.map((vendorListValue, key) =>
                        vendorListValue != null ? <option value={vendorListValue.id}> {vendorListValue.name} </option> : null
                      )
                    }
                  </Input>
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="categoryName">Product</Label>
                </Col>
                <Col xs="12" md="8">
                  <Input type="text" id="productName" name="productName" placeholder="Product Name" onChange={this.searchProduct.bind(this)} value={this.state.productName}/>
                    <Input type="hidden" id="productName" name="productName" placeholder="Product Name" onChange={this.searchProduct.bind(this)} value={this.state.id}/>
                </Col>
                <Col md="1">
                  <Label htmlFor="add"> <a href="#" onClick={this.addClick.bind(this)}> <i className="fa fa-plus-square" style={{paddingTop: '11px'}}></i>  </a> </Label>&nbsp;
                  {/* <Label htmlFor="productName"> <a href="#"> <i className="fa fa-window-close" style={{paddingTop: '11px'}}></i> </a> </Label>                 */}
                </Col>
              </FormGroup>

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

              <FormGroup row style={{backgroundColor: 'gray', paddingTop: '5px', color: 'white'}}>
                <Col md="12">
                  <Label htmlFor="productName">Searched Product</Label>
                </Col>
              </FormGroup>

              {
                this.state.searchedProductList.map((searchedProductListValues, key1) =>
                  <FormGroup row>
                    <Col md="11">
                      <Input type="text" readOnly value={searchedProductListValues.productName}/>
                    </Col>

                    <Col md="1">
                      <Label htmlFor="close" name="close" onClick={this.deletePurchaseItem.bind(this,key1)} > <a href="#"> <i className="fa fa-window-close" style={{paddingTop: '11px'}}></i> </a> </Label>
                    </Col>
                  </FormGroup>

                )
              }

              {
                this.state.isSubmitAllowed == true ?
                <Button type="submit" size="sm" color="primary"><i className="fa fa-dot-circle-o"></i> Submit</Button>
                :
                <Button type="submit" size="sm" color="primary" disabled><i className="fa fa-dot-circle-o"></i> Submit</Button>
              }
              &nbsp;

              <Button type="reset" size="sm" color="danger"><i className="fa fa-ban"></i> Reset</Button>
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
                    <i className="fa fa-align-justify"></i>Sub Banner List
                  </Col>
                  <Col md="6">
                  </Col>
                </Row>
              </CardHeader>

              <CardBody>
                <Table responsive bordered>
                  <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>Product Image</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                  </thead>
                  <tbody>

                  {
                    this.state.banner.map((bannerValue, key) =>
                      <tr>
                        <td>{bannerValue.name}</td>
                        <td>
                          {
                            bannerValue.image?
                            <img width="100" height="80" src={`${publicUrl+'/upload/product/productImages/'+bannerValue.image}`}></img>
                            // <img width="100" height="80" src={publicUrl+'/upload/product/productImages/'+`${productListValue.home_image}`}></img>
                            :
                            <img width="100" height="80" src={publicUrl+'/upload/vendor/personal/default.png'}></img>
                          }
                        </td>
                        <td>{bannerValue.description}</td>
                        <td>
                        {
                          bannerValue.status == 1 ?
                          <i class="fa fa-check fa-lg" style={{color: '#009345'}}></i>
                          :
                          <i class="fa fa-times fa-lg" style={{color: '#009345'}}></i>
                        }
                        </td>
                        <td> <a href="#" onClick={this.deleteItem.bind(this)} data-id={bannerValue.id}><i className="fa fa-trash fa-lg" title="Delete Products Details" aria-hidden="true" style={{color: '#EB1C22'}}></i></a> </td>
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
            <ModalHeader toggle={this.toggleSmall}>
              Banner Delete
            </ModalHeader>
            <ModalBody>
              <strong>
                Are Sure to delete this Sub Banner?
              </strong>
            </ModalBody>
            <ModalFooter>
              <Button color="success" onClick={(e)=>{this.toggleSmall('deleteBannerPermitted')}} disabled>yes</Button>
              <Button color="danger" onClick={(e)=>{this.toggleSmall('deleteBannerDenied')}} >No</Button>
            </ModalFooter>
          </Modal>

    </Row>
    )
  }
}



export default OptionalBannerProducts;
