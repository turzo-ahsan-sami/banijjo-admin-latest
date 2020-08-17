import React, { Component } from 'react';
import {ToastsContainer, ToastsStore} from 'react-toasts';
import ImageUploader from 'react-images-upload';
import axios from 'axios';
import cookie from 'react-cookies';

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

class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      collapse: true,
      fadeIn: true,
      timeout: 300,
      user_id: '',
      usesr_name: '',
      user_email: '',
      user_employee_id: -1,
      vendor : [],
      vendor_details: [],
      modal: false,
      blarge: false,
      plarge: false,
      bslarge: false,
      slarge: false,
      file: null,
      fileLogo: null,
      fileCoverPicture: null,
      pImageName: '',
      pImageFile: [],
      pUpdateSubmission: 0,
      sImageLogo: '',
      sImageCoverPhoto: '',
      sLogo: '',
      sCoverPhoto: '',
      sImageFile: [],

    };

    this.toggleBasicLarge = this.toggleBasicLarge.bind(this);
    this.togglePersonalLarge = this.togglePersonalLarge.bind(this);
    this.toggleBusinessLarge = this.toggleBusinessLarge.bind(this);
    this.toggleShopLarge = this.toggleShopLarge.bind(this);

    this.handleGetBasicEditForm = this.handleGetBasicEditForm.bind(this);
    this.handleGetPersonalEditForm = this.handleGetPersonalEditForm.bind(this);
    this.handleGetBusinessEditForm = this.handleGetBusinessEditForm.bind(this);
    this.handleGetShopEditForm = this.handleGetShopEditForm.bind(this);

    this.handleChange = this.handleChange.bind(this);

    this.handleSubmitBasicUpdate = this.handleSubmitBasicUpdate.bind(this);
    this.handleSubmitPersonalUpdate = this.handleSubmitPersonalUpdate.bind(this);
    this.handleSubmitBusinessUpdate = this.handleSubmitBusinessUpdate.bind(this);
    this.handleSubmitShopUpdate = this.handleSubmitShopUpdate.bind(this);
  }

  toggleBasicLarge() {
    this.setState({
      blarge: !this.state.blarge,
    });

    console.log('Edit Basic Infos for : ', this.state.user_id);
  }

  togglePersonalLarge() {
    this.setState({
      plarge: !this.state.plarge,
    });

    console.log('Edit Personal Infos for : ', this.state.user_id);
  }

  toggleBusinessLarge() {
    this.setState({
      bslarge: !this.state.bslarge,
    });

    console.log('Edit business Infos for : ', this.state.user_id);
  }

  toggleShopLarge() {
    this.setState({
      slarge: !this.state.slarge,
    });

    console.log('Edit business Infos for : ', this.state.user_id);
  }

  componentDidMount () {
    console.log("User Name : ", localStorage.userName);
    console.log("User Name : ", localStorage.employee_id);

    this.setState({
      usesr_name: localStorage.userName,
      user_employee_id: localStorage.employee_id,
      user_email: localStorage.email
    });

    // GET THE USR INFOMATION
    fetch(base+`/api/getUserInfo/?id=${localStorage.employee_id}`, {
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
        vendor_details: users.data_vendor_details
      })

      console.log('Vendor Data : ', this.state.vendor);
      console.log('Vendor Details : ', this.state.vendor_details);
      return false;
    });

  }

  handleSubmitBasicUpdate (event) {
    event.preventDefault();

    fetch(base+'/api/updateUserBasicInfos', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        'Authorization': 'Atiq '+cookie.load('token')
      },
      body: JSON.stringify(this.state)
    })
    .then(res => {
      return res.json()
    })
    .then(users => {
      setTimeout(()=> {
        window.location = '/create-users/user-profile';
      },500);
    });

    console.log('Submitted For The Basic Info : ', this.state);
  }

  handleSubmitPersonalUpdate (event) {
    event.preventDefault();

    this.setState({
      pUpdateSubmission: ++this.state.pUpdateSubmission
    })

    console.log('this.state.pName : ', this.state.pName);
    console.log('this.state.pImage : ', this.state.pImage);

    const data = new FormData(event.target);

    setTimeout(()=> {
      if (this.state.pUpdateSubmission == 1) {
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
        data.append('personalEmployeeId', JSON.stringify(this.state.user_employee_id));

        // Display the values
        // for (var value of data.values()) {
        //    console.log(value);
        // }

        console.log('this.state.pImageFile : ', this.state.pImageFile);

        axios({
          method: 'post',
          url: base+'/api/updateUserPersonalInfos',
          data: data,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data',
            'Authorization': 'Atiq '+cookie.load('token')
          }
        })
        .then(function (response) {
          console.log(response);
          setTimeout(()=> {
            window.location = '/create-users/user-profile';
          },500);
        })
        .catch(function (response) {
          //handle error
          console.log(response);
        });
      }
    }, 200);


  }

  handleSubmitBusinessUpdate (event) {
    event.preventDefault();

    fetch(base+'/api/updateUserBusinessInfos', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        'Authorization': 'Atiq '+cookie.load('token')
      },
      body: JSON.stringify(this.state)
    })
    .then(res => {
      return res.json()
    })
    .then(users => {
      setTimeout(()=> {
        window.location = '/create-users/user-profile';
      },500);

      console.log('After Update Basic Infos : ', users);
    });

    console.log('Submitted For The Basic Info : ', this.state);
  }

  handleSubmitShopUpdate(event) {
    event.preventDefault();
    console.log('this.state.sImageFile : ', this.state.sImageFile);

    const data = new FormData(event.target);

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
    data.append('personalEmployeeId', JSON.stringify(this.state.user_employee_id));

    // Display the values
    let i = 0;
    for (let value of data.values()) {
      ++i;
      console.log('Looping for '+i+' time');
       console.log(value);
    }

    // console.log('this.state.pImageFile : ', this.state.pImageFile);

    axios({
      method: 'post',
      url: base+'/api/updateUserShopInfos',
      data: data,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data',
        'Authorization': 'Atiq '+cookie.load('token')
      }
    })
    .then(function (response) {
      console.log(response);
      setTimeout(()=> {
        window.location = '/create-users/user-profile';
      },500);
    })
    .catch(function (response) {
      //handle error
      console.log(response);
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

    this.setState({
      blarge: !this.state.blarge,
    });

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

    this.setState({
      plarge: !this.state.plarge,
    });

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

    this.setState({
      bslarge: !this.state.bslarge,
    });

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


    this.setState({
      slarge: !this.state.slarge,
    });
  }

  handleChange(event) {
    this.setState({value: event.target.value});

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
    }

  }

  render() {

    return (
      this.state.user_employee_id == 0 ?
      <Row>
        <Col md="12">
          <Card className="text-black" style={{backgroundColor: "white", backgroundImage: "linear-gradient(white, #5c8a8a)"}}>
            <CardBody>
              <Row>
                <Col md="3" style={{textAlign: "left"}}>
                  <img width="120" height="100" src={publicUrl+'/upload/vendor/default.png'}/>
                </Col>
                <Col md="6" style={{textAlign: "center"}}>
                  <strong>My Profile</strong><br />
                  <h3>Name : {this.state.usesr_name}</h3>
                  <strong>
                    Email : {this.state.user_email}
                  </strong>
                </Col>
                <Col style={{textAlign: "right"}}>
                  <img width="120" height="100" src={publicUrl+'/upload/vendor/default.png'}/>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
      :
      <React.Fragment>
      <Row>
        <Col md="12">
          <Card className="text-black" style={{backgroundColor: "white", backgroundImage: "linear-gradient(white, #5c8a8a)"}}>
            <CardBody>
              <Row>
                {
                  this.state.vendor_details.length > 0 ?
                  <React.Fragment>
                    <Col md="3" style={{left: "2%"}}>
                      {
                        this.state.vendor_details[0].vendorImage?
                        <img width="120" height="100" src={publicUrl+'/upload/vendor/'+this.state.vendor_details[0].vendorImage}/>
                        :
                        <img width="120" height="100" src={publicUrl+'/upload/vendor/default.png'}/>
                      }

                    </Col>
                    <Col md="6" style={{textAlign: "center"}}>
                      <strong>My Profile</strong><br />
                      <hr/>
                      <center>
                      <table>
                        <tr>
                          <td>
                            <strong>Name</strong>
                          </td>
                          <td>&nbsp;<strong>:</strong>&nbsp;</td>
                          <td>
                            <strong>
                              {
                                this.state.vendor.length > 0 ?
                                this.state.vendor[0].name:
                                this.state.usesr_name
                              }
                            </strong>
                          </td>
                          <td>
                            <a style={{cursor: "pointer"}} onClick={this.handleGetBasicEditForm} title="Edit Basic Infos">
                              <i className="fa fa-edit fa-lg" style={{marginTop: "0px !important"}}></i>
                            </a>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <strong>User Name</strong>
                          </td>
                          <td>&nbsp;<strong>:</strong>&nbsp;</td>
                          <td>
                            {this.state.usesr_name}
                          </td>
                          <td>
                            &nbsp;
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Email</strong>
                          </td>
                          <td>&nbsp;<strong>:</strong>&nbsp;</td>
                          <td>
                            {this.state.user_email}
                          </td>
                          <td>
                            &nbsp;
                          </td>
                        </tr>
                      </table>
                      </center>

                    </Col>
                    <Col style={{textAlign: "right", right: "2%"}}>
                    {
                      this.state.vendor_details[0].logo?
                      <img width="120" height="100" src={publicUrl+'/upload/vendor/'+this.state.vendor_details[0].logo}/>
                      :
                      <img width="120" height="100" src={publicUrl+'/upload/vendor/default.png'}/>
                    }
                    </Col>
                  </React.Fragment>
                  :
                  <React.Fragment>
                    <Col md="3" style={{left: "2%"}}>
                      <img width="120" height="100" src={publicUrl+'/upload/vendor/default.png'}/>
                    </Col>
                    <Col md="6" style={{textAlign: "center"}}>
                      <strong>My Profile</strong><br />
                      <hr/>
                      <center>
                      <table>
                        <tr>
                          <td>
                            <strong>Name</strong>
                          </td>
                          <td>&nbsp;<strong>:</strong>&nbsp;</td>
                          <td>
                            <strong>{this.state.usesr_name}</strong>
                          </td>
                          <td>
                            <a style={{cursor: "pointer"}} title="Edit Basic Infos">
                              <i className="fa fa-edit fa-lg" style={{marginTop: "0px !important"}}></i>
                            </a>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <strong>User Name</strong>
                          </td>
                          <td>&nbsp;<strong>:</strong>&nbsp;</td>
                          <td>
                            {this.state.usesr_name}
                          </td>
                          <td>
                            &nbsp;
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <strong>Email</strong>
                          </td>
                          <td>&nbsp;<strong>:</strong>&nbsp;</td>
                          <td>
                            {this.state.user_email}
                          </td>
                          <td>
                            &nbsp;
                          </td>
                        </tr>
                      </table>
                      </center>

                    </Col>
                    <Col style={{textAlign: "right", right: "2%"}}>
                      <img width="120" height="100" src={publicUrl+'/upload/vendor/default.png'}/>
                    </Col>
                  </React.Fragment>
                }

              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md="4">
          <Card className="text-black" style={{backgroundColor: "#5c8a8a", backgroundImage: "linear-gradient(#5c8a8a, white)"}}>
            <CardBody>
            <Row>
              <Col md="6">
                <strong>Personal Infos</strong>
                &nbsp;
                <a style={{cursor: "pointer"}} onClick={this.handleGetPersonalEditForm} title="Edit Personal Infos">
                  <i className="fa fa-edit fa-lg" style={{marginTop: "0px !important"}}></i>
                </a>
              </Col>
              <Col md="6">
                &nbsp;
              </Col>
            </Row>
              <hr/>
              {
                this.state.vendor_details.length > 0 ?
                <React.Fragment>
                <table>
                  <tr>
                    <td>
                    <strong>Full Name</strong>
                    </td>
                    <td>
                    &nbsp;<strong>:</strong>&nbsp;
                    </td>
                    <td>
                    {this.state.vendor_details[0].name}
                    </td>
                  </tr>
                  <tr>
                    <td>
                    <strong>Mobile Number</strong>
                    </td>
                    <td>
                    &nbsp;<strong>:</strong>&nbsp;
                    </td>
                    <td>
                    {this.state.vendor_details[0].mobile}
                    </td>
                  </tr>
                  <tr>
                    <td>
                    <strong>NID Number</strong>
                    </td>
                    <td>
                    &nbsp;<strong>:</strong>&nbsp;
                    </td>
                    <td>
                    {this.state.vendor_details[0].nid}
                    </td>
                  </tr>
                  <tr>
                    <td>
                    <strong>Date Of Birth</strong>
                    </td>
                    <td>
                    &nbsp;<strong>:</strong>&nbsp;
                    </td>
                    <td>
                    {this.state.vendor_details[0].dob}
                    </td>
                  </tr>
                  <tr>
                    <td>
                    <strong>Present Address</strong>
                    </td>
                    <td>
                    &nbsp;<strong>:</strong>&nbsp;
                    </td>
                    <td>
                    {this.state.vendor_details[0].present_address}
                    </td>
                  </tr>
                </table>
                </React.Fragment>
                :
                <React.Fragment>
                NO DATA FOUND ! TRY TO ADD SOME !
                </React.Fragment>
              }
            </CardBody>
          </Card>
        </Col>
        <Col md="4">
          <Card className="text-black" style={{backgroundColor: "#5c8a8a", backgroundImage: "linear-gradient(#5c8a8a, white)"}}>
            <CardBody>
              <Row>
                <Col md="6">
                  <strong>Business Infos</strong>
                  &nbsp;
                  <a style={{cursor: "pointer"}} onClick={this.handleGetBusinessEditForm} title="Edit Business Infos">
                    <i className="fa fa-edit fa-lg" style={{marginTop: "0px !important"}}></i>
                  </a>
                </Col>
                <Col md="6">
                  &nbsp;
                </Col>
              </Row>
              <hr/>
              {
                this.state.vendor_details.length > 0 ?
                <React.Fragment>
                <table>
                  <tr>
                    <td>
                    <strong>Trade Licence</strong>
                    </td>
                    <td>
                    &nbsp;<strong>:</strong>&nbsp;
                    </td>
                    <td>
                    {this.state.vendor_details[0].trade_licence}
                    </td>
                  </tr>
                  <tr>
                    <td>
                    <strong>Business Start Date</strong>
                    </td>
                    <td>
                    &nbsp;<strong>:</strong>&nbsp;
                    </td>
                    <td>
                    {this.state.vendor_details[0].business_start_date}
                    </td>
                  </tr>
                  <tr>
                    <td>
                    <strong>TIN</strong>
                    </td>
                    <td>
                    &nbsp;<strong>:</strong>&nbsp;
                    </td>
                    <td>
                    {this.state.vendor_details[0].tin}
                    </td>
                  </tr>
                  <tr>
                    <td>
                    <strong>Business Address</strong>
                    </td>
                    <td>
                    &nbsp;<strong>:</strong>&nbsp;
                    </td>
                    <td>
                    {this.state.vendor_details[0].business_address}
                    </td>
                  </tr>
                  <tr>
                    <td>
                    <strong>Web Address</strong>
                    </td>
                    <td>
                    &nbsp;<strong>:</strong>&nbsp;
                    </td>
                    <td>
                    {this.state.vendor_details[0].web_address}
                    </td>
                  </tr>
                </table>
                </React.Fragment>
                :
                <React.Fragment>
                NO DATA FOUND ! TRY TO ADD SOME !
                </React.Fragment>
              }
            </CardBody>
          </Card>
        </Col>
        <Col md="4">
          <Card className="text-black" style={{backgroundColor: "#5c8a8a", backgroundImage: "linear-gradient(#5c8a8a, white)"}}>
            <CardBody>
              <Row>
                <Col md="6">
                  <strong>Shop Info</strong>
                  &nbsp;
                  <a style={{cursor: "pointer"}} onClick={this.handleGetShopEditForm} title="Edit Shop Infos">
                    <i className="fa fa-edit fa-lg" style={{marginTop: "0px !important"}}></i>
                  </a>
                </Col>
                <Col md="6">
                  &nbsp;
                </Col>
              </Row>
              <hr/>
              {
                this.state.vendor_details.length > 0 ?
                <React.Fragment>
                <table>
                  <tr>
                    <td>
                    <strong>Shop Name</strong>
                    </td>
                    <td>
                    &nbsp;<strong>:</strong>&nbsp;
                    </td>
                    <td>
                    {this.state.vendor_details[0].shop_name}
                    </td>
                  </tr>
                  <tr>
                    <td>
                    <strong>Shop Language</strong>
                    </td>
                    <td>
                    &nbsp;<strong>:</strong>&nbsp;
                    </td>
                    <td>
                    {this.state.vendor_details[0].shop_language}
                    </td>
                  </tr>
                  <tr>
                    <td>
                    <strong>Shop Country</strong>
                    </td>
                    <td>
                    &nbsp;<strong>:</strong>&nbsp;
                    </td>
                    <td>
                    {this.state.vendor_details[0].shop_country}
                    </td>
                  </tr>
                  <tr>
                    <td>
                    <strong>Shop Currency</strong>
                    </td>
                    <td>
                    &nbsp;<strong>:</strong>&nbsp;
                    </td>
                    <td>
                    {this.state.vendor_details[0].shop_currency}
                    </td>
                  </tr>
                </table>
                </React.Fragment>
                :
                <React.Fragment>
                NO DATA FOUND ! TRY TO ADD SOME !
                </React.Fragment>
              }
            </CardBody>
          </Card>
        </Col>

        {/*BASIC INFO MODAL STARTED*/}
        <Modal isOpen={this.state.blarge} toggle={this.toggleBasicLarge}
               className={'modal-lg ' + this.props.className}>
          <ModalHeader toggle={this.toggleBasicLarge}></ModalHeader>
          <ModalBody>
            {/*Basic info*/}
            <Row>
              <Col xs="12" md="12">
                <Card>
                  <ToastsContainer store={ToastsStore}/>
                  <CardHeader>
                  <strong>Update Basic Infos</strong>
                  </CardHeader>
                  <CardBody>
                    <Form action="" method="post" encType="multipart/form-data" onSubmit={this.handleSubmitBasicUpdate} onChange={this.handleChange} className="form-horizontal">
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

                      <Button type="submit" color="success" onClick={this.toggleBasicLarge}>Update</Button>{' '}
                      <Button type="reset" color="danger" onClick={this.toggleBasicLarge}>Cancel</Button>
                    </Form>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>

          </ModalFooter>
        </Modal>
        {/*BASIC INFO MODAL ENDED*/}

        {/*PERSONAL INFO MODAL STARTED*/}
        <Modal isOpen={this.state.plarge} toggle={this.togglePersonalLarge}
               className={'modal-lg ' + this.props.className}>
          <ModalHeader toggle={this.togglePersonalLarge}></ModalHeader>
          <ModalBody>
            {/*Personal info*/}
            <Row>
              <Col xs="12" md="12">
                <Card>
                  <ToastsContainer store={ToastsStore}/>
                  <CardHeader>
                  <strong>Update Personal Infos</strong>
                  </CardHeader>
                  <CardBody>
                    <Form action="" method="post" encType="multipart/form-data" onSubmit={this.handleSubmitPersonalUpdate} onChange={this.handleChange} className="form-horizontal">
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

                      <Button type="submit" color="success" onClick={this.togglePersonalLarge}>Update</Button>{' '}
                      <Button type="reset" color="danger" onClick={this.togglePersonalLarge}>Cancel</Button>
                    </Form>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>

          </ModalFooter>
        </Modal>
        {/*PERSONAL INFO MODAL ENDED*/}

        {/*BUSINESS INFO MODAL STARTED*/}
        <Modal isOpen={this.state.bslarge} toggle={this.toggleBusinessLarge}
               className={'modal-lg ' + this.props.className}>
          <ModalHeader toggle={this.toggleBusinessLarge}></ModalHeader>
          <ModalBody>
            {/*Business info*/}
            <Row>
              <Col xs="12" md="12">
                <Card>
                  <ToastsContainer store={ToastsStore}/>
                  <CardHeader>
                  <strong>Update Business Infos</strong>
                  </CardHeader>
                  <CardBody>
                    <Form action="" method="post" encType="multipart/form-data" onSubmit={this.handleSubmitBusinessUpdate} onChange={this.handleChange} className="form-horizontal">
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

                      <Button type="submit" color="success" onClick={this.toggleBusinessLarge}>Update</Button>{' '}
                      <Button type="reset" color="danger" onClick={this.toggleBusinessLarge}>Cancel</Button>
                    </Form>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>

          </ModalFooter>
        </Modal>
        {/*BUSINESS INFO MODAL ENDED*/}

        {/*SHOP INFO MODAL STARTED*/}
        <Modal isOpen={this.state.slarge} toggle={this.toggleShopLarge}
               className={'modal-lg ' + this.props.className}>
          <ModalHeader toggle={this.toggleShopLarge}></ModalHeader>
          <ModalBody>
            {/*Shop info*/}
            <Row>
              <Col xs="12" md="12">
                <Card>
                  <ToastsContainer store={ToastsStore}/>
                  <CardHeader>
                  <strong>Update Shop Infos</strong>
                  </CardHeader>
                  <CardBody>
                    <Form action="" method="post" encType="multipart/form-data" onSubmit={this.handleSubmitShopUpdate} onChange={this.handleChange} className="form-horizontal">
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

                      <Button type="submit" color="success" onClick={this.toggleShopLarge}>Update</Button>{' '}
                      <Button type="reset" color="danger" onClick={this.toggleShopLarge}>Cancel</Button>
                    </Form>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>

          </ModalFooter>
        </Modal>
        {/*SHOP INFO MODAL ENDED*/}

      </Row>
      </React.Fragment>

    )
  }
}



export default Profile;
