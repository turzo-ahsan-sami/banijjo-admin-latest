import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {ToastsContainer, ToastsStore} from 'react-toasts';
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

class SalesReturn extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.toggleFade = this.toggleFade.bind(this);

    this.AddValuesRef = React.createRef();
    this.ProductSpecificationValArray = [];
    this.addPurchase = [];

    this.state = {
      modal: false,
      large: false,
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
      productListArray: [],
      userName: '',
      vendorId: '',
      PurchaseList: [],
      countPurcheseList: 0,
      totalPrice: 0,
      grandTotalQuantity: 0,
      grandTotalPrice: 0,
      currentBillNo: 0,
      currentDate: '',
      vendorList: [],
      purchaseReturnNo: '',
      vendorWiseBillNo: [],
      vendorWiseBillNoArray: [],
      pBillNo: '',
      sales_date: '',
      vendorIdForPurchase: ''
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleProductChange = this.handleProductChange.bind(this);

    this.toggleLarge = this.toggleLarge.bind(this);
  }

  // AUTO SUGGEST START

  searchProduct (event) {
    console.log('Searched value : ', event.target.value);

    let target = event.target;
    let value = target.value;
    let name = target.name;

    this.setState({
      [name]: value
    });

    if ( event.target.value != '') {

      fetch(base+`/api/search_sales_products/?id=${event.target.value}&bill_no_id=${this.state.sales_bill_id}`, {
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
          if (products.data[i]) {
            console.log(products.data[j][0].id);
            let productObject = {};

            productObject.id = products.data[j][0].id;
            productObject.product_name_code = products.data[j][0].product_name+' - '+products.data[j][0].product_sku;

            this.state.productListArray.push(productObject);
          }
          else {
            console.log('Nullable');
          }

          ++j;
        }

        //

        // while (i < this.state.productList.length) {

        //   let productObject = {};

        //   productObject.id = this.state.productList[i].id;
        //   productObject.product_name_code = this.state.productList[i].product_name+' - '+this.state.productList[i].product_sku;

        //   this.state.productListArray.push(productObject);
        //   console.log('i : ', i);
        //   ++i;
        // }

        console.log('Product List : ', this.state.productListArray);

        return false;
      });

    }
    else {
      this.state.productListArray = [];

      console.log('Product List : ', this.state.productListArray);
    }


  }

  searchBillNo (event) {
    let target = event.target;
    let value = target.value;
    let name = target.name;

    console.log('Name : ', name);
    console.log('value : ', value);

    this.setState({
      [name]: value
    });

    this.state.vendorWiseBillNoArray = [];

    let i = 0;

    console.log('Array Length is : ', this.state.vendorWiseBillNo.length);
    console.log('Text Search : ', event.target.value);

    if ( event.target.value != '') {

      fetch(base+`/api/search_sales_products_bill_no/?id=${event.target.value}`, {
        method: 'GET'
      })
      .then(res => {
        console.log(res);
        return res.json()
      })
      .then(sales => {
        console.log('The api response for products quesry : ', sales.data);

        this.setState({
          productList : sales.data
        })

        this.state.productListArray = [];

        let i = 0;
        let j = 0;

        console.log('Array Length : ', this.state.productList.length);

        console.log('Return Vales : ', sales.data);

        while (i < sales.data.length) {

          let productSalesObject = {};

          productSalesObject.id = sales.data[i].id;
          productSalesObject.product_name_code = sales.data[i].sales_bill_no;
          productSalesObject.sales_date = sales.data[i].sales_date;
          productSalesObject.customer_id = sales.data[i].customer_id;
          productSalesObject.sales_pay_amount = sales.data[i].total_sales_amount;

          this.state.vendorWiseBillNoArray.push(productSalesObject);
          console.log('i : ', i);
          ++i;
        }

        if (sales.data.length > 0) {
            this.setState({
                vendorWiseBillNoArray : this.state.vendorWiseBillNoArray
            })
        }

        console.log('Product List : ', this.state.vendorWiseBillNoArray);
        console.log('Product List Length : ', this.state.vendorWiseBillNoArray.length);

        return false;
      });

    }
    else {
      this.state.productListArray = [];

      console.log('Product List : ', this.state.vendorWiseBillNoArray);
    }

    console.log('Product List : ', this.state.vendorWiseBillNoArray);
  }

  handleBillNoSearchText (event) {
    console.log(event.target.dataset.value);
    console.log(event.target.dataset.id);

    let target = event.target.dataset;
    let value = target.value;
    let name = event.target.name;

    console.log(name);
    console.log(event.target.name);
    console.log(value);
    console.log('Recived Date : ', event.target.dataset.date);
    console.log(event.target.dataset);

    this.setState({
      vendorWiseBillNoName: value
    });

    this.setState({
      ['sales_bill_id']: event.target.dataset.id
    });

    this.setState({
      sales_date: event.target.dataset.date
    });

    this.setState({
      ['customer_id']: event.target.dataset.customer_id
    });

    this.setState({
      ['sales_pay_amount'] : event.target.dataset.sales_pay_amount
    });

    this.state.vendorWiseBillNoArray = [];
    console.log('Sales Date : ', this.state.sales_date);
    console.log(this.state.vendorWiseBillNoName);
    console.log(this.state.vendorWiseBillNo);
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

  toggleLarge() {
    this.setState({
      large: !this.state.large,
    });
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

    this.state.userName = userName;

    this.state.productListArray = [];

    console.log(this.state.productListArray);

    this.state.vendorId = localStorage.getItem('employee_id');

    let tempDate = new Date();
    let date = tempDate.getFullYear() + '-' + (tempDate.getMonth()+1) + '-' + tempDate.getDate();

    this.state.currentDate = date;

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

    fetch(base+`/api/bill_no/?id=${this.state.vendorId}`, {
      method: 'GET'
    })
    .then(res => {
      console.log(res);
      return res.json()
    })
    .then(currentBillNo => {
      console.log('Current Bill No : ', currentBillNo.data[0].count_id);
      this.setState({
        currentBillNo : currentBillNo.data[0].count_id
      })

      console.log(this.state.currentBillNo);
      this.state.currentBillNo = Number(this.state.currentBillNo) + 1;
      this.state.currentBillNo = this.state.userName+'-'+this.state.currentBillNo;
      console.log(this.state.currentBillNo);

      return false;
    });

    fetch(base+'/api/sales_return_no', {
      method: 'GET'
    })
    .then(res => {
      console.log(res);
      return res.json()
    })
    .then(purchaseReturnNo => {
      console.log(purchaseReturnNo.data[0].count_id);
      let count_id = Number(purchaseReturnNo.data[0].count_id) + 1;

      console.log('length is : '+count_id.toString().length);

      while (count_id.toString().length < 5) {
        count_id = '0'+count_id;
        console.log('cound Id is : ', count_id);
      }

      this.setState({
        purchaseReturnNo : 'SR-'+count_id
      })

      return false;
    });

  }

  valueChange(event) {
    // this.setState({value: event.target.value});
    alert('Details', event.target.value);
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });

  }

  handlePurchaseByVendor (event) {
    console.log('vendor ID : ', event.target.value);
    let vendorId = event.target.value;
    this.state.vendorIdForPurchase = event.target.value;

    if (localStorage.getItem('user_type') != 'vendor') {
      fetch(base+`/api/purchase_list/?id=${vendorId}`, {
        method: 'GET'
      })
      .then(res => {
        console.log(res);
        return res.json()
      })
      .then(vendorWiseBillNo => {
        console.log('Purchase List : ', vendorWiseBillNo.data);

        this.setState({
          vendorWiseBillNo : vendorWiseBillNo.data
        })

        console.log('Purchase List : ', this.state.vendorWiseBillNo);

        return false;
      });
    }

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

    fetch(base+'/api/saveSalesReturn' , {
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
          ToastsStore.success("Product Purchasse Return Successfully inserted !!");
          console.log(info.success);
          setTimeout(
            function() {
            // window.location = '/sales/sales-return';
            }
            .bind(this),
            3000
          );
        }
        else {
          ToastsStore.warning("Product Purchase Insertion Faild. Please try again !!");
          console.log(info.success);
        }

    })

    // fetch(base+'/api/saveSalesReturn' , {
    //   method: "POST",
    //   headers: {
    //     'Content-type': 'application/json',
    //     'Authorization': 'Atiq '+cookie.load('token')
    //   },
    //   body: JSON.stringify(this.state)
    // })
    // .then((result) => result.json())
    // .then((info) => {
    //   if (info.success == true) {
    //     ToastsStore.success("Product Purchasse Return Successfully inserted !!");
    //     console.log(info.success);
    //     setTimeout(
    //       function() {
    //       // window.location = '/sales/sales-return';
    //       }
    //       .bind(this),
    //       3000
    //     );
    //   }
    //   else {
    //     ToastsStore.warning("Product Purchase Insertion Faild. Please try again !!");
    //     console.log(info.success);
    //   }
    // })

  }

  calculateTotalPrice (event) {
    this.state.totalPrice = this.state.productQuantity * event.target.value;
    console.log(event.target.value);
    console.log('Total Price is : ', this.state.totalPrice);
  }

  addClick(){
    console.log('OK');
    console.log(this.state.PurchaseList);

    let purchaseObject = {};

    purchaseObject.productName = this.state.productName;
    purchaseObject.productQuantity = this.state.productQuantity;
    purchaseObject.productPrice = this.state.productPrice;
    purchaseObject.totalPrice = this.state.totalPrice;
    purchaseObject.id = this.state.id;

    this.state.PurchaseList.push(purchaseObject);

    this.state.grandTotalQuantity = Number(this.state.grandTotalQuantity) + Number(this.state.productQuantity);

    this.state.grandTotalPrice = Number(this.state.grandTotalPrice) + Number(this.state.totalPrice);

    console.log(this.state.PurchaseList);

    this.state.productName = '';
    this.state.productQuantity= '';
    this.state.productPrice= '';
    this.state.totalPrice= '';
    this.state.id='';

    console.log(this.addPurchase);

  }

  calculateTotalPrice (event) {
    this.state.totalPrice = this.state.productQuantity * event.target.value;
    console.log(event.target.value);
    console.log('Total Price is : ', this.state.totalPrice);
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

  render() {

    return (
      <Row>
        <ToastsContainer store={ToastsStore}/>


      <Col xs="12" md="12">
        <Card>
          <CardHeader>
            {/* <i className="fa fa-align-justify"></i> Product Specification List */}
            <Row>
              <Col md="6"><i className="fa fa-align-justify"></i> Add Sales Return</Col>

              <Col md="6">
                  <Button color="success" onClick={this.toggleLarge} className="mr-1"> <i className="fa fa-plus-circle"></i> Add New Sales Return</Button>
              </Col>
            </Row>
          </CardHeader>
          <CardBody>
            <Table responsive bordered>
              <thead>
              <tr>
                <th>Product Name</th>
                <th>Product Price</th>
                <th>Sales Bill No</th>
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

      <Modal isOpen={this.state.large} toggle={this.toggleLarge}
              className={'modal-lg ' + this.props.className}>
        <ModalHeader toggle={this.toggleLarge}>Add New Sales Return</ModalHeader>
        <ModalBody>

        <Col xs="12" md="12">
        <Card>
          <CardBody>

            <Form action="" method="post" onSubmit={this.handleSubmit} onChange={this.handleProductChange} encType="multipart/form-data" className="form-horizontal">

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="purchaseReturnNo">Sales Return No</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="text" id="purchaseReturnNo" name="purchaseReturnNo" placeholder="Purchase Return No" ref='clear' onChange={this.handleAddChange.bind(this)} readOnly  value={this.state.purchaseReturnNo}/>
                </Col>
              </FormGroup>

              {/* {
                localStorage.getItem('user_type') == 'vendor' ?
                <FormGroup row>
                  <Col md="3">
                    <Label htmlFor="SuplierName">Sales Bill No</Label>
                  </Col>
                  <Col xs="12" md="9">
                    <Input type="text" id="SuplierName" name="SuplierName" placeholder="Suplier Name" readOnly value={this.state.userName}/>
                  </Col>
                </FormGroup>
                :
                <FormGroup row>
                  <Col md="3">
                    <Label htmlFor="SuplierName">Supplier Name</Label>
                  </Col>

                  <Col xs="12" md="9">
                    <Input type="select" id="SuplierName" name="SuplierName"  placeholder="Suplier Name" onChange={this.valueChange.bind(this), this.handlePurchaseByVendor.bind(this)}  value={this.state.SuplierName} >
                    <option value="0">Please select</option>
                    {
                      this.state.vendorList.map((vendorListValue, key) =>
                        <option value={vendorListValue.id}> {vendorListValue.name} </option>
                      )
                    }
                    </Input>
                  </Col>
                </FormGroup>
              } */}

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="pBillNo">Sales Bill No : {this.state.vendorWiseBillNoArray.length}</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="text" id="vendorWiseBillNoName" name="vendorWiseBillNoName" placeholder="Sales Bill No" required="true" ref='clear' onChange={/*this.handleAddChange.bind(this),*/ this.searchBillNo.bind(this)} value={this.state.vendorWiseBillNoName} />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col xs="12" md="12">
                    {
                      this.state.vendorWiseBillNoArray.length > 0 ?

                      this.state.vendorWiseBillNoArray.map((values, key) =>
                        <ListGroupItem tag="button" name="salesBillNoName" onClick={this.handleBillNoSearchText.bind(this)} data-id={values.id} data-value={values.product_name_code} data-date={values.sales_date} data-customer_id={values.customer_id} data-sales_pay_amount={values.sales_pay_amount} action> {values.product_name_code}</ListGroupItem>
                      ) :
                      null
                    }
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="values">Sales Return Date</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="date" id="purchaseReturnDate" name="purchaseReturnDate" placeholder="Order No" onChange={this.handleAddChange.bind(this)} value={this.state.purchaseReturnDate} />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="values">Sales Date</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="text" id="sales_date" name="sales_date" placeholder="Sales Date" readOnly onChange={this.handleAddChange.bind(this)} value={this.state.sales_date} />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="values">Total Quantity</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="text" id="totalQuantity" name="totalQuantity" placeholder="Total Quantity" ref='clear' readOnly value={this.state.grandTotalQuantity}/>
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="values">Total Amount</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="text" id="totalAmount" name="totalAmount" placeholder="Total Amount" ref='clear' readOnly value={this.state.grandTotalPrice}/>
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="values">Total Return Amount</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="text" id="totalReturnAmount" name="totalReturnAmount" placeholder="Total Return Amount" ref='clear' required onChange={this.handleAddChange.bind(this)} value={this.state.totalReturnAmount}/>
                </Col>
              </FormGroup>

              <hr/>

              <FormGroup row style={{backgroundColor: 'gray', paddingTop: '5px', color: 'white'}}>
                <Col md="4">
                  <Label htmlFor="productName">Search Product</Label>
                </Col>
                <Col md="2">
                  <Label htmlFor="productName">Quantity</Label>
                </Col>
                <Col md="2">
                  <Label htmlFor="productName">Price</Label>
                </Col>
                <Col md="3">
                  <Label htmlFor="productName">total</Label>
                </Col>
                <Col md="1">
                  <Label htmlFor="productName"> Action </Label>
                </Col>
              </FormGroup>

              {this.addPurchase}

              <FormGroup row>
                <Col xs="12" md="4">
                <Input type="text" id="productName" name="productName" placeholder="Product Name" onChange={this.searchProduct.bind(this)} value={this.state.productName}/>
                  <Input type="hidden" id="productName" name="productName" placeholder="Product Name" onChange={this.searchProduct.bind(this)} value={this.state.id}/>
                </Col>

                <Col xs="12" md="2">
                  <Input type="text" id="productQuantity" name="productQuantity" placeholder="Quantity" ref='clear' onChange={this.handleAddChange.bind(this)} value={this.state.productQuantity}/>
                </Col>

                <Col xs="12" md="2">
                  <Input type="text" id="productPrice" name="productPrice" placeholder="Price" ref='clear' onChange={this.handleAddChange.bind(this), this.calculateTotalPrice.bind(this)} value={this.state.productPrice}/>
                </Col>

                <Col xs="12" md="3">
                  <Input type="text" id="totalPrice" name="totalPrice" placeholder="Total Price" ref='clear' readOnly value={this.state.totalPrice}/>
                </Col>

                <Col md="1">
                  <Label htmlFor="add"> <a href="#"  onClick={this.addClick.bind(this)}> <i className="fa fa-plus-square" style={{paddingTop: '11px'}}></i>  </a> </Label>&nbsp;
                  {/* <Label htmlFor="productName"> <a href="#"> <i className="fa fa-window-close" style={{paddingTop: '11px'}}></i> </a> </Label>                 */}
                </Col>
              </FormGroup>



              <FormGroup row>
                <Col xs="12" md="12">
                  {/* <table> */}

                    {
                      this.state.productListArray.length != 0 ?

                      this.state.productListArray.map((values, key) =>
                        // <tr>
                        //   <td scope="row" > <a href="#" name="productName" onClick={this.handleSearchText.bind(this)} data-value={values.product_name_code}> {values.product_name_code} </a> </td>
                        // </tr>

                        <ListGroupItem tag="button" name="productName" onClick={this.handleSearchText.bind(this)} data-id={values.id} data-value={values.product_name_code}  action>{values.product_name_code}</ListGroupItem>
                      ) :
                      null
                    }
                  {/* </table> */}
                </Col>
              </FormGroup>


              {
                this.state.PurchaseList.map((purchaseValues, key1) =>
                  <FormGroup row>
                    <Col md="4">
                      <Input type="text" readOnly value={purchaseValues.productName}/>
                    </Col>

                    <Col md="2">
                      <Input type="text" readOnly value={purchaseValues.productQuantity} />
                    </Col>

                    <Col md="2">
                      <Input type="text" readOnly value={purchaseValues.productPrice}/>
                    </Col>

                    <Col md="3">
                      <Input type="text" readOnly value={purchaseValues.totalPrice} />
                    </Col>

                    <Col md="1">
                      <Label htmlFor="close" name="close" onClick={this.deletePurchaseItem.bind(this,key1)} > <a href="#"> <i className="fa fa-window-close" style={{paddingTop: '11px'}}></i> </a> </Label>
                    </Col>
                  </FormGroup>
                )
              }



              <Button type="submit" size="sm" color="success"><i className="fa fa-dot-circle-o"></i> Submit</Button>&nbsp;
              <Button type="reset" size="sm" color="danger"><i className="fa fa-ban"></i> Reset</Button>
            </Form>
          </CardBody>

        </Card>
      </Col>

      </ModalBody>
    </Modal>

    </Row>

    )
  }
}



export default SalesReturn;
