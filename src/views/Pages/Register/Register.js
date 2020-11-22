import React, { Component } from 'react';
import {ToastsContainer, ToastsStore} from 'react-toasts';
import { AppAsideToggler, AppNavbarBrand, AppSidebarToggler } from '@coreui/react';
// import logo from '../../../assets/img/brand/logo_head_left.png'
import logo from '../../../assets/img/brand/logo_head_left.com.png'

import  { Redirect } from 'react-router-dom';
import { Link } from 'react-router-dom';

import { Button, Card, CardBody, CardFooter, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';

const base = process.env.REACT_APP_ADMIN_SERVER_URL;
const REACT_APP_FRONT_URL = process.env.REACT_APP_FRONT_URL;

const Login = React.lazy(() => import('../Login'));

class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      collapse: true,
      fadeIn: true,
      timeout: 300,
      inputValue: '',
      userFound:'',
      message: '',
      checkStatus: false,
      isNameAllowed: true,
      isUserNameAllowed: true,
      isUserPasswordAllowed: true,
      isPasswordLengthAllowed: true,
      isPasswordConfirmAllowed: true,
      passwordStrength: '',
      isPasswordStrengthAllowed: false,
      passwordConfirmationMessage: false
    };

    this.handleProductChange = this.handleProductChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.searchEmail = this.searchEmail.bind(this);
    // console.log(this.state);
  }

  componentDidMount () {
    const userName = localStorage.getItem('userName');
    const userPassword = localStorage.getItem('userPassword');
    // if(userName=== null && userPassword === null)
    // {
    //   this.props.history.push("/login");
    // }
    // else {
    //   this.props.history.push("/dashboard");
    // }
  }

  searchEmail (event) {
      console.log(event.target.value);

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
                    message: 'Not Available',
                    checkStatus: false
                })
            }
            else {
                this.setState({
                    message: 'Available',
                    checkStatus: true
                })
              console.log(info);
            }

          });
      }
      else {
          this.setState({
              message: 'Invalid Email!',
              checkStatus: false
          })
      }

  }

  handleProductChange(event) {
    // this.setState({value: event.target.value});
    // alert(event.target.input.files[0]);
    let target = event.target;
    let value = target.type === 'checkbox' ? target.checked : target.value;
    let name = target.name;

    // this.setState({
    //   [name]: value,
    //   isNameAllowed: true
    // });

    // validation for the name
    if (target.name == 'name') {
      let charecterForName = /^[ A-Za-z]+$/;
      let isItAllowed = false;
      
      isItAllowed = target.value.match(charecterForName);

      if (isItAllowed) {
        this.setState({
          [name]: value,
          isNameAllowed: true
        });
      }
      else {
        // console.log('Alphabet only and result : '+ isItAllowed +' - user inputed : '+target.value);
        this.setState({
          isNameAllowed: false
        })
      }
    }

    // validation for the user name
    if (target.name == 'userName') {
      let charecterForUserName = /^[ A-Za-z0-9_@.]*$/;
      let isItAllowed = false;
      
      isItAllowed = target.value.match(charecterForUserName);

      if (isItAllowed) {
        this.setState({
          [name]: value,
          isUserNameAllowed: true
        });
      }
      else {
        // console.log('Alphabet only and result : '+ isItAllowed +' - user inputed : '+target.value);
        this.setState({
          isUserNameAllowed: false
        })
      }
    }

    // validation for password
    if (target.name == 'userPassword') {
      let charecterForUserPassword = /^[A-Za-z0-9_@]*$/;
      let isItAllowed = false;
      
      isItAllowed = target.value.match(charecterForUserPassword);

      if (isItAllowed) {
        this.setState({
          [name]: value,
          isUserPasswordAllowed: true
        });
        if (value.length < 8) {
          this.setState({
            isPasswordLengthAllowed: false
          })
        }
        else {
          this.setState({
            isPasswordLengthAllowed: true
          })
        }

        // check password strngth
        let strength = {
          1: 'Very Weak',
          2: 'Weak',
          3: 'Medium',
          4: 'Strong',
          5: 'Very Strong'
        };

        let strengthValue = {
          'caps': false,
          'length': false,
          'special': false,
          'numbers': false,
          'small': false
        };

        for(let index=0; index < value.length; index++) {
          let char = value.charCodeAt(index);
          if(!strengthValue.caps && char >= 65 && char <= 90) {
              strengthValue.caps = true;
          } else if(!strengthValue.numbers && char >=48 && char <= 57){
            strengthValue.numbers = true;
          } else if(!strengthValue.small && char >=97 && char <= 122){
            strengthValue.small = true;
          } else if(!strengthValue.numbers && char >=48 && char <= 57){
            strengthValue.numbers = true;
          } /*else if(!strengthValue.special && (char >=33 && char <= 47) || (char >=58 && char <= 64) || char == 95) {
            strengthValue.special = true;
          }*/ else if(!strengthValue.special && char == 64 || char == 95) {
            strengthValue.special = true;
          }

          if (value.length >= 8) {
            strengthValue.length = true;
          }
        }

        let strengthIndicator = 0;
        for(let metric in strengthValue) {
          // console.log('metric : '+ metric + ' | strengthValue[metric] : '+strengthValue[metric]);
          if(strengthValue[metric] === true) {
            strengthIndicator++;
          }
        }

        this.setState({
          passwordStrength: strength[strengthIndicator],
          isPasswordStrengthAllowed: true
        })

        // console.log("Your password: " + value + " ( " + strength[strengthIndicator] + " ) | Strength value : "+strengthValue+" | strengthIndicator : "+strengthIndicator);

      }
      else {
        // console.log('Alphabet only and result : '+ isItAllowed +' - user inputed : '+target.value);
        this.setState({
          isUserPasswordAllowed: false
        })
      }
    }

    // validation for password confirmation
    if (target.name ==  'userRePassword' && this.state.userPassword != value) {
      this.setState({
        isPasswordConfirmAllowed: false,
        passwordConfirmationMessage: false
      })
    }
    else if (target.name ==  'userRePassword' && this.state.userPassword == value)  {
      console.log('Password : ', this.state.userPassword)
      console.log('Confirme password : ', value)
      this.setState({
        [name]: value,
        isPasswordConfirmAllowed: true,
        passwordConfirmationMessage: true
      })
    }

    if (target.name ==  'userEmail') {
      this.setState({
        [name]: value,
      });
    }

    // this.setState({
    //   [name]: value,
    // });

  }



  handleUsernameChange(event){
    this.setState({
      inputValue: event.target.value
    },()=>{
      let charecter = /^[A-Za-z]+$/;
      let isItAllowed = this.state.inputValue.match(charecter);

      if (isItAllowed) {
        fetch(base+'/api/checkUsername', {
          method: "POST",
          headers: {
            'Content-type': 'application/json'
          },
          body: JSON.stringify(this.state)
        })
        .then((result) => result.json())
        .then((info) => {
          if(info.message){
            this.setState({userFound:'yes'});
          }
          else{
            this.setState({userFound:'no'});
          }
        })
      }
      else {
        console.log('Only alphabets are allowed');
      }

    });
  }




  handleSubmit (event) {
    event.preventDefault();

    console.log('submitted JSON value : ', JSON.stringify(this.state));
    console.log('submitted value : ', this.state);

    if (this.state.checkStatus == true) {
        fetch(base+'/api/vendor-registration' , {
          method: "POST",
          headers: {
            'Content-type': 'application/json'
          },
          body: JSON.stringify(this.state)
          // body: this.state
        })
        .then((result) => result.json())
        .then((info) => {
          if (info.success == true) {
            ToastsStore.success("User  Successfully Registered !!");
            console.log('Success : ', info.success);

            setTimeout(
              function() {
                this.props.history.push("/");
              }
              .bind(this),
              3000
            );
          }
          else {
            ToastsStore.warning("User Registration Faild. Please try again !!");
            console.log(info.success);
          }

        })
    }
    else {
        this.setState({
            message: 'required*'
        })
    }

  }

  render() {
    // let status = this.state.userFound;
    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
          <ToastsContainer store={ToastsStore}/>
            <Col md="9" lg="7" xl="6">
              <Card className="mx-4">
                <CardBody className="p-4">
                  <Form action="" method="post" encType="multipart/form-data" className="form-horizontal" onSubmit={this.handleSubmit}  onChange={this.handleProductChange}>

                    <Row>
                        <Col xs="12" className="text-center">
                            {/* <img src={logo} alt="banijjo" width="160" height="100" /> */}
                            <AppNavbarBrand 
                              // full={{ src: logo, width: 160, height: 100, alt: 'CoreUI Logo' }}  
                              full={{ src: logo, width: 250, alt: 'banijjo.com Logo' }} 
                              // href="https://banijjo.com.bd" 
                              href={`${REACT_APP_FRONT_URL}`}
                              target="_blank" 
                              rel="noopener noreferrer"
                            />
                            {/* <a href="https://banijjo.com.bd" target="_blank" rel="noopener noreferrer"></a> */}
                        </Col>
                    </Row>

                    <Row>
                      <Col xs="6">
                        <h1>Register</h1>
                        <p className="text-muted">Create your account</p>
                      </Col>

                      <Col xs="6" className="text-right" style={{marginTop: "6%"}}>
                      {/* <Link to="/login">
                        <Button color="success" style={{backgroundColor: "#009345"}}>Back To Login</Button>
                      </Link> */}
                      <Link to="/login">
                        <a href="#" style={{color: "#009345"}}><strong>Back to login</strong></a>
                      </Link>
                      </Col>
                    </Row>

                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-user"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="text" name="name" required="true" placeholder="Name*" autoComplete="name" />
                      
                    </InputGroup>

                    {
                      this.state.isNameAllowed == true ?
                      null
                      :
                      <p style={{color: "red"}}>Only alphabet is allowed</p>
                    }

                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-user"></i>
                        </InputGroupText>
                      </InputGroupAddon>


                      <Input type="text" className={this.state.userFound=="yes"? "is-valid form-control":this.state.userFound=="no"? "is-invalid form-control":''} value={this.state.inputValue} name="userName" onChange={this.handleUsernameChange.bind(this)} required="true" placeholder="User Name*" autoComplete="username" />
                        <React.Fragment>
                              {
                                  this.state.userFound=="yes" ?
                                  <div style={{marginLeft:"10%",fontSize:"15px"}} className="valid-feedback">Username Available</div>
                                  : this.state.userFound=="no" ?
                                  <div style={{marginLeft:"10%",fontSize:"15px"}} className="invalid-feedback">Username Unvailable</div>
                                  :''
                                }
                        </React.Fragment>
                    </InputGroup>

                    {
                      this.state.isUserNameAllowed == true ?
                      null
                      :
                      <p style={{color: "red"}}>Only alphanumeric value and some special charecter like ( _@. ) are allowed</p>
                    }

                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>@</InputGroupText>
                      </InputGroupAddon>
                      <Input type="text" name="userEmail" required="true" placeholder="Email*" autoComplete="email" onChange={this.searchEmail.bind(this)} />
                      
                    </InputGroup>
                    {
                      this.state.checkStatus == true ?
                      <p style={{color: 'green'}}>{this.state.message}</p>
                      :
                      <p style={{color: 'red'}}>{this.state.message}</p>
                    }

                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-lock"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="password" name="userPassword" required="true" placeholder="Password*" autoComplete="new-password" />
                    </InputGroup>
                    {
                      this.state.isUserPasswordAllowed == true ?
                      null
                      :
                      <p style={{color: "red"}}>Only alphanumeric value and some special charecter like ( _@ ) are allowed</p>
                    }
                    {
                      this.state.isPasswordLengthAllowed == true ?
                      null
                      :
                      <p style={{color: "red"}}>Password must be at least 8 charecter or more</p>
                    }
                    {
                      this.state.isPasswordStrengthAllowed == true ?
                      <Row style={{marginBottom: "10px"}}>
                        <Col xs="6">Password Strength is {this.state.passwordStrength} </Col>
                        {/* <Col xs="1" style={ this.state.passwordStrength == 'Very Weak' ? {backgroundColor: "#009345", height: "20px"} : {backgroundColor: "#ddd", height: "20px"}}></Col>
                        <Col xs="1" style={ this.state.passwordStrength == 'Weak' ? {backgroundColor: "#009345", height: "20px"} : {backgroundColor: "#ddd", height: "20px"}}></Col>
                        <Col xs="1" style={ this.state.passwordStrength == 'Medium' ? {backgroundColor: "#009345", height: "20px"} : {backgroundColor: "#ddd", height: "20px"}}></Col>
                        <Col xs="1" style={ this.state.passwordStrength == 'Strong' ? {backgroundColor: "#009345", height: "20px"} : {backgroundColor: "#ddd", height: "20px"}}></Col>
                        <Col xs="1" style={ this.state.passwordStrength == 'Very Strong' ? {backgroundColor: "#009345", height: "20px"} : {backgroundColor: "#ddd", height: "20px"}}></Col> */}
                        
                        {
                          this.state.passwordStrength == 'Very Weak' ?
                          <React.Fragment>
                            <Col xs="1" style={{backgroundColor: "#009345", height: "20px"}}></Col>
                            <Col xs="4" style={{backgroundColor: "#ddd", height: "20px"}}></Col>
                            <Col xs="1" ></Col>
                          </React.Fragment>
                          :
                          this.state.passwordStrength == 'Weak' ?
                          <React.Fragment>
                            <Col xs="2" style={{backgroundColor: "#009345", height: "20px"}}></Col>
                            <Col xs="3" style={{backgroundColor: "#ddd", height: "20px"}}></Col>
                            <Col xs="1" ></Col>
                          </React.Fragment>
                          :
                          this.state.passwordStrength == 'Medium' ?
                          <React.Fragment>
                            <Col xs="3" style={{backgroundColor: "#009345", height: "20px"}}></Col>
                            <Col xs="2" style={{backgroundColor: "#ddd", height: "20px"}}></Col>
                            <Col xs="1" ></Col>
                          </React.Fragment>
                          :
                          this.state.passwordStrength == 'Strong' ?
                          <React.Fragment>
                            <Col xs="4" style={{backgroundColor: "#009345", height: "20px"}}></Col>
                            <Col xs="1" style={{backgroundColor: "#ddd", height: "20px"}}></Col>
                            <Col xs="1" ></Col>
                          </React.Fragment>
                          :
                          this.state.passwordStrength == 'Very Strong' ?
                          <React.Fragment>
                            <Col xs="5" style={{backgroundColor: "#009345", height: "20px"}}></Col>
                            <Col xs="1" ></Col>
                          </React.Fragment>
                          :
                          <React.Fragment>
                            <Col xs="5" style={{backgroundColor: "#ddd", height: "20px"}}></Col>
                            <Col xs="1" ></Col>
                          </React.Fragment>
                        }
                      </Row>
                      :
                      null
                    }
                    
                    <InputGroup className="mb-4">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-lock"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="password" name="userRePassword" required="true" placeholder="Confirm password*" autoComplete="new-password" />
                    </InputGroup>
                    {
                      this.state.isPasswordConfirmAllowed == true ?
                      this.state.passwordConfirmationMessage == true?
                      <p style={{color: "#009345"}}>Password has matched</p>
                      :
                      null
                      :
                      <p style={{color: "red"}}>Password does not match</p>
                    }

                    <Button type="submit" style={{backgroundColor: "#009345"}} color="success" block>Create Account</Button>
                  </Form>
                </CardBody>

              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Register;
