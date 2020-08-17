import React, { Component } from 'react';
import {ToastsContainer, ToastsStore} from 'react-toasts';
import  { Redirect } from 'react-router-dom';
import { Link } from 'react-router-dom';

import { Button, Card, CardBody, CardFooter, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
const base = process.env.REACT_APP_ADMIN_SERVER_URL;

const Login = React.lazy(() => import('../Login'));

class ResetPassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      collapse: true,
      fadeIn: true,
      timeout: 300,
      inputValue: '',
      userFound:'',
      nPassword: '',
      cPassword: '',
      isMatched: '',
      email: ''
    };

    this.handleProductChange = this.handleProductChange.bind(this);
    this.checkPassword = this.checkPassword.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    console.log(this.state);
  }

  componentDidMount () {
    const userName = localStorage.getItem('userName');
    const userPassword = localStorage.getItem('userPassword');
    this.setState({
        email: this.props.match.params.email
    })
    // if(userName=== null && userPassword === null)
    // {
    //   this.props.history.push("/login");
    // }
    // else {
    //   this.props.history.push("/dashboard");
    // }
  }

  handleProductChange(event) {
    // this.setState({value: event.target.value});
    // alert(event.target.input.files[0]);
    console.log(this.props.match.params.email);
    let target = event.target;
    let value = target.type === 'checkbox' ? target.checked : target.value;
    let name = target.name;

    this.setState({
      [name]: value,

    });

  }

  checkPassword (event) {
      if (this.state.nPassword === event.target.value) {
          this.setState({
              isMatched : 'Password Matched'
          });
      }
      else {
          this.setState({
              isMatched : 'Password did not Match'
          });
      }
  }

  handleSubmit (event) {
    event.preventDefault();

    console.log('submitted JSON value : ', JSON.stringify(this.state));
    console.log('submitted value : ', this.state);

    fetch(base+'/api/submit-reset-password' , {
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
        ToastsStore.success("User  Successfully Reseted Password !!");
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
        ToastsStore.warning("Faild. Please try again !!");
        console.log(info.success);
      }

    })
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
                      <Col xs="6">
                        {/* <h1>Reset Password</h1> */}
                        <p className="text-muted">Reset Password</p>
                      </Col>

                      <Col xs="6" className="text-right">
                      <Link to="/login">
                        <Button color="success" style={{backgroundColor: "#009345"}}>Back To Login</Button>
                      </Link>
                      </Col>
                    </Row>

                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-lock"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="password" name="nPassword" required="true" placeholder="Password" autoComplete="new-password" />
                    </InputGroup>

                    <InputGroup className="mb-4">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-lock"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="password" name="cRePassword" required="true" placeholder="Confirm password" onKeyUp={this.checkPassword} autoComplete="new-password" />
                    </InputGroup>

                    <React.Fragment>
                        {this.state.isMatched === 'Password Matched'? <p style={{color: "green"}}>{this.state.isMatched}</p>: this.state.isMatched !== ''? <p style={{color: "red"}}>{this.state.isMatched}</p>:<p></p>}
                    </React.Fragment>

                    <Button type="submit" style={{backgroundColor: "#009345"}} color="success" block>Reset</Button>
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

export default ResetPassword;
