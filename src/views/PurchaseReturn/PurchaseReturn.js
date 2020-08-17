import React, { Component } from 'react';
import ReactDOM from 'react-dom';
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
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ListGroupItem,
} from 'reactstrap';
const base = process.env.REACT_APP_ADMIN_SERVER_URL;



class PurchaseReturn extends Component {
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
      largeEdit: false,
      small: false,
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
      purchaseDate: '',
      vendorIdForPurchase: '',
      purchaseReturnList: [],
      userType: '',
      userId: '',
      purchaseReturnDeleteId: 0,
      disabledColor: true,
      disabledSize: true,
      colorList: [],
      sizeList: [],
      confirmModal: false,
      purchaseConfirmId : -1,
      employee_id: -1,
      purchaseReturnId: -1,
      isUpdateClicked: false,
      purchaseInfos: [],
      purchaseDetailsInfos: [],
      supplierId: -1,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleProductChange = this.handleProductChange.bind(this);

    this.toggleLarge = this.toggleLarge.bind(this);
    this.toggleLargeEdit = this.toggleLargeEdit.bind(this);
    this.toggleSmall = this.toggleSmall.bind(this);
    this.toggleConfirmModal = this.toggleConfirmModal.bind(this);
  }

  toggleSmall(event) {
    if (event == 'Yes') {
      fetch(base+`/api/deletePurchaseReturn/?id=${this.state.purchaseReturnDeleteId}`, {
        method: 'GET',
        headers: {'Authorization': 'Atiq '+cookie.load('token')}
      })
      .then(res => {
        console.log(res);
        return res.json()
      })
      .then(purchaseDelete => {
        console.log('Data : ', purchaseDelete.data);

        if (purchaseDelete.success == true) {
          setTimeout(() => {
            this.setState({
              small: !this.state.small,
            });
            window.location = '/purchase/purchase-return';
          }, 1000);
        }
        else {
          if (purchaseDelete.status == 403) {
            console.log(purchaseDelete);

            ToastsStore.warning('Your session is expired. Please Login again');

            setTimeout(()=> {
              logoutFunction(localStorage.userName);
            }, 1000);

          }
          else {
            ToastsStore.warning("Purchase Return Info deletion Faild. Please try again !!");
            console.log(purchaseDelete.success);
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

    console.log(event);
  }

  toggleLargeEdit(event) {
    if (event == 'Yes') {
      console.log('working...');
    }
    else {
      this.setState({
        largeEdit: !this.state.largeEdit,
        PurchaseList: []
      });
    }

  }

  toggleConfirmModal(event) {
    console.log('states : ', this.state);
    if (event == 'Yes') {
      console.log('confirmed clicked!');
      fetch(base+`/api/confirmPurchaseReturn/?id=${this.state.purchaseConfirmId}&employee_id=${this.state.employee_id}`, {
        method: 'GET',
        headers: {'Authorization': 'Atiq '+cookie.load('token')}
      })
      .then(res => {
        console.log(res);
        return res.json()
      })
      .then(purchaseDelete => {
        console.log('Data : ', purchaseDelete.data);

        if (purchaseDelete.success == true) {
          ToastsStore.success(purchaseDelete.message);

          setTimeout(() => {
            this.setState({
              confirmModal : !this.state.confirmModal
            });
            window.location = '/purchase/purchase-return';
          }, 1000);
        }
        else {
          if (purchaseDelete.status == 403) {
            console.log(purchaseDelete);

            ToastsStore.warning('Your session is expired. Please Login again');

            setTimeout(()=> {
              logoutFunction(localStorage.userName);
            }, 1000);

          }
          else {
            ToastsStore.warning("Purchase Info deletion Faild. Please try again !!");
            console.log(purchaseDelete.success);
          }
        }

        return false;
      });
    }
    else {
      console.log('did not confirm');
      this.setState({
        confirmModal : !this.state.confirmModal
      });
    }

    console.log(event);
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

      fetch(base+`/api/search_purchase_products/?id=${event.target.value}&vendorId=${this.state.vendorIdForPurchase}`, {
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

    this.setState({
      [name]: value
    });

    this.state.vendorWiseBillNoArray = [];

    let i = 0;

    console.log('Array Length : ', this.state.vendorWiseBillNo.length);

    while (i < this.state.vendorWiseBillNo.length) {

      let billNoObject = {};

      if (this.state.vendorWiseBillNo[i].billNo.includes(target.value) == true && target.value != '') {
        billNoObject.id = this.state.vendorWiseBillNo[i].id;
        billNoObject.vendorWiseBillNo = this.state.vendorWiseBillNo[i].billNo;
        billNoObject.date = this.state.vendorWiseBillNo[i].purchaseDate;

        this.state.vendorWiseBillNoArray.push(billNoObject);

        let dateTime = new Date(this.state.vendorWiseBillNo[i].purchaseDate);

        let Year = dateTime.getFullYear;
        let month = dateTime.getMonth;
        let day = dateTime.getDay;

        let purchaseDate = Year+'-'+month+'-'+day;

        console.log('i : ', i);
        console.log('Bill No : ', this.state.vendorWiseBillNo[i].billNo);
        console.log('Target Value : ', this.state.vendorWiseBillNo[i].billNo.includes(target.value) );
        console.log('serched values : ', target.value);
        console.log('Date : ', this.state.vendorWiseBillNo[i].purchaseDate);
        console.log('Values Loop : ', this.state.vendorWiseBillNo[i]);
        console.log('purchase Date : ', purchaseDate+' - '+this.state.vendorWiseBillNo[i].purchaseDate);
      }
      else{
        this.state.vendorWiseBillNoArray = [];
      }

      ++i;
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
    console.log(event.target.dataset.date);
    console.log(event.target.dataset);

    this.setState({
      [name]: value
    });

    this.setState({
      ['id']: event.target.dataset.id
    });

    this.setState({
      ['purchaseDate']: event.target.dataset.date
    })

    this.state.vendorWiseBillNoArray = [];
    console.log(this.state.purchaseDate);
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

    fetch(base+`/api/getSpecificationNamesValues/?id=${event.target.dataset.id}`, {
      method: 'GET',
      headers: {'Authorization': 'Atiq '+cookie.load('token')}
    })
    .then(res => {
      console.log(res);
      return res.json()
    })
    .then(specification => {
      console.log('THe api response for products quesry : ', specification.data);

      if (specification.success == true) {
        this.setState({
          colorList : specification.colorList,
          sizeList: specification.sizeList,
        })

        if (specification.colorList.length > 0) {
          this.setState({
            disabledColor: false,
          });
        }

        if (specification.sizeList.length > 0) {
          this.setState({
            disabledSize: false,
          });
        }

        console.log('specification.colorList : ', specification.colorList);
        console.log('specification.colorList length : ', specification.colorList.length);
        console.log('specification.sizeList : ', specification.sizeList);
        console.log('specification.sizeList length : ', specification.sizeList.length);
      }
      else {
        console.log('Error handled');
        console.log('Specificaton data : ', specification);
      }

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
    const userType = localStorage.getItem('user_type');
    const userId = localStorage.getItem('employee_id');
    this.state.employee_id = localStorage.getItem('employee_id');

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

    fetch(base+'/api/purchase_return_no', {
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
        purchaseReturnNo : 'PRR-'+count_id
      })

      return false;
    });

    this.handlePurchaseReturnList();

  }

  handlePurchaseReturnList () {
    fetch(base+`/api/purchase_return_list/?id=${this.state.userId}&type=${this.state.userType}`, {
      method: 'GET'
    })
    .then(res => {
      console.log(res);
      return res.json()
    })
    .then(purchaseReturnList => {
      console.log(purchaseReturnList.data);
      this.setState({
        purchaseReturnList : purchaseReturnList.data
      })

      console.log('purchaseReturnList : ', this.state.purchaseReturnList);

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

    if (this.state.isUpdateClicked == false) {
      // purchase reurn save
      fetch(base+'/api/saveProductPurchaseReturn' , {
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
            // this.props.history.push("/product/products");
              window.location = '/purchase/purchase-return';
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
            ToastsStore.warning("Product Purchase Return insertion Faild. Please try again !!");
            console.log(info.success);
          }
        }
      })
    }
    else {
      // Purchase return edit
      fetch(base+'/api/editProductPurchaseReturn' , {
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
          ToastsStore.success("Product Purchasse Return Successfully Updated !!");
          console.log(info.success);
          setTimeout(
            function() {
            // this.props.history.push("/product/products");
              window.location = '/purchase/purchase-return';
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
            ToastsStore.warning("Product Purchase Return Update Faild. Please try again !!");
            console.log(info.success);
          }
        }
      })
    }

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
    purchaseObject.colorValue = this.state.productColor;
    purchaseObject.sizeValue = this.state.productSize;

    this.state.PurchaseList.push(purchaseObject);

    this.state.grandTotalQuantity = Number(this.state.grandTotalQuantity) + Number(this.state.productQuantity);

    this.state.grandTotalPrice = Number(this.state.grandTotalPrice) + Number(this.state.totalPrice);

    console.log(this.state.PurchaseList);

    this.state.productName = '';
    this.state.productQuantity= '';
    this.state.productPrice= '';
    this.state.totalPrice= '';
    this.state.id='';
    this.state.productColor='';
    this.state.productSize='';
    this.state.colorList=[];
    this.state.sizeList=[];

    this.setState({
      disabledSize: true,
      disabledColor: true,
    });

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

  deleteItem (event) {
    console.log('Delete Purchase Id : ', event.currentTarget.dataset['id']);

    this.setState({
      small: !this.state.small,
      purchaseReturnDeleteId: event.currentTarget.dataset['id']
    });
  }

  confirmClicked (event) {

    console.log('confirmation purchase id : ', event.currentTarget.dataset['id']);

    this.setState({
      purchaseConfirmId: event.currentTarget.dataset['id'],
      confirmModal : !this.state.confirmModal
    })
  }

  editItem (event) {
    console.log('Edit Purchase Id : ', event.currentTarget.dataset['editid']);

    this.setState({
      purchaseReturnId: event.currentTarget.dataset['editid'],
      isUpdateClicked : true,
    })

    fetch(base+`/api/getPurchaseReturnInfoForUpdate/?id=${event.currentTarget.dataset['editid']}`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        'Authorization': 'Atiq '+cookie.load('token')
      },
    })
    .then(res => {
      console.log(res);
      return res.json()
    })
    .then(purchaseUpdate => {
      console.log('Response From \'getPurchaseReturnInfoForUpdate\' update API : ', purchaseUpdate);
      console.log('supplierName : ', purchaseUpdate.data[2]);
      console.log('purchase update : ', purchaseUpdate.data[0]);

      this.setState({
        purchaseInfos : purchaseUpdate.data[0],
        purchaseDetailsInfos: purchaseUpdate.data[1],
        largeEdit: !this.state.largeEdit,
        currentBillNo : purchaseUpdate.data[0].purchaseReturnBillNo,
        // chalanNo: purchaseUpdate.data[0].chalanNo,
        supplierId: purchaseUpdate.data[0].supplierId,
        vendorIdForPurchase: purchaseUpdate.data[0].supplierId,
        SuplierName: purchaseUpdate.data[2],
        purchaseDate: purchaseUpdate.data[0].purchaseReturnDate,
        grandTotalQuantity: purchaseUpdate.data[0].totalQuantity,
        grandTotalPrice: purchaseUpdate.data[0].totalAmount,
      });

      let i = 0;

      while (i < purchaseUpdate.data[3].length) {

        // add click
        let purchaseObject = {};

        purchaseObject.productName = purchaseUpdate.data[3][i].product_name+' - '+purchaseUpdate.data[3][i].product_sku;
        purchaseObject.productQuantity = purchaseUpdate.data[3][i].quantity;
        purchaseObject.productPrice = purchaseUpdate.data[3][i].price;
        purchaseObject.totalPrice = purchaseUpdate.data[3][i].totalPrice;
        purchaseObject.id = purchaseUpdate.data[3][i].id;
        purchaseObject.colorValue = purchaseUpdate.data[3][i].colorId;
        purchaseObject.sizeValue = purchaseUpdate.data[3][i].sizeId;
        purchaseObject.colorName = purchaseUpdate.data[3][i].name;
        purchaseObject.sizeName = purchaseUpdate.data[3][i].size;

        this.state.PurchaseList.push(purchaseObject);

        console.log('i : ', i);
        ++i;
      }

      this.setState({
        PurchaseList: this.state.PurchaseList
      });

      console.log('Purchase List : ', this.state.PurchaseList);

      return false;
    });

    this.setState({
      purchaseEditId: event.currentTarget.dataset['editid']
    });

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
              <Col md="6"><i className="fa fa-align-justify"></i> Add Product Purchase Return</Col>

              <Col md="6">
                  <center>
                    <Button color="success" onClick={this.toggleLarge} className="mr-1"> <i className="fa fa-plus-circle"></i> Add </Button>
                  </center>

              </Col>
            </Row>
          </CardHeader>
          <CardBody>
            <Table responsive bordered>
              <thead>
              <tr>
                <th>Purchase Return Bill No</th>
                <th>purchaseReturnDate</th>
                <th>Total Amount</th>
                <th>Total Quantity</th>
                <th>Action</th>
              </tr>
              </thead>
              <tbody>
                {
                  this.state.purchaseReturnList.map((purchaseReturnListValue, key) =>
                    <tr>
                      <td>{purchaseReturnListValue.purchaseReturnBillNo}</td>
                      <td>{purchaseReturnListValue.purchaseReturnDate}</td>
                      <td>{purchaseReturnListValue.totalAmount}</td>
                      <td>{purchaseReturnListValue.totalQuantity}</td>
                      <td>
                        <center>
                          {
                            purchaseReturnListValue.isConfirmed == 'false' ?
                            <React.Fragment>
                              <a href="#" id="editIds" ref="editIds" onClick={this.editItem.bind(this)} data-editid={purchaseReturnListValue.id}>
                                <i className="fa fa-edit" title="Edit Products Details" aria-hidden="true" style={{color: '#009345'}}></i>
                              </a> {' '}
                              <a href="#" onClick={this.deleteItem.bind(this)} id="deleteIds" ref="dataIds" data-id={purchaseReturnListValue.id}>
                                <i className="fa fa-trash fa-lg" title="Delete Purchase Return Details" aria-hidden="true" style={{color: '#EB1C22'}}></i>
                              </a> {' '}
                              <a href="#" id="confirmIds" ref="confirmIds" onClick={this.confirmClicked.bind(this)} data-id={purchaseReturnListValue.id}>
                                <i className="fa fa-play" title="Confirm Purchase" aria-hidden="true" style={{color: '#009345'}}></i>
                              </a>
                            </React.Fragment>
                            :
                            null
                          }

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

      <Modal isOpen={this.state.large} toggle={this.toggleLarge}
              className={'modal-lg ' + this.props.className}>
        <ModalHeader toggle={this.toggleLarge}>Add New Purchase Return</ModalHeader>
        <ModalBody>

        <Col xs="12" md="12">
        <Card>
          <CardBody>

            <Form action="" method="post" onSubmit={this.handleSubmit} onChange={this.handleProductChange} encType="multipart/form-data" className="form-horizontal">

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="purchaseReturnNo">Purchase Return No</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="text" id="purchaseReturnNo" name="purchaseReturnNo" placeholder="Purchase Return No" ref='clear' onChange={this.handleAddChange.bind(this)} readOnly  value={this.state.purchaseReturnNo}/>
                </Col>
              </FormGroup>

              {
                localStorage.getItem('user_type') == 'vendor' ?
                <FormGroup row>
                  <Col md="3">
                    <Label htmlFor="SuplierName">Vendor Name</Label>
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
                    {/* <Input type="selec" id="SuplierName" name="SuplierName" placeholder="Suplier Name" readOnly value={this.state.userName}/> */}
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
              }

              {/* <FormGroup row>
                <Col md="3">
                  <Label htmlFor="pBillNo">Purchase Bill No</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="text" id="vendorWiseBillNoName" name="vendorWiseBillNoName" placeholder="Purchase Bill No" required="true" ref='clear' onChange={this.handleAddChange.bind(this), this.searchBillNo.bind(this)} value={this.state.vendorWiseBillNoName} />
                </Col>
              </FormGroup> */}

              <FormGroup row>
                <Col xs="12" md="12">
                    {
                      this.state.vendorWiseBillNoArray.length != 0 ?

                      this.state.vendorWiseBillNoArray.map((values, key) =>
                        <ListGroupItem tag="button" name="vendorWiseBillNoName" onClick={this.handleBillNoSearchText.bind(this)} data-id={values.id} data-value={values.vendorWiseBillNo} data-date={values.date} action> {values.vendorWiseBillNo}</ListGroupItem>
                      ) :
                      null
                    }
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="values">Purchase Return Date</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="date" id="purchaseReturnDate" name="purchaseReturnDate" placeholder="Order No" onChange={this.handleAddChange.bind(this)} value={this.state.purchaseReturnDate} />
                </Col>
              </FormGroup>

              {/* <FormGroup row>
                <Col md="3">
                  <Label htmlFor="values">Purchase Date</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="text" id="purchaseDate" name="purchaseDate" placeholder="Order No" readOnly onChange={this.handleAddChange.bind(this)} value={this.state.purchaseDate} />
                </Col>
              </FormGroup> */}

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

              <hr/>

              <FormGroup row style={{backgroundColor: 'gray', paddingTop: '5px', color: 'white'}}>
                <Col md="3">
                  <Label htmlFor="productName">Search Product</Label>
                </Col>
                <Col md="2">
                  <Label htmlFor="productName">Specification</Label>
                </Col>
                <Col md="2">
                  <Label htmlFor="productName">Quantity</Label>
                </Col>
                <Col md="2">
                  <Label htmlFor="productName">Unite Price</Label>
                </Col>
                <Col md="2">
                  <Label htmlFor="productName">total</Label>
                </Col>
                <Col md="1">
                  <Label htmlFor="productName"> Action </Label>
                </Col>
              </FormGroup>

              {this.addPurchase}

              <FormGroup row>
                <Col xs="3" style={{paddingRight: "0px", paddingLeft: "0px"}}>
                <Input type="text" id="productName" name="productName" placeholder="Product Name" onChange={this.searchProduct.bind(this)} value={this.state.productName}/>
                  <Input type="hidden" id="productName" name="productName" placeholder="Product Name" onChange={this.searchProduct.bind(this)} value={this.state.id}/>
                </Col>

                <Col xs="1">
                  <select id="productColor" name="productColor" placeholder="Color" style={{height: "34px", borderRadius:"4px", display:"inline-block", overflow:"hidden", border:"1px solid #cccccc"}} disabled = {(this.state.disabledColor)? "disabled" : ""} >
                    <option value="" disabled selected>Color</option>
                    {
                      this.state.colorList.length > 0 ?
                        this.state.colorList.map((colorListValue, key) =>
                          <option value={colorListValue.id}>{colorListValue.name}</option>
                        )
                      :
                      null
                    }
                  </select>
                </Col>

                <Col xs="1">
                  <select id="productSize" name="productSize" placeholder="Size" style={{height: "34px", borderRadius:"4px", display:"inline-block", overflow:"hidden", border:"1px solid #cccccc"}} disabled = {(this.state.disabledSize)? "disabled" : ""} >
                    <option value="" disabled selected>Size</option>
                    {
                      this.state.sizeList.length > 0 ?
                        this.state.sizeList.map((sizeListValue, key) =>
                          <option value={sizeListValue.id}>{sizeListValue.size}</option>
                        )
                      :
                      null
                    }
                  </select>
                </Col>

                <Col xs="2" style={{paddingRight: "3px", paddingLeft: "7px"}}>
                  <Input type="text" id="productQuantity" name="productQuantity" placeholder="Quantity" ref='clear' onChange={this.handleAddChange.bind(this)} value={this.state.productQuantity}/>
                </Col>

                <Col xs="2" style={{paddingRight: "3px", paddingLeft: "0px"}}>
                  <Input type="text" id="productPrice" name="productPrice" placeholder="Price" ref='clear' onChange={this.handleAddChange.bind(this), this.calculateTotalPrice.bind(this)} value={this.state.productPrice}/>
                </Col>

                <Col xs="2" style={{paddingRight: "0px", paddingLeft: "0px"}}>
                  <Input type="text" id="totalPrice" name="totalPrice" placeholder="Total Price" ref='clear' readOnly value={this.state.totalPrice}/>
                </Col>

                <Col xs="1">
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

              <center>
                <Button type="submit" size="sm" color="success"><i className="fa fa-dot-circle-o"></i> Submit</Button>&nbsp;
                <Button type="reset" size="sm" color="danger"><i className="fa fa-ban"></i> Reset</Button>
              </center>


            </Form>
          </CardBody>

        </Card>
      </Col>

      </ModalBody>
    </Modal>

    <Modal isOpen={this.state.largeEdit} toggle={this.toggleLargeEdit}
           className={'modal-lg ' + this.props.className}>
      <ModalHeader toggle={this.toggleLargeEdit}>Edit Purchase Return</ModalHeader>
      <ModalBody>
        <Form action="" method="post" onSubmit={this.handleSubmit} onChange={this.handleProductChange} encType="multipart/form-data" className="form-horizontal">

          <FormGroup row>
            <Col md="3">
              <Label htmlFor="values">Return Bill No</Label>
            </Col>
            <Col xs="12" md="9">
              <Input type="text" id="billNo" name="billNo" placeholder="Bill No" ref='clear' onChange={this.handleAddChange.bind(this)} readOnly  value={this.state.currentBillNo}/>
            </Col>
          </FormGroup>

          <FormGroup row>
            <Col md="3">
              {
                localStorage.user_type == 'vendor'?
                <Label htmlFor="SuplierName">Vendor Name</Label>
                :
                <Label htmlFor="SuplierName">Supplier Name</Label>
              }
            </Col>

            <Col xs="12" md="9">
              {
                localStorage.user_type == 'vendor'?
                <Input type="text" id="SuplierName" name="SuplierName" placeholder="Suplier Name" readOnly value={this.state.SuplierName}/>
                :
                <Input type="text" id="SuplierName" name="SuplierName" placeholder="Suplier Name" readOnly value={this.state.SuplierName}/>
              }
            </Col>
          </FormGroup>

          <FormGroup row>
            <Col md="3">
              <Label htmlFor="values">Purchase Return Date</Label>
            </Col>
            <Col xs="12" md="9">
              <Input type="text" id="purchaseDate" name="purchaseDate" placeholder="Order No" readOnly onChange={this.handleAddChange.bind(this)} value={this.state.purchaseDate} />
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

          <hr/>

          <FormGroup row style={{backgroundColor: 'gray', paddingTop: '5px', color: 'white'}}>
            <Col md="3">
              <Label htmlFor="productName">Search Product</Label>
            </Col>
            <Col md="2">
              <Label htmlFor="productName">Specification</Label>
            </Col>
            <Col md="2">
              <Label htmlFor="productName">Quantity</Label>
            </Col>
            <Col md="2">
              <Label htmlFor="productName">Unite Price</Label>
            </Col>
            <Col md="2">
              <Label htmlFor="productName">total</Label>
            </Col>
            <Col md="1">
              <Label htmlFor="productName"> Action </Label>
            </Col>
          </FormGroup>

          {this.addPurchase}

          <FormGroup row>
            <Col xs="12" md="3">
            <Input type="text" id="productName" name="productName" placeholder="Product Name" onChange={this.searchProduct.bind(this)} value={this.state.productName}/>
              <Input type="hidden" id="productName" name="productName" placeholder="Product Name" onChange={this.searchProduct.bind(this)} value={this.state.id}/>
            </Col>

            <Col xs="12" md="1">
              <select id="productColor" name="productColor" placeholder="Color" style={{height: "34px", borderRadius:"4px", display:"inline-block", overflow:"hidden", border:"1px solid #cccccc"}} disabled = {(this.state.disabledColor)? "disabled" : ""} >
                <option value="" disabled selected>Color</option>
                {
                  this.state.colorList.length > 0 ?
                    this.state.colorList.map((colorListValue, key) =>
                      <option value={colorListValue.id}>{colorListValue.name}</option>
                    )
                  :
                  null
                }
              </select>
            </Col>

            <Col xs="12" md="1">
              <select id="productSize" name="productSize" placeholder="Size" style={{height: "34px", borderRadius:"4px", display:"inline-block", overflow:"hidden", border:"1px solid #cccccc"}} disabled = {(this.state.disabledSize)? "disabled" : ""} >
                <option value="" disabled selected>Size</option>
                {
                  this.state.sizeList.length > 0 ?
                    this.state.sizeList.map((sizeListValue, key) =>
                      <option value={sizeListValue.id}>{sizeListValue.size}</option>
                    )
                  :
                  null
                }
              </select>
            </Col>

            <Col xs="12" md="2">
              <Input type="text" id="productQuantity" name="productQuantity" placeholder="Quantity" ref='clear' onChange={this.handleAddChange.bind(this)} value={this.state.productQuantity}/>
            </Col>

            <Col xs="12" md="2">
              <Input type="text" id="productPrice" name="productPrice" placeholder="Price" ref='clear' onChange={this.handleAddChange.bind(this), this.calculateTotalPrice.bind(this)} value={this.state.productPrice}/>
            </Col>

            <Col xs="12" md="2">
              <Input type="text" id="totalPrice" name="totalPrice" placeholder="Total Price" ref='clear' readOnly value={this.state.totalPrice}/>
            </Col>

            <Col md="1">
              <Label htmlFor="add"> <a href="#"  onClick={this.addClick.bind(this)}> <i className="fa fa-plus-square" style={{paddingTop: '11px'}}></i>  </a> </Label>&nbsp;
            </Col>
          </FormGroup>

          <FormGroup row>
            <Col xs="12" md="12">
              {
                this.state.productListArray.length != 0 ?

                this.state.productListArray.map((values, key) =>
                  <ListGroupItem tag="button" name="productName" onClick={this.handleSearchText.bind(this)} data-id={values.id} data-value={values.product_name_code}  action>{values.product_name_code}</ListGroupItem>
                ) :
                null
              }
            </Col>
          </FormGroup>

          <hr/>

          {
            this.state.PurchaseList.map((purchaseValues, key1) =>
              <FormGroup row>
                <Col md="11">
                  <ListGroupItem tag="button" name="purchaeInfo" action disabled>
                    <strong>Name & SKU :</strong> {purchaseValues.productName}<br/>
                    <strong>Color : </strong>{purchaseValues.colorName}<br/>
                    <strong>Size : </strong>{purchaseValues.sizeName}<br/>
                    <strong>Quantity : </strong>{purchaseValues.productQuantity}<br/>
                    <strong>Unite Price : </strong>{purchaseValues.productPrice} <br/>
                    <strong> Total Price : </strong> {purchaseValues.totalPrice}
                  </ListGroupItem>
                </Col>

                <Col md="1">
                  <Label htmlFor="close" name="close" onClick={this.deletePurchaseItem.bind(this,key1)} > <a href="#"> <i className="fa fa-window-close" style={{paddingTop: '11px'}}></i> </a> </Label>
                </Col>
              </FormGroup>
            )
          }

          <center>
            <Button type="submit" size="sm" color="success" ><i className="fa fa-dot-circle-o"></i> Submit</Button>&nbsp;
            <Button type="reset" size="sm" color="danger"><i className="fa fa-ban"></i> Reset</Button>
          </center>


        </Form>
      </ModalBody>
      <ModalFooter>
      </ModalFooter>
    </Modal>

    <Modal isOpen={this.state.small} toggle={this.toggleSmall}
           className={'modal-sm ' + this.props.className}>
      <ModalHeader toggle={this.toggleSmall}>Delete Purchase Return</ModalHeader>
      <ModalBody>
        Are You Sure To Delete This Purchase Return ?
      </ModalBody>
      <ModalFooter>
        <Button color="success" onClick={(e)=>{this.toggleSmall('Yes')}} >Yes</Button>{' '}
        <Button color="danger" onClick={(e)=>{this.toggleSmall('No')}} >No</Button>
      </ModalFooter>
    </Modal>

    <Modal isOpen={this.state.confirmModal} toggle={this.toggleConfirmModal}
           className={'modal-sm ' + this.props.className}>
      <ModalHeader toggle={this.toggleConfirmModal}>Confirm Purchase</ModalHeader>
      <ModalBody>
        Are You Sure To Confirm This Purchase Return ?
      </ModalBody>
      <ModalFooter>
        <Button color="success" onClick={(e)=>{this.toggleConfirmModal('Yes')}} >Yes</Button>{' '}
        <Button color="danger" onClick={(e)=>{this.toggleConfirmModal('No')}} >No</Button>
      </ModalFooter>
    </Modal>

    </Row>

    )
  }
}



export default PurchaseReturn;
