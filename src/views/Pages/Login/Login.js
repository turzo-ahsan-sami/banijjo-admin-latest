import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { AppAsideToggler, AppNavbarBrand, AppSidebarToggler } from '@coreui/react';
import logo from '../../../assets/img/brand/logo_head_left.png'
import sygnet from '../../../assets/img/brand/sygnet.svg'

import {
  Button,
  Card,
  CardBody,
  CardGroup,
  Col,
  Container,
  Form,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader
} from 'reactstrap';

import {ToastsContainer, ToastsStore} from 'react-toasts';
import cookie from 'react-cookies';
import './loginModal.css';

const base = process.env.REACT_APP_ADMIN_SERVER_URL;
let exportToken = '';
class Login extends Component {

  constructor(props) {
    super(props);

    this.state = {
      userName: '',
      userPassword: '',
      collapse: true,
      fadeIn: true,
      timeout: 300,
      exportJWToken: '',
      small: false,
      email_address: '',
      message: '',
      checkStatus: false,
    };

    this.handleProductChange = this.handleProductChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggleSmall = this.toggleSmall.bind(this);
    this.handleCheckEmail = this.handleCheckEmail.bind(this);
    this.submitEmail = this.submitEmail.bind(this);

  }

  componentDidMount() {
    console.log('Base : ', base);
  }

  toggleSmall(event) {
    this.setState({
      small: !this.state.small,
    });
  }

  handleProductChange(event) {
    // this.setState({value: event.target.value});
    // alert(event.target.input.files[0]);
    let target = event.target;
    let value = target.type === 'checkbox' ? target.checked : target.value;
    let name = target.name;

    this.setState({
      [name]: value
    });

  }

  submitEmail (event) {
    fetch(base+`/api/submit-email` , {
        method: "POST",
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(this.state)
    })

    .then((result) => result.json())
    .then((info) => {

      if (info.success == true) {
          console.log(info);
          ToastsStore.success("Succesfully send a password reset link!");

          this.setState({
              small: !this.state.small,
          })
      }
      else {
        console.log(info);
        ToastsStore.success("Failed! Please Try Again.");
      }

    });
  }

  handleCheckEmail(event) {
    // this.setState({value: event.target.value});
    // alert(event.target.input.files[0]);
    let target = event.target;
    let value = target.type === 'checkbox' ? target.checked : target.value;
    let name = target.name;

    this.setState({
      [name]: value
    });

    console.log('Email Check : ', event.target.value);

    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(event.target.value))
    {
        fetch(base+`/api/check-email?email=${event.target.value}` , {
          method: "GET"
        })

        .then((result) => result.json())
        .then((info) => {

          if (info.success == true) {
              console.log(info);
              this.setState({
                  message: info.message,
                  checkStatus: true
              })
          }
          else {
              this.setState({
                  message: info.message,
                  checkStatus: false
              })
            console.log(info);
          }

        });
    }
    else {
        this.setState({
            message: 'Invalied!',
            checkStatus: false
        })
    }
  }

  storeJWToken (user_id, token) {
    console.log('Token storage event has called... ', token);

    let data = {
      'id' : user_id,
      'token' : token
    }

    setTimeout(() => {
      fetch(base+'/api/store-token' , {
        method: "POST",
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      .then((result) => result.json())
      .then((info) => {
        console.log('Token storing result : ', info);
      })
    }, 1000);

  }

  handleSubmit (event) {
    event.preventDefault();

    const { userName, userPassword } = this.state;

    console.log('submitted JSON value : ', JSON.stringify(this.state));
    console.log('submitted value : ', this.state);
    console.log('submitted value user name : ', this.state.username);
    console.log('submitted value : ', this.state.password);

    fetch(base+'/api/user-login' , {
      method: "POST",
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(this.state)
    })

    .then((result) => result.json())
    .then((info) => {

      if (info.success == true) {
        ToastsStore.success("User  Successfully Logedin !!");
        console.log('Success : ', info.success);

        console.log('The response is : ', info);

        localStorage.setItem('userName', info.session.username);
        localStorage.setItem('email', info.session.email);
        localStorage.setItem('user_status', info.session.user_status);
        localStorage.setItem('employee_id', info.session.employee_id);
        localStorage.setItem('user_type', info.session.user_type);
        localStorage.setItem('token', info.token);

        console.log('Token : ', info.token);
        console.log(localStorage.user_status);

        exportToken = info.token;
        console.log('Token for export : ',exportToken);
        cookie.save('token', info.token);
        cookie.save('issuedAt', info.issuedAt);
        cookie.save('expiresIn', info.expiresIn);
        cookie.save('userId', info.session.employee_id);
        console.log('token in Cookies : ', cookie.load('token'));
        // this.storeJWToken(info.session.employee_id, exportToken);

        // const isApproved = localStorage.user_status=='approved'?true:false;
        // isApproved===true ? this.props.history.push("/dashboard"):this.props.history.push("/rogister");
        // console.log("consoling localstorage",isApproved);

        // FOR ADMIN OR ADMIN MANAGER OR DELIVERY MAN
        if (info.session.user_type == 'super_admin' || info.session.user_type == 'admin' || info.session.user_type == 'admin_manager' || info.session.user_type == 'delivery_man') {

          console.log(localStorage.user_status);

          const isApproved = localStorage.user_status=='approved'?true:false;
          isApproved===true ? this.props.history.push("/dashboard"):this.props.history.push("/rogister");

          console.log("consoling for admin : ",isApproved);
        }

        // FOR VENDOR
        else if (info.session.user_type == 'vendor') {

          console.log(localStorage.user_status);

          var isApproved = localStorage.user_status=='approved'?true: localStorage.user_status=='completed'? true: false;
          isApproved===true ? this.props.history.push("/dashboard"):this.props.history.push("/rogister");

          console.log("consoling for vendor : ",isApproved);
        }
      }
      else {
        ToastsStore.warning("User Logedin Failed. Please try again !!");
        console.log(info.success);
      }

    })
  }

  render() {
    var divStyle = {
      marginLeft: "110px"
    };
    return (
      <React.Fragment>
        <div className="app flex-row align-items-center">
          <Container>
            <Row className="justify-content-center">
            <ToastsContainer store={ToastsStore}/>
              <Col md="5">

                <CardGroup>
                  <Card>
                    <CardBody>
                      <Form action="" method="post" encType="multipart/form-data" className="form-horizontal" onSubmit={this.handleSubmit}  onChange={this.handleProductChange}>

                      <center>
                        <AppNavbarBrand full={{ src: logo, width: 160, height: 100, alt: 'CoreUI Logo' }}  href="https://banijjo.com.bd" target="_blank" rel="noopener noreferrer"/>
                        <a href="https://banijjo.com.bd" target="_blank" rel="noopener noreferrer"></a>
                      </center>

                        <p className="text-muted">Sign In to your account</p>

                        <InputGroup className="mb-3">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="icon-user"></i>
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input type="text" name="username" placeholder="Username" autoComplete="username" />
                        </InputGroup>

                        <InputGroup className="mb-4">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="icon-lock"></i>
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input type="password" name="password" placeholder="Password" autoComplete="current-password" />
                        </InputGroup>

                        <Row>
                          <Col xs="6">
                            <Button style={{backgroundColor: "#009345", color: "white"}}>Login</Button><br></br>
                            <a href="#" style={{color: "#ec1c24"}} onClick={this.toggleSmall}>Forgot Password !</a>
                          </Col>

                          <Col xs="6" className="text-right">
                          <Link to="/register">
                            {/* <Button color="success" style={{backgroundColor: "#009345"}}>Register Now!</Button> */}
                            <a href="#" style={{color: "#009345"}}><strong>Register Now !</strong></a>
                          </Link>
                          </Col>


                        </Row>

                      </Form>
                    </CardBody>
                  </Card>

                </CardGroup>
              </Col>
            </Row>
          </Container>
        </div>

        <Modal isOpen={this.state.small} toggle={this.toggleSmall}
        className={'modal-sm ' + this.props.className}>
          <ModalHeader toggle={this.toggleSmall}>
              {'Email Address'}
          </ModalHeader>
          <ModalBody>
            <div>
                <Input type="text" name="email_address" placeholder="Email" autoComplete="email_address" onChange={this.handleCheckEmail} />
                {
                    this.state.checkStatus == true ?
                    <p style={{color: 'green'}}>{this.state.message}</p>
                    :
                    <p style={{color: 'red'}}>{this.state.message}</p>
                }

                {'Note: Please provide the appropriate and full email address.'}
            </div>
          </ModalBody>
          <ModalFooter>
              {
              <div>
                  <Button color="success" onClick={this.submitEmail}>Send Link</Button>{' '}
                  <Button color="danger" onClick={this.toggleSmall}>Cancel</Button>
              </div>
              }
          </ModalFooter>
        </Modal>

      </React.Fragment>

    );
  }
}

export {exportToken};
export default Login;
