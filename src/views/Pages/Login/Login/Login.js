import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { AppAsideToggler, AppNavbarBrand, AppSidebarToggler } from '@coreui/react';
import logo from '../../../assets/img/brand/logo_head_left.png'
import sygnet from '../../../assets/img/brand/sygnet.svg'
import { Button, Card, CardBody, CardGroup, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import {ToastsContainer, ToastsStore} from 'react-toasts';

class Login extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
      userName: '',
      userPassword: '',
      collapse: true,
      fadeIn: true,
      timeout: 300
    };

    this.handleProductChange = this.handleProductChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

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

  handleSubmit (event) {
    event.preventDefault();

    const { userName, userPassword } = this.state;
    
    console.log('submitted JSON value : ', JSON.stringify(this.state));
    console.log('submitted value : ', this.state);
    console.log('submitted value user name : ', this.state.username);
    console.log('submitted value : ', this.state.password);

    fetch('/api/user-login' , {
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

        console.log(localStorage.user_status);

        const isApproved = localStorage.user_status=='approved'?true:false;
        isApproved===true ? this.props.history.push("/dashboard"):this.props.history.push("/rogister");
        console.log("consoling localstorage",isApproved);
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
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
          <ToastsContainer store={ToastsStore}/>
            <Col md="8">
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                    <Form action="" method="post" encType="multipart/form-data" className="form-horizontal" onSubmit={this.handleSubmit}  onChange={this.handleProductChange}>
                      
                      <h1>Login to Banijjo</h1>
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
                          <Button color="primary" className="px-4">Login</Button>
                        </Col>
                        <Col xs="6" className="text-right">
                          <Button color="link" className="px-0">Forgot password?</Button>
                        </Col>
                      </Row>

                    </Form>
                  </CardBody>
                </Card>
                <Card className="text-white bg-primary py-5 d-md-down-none" style={{ width: '44%' }}>
                <AppNavbarBrand style={divStyle}  full={{ src: logo, width: 120, height: 50, alt: 'CoreUI Logo' }}/>
                  <CardBody className="text-center">
                    <div>
                      <h2>Sign up</h2>
                      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut
                        labore et dolore magna aliqua.</p>
                      <Link to="/register">
                        <Button color="primary" className="mt-3" active tabIndex={-1}>Register Now!</Button>
                      </Link>
                    </div>
                  </CardBody>
                </Card>
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Login;
