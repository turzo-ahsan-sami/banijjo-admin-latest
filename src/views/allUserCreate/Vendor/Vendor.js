import React, { Component } from 'react';
import {ToastsContainer, ToastsStore} from 'react-toasts';
import ImageUploader from 'react-images-upload';
import axios from 'axios';
import cookie from 'react-cookies';

import {logoutFunction} from '../../DynamicLogout/Logout';

// import { Badge, Card, CardBody, CardHeader, Col, Pagination, PaginationItem, PaginationLink, Row, Table } from 'reactstrap';
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
const publicUrl = process.env.REACT_APP_PUBLIC_URL;
// const FormData = require('form-data');

class Vendor extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.toggleFade = this.toggleFade.bind(this);
    this.state = {
      vendorList: [],
      pictures: [],
      collapse: true,
      fadeIn: true,
      timeout: 300,
      imageURL:'',
      selectedFile: null,
      vendorImagePreview:'',
      small:false,
      large: false,
      vendorIdForAuthorize: 0,
      isAuthorizeClicked: '',
      getDeleteId : 0,
      isDeleteClicked : '',

      isTabClicked: 0,
      bName: '',
      bEmail: '',
      bWebsite: '',
      bAddress: '',
      pName: '',
      pEmail: '',
      pMobile: '',
      pNid: '',
      pDob: '',
      pAddress: '',
      pImage: '',
      tin: '',
      trade_licence: '',
      web_address: '',
      bsd: '',
      business_address: '',
      sName: '',
      sLanguage: '',
      sCountry: '',
      sCurrency: '',
      sCoverPhoto: '',
      sLogo: '',
      isEditClicked: 0,
      file: null,
      pImageName: '',
      pImageFile: [],
      sImageLogo: '',
      fileLogo: null,
      sImageFile: [],
      sImageCoverPhoto: '',
      fileCoverPicture: null,
      user_employee_id: -1,

      vendor: [],
      vendor_details: [],

      viewLarge: false,
    };

    // this.handleSubmit = this.handleSubmit.bind(this);
    this.handleProductChange = this.handleProductChange.bind(this);
    this.handleUploadImage = this.handleUploadImage.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.handleSubmitUpdate = this.handleSubmitUpdate.bind(this);

    this.toggleSmall = this.toggleSmall.bind(this);
    this.toggleLarge = this.toggleLarge.bind(this);

    this.toggleLargeView = this.toggleLargeView.bind(this);
  }

  toggle() {
    this.setState({ collapse: !this.state.collapse });
  }

  toggleFade() {
    this.setState((prevState) => { return { fadeIn: !prevState }});
  }

  toggleLarge() {
    this.setState({
      large: !this.state.large,
    });

    if (this.state.isEditClicked == 1) {
      this.tabClicked(0);
    }

  }

  toggleLargeView(event) {
    this.setState({
      viewLarge: !this.state.viewLarge,
    });

    if (event.currentTarget.dataset['id'] === undefined) {
        console.log('Oops !');

        this.setState({
            vendor : [],
            vendor_details: [],
        });

        setTimeout(()=>{
            console.log('Vendor Data : ', this.state.vendor);
            console.log('Vendor Details : ', this.state.vendor_details);
        }, 100);

    }
    else {

        fetch(base+`/api/getUserInfo/?id=${event.currentTarget.dataset['id']}&clicked=${event.currentTarget.dataset['viewclicked']}`, {
          method: 'GET',
          headers: {'Authorization': 'Atiq '+cookie.load('token')}
        })
        .then(res => {
          return res.json()
        })
        .then(users => {

            console.log(users);

            this.setState({
                vendor : users.data_vendor,
                vendor_details: users.data_vendor_details,
            });

            console.log('Vendor Data : ', this.state.vendor);
            console.log('Vendor Details : ', this.state.vendor_details);

            return false;
        });
    }

  }

  tabClicked (event) {
    console.log('Tab Clicked : ', event);

    this.setState({
      isTabClicked : event,
      isEditClicked: 0,
    });

    this.handleGetBasicEditForm();
    this.handleGetPersonalEditForm();
    this.handleGetBusinessEditForm();
    this.handleGetShopEditForm();

  }

  tabClickedFor (event) {
    console.log('Tab Clicked : ', event);

    this.setState({
      isTabClicked : event
    });
  }

  toggleSmall(event) {
    console.log('Name : ', event);
    if (event == 'authorizeVendorPermitted') {
      fetch(base+`/api/vendorAuthorization/?id=${this.state.vendorIdForAuthorize}&clicked=${this.state.isAuthorizeClicked}`, {
        method: 'GET',
        headers: {'Authorization': 'Atiq '+cookie.load('token')}
      })
      .then(res => {
        // console.log(res);
        return res.json()
      })
      .then(vendors => {
        console.log('vendor list returned : ', vendors.data);
        console.log('Clicked on : ', vendors.clicked);

        if (vendors.success == true) {
          ToastsStore.success(vendors.message);

          this.setState({
            vendorList : vendors.data,
            isAuthorizeClicked: '',
            small: !this.state.small,
          });
        }
        else {
          if (vendors.status == 403) {
            console.log(vendors);

            ToastsStore.warning('Your session is expired. Please Login again');

            setTimeout(()=> {
              logoutFunction(localStorage.userName);
            }, 1000);

          }
          else {
            ToastsStore.warning('Someth Went Wrong!');
            this.setState({
              vendorList : vendors.data,
              isAuthorizeClicked: '',
              small: !this.state.small,
            });
          }
        }

        return false;
      });
    }
    else if (event == 'authorizeVendorDenied') {
      this.setState({
        small: !this.state.small,
        isAuthorizeClicked: ''
      });
    }
    else if (event == 'deleteVendorPermitted') {
      fetch(base+`/api/vendorAuthorization/?id=${this.state.getDeleteId}&clicked=${this.state.isDeleteClicked}`, {
        method: 'GET',
        headers: {'Authorization': 'Atiq '+cookie.load('token')}
      })
      .then(res => {
        // console.log(res);
        return res.json()
      })
      .then(vendors => {
        console.log('vendor list returned : ', vendors.data);
        console.log('Clicked on : ', vendors.clicked);

        if (vendors.success == true) {
          ToastsStore.success(vendors.message);

          this.setState({
            vendorList : vendors.data,
            isAuthorizeClicked: '',
            small: !this.state.small,
          });
        }
        else {

          if (vendors.status == 403) {
            console.log(vendors);

            ToastsStore.warning('Your session is expired. Please Login again');

            setTimeout(()=> {
              logoutFunction(localStorage.userName);
            }, 1000);

          }
          else {
            ToastsStore.warning('Something Went Wrong!');

            this.setState({
              vendorList : vendors.data,
              isAuthorizeClicked: '',
              small: !this.state.small,
            });
          }

        }

        return false;
      });
    }
    else if (event == 'deleteVendorDenied') {
      this.setState({
        small: !this.state.small,
        isDeleteClicked: ''
      });
    }

    console.log(event);

    console.log(this.state.small);
  }

  componentDidMount() {
    console.log('Version is : ', React.version);
    fetch(base+'/api/vendor_list_for_product', {
      method: 'GET'
    })
    .then(res => {
      // console.log(res);
      return res.json()
    })
    .then(vendors => {
      console.log(vendors.data);
      this.setState({
        vendorList : vendors.data
      })

      // console.log('Vendor Data : ', this.state.vendorList);
      return false;
    });
  }

  handleGetEditForm (event) {
    console.log('Vendor ID : ', event.currentTarget.dataset['id']);

    this.setState({
      user_employee_id : event.currentTarget.dataset['id']
    })

    // GET THE USR INFOMATION
    fetch(base+`/api/getUserInfo/?id=${event.currentTarget.dataset['id']}`, {
      method: 'GET'
    })
    .then(res => {
      // console.log(res);
      return res.json()
    })
    .then(users => {
      console.log(users.data_vendor);
      this.setState({
        vendor : users.data_vendor,
        vendor_details: users.data_vendor_details,
        isEditClicked: 1,
      })

      console.log('Vendor Data : ', this.state.vendor);
      console.log('Vendor Details : ', this.state.vendor_details);

      this.toggleLarge();

      return false;
    });

  }

  handleGetBasicEditForm () {
    console.log('Edit Method working...');
    console.log(this.state.vendor);

    if (this.state.vendor.length > 0) {
      for (var i = 0; i < this.state.vendor.length; i++) {
        this.setState({
          bName: this.state.vendor[i].name,
          bEmail: this.state.vendor[i].email,
          bWebsite: this.state.vendor[i].website,
          bAddress: this.state.vendor[i].address,
        });
      }
    }

    // this.setState({
    //   blarge: !this.state.blarge,
    // });

  }

  handleGetPersonalEditForm () {
    console.log('Edit Method working...');
    console.log(this.state.vendor);

    if (this.state.vendor_details.length > 0) {
      for (var i = 0; i < this.state.vendor_details.length; i++) {
        this.setState({
          pName: this.state.vendor_details[i].name,
          pEmail: this.state.vendor_details[i].email,
          pMobile: this.state.vendor_details[i].mobile,
          pNid: this.state.vendor_details[i].nid,
          pDob: this.state.vendor_details[i].dob,
          pAddress: this.state.vendor_details[i].present_address,
          pImage: this.state.vendor_details[i].vendorImage,
        });
      }
    }

    // this.setState({
    //   plarge: !this.state.plarge,
    // });

  }

  handleGetBusinessEditForm () {
    console.log('Edit Method working...');

    if (this.state.vendor_details.length > 0) {
      for (var i = 0; i < this.state.vendor_details.length; i++) {
        this.setState({
          tin: this.state.vendor_details[i].tin,
          trade_licence: this.state.vendor_details[i].trade_licence,
          web_address: this.state.vendor_details[i].web_address,
          bsd: this.state.vendor_details[i].business_start_date,
          business_address: this.state.vendor_details[i].business_address,
        });
      }
    }

    // this.setState({
    //   bslarge: !this.state.bslarge,
    // });

  }

  handleGetShopEditForm() {
    console.log('Edit Method working...');
    console.log(this.state.vendor);

    if (this.state.vendor_details.length > 0) {
      for (var i = 0; i < this.state.vendor_details.length; i++) {
        this.setState({
          sName: this.state.vendor_details[i].shop_name,
          sLanguage: this.state.vendor_details[i].shop_language,
          sCountry: this.state.vendor_details[i].shop_country,
          sCurrency: this.state.vendor_details[i].shop_currency,
          sCoverPhoto: this.state.vendor_details[i].cover_photo,
          sLogo: this.state.vendor_details[i].logo,
        });
        console.log('logo : ', this.state.vendor_details[i].logo);
        console.log('cover_photo : ', this.state.vendor_details[i].cover_photo);
      }
      console.log('sLogo from state : ',this.state.sLogo);
    }


    // this.setState({
    //   slarge: !this.state.slarge,
    // });
  }

  handleProductChange(event) {
    // this.setState({value: event.target.value});
    // alert(event.target.input.files[0]);
    if (event.target.name == 'pImage') {

      let file = event.target.files[0];
      if (!file.name.match(/.(jpg|jpeg|png|gif)$/i)){
        ToastsStore.warning("Image is not valid");
        return false;
      }
      else {
        this.setState({
          pImageName: file.name,
          file: URL.createObjectURL(event.target.files[0])
        })

        this.state.pImageFile.push(file);
      }

      this.setState({

      })
    }
    else if (event.target.name == 'sLogo') {

      let file = event.target.files[0];
      if (!file.name.match(/.(jpg|jpeg|png|gif)$/i)){
        ToastsStore.warning("Image is not valid");
        return false;
      }
      else {
        this.setState({
          sImageLogo: file.name,
          fileLogo: URL.createObjectURL(event.target.files[0])
        })

        this.state.sImageFile.push(file);
        console.log('sImage after push from sLogo', this.state.sImageFile);
      }

      this.setState({

      });

    }
    else if (event.target.name == 'sCoverPhoto') {

      let file = event.target.files[0];
      if (!file.name.match(/.(jpg|jpeg|png|gif)$/i)){
        ToastsStore.warning("Image is not valid");
        return false;
      }
      else {
        this.setState({
          sImageCoverPhoto: file.name,
          fileCoverPicture: URL.createObjectURL(event.target.files[0])
        })

        this.state.sImageFile.push(file);
        console.log('sImage after push from sCoverPhoto', this.state.sImageFile);
      }

      this.setState({

      });

    }
    else {
      let target = event.target;
      let value = target.type === 'checkbox' ? target.checked : target.value;
      let name = target.name;

      this.setState({
        [name]: value
      });

      console.log('Value Changing on : ', name);
      console.log('Value is : ', value);
    }

  }

  onDrop(picture) {

    this.setState({
        pictures: this.state.pictures.concat(picture),
    });

  }

  // handleSubmit (event) {
  //   event.preventDefault();
  //   console.log('submitted value : ', this.state);
  //   console.log('submitted Image : ', this.state.image);
  //   console.log('submitted Image value : ', this.state.pictures[0].path);

  //   // this.setState({
  //   //   pictures: this.state.pictures.concat(this.state.image),
  //   // });

  //   console.log('submitted Picture value : ', this.state.pictures);

  //   fetch('/api/saveVendor' , {
  //     method: "POST",
  //     headers: {
  //       'Content-type': 'application/json'
  //     },
  //     body: JSON.stringify(this.state)
  //   })
  //   .then((result) => result.json())
  //   .then((info) => {
  //     if (info.success == true) {
  //       ToastsStore.success("Vendor Successfully inserted !!");
  //       console.log(info.success);
  //       setTimeout(
  //         function() {
  //         // this.props.history.push("/product/vendor");
  //         window.location = '/product/vendor';
  //         }
  //         .bind(this),
  //         3000
  //       );
  //     }
  //     else {
  //       ToastsStore.warning("Product Insertion Faild. Please try again !!");
  //       console.log(info.success);
  //     }

  //   })
  // }

  handleUploadImage(ev) {
    ev.preventDefault();
    const data = new FormData(ev.target);
    // for (const file of this.state.allFilesInfo) {
    //   data.append('file', file)
    // }
     data.append('file', this.state.selectedFile);
    // data.append('file', this.state.allFilesInfo);
    // console.log(data);
    // fetch('/api/saveVendor', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'multipart/form-data'
    //   },
    //   body: data
    // }).then((response) => {
    //   response.json()
    //   .then((data) => {
    //     console.log(data);
    //     // this.setState({ imageURL: `http://localhost:8000/${body.file}` });
    //   });
    // });

    axios({
      method: 'post',
      url: base+'/api/saveVendor',
      data: data,
       headers: { 'Authorization': 'Atiq '+cookie.load('token') }
      })
      .then(function (response) {
          //handle success
        // let  data =  response.json();
        if(response.data.message=="success"){
          ToastsStore.success("Vendor Successfully inserted !!");
                setTimeout(
                  function() {
                  window.location = '/product/vendor';
                  }
                  .bind(this),
                  3000
                );
        }
      })
      .catch(function (response) {
          //handle error
          console.log(response);
      });
  }


  onChangeHandler=event=>{
    // let testFileInfo = {}
    //  testFileInfo.selectedFile = event.target.files[0];
  //   const  fileInput = event.target.files[0];


  //    this.setState({selectedFile:event.target.files[0]})
  //  //  this.state.allFilesInfo.push(event.target.files[0]);
  //  var reader = new FileReader();
  //  reader.onload = (e) => {
  //    this.state.vendorImage = event.target.files[0];
  //  }
  //  reader.readAsDataURL(fileInput);




   let reader = new FileReader();
    let file = event.target.files[0];
    if (!file.name.match(/.(jpg|jpeg|png|gif)$/i)){
      ToastsStore.warning("Image is not valid");
      return false;
    }
    else{
      reader.onloadend = () => {
        this.setState({
          selectedFile: file,
          vendorImagePreview: reader.result
        },()=>{console.log(this.state)});
    }
      reader.readAsDataURL(file)
    }
  }

  authorize (event) {
    console.log('authorize function called !', event.currentTarget.dataset['id']);

    this.setState({

      vendorIdForAuthorize: event.currentTarget.dataset['id'],
      isAuthorizeClicked: event.currentTarget.dataset['clicked']
    });

    setTimeout(() => {
      this.setState({
        small: !this.state.small,
      })
      console.log('Authorize Clicked : ', this.state.isAuthorizeClicked);
    }, 200);


  }

  deleteEvent (event) {
    this.state.getDeleteId = event.currentTarget.dataset['id'];
    this.state.isDeleteClicked = event.currentTarget.dataset['deleteclicked'];

    this.setState({
      small: !this.state.small
    })

    console.log(event.currentTarget.dataset['id']);

    console.log(this.state.getDeleteId);
    console.log(this.state.isDeleteClicked);
  }

  handleSubmitUpdate (event) {
    event.preventDefault();

    const data = new FormData(event.target);

    console.log('this.state.bName : ', this.state.bName);
    console.log('event.target.file : ', event.target);

    // BASIC INFOS...
    data.append('basicName', JSON.stringify(this.state.bName));
    data.append('basicEmail', JSON.stringify(this.state.bEmail));
    data.append('basicWebsite', JSON.stringify(this.state.bWebsite));
    data.append('basicAddress', JSON.stringify(this.state.bAddress));

    // PERSONAL INFOS...
    console.log('this.state.pImageFile : ', this.state.pImageFile);
    if (this.state.pImageFile.length > 0) {
      data.append('personalImageFile', this.state.pImageFile);
      data.append('personalImageName', this.state.pImageName);
      console.log('pImage exist....', this.state.pImageFile);
    }
    else {
      data.append('personalImageName', this.state.pImage);
      data.append('personalImageFile', false);
    }

    data.append('personalName', JSON.stringify(this.state.pName));
    data.append('personalEmail', JSON.stringify(this.state.pEmail));
    data.append('personalMobile', JSON.stringify(this.state.pMobile));
    data.append('personalNid', JSON.stringify(this.state.pNid));
    data.append('personalDob', JSON.stringify(this.state.pDob));
    data.append('personalAddress', JSON.stringify(this.state.pAddress));

    // BUSINESS INFOS...
    data.append('b_trade_licence', JSON.stringify(this.state.trade_licence));
    data.append('b_tin', JSON.stringify(this.state.tin));
    data.append('b_bsd', JSON.stringify(this.state.bsd));
    data.append('b_web_address', JSON.stringify(this.state.web_address));
    data.append('b_business_address', JSON.stringify(this.state.business_address));

    // SHOP INFOS...
    if (this.state.sImageFile.length > 0) {
      for (const file of this.state.sImageFile) {
        data.append('shopImageFile', file)

      }

      console.log('sImageLogo : ', this.state.sImageLogo);
      console.log('sImageCoverPhoto : ', this.state.sImageCoverPhoto);

      if (this.state.sImageLogo) {
        data.append('shopImageLogo', this.state.sImageLogo);
      }
      else {
        console.log('asigning sLogo : ', this.state.sLogo);
        data.append('shopImageLogo', this.state.sLogo);
      }
      if (this.state.sImageCoverPhoto) {
        data.append('shopImageCoverPhoto', this.state.sImageCoverPhoto);
      }
      else {
        console.log('asigning sCoverPhoto : ', this.state.sCoverPhoto);
        data.append('shopImageCoverPhoto', this.state.sCoverPhoto);
      }

      console.log('sImage exist....', this.state.sImageFile);
    }
    else {
      data.append('shopImageLogo', this.state.sLogo);
      data.append('shopImageCoverPhoto', this.state.sCoverPhoto);
      data.append('shopImageFile', false);
    }

    data.append('ShopName', JSON.stringify(this.state.sName));
    data.append('ShopLanguage', JSON.stringify(this.state.sLanguage));
    data.append('ShopCountry', JSON.stringify(this.state.sCountry));
    data.append('ShopCurrency', JSON.stringify(this.state.sCurrency));
    data.append('user_employee_id', JSON.stringify(this.state.user_employee_id));

    let i = 0;
    for (let value of data.values()) {
      ++i;
      console.log('Looping for '+i+' time');
       console.log(value);
    }

    // Display the key/value pairs
    for (var pair of data.entries()) {
        console.log(pair[0]+ ', ' + pair[1]);
    }

    axios({
      method: 'post',
      url: base+'/api/vendorUpdateByAdmin',
      data: data,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data',
        'Authorization': 'Atiq '+cookie.load('token')
      }
    })
    .then(function (response) {
      console.log(response);
      if (response.data.success == true) {
        ToastsStore.success("Succesfully Updated");

        setTimeout(()=> {
          window.location = '/create-users/vendor-create';
        },1500);
      }
      else {

        if (response.data.status == 403) {
          console.log(response);

          ToastsStore.warning('Your session is expired. Please Login again');

          setTimeout(()=> {
            logoutFunction(localStorage.userName);
          }, 1000);

        }
        else {
          ToastsStore.warning('Data Update Faild');
        }

      }

    })
    .catch(function (response) {
      ToastsStore.warning("Something Went Wrong! Please Try Again!");
      //handle error
      console.log(response);
    });

    console.log('Update Form Submnitted : ', this.state);
  }


  render() {
    let {vendorImagePreview} = this.state;
    let $imagePreview = null;
    if (vendorImagePreview) {
      $imagePreview = (<img width="100" height="100" src={vendorImagePreview} />);
    }
    return (
      <Row>
        <ToastsContainer store={ToastsStore}/>
      {/*<Col xs="12" md="6">
        <Card>
          <CardHeader>
            <strong>Add Vendor</strong>
          </CardHeader>
          <CardBody>
            <Form  refs action="" method="post" encType="multipart/form-data" className="form-horizontal" onSubmit={this.handleUploadImage}  onChange={this.handleProductChange}>
              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="name">Vendor Name</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="text" id="name" name="name" placeholder="Vendor Name" />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="email">Vendor Email</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="text" id="email" name="email" placeholder="Vendor Name" />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="phoneNumber">Vendor Phone Number</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="text" id="phoneNumber" name="phoneNumber" placeholder="Vendor Phone Number" />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="website">Vendor Website</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="text" id="website" name="website" placeholder="Vendor Website" />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="address">Address</Label>
                </Col>
                <Col xs="12" md="9">
                      <Input type="textarea" name="address" id="address" rows="9"
                             placeholder="Address..." />
                    </Col>
              </FormGroup>

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="image">Vendor Image [previously it was commented]</Label>
                </Col>
                <Col xs="12" md="9">
                      <Input type="file" id="image" name="image" />
                    </Col>
              </FormGroup> 

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="image">Vendor Image</Label>
                </Col>
                <Col xs="12" md="9">
                    <label for="file-input" >
                      <img style={{height: "60px", width: "60px"}} src={publicUrl+"/productFormatedImages/Asset3.png"}/>
                    </label>

                    <Input style={{visibility:"hidden"}} type="file" onChange={this.onChangeHandler} id="file-input" name="image" />
                    <div style={{height: "30px", width: "30px"}}></div>
                    {$imagePreview}
                </Col>
              </FormGroup>
              <center>
                <Button type="submit" size="sm" color="success" disabled><i className="fa fa-dot-circle-o" ></i> Submit</Button>&nbsp;
                <Button type="reset" size="sm" color="danger"><i className="fa fa-ban"></i> Reset</Button>
              </center>

            </Form>
          </CardBody>
          <CardFooter>

          </CardFooter>
        </Card>
      </Col>*/}

      <Col xs="12" lg="12">
        <Card>
          <CardHeader>
            <i className="fa fa-align-justify"></i> Vendor List
          </CardHeader>
          <CardBody>
            <Table responsive bordered>
              <thead>
              <tr>
                <th>Vendor Name</th>
                <th>Vendor Image</th>
                <th>Email</th>
                <th>Website</th>
                <th>Address</th>
                <th>Status</th>
                {
                  localStorage.user_type == 'super_admin' ?
                  <th>Action</th>
                  :
                  localStorage.user_type == 'admin' ?
                  <th>Action</th>
                  :
                  localStorage.user_type == 'admin_manager' ?
                  <th>Action</th>
                  :
                  null
                }
                {
                  localStorage.user_type == 'super_admin' ?
                  <th>Authorization</th>
                  :
                  localStorage.user_type == 'admin' ?
                  <th>Authorization</th>
                  :
                  localStorage.user_type == 'admin_manager' ?
                  <th>Authorization</th>
                  :
                  null
                }
              </tr>
              </thead>
              <tbody>
              {
                this.state.vendorList.map((vendorListValue, key) =>
                <tr>
                  <td>{vendorListValue.name}</td>
                  <td>
                  {
                    vendorListValue.vendorImage?<img width="60" height="60" src={publicUrl+'/upload/vendor/'+vendorListValue.vendorImage}></img>
                    :
                    <img width="60" height="60" src={publicUrl+'/upload/vendor/default.png'}></img>
                  }

                  </td>
                  <td>{vendorListValue.email}</td>
                  <td>{vendorListValue.website}</td>
                  <td>{vendorListValue.address}</td>
                  <td>
                    {vendorListValue.status == 'active' ? <center> <i class="fa fa-check fa-lg" style={{color: '#009345'}}></i>  </center> : <center> <i class="fa fa-times fa-lg" style={{color: '#009345'}}></i> </center> }
                  </td>
                  {
                  localStorage.user_type == 'super_admin' ?
                  <td>
                    <center>
                      <a href="#">
                        <i className="fa fa-info-circle fa-lg" data-id={vendorListValue.id} data-viewclicked={'viewclicked'}  title="View Vendor Info" aria-hidden="true" style={{color: '#009345'}} onClick={this.toggleLargeView.bind(this)}></i>
                      </a>&nbsp;
                      <a href="#">
                      <i className="fa fa-edit fa-lg"  title="Edit Vendor Info" aria-hidden="true" style={{color: '#009345'}} data-id={vendorListValue.id} onClick={this.handleGetEditForm.bind(this)} ></i>
                      </a>&nbsp;
                      {
                        localStorage.user_type == 'admin'?
                        <a data-id={vendorListValue.id} data-deleteclicked={'deleteclicked'} title="delete" onClick={this.deleteEvent.bind(this)} style={{cursor: 'pointer'}}>
                        <i className="fa fa-trash fa-lg" title="Delete Products Details" aria-hidden="true" style={{color: '#EB1C22'}}></i>
                        </a>
                        :
                        localStorage.user_type == 'super_admin'?
                        <a data-id={vendorListValue.id} data-deleteclicked={'deleteclicked'} title="delete" onClick={this.deleteEvent.bind(this)} style={{cursor: 'pointer'}}>
                        <i className="fa fa-trash fa-lg" title="Delete Products Details" aria-hidden="true" style={{color: '#EB1C22'}}></i>
                        </a>
                        :null
                      }
                    </center>
                  </td>
                  :
                  localStorage.user_type == 'admin' ?
                  <td>
                    <center>
                      <a href="#">
                        <i className="fa fa-info-circle fa-lg" data-id={vendorListValue.id} data-viewclicked={'viewclicked'}  title="View Details Info" aria-hidden="true" style={{color: '#009345'}} onClick={this.toggleLargeView.bind(this)}></i>
                      </a>&nbsp;
                      <a href="#">
                      <i className="fa fa-edit fa-lg"  title="Edit Details Info" aria-hidden="true" style={{color: '#009345'}} data-id={vendorListValue.id} onClick={this.handleGetEditForm.bind(this)}></i>
                      </a>&nbsp;
                      {
                        localStorage.user_type == 'admin'?
                        <a data-id={vendorListValue.id} data-deleteclicked={'deleteclicked'} title="delete" onClick={this.deleteEvent.bind(this)} style={{cursor: 'pointer'}}>
                        <i className="fa fa-trash fa-lg" title="Delete Products Details" aria-hidden="true" style={{color: '#EB1C22'}}></i>
                        </a>
                        :
                        localStorage.user_type == 'super_admin'?
                        <a data-id={vendorListValue.id} data-deleteclicked={'deleteclicked'} title="delete" onClick={this.deleteEvent.bind(this)} style={{cursor: 'pointer'}}>
                        <i className="fa fa-trash fa-lg" title="Delete Products Details" aria-hidden="true" style={{color: '#EB1C22'}}></i>
                        </a>
                        :null
                      }
                    </center>
                  </td>
                  :
                  localStorage.user_type == 'admin_manager' ?
                  <td>
                    <center>
                      <a href="#">
                        <i className="fa fa-info-circle fa-lg" data-id={vendorListValue.id} data-viewclicked={'viewclicked'}  title="View Details Info" aria-hidden="true" style={{color: '#009345'}} onClick={this.toggleLargeView.bind(this)}></i>
                      </a>&nbsp;
                      <a href="#">
                      <i className="fa fa-edit fa-lg"  title="Edit Details Info" aria-hidden="true" style={{color: '#009345'}}></i>
                      </a>&nbsp;
                      {
                        localStorage.user_type == 'admin'?
                        <a data-id={vendorListValue.id} data-deleteclicked={'deleteclicked'} title="delete" onClick={this.deleteEvent.bind(this)} style={{cursor: 'pointer'}}>
                        <i className="fa fa-trash fa-lg" title="Delete Details" aria-hidden="true" style={{color: '#EB1C22'}}></i>
                        </a>
                        :
                        localStorage.user_type == 'super_admin'?
                        <a data-id={vendorListValue.id} data-deleteclicked={'deleteclicked'} title="delete" onClick={this.deleteEvent.bind(this)} style={{cursor: 'pointer'}}>
                        <i className="fa fa-trash fa-lg" title="Delete Details" aria-hidden="true" style={{color: '#EB1C22'}}></i>
                        </a>
                        :null
                      }
                    </center>
                  </td>
                  :
                  null
                }
                {
                  localStorage.user_type == 'super_admin' ?
                  <td>
                    {
                      vendorListValue.step_completed == 'approved' ?
                      <center>
                        <a data-id={vendorListValue.id} data-clicked={'Unauthorize'} style={{cursor: 'pointer'}} title="Unauthorize" onClick={this.authorize.bind(this)}>
                          <i class="fa fa-chevron-circle-left fa-lg" style={{color: '#009345'}}></i>
                        </a>
                      </center>
                      :
                      <center>
                      <a data-id={vendorListValue.id} data-clicked={'Authorize'} style={{cursor: 'pointer'}} title="Authorize" onClick={this.authorize.bind(this)}>
                        <i class="fa fa-chevron-circle-right fa-lg" style={{color: 'red'}}></i>
                      </a>
                    </center>
                    }

                  </td>
                  :
                  localStorage.user_type == 'admin' ?
                  <td>
                    {
                      vendorListValue.step_completed == 'approved' ?
                      <center>
                        <a data-id={vendorListValue.id} data-clicked={'Unauthorize'} style={{cursor: 'pointer'}} title="Unauthorize" onClick={this.authorize.bind(this)}>
                          <i class="fa fa-chevron-circle-left fa-lg" style={{color: '#009345'}}></i>
                        </a>
                      </center>
                      :
                      <center>
                      <a data-id={vendorListValue.id} data-clicked={'Authorize'} style={{cursor: 'pointer'}} title="Authorize" onClick={this.authorize.bind(this)}>
                        <i class="fa fa-chevron-circle-right fa-lg" style={{color: 'red'}}></i>
                      </a>
                    </center>
                    }
                  </td>
                  :
                  null
                }
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

      <Modal isOpen={this.state.small} toggle={this.toggleSmall}
          className={'modal-sm ' + this.props.className}>
        <ModalHeader toggle={this.toggleSmall}>
        {
          this.state.isDeleteClicked == 'deleteclicked' ?
          <React.Fragment>
          Vendor Deletion
          </React.Fragment>
          :
          <React.Fragment>
          Vendor Approval
          </React.Fragment>
        }
        </ModalHeader>
        <ModalBody>
          <strong>
            {
              this.state.isDeleteClicked == 'deleteclicked' ?
              <center>
              Are Sure to delete this vendor ?
              </center>
              :
              <center>
              Are Sure to {this.state.isAuthorizeClicked} this vendor ?
              </center>
            }

          </strong>
        </ModalBody>
        <ModalFooter>
          {
            this.state.isDeleteClicked == 'deleteclicked' ?
            <React.Fragment>
              <Button color="success" onClick={(e)=>{this.toggleSmall('deleteVendorPermitted')}} >yes</Button>{' '}
              <Button color="danger" onClick={(e)=>{this.toggleSmall('deleteVendorDenied')}} >No</Button>
            </React.Fragment>

            :
            <React.Fragment>
              <Button color="success" onClick={(e)=>{this.toggleSmall('authorizeVendorPermitted')}} >yes</Button>{' '}
              <Button color="danger" onClick={(e)=>{this.toggleSmall('authorizeVendorDenied')}} >No</Button>
            </React.Fragment>

          }

        </ModalFooter>
      </Modal>

      <Modal isOpen={this.state.viewLarge} toggle={this.toggleLargeView}
             className={'modal-lg ' + this.props.className}>
        <ModalHeader toggle={this.toggleLargeView}>Vendor Details</ModalHeader>

        <ModalBody>
        </ModalBody>
            <div>
                <div style={{backgroundColor: "#D6D4D4"}}>
                    <h4 style={{marginLeft: "15px"}}>Personal Info</h4>
                </div>
                <div>
                    {
                        this.state.vendor_details.length > 0 ?
                        <table style={{marginLeft: "30px"}}>
                            <tr>
                                <td><strong>Name{' '}</strong></td>
                                <td> <strong>{' '}:{' '}</strong> </td>
                                <td>{' '}{this.state.vendor_details[0].name}</td>
                            </tr>
                            <tr>
                                <td><strong>Mobile Number{' '}</strong></td>
                                <td> <strong>{' '}:{' '}</strong> </td>
                                <td>{' '}{this.state.vendor_details[0].mobile}</td>
                            </tr>
                            <tr>
                                <td><strong>National ID{' '}</strong></td>
                                <td> <strong>{' '}:{' '}</strong> </td>
                                <td>{' '}{this.state.vendor_details[0].nid}</td>
                            </tr>
                            <tr>
                                <td><strong>Date Of Birth{' '}</strong></td>
                                <td> <strong>{' '}:{' '}</strong> </td>
                                <td>{' '}{this.state.vendor_details[0].dob}</td>
                            </tr>
                            <tr>
                                <td><strong>Present Address{' '}</strong></td>
                                <td> <strong>{' '}:{' '}</strong> </td>
                                <td>{' '}{this.state.vendor_details[0].present_address}</td>
                            </tr>
                            <tr>
                                <td><strong>Profile Image{' '}</strong></td>
                                <td> <strong>{' '}:{' '}</strong> </td>
                                <td>{' '} <img width="60" height="60" src={publicUrl+'/upload/vendor/'+this.state.vendor_details[0].vendorImage} /> </td>
                            </tr>
                        </table>
                        :null
                    }
                </div>
                <div style={{backgroundColor: "#D6D4D4"}}>
                    <h4 style={{marginLeft: "15px"}}>Business Info</h4>
                </div>
                <div>
                    {
                        this.state.vendor_details.length > 0 ?
                        <table style={{marginLeft: "30px"}}>
                            <tr>
                                <td><strong>Trade Licence{' '}</strong></td>
                                <td> <strong>{' '}:{' '}</strong> </td>
                                <td>{' '}{this.state.vendor_details[0].trade_licence}</td>
                            </tr>
                            <tr>
                                <td><strong>Business Start Date{' '}</strong></td>
                                <td> <strong>{' '}:{' '}</strong> </td>
                                <td>{' '}{this.state.vendor_details[0].business_start_date}</td>
                            </tr>
                            <tr>
                                <td><strong>Tin Number{' '}</strong></td>
                                <td> <strong>{' '}:{' '}</strong> </td>
                                <td>{' '}{this.state.vendor_details[0].tin}</td>
                            </tr>
                            <tr>
                                <td><strong>Business Address{' '}</strong></td>
                                <td> <strong>{' '}:{' '}</strong> </td>
                                <td>{' '}{this.state.vendor_details[0].business_address}</td>
                            </tr>
                            <tr>
                                <td><strong>Web Address{' '}</strong></td>
                                <td> <strong>{' '}:{' '}</strong> </td>
                                <td>{' '}{this.state.vendor_details[0].web_address}</td>
                            </tr>
                            <tr>
                                <td><strong>Transaction Information{' '}</strong></td>
                                <td> <strong>{' '}:{' '}</strong> </td>
                                <td>{' '}{this.state.vendor_details[0].transaction_information}</td>
                            </tr>

                        </table>
                        :null
                    }
                </div>
                <div style={{backgroundColor: "#D6D4D4"}}>
                    <h4 style={{marginLeft: "15px"}}>Shop Info</h4>
                </div>
                <div>
                    {
                        this.state.vendor_details.length > 0 ?
                        <table style={{marginLeft: "30px"}}>
                            <tr>
                                <td><strong>Shop Name{' '}</strong></td>
                                <td> <strong>{' '}:{' '}</strong> </td>
                                <td>{' '}{this.state.vendor_details[0].shop_name}</td>
                            </tr>
                            <tr>
                                <td><strong>Language{' '}</strong></td>
                                <td> <strong>{' '}:{' '}</strong> </td>
                                <td>{' '}{this.state.vendor_details[0].shop_language}</td>
                            </tr>
                            <tr>
                                <td><strong>Country{' '}</strong></td>
                                <td> <strong>{' '}:{' '}</strong> </td>
                                <td>{' '}{this.state.vendor_details[0].shop_country}</td>
                            </tr>
                            <tr>
                                <td><strong>Currency{' '}</strong></td>
                                <td> <strong>{' '}:{' '}</strong> </td>
                                <td>{' '}{this.state.vendor_details[0].shop_currency}</td>
                            </tr>
                            <tr>
                                <td><strong>Brand Image{' '}</strong></td>
                                <td> <strong>{' '}:{' '}</strong> </td>
                                <td>{' '} <img width="60" height="60" src={publicUrl+'/upload/vendor/'+this.state.vendor_details[0].logo} /> </td>
                            </tr>
                            <tr>
                                <td><strong>Banner Image{' '}</strong></td>
                                <td> <strong>{' '}:{' '}</strong> </td>
                                <td>{' '} <img width="300" height="100" src={publicUrl+'/upload/vendor/'+this.state.vendor_details[0].cover_photo} /> </td>
                            </tr>
                        </table>
                        :null
                    }
                </div>
            </div>
        <ModalFooter>
        </ModalFooter>
      </Modal>

      <Modal isOpen={this.state.large} toggle={this.toggleLarge}
             className={'modal-lg ' + this.props.className}>
        <ModalHeader toggle={this.toggleLarge}>Edit Vendor Infos</ModalHeader>
        <ToastsContainer store={ToastsStore}/>
        <ModalBody>
          <Form action="" method="post" encType="multipart/form-data" className="form-horizontal" onSubmit={this.handleSubmitUpdate} onChange={this.handleProductChange}>
          {
            this.state.isTabClicked == 0 ?
            <React.Fragment>
              <Button className="mr-1" color="success" onClick={() => this.tabClickedFor(0)}>Basic</Button>
              <Button className="mr-1" onClick={() => this.tabClickedFor(1)}>Personal</Button>
              <Button className="mr-1" onClick={() => this.tabClickedFor(2)}>Business</Button>
              <Button className="mr-1" onClick={() => this.tabClickedFor(3)}>Shop</Button>
              <hr/>

              {/* UPDATE FORM FOR THE BASIC INFOS */}
              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="Name">Name</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="text" id="bName" name="bName" placeholder="Name" value={this.state.bName} />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="Email">Email</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="text" id="bEmail" name="bEmail" placeholder="Email" value={this.state.bEmail} />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="Website">Website</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="text" id="bWebsite" name="bWebsite" placeholder="Website" value={this.state.bWebsite} />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="Address">Address</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="text" id="bAddress" name="bAddress" placeholder="Address" value={this.state.bAddress} />
                </Col>
              </FormGroup>

            </React.Fragment>
            : this.state.isTabClicked == 1 ?
            <React.Fragment>
              <Button className="mr-1" onClick={() => this.tabClickedFor(0)}>Basic</Button>
              <Button className="mr-1" color="success" onClick={() => this.tabClickedFor(1)}>Personal</Button>
              <Button className="mr-1" onClick={() => this.tabClickedFor(2)}>Business</Button>
              <Button className="mr-1" onClick={() => this.tabClickedFor(3)}>Shop</Button>
              <hr/>

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="Name">Name</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="text" id="pName" name="pName" placeholder="Name" value={this.state.pName} />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="Email">Email</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="text" id="pEmail" name="pEmail" placeholder="Email" value={this.state.pEmail} />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="Website">Mobile</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="text" id="pMobile" name="pMobile" placeholder="Mobile" value={this.state.pMobile} />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="Website">National ID</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="text" id="pNid" name="pNid" placeholder="National ID" value={this.state.pNid} />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="Address">Date Of Birth</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="date" id="pDob" name="pDob" placeholder="Date Of Birth" value={this.state.pDob} />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="Website">Present Address</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="textarea" id="pAddress" name="pAddress" placeholder="Present Address" value={this.state.pAddress} />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="Website">Profile Image</Label>
                </Col>
                <Col xs="12" md="9">
                  {
                    this.state.file ?
                    <img width="120" height="100" src={this.state.file}/>
                    :
                    this.state.pImage ?  <img width="120" height="100" src={publicUrl+'/upload/vendor/'+this.state.pImage}/> : <img width="120" height="100" src={publicUrl+'/upload/vendor/default.png'}/>
                  }
                  <br />
                  <input style={{visibility:"none"}} type="file" name="pImage" />
                </Col>
              </FormGroup>

            </React.Fragment>
            : this.state.isTabClicked == 2 ?
            <React.Fragment>
              <Button className="mr-1" onClick={() => this.tabClickedFor(0)}>Basic</Button>
              <Button className="mr-1" onClick={() => this.tabClickedFor(1)}>Personal</Button>
              <Button className="mr-1" color="success" onClick={() => this.tabClickedFor(2)}>Business</Button>
              <Button className="mr-1" onClick={() => this.tabClickedFor(3)}>Shop</Button>
              <hr/>

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="Name">Trade Licence</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="text" id="trade_licence" name="trade_licence" placeholder="Trade Licence" value={this.state.trade_licence} />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="Email">Tin</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="text" id="tin" name="tin" placeholder="Tin" value={this.state.tin} />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="Email">Business Start Date</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="text" id="bsd" name="bsd" placeholder="Business Start Date" value={this.state.bsd} />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="Website">Website</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="text" id="web_address" name="web_address" placeholder="Website" value={this.state.web_address} />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="Website">Business Address</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="textarea" id="business_address" name="business_address" placeholder="Business Address" value={this.state.business_address} />
                </Col>
              </FormGroup>

            </React.Fragment>
            : this.state.isTabClicked == 3 ?
            <React.Fragment>
              <Button className="mr-1" onClick={() => this.tabClickedFor(0)}>Basic</Button>
              <Button className="mr-1" onClick={() => this.tabClickedFor(1)}>Personal</Button>
              <Button className="mr-1" onClick={() => this.tabClickedFor(2)}>Business</Button>
              <Button className="mr-1" color="success" onClick={() => this.tabClickedFor(3)}>Shop</Button>
              <hr/>

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="Name">Shop Name</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="text" id="sName" name="sName" placeholder="Shop Name" value={this.state.sName} />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="Email">Shop Language</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="text" id="sLanguage" name="sLanguage" placeholder="Shop Language" value={this.state.sLanguage} />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="Website">Shop Country</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="text" id="sCountry" name="sCountry" placeholder="Shop Country" value={this.state.sCountry} />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="Website">Shop Currency</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="text" id="sCurrency" name="sCurrency" placeholder="Shop Currency" value={this.state.sCurrency} />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="Website">Brand Logo</Label>
                </Col>
                <Col xs="12" md="9">
                  {
                    this.state.fileLogo ?
                    <img width="120" height="100" src={this.state.fileLogo}/>
                    :
                    this.state.sLogo ?  <img width="120" height="100" src={publicUrl+'/upload/vendor/'+this.state.sLogo}/> : <img width="120" height="100" src={publicUrl+'/upload/vendor/default.png'}/>
                  }
                  <br />
                  <input style={{visibility:"none"}} type="file" name="sLogo" />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="Website">Cover Picture</Label>
                </Col>
                <Col xs="12" md="9">
                  {
                    this.state.fileCoverPicture ?
                    <img width="300" height="100" src={this.state.fileCoverPicture}/>
                    :
                    this.state.sCoverPhoto ?  <img width="300" height="100" src={publicUrl+'/upload/vendor/'+this.state.sCoverPhoto}/> : <img width="300" height="100" src={publicUrl+'/upload/vendor/default.png'}/>
                  }
                  <br />
                  <input style={{visibility:"none"}} type="file" name="sCoverPhoto" />
                </Col>
              </FormGroup>
            </React.Fragment>
            : null
          }
          <Button color="success">Update</Button>{' '}
          <Button color="danger" onClick={this.toggleLarge}>Cancel</Button>
          </Form>
        </ModalBody>
        <ModalFooter>

        </ModalFooter>
      </Modal>
    </Row>
    )
  }
}



export default Vendor;
