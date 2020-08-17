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

class User extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.toggleFade = this.toggleFade.bind(this);
    this.state = {
      usersList: [],
      pictures: [],
      collapse: true,
      fadeIn: true,
      timeout: 300,
      imageURL:'',
      selectedFile: null,
      vendorImagePreview:'',
      passwordStatus: '',
      nameStatus: '',
      userStatus: 4,
      createdDate: '',
      status: 1,
      employeeId: 0,
      deleteId: 0,
      updateId: 0,
      isUpdateClicked: 0,
      titleName: 0
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.checkPassword = this.checkPassword.bind(this);
    this.reSetTheUserForm = this.reSetTheUserForm.bind(this);

    this.toggleSmall = this.toggleSmall.bind(this);
  }

  toggle() {
    this.setState({ collapse: !this.state.collapse });
  }

  toggleFade() {
    this.setState((prevState) => { return { fadeIn: !prevState }});
  }

  toggleSmall(event) {
    if (event == 'deleteCategoryOrderListPermitted') {
      console.log('deletion permitted', this.state.deleteId);

      fetch(base+`/api/delete_users/?id=${this.state.deleteId}`, {
        method: 'GET',
        headers: {'Authorization': 'Atiq '+cookie.load('token')}
      })
      .then(res => {
        console.log(res);
        return res.json()
      })
      .then(users => {

        if (users.success == true) {
          ToastsStore.success("User Info Successfully deleted !!");
          console.log(users.message);

          this.setState({
            usersList : users.data,
            small: !this.state.small,
            deleteId: 0
          })
        }
        else {

          if (users.status == 403) {
            console.log(users);

            ToastsStore.warning('Your session is expired. Please Login again');

            setTimeout(()=> {
              logoutFunction(localStorage.userName);
            }, 1000);

          }
          else {
            ToastsStore.warning("User Info deletion Faild. Please try again !!");
            console.log(users.success);
          }
        }

        return false;
      });

    }
    else if (event == 'getDeleteModal') {
      console.log('Event Value is : ', event);
      // console.log('ID is : ', event.currentTarget.dataset['id'])
      this.setState({
        small: !this.state.small,
      });
    }
    else {
      this.setState({
        small: !this.state.small,
        deleteId: 0
      });
    }
  }

  componentDidMount() {
    fetch(base+'/api/getAllCreatedUsers', {
      method: 'GET'
    })
    .then(res => {
      // console.log(res);
      return res.json()
    })
    .then(users => {
      console.log(users.data);
      this.setState({
        usersList : users.data
      })

      // console.log('Vendor Data : ', this.state.usersList);
      return false;
    });

    var currentdate = new Date();

    this.setState({
      createdDate: currentdate.getFullYear()  + "-"
      + (currentdate.getMonth()+1) + "-"
      + currentdate.getDate() + " "
      + currentdate.getHours() + ":"
      + currentdate.getMinutes() + ":"
      + currentdate.getSeconds()
    })

  }

  handleChange(event) {
    let target = event.target;
    // let value = target.type === 'checkbox' ? target.checked : target.value;
    // let name = target.name;

    let value = target.value;
    let name = target.name;

    // this.setState({
    //   [name]: ''
    // });

    this.setState({
      [name]: value
    });

    // console.log(this.state.repassword);

  }

  checkPassword () {
    if (this.state.password != '' && this.state.password != null && this.state.password != undefined) {
      if (this.state.password == this.state.repassword) {
        this.setState({
          passwordStatus: 'password matched'
        })
      }
      else {
        if (this.state.isUpdateClicked == 1) {
          this.setState({
            passwordStatus: ''
          })
        }
        else {
          this.setState({
            passwordStatus: 'password not matched'
          })
        }
      }
    }
    else {
      this.setState({
        passwordStatus: 'please provide your password !'
      })
    }

    if (this.state.name == '' || this.state.name == null || this.state.name == undefined) {
      this.setState({
        nameStatus: 'please provide your name !'
      })
    }
    else {
      this.setState({
        nameStatus: ''
      })
    }

    console.log('Name status and name : '+ this.state.nameStatus +' : '+ this.state.name);
  }

  handleSubmit (event) {
    event.preventDefault();
    console.log('submitted value : ', this.state);

    if (this.state.isUpdateClicked == 1) {
      console.log('trying to submit the update form');
      console.log('Re-password : ', this.state.repassword);

      // data update part
      if (this.state.repassword != '' && this.state.repassword != null && this.state.repassword != undefined) {
        if (this.state.password == this.state.repassword) {
          fetch(base+'/api/updateCreateUsers' , {
            method: "POST",
            headers: {
              'Content-type': 'application/json',
              'Authorization': 'Atiq '+cookie.load('token')
            },
            body: JSON.stringify(this.state)
          })
          .then((result) => result.json())
          .then((info) => {
            console.log('the result is : ',info.result);
            if (info.success == true) {
              ToastsStore.success("User Successfully updated !!");
              console.log(info.success);

              // this.state.isUpdateClicked = 0;

              this.setState({
                usersList : info.all_users,
                name : '',
                password: '',
                repassword: '',
                email : '',
                type : '',
                nameStatus: '',
                passwordStatus: '',
                isUpdateClicked: 0,
                titleName: 0
              });

              console.log('update status after update : ', this.state.isUpdateClicked);

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
                ToastsStore.warning("User update Faild. Please try again !!");
                console.log(info.success);
              }
            }

          })
        }
        else {
          this.setState({
            passwordStatus: 'password not matched'
          })
        }
      }
      else {
        fetch(base+'/api/updateCreateUsers' , {
          method: "POST",
          headers: {
            'Content-type': 'application/json',
            'Authorization': 'Atiq '+cookie.load('token')
          },
          body: JSON.stringify(this.state)
        })
        .then((result) => result.json())
        .then((info) => {
          console.log('the result is : ',info.result);
          if (info.success == true) {
            ToastsStore.success("User Successfully updated !!");
            console.log(info.success);

            this.setState({
              usersList : info.all_users,
              name : '',
              password: '',
              repassword: '',
              email : '',
              type : '',
              nameStatus: '',
              passwordStatus: '',
              isUpdateClicked: 0,
              titleName: 0
            });
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
              ToastsStore.warning("User update Faild. Please try again !!");
              console.log(info.success);
            }

          }

        })
      }

    }
    else {
      // data submission part
      if (this.state.password == this.state.repassword) {
        fetch(base+'/api/saveCreateUsers' , {
          method: "POST",
          headers: {
            'Content-type': 'application/json',
            'Authorization': 'Atiq '+cookie.load('token')
          },
          body: JSON.stringify(this.state)
        })
        .then((result) => result.json())
        .then((info) => {
          console.log('the result is : ',info.result);
          if (info.success == true) {
            ToastsStore.success("User Successfully inserted !!");
            console.log(info.success);

            this.setState({
              usersList : info.all_users,
              name : '',
              password: '',
              repassword: '',
              email : '',
              type : '',
              nameStatus: '',
              passwordStatus: ''
            });
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
              ToastsStore.warning("User Insertion Faild. Please try again !!");
              console.log(info.success);
            }

          }

        })
      }
      else {
        this.setState({
          passwordStatus: 'Password not matched! Please confirm your password!'
        })
      }

    }

  }

  updateClicked (event) {
    console.log('update clicked');
    console.log(event.currentTarget.dataset['id']);

    this.setState({
      updateId: event.currentTarget.dataset['id'],
      isUpdateClicked : 1,
      nameStatus : '',
      passwordStatus: '',
      titleName: 1
    })

    fetch(base+`/api/update_users_clicked/?id=${event.currentTarget.dataset['id']}`, {
      method: 'GET'
    })
    .then(res => {
      console.log(res);
      return res.json()
    })
    .then(users => {

      if (users.success == true) {
        console.log(users.message);

        console.log(users.data[0]);

        if (users.data[0].user_type == 'admin'){
          this.setState ({
            type : 1,
          })
        }
        else if (users.data[0].user_type == 'admin_manager') {
          this.setState ({
            type : 4,
          })
        }
        else if (users.data[0].user_type == 'delivery_man') {
          this.setState ({
            type : 6,
          })
        }

        this.setState({
          name : users.data[0].username,
          password: users.data[0].password,
          email : users.data[0].email,

        });
      }
      else {
        ToastsStore.warning("Something went wrong at the time of getting data !");
        console.log(users.success);
      }

      return false;
    });

  }

  deleteClicked (event) {
    console.log('delete clicked');
    console.log(event.currentTarget.dataset['id']);

    this.setState({
      deleteId: event.currentTarget.dataset['id']
    });

    this.toggleSmall('getDeleteModal');

  }

  reSetTheUserForm (event) {
    this.setState({
      name : '',
      password: '',
      repassword: '',
      email : '',
      type : '',
      nameStatus: '',
      passwordStatus: '',
      isUpdateClicked: 0,
      titleName: 0
    });
    console.log('Re set buttton clicked : ', this.state.name);
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
      <Col xs="12" md="6">
        <Card>
          <CardHeader>
            {
              this.state.titleName == 0 ?
              <strong>Add User</strong>
              :
              <strong>Update User</strong>
            }

          </CardHeader>
          <CardBody>
            <Form  refs action="" method="post" encType="multipart/form-data" className="form-horizontal" onSubmit={this.handleSubmit}>
              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="name">User Name</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="text" id="name" name="name" placeholder="User Name" value={this.state.name} onChange={this.handleChange.bind(this)} required />
                  <p style={{color: 'red'}}>{this.state.nameStatus}</p>
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="password">User Password</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="password" id="password" name="password" placeholder="User Password" value={this.state.password}  onChange={this.handleChange.bind(this)} required />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="repassword">Confirm Password</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="password" id="repassword" name="repassword" placeholder="Confirm Password" value={this.state.repassword} onChange={this.handleChange.bind(this)} />

                  {
                    this.state.passwordStatus == 'password matched' ?
                    <p style={{color: 'green'}}>{this.state.passwordStatus}</p>
                    :
                    <p style={{color: 'red'}}>{this.state.passwordStatus}</p>
                  }
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="email">User Email</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="email" id="email" name="email" placeholder="User Email : example@example.com" onClick={this.checkPassword} value={this.state.email} onChange={this.handleChange.bind(this)} required />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="type">User Type</Label>
                </Col>
                <Col xs="12" md="9">
                <Input type="select" name="type" id="type" value="" onClick={this.checkPassword} value={this.state.type} onChange={this.handleChange.bind(this)} required>
                <option value=""> select Type </option>
                <option value="1"> admin </option>
                <option value="4"> admin_manager </option>
                <option value="6"> delivery_man </option>
                </Input>
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="status">User Status</Label>
                </Col>
                <Col xs="12" md="9">
                <Input type="text" name="status" id="status" value="active" readOnly required>
                </Input>
                </Col>
              </FormGroup>

              <center>
                {
                  this.state.isUpdateClicked == 1 ?
                  <Button type="submit" size="sm" color="success" ><i className="fa fa-dot-circle-o"></i> update</Button>
                  :
                  <Button type="submit" size="sm" color="success"><i className="fa fa-dot-circle-o"></i> Submit</Button>
                }
                &nbsp;
                <Button type="reset" size="sm" color="danger" onClick={this.reSetTheUserForm}><i className="fa fa-ban"></i> Reset</Button>
              </center>

            </Form>
          </CardBody>
          <CardFooter>

          </CardFooter>
        </Card>
      </Col>

      <Col xs="12" lg="6">
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> User List
              </CardHeader>
              <CardBody>
                <Table responsive bordered>
                  <thead>
                  <tr>
                    <th>User Name</th>
                    <th>Email</th>
                    <th>User Type</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                  </thead>
                  <tbody>
                  {
                    this.state.usersList.map((usersListValue, key) =>
                    <tr>
                      <td>{usersListValue.username}</td>
                      <td>{usersListValue.email}</td>
                      <td> {usersListValue.user_type} </td>
                      <td>
                        <center>
                        {usersListValue.status == 'active' ? <i class="fa fa-check fa-lg" style={{color: '#009345'}}></i> : <i class="fa fa-times fa-lg" style={{color: 'red'}}></i> }
                        </center>
                      </td>
                      <td>
                        <center>
                          <a href="#" ref="updateId" data-id={usersListValue.id} onClick={this.updateClicked.bind(this)}>
                            <i className="fa fa-edit fa-lg"  title="Edit users Details Info" aria-hidden="true" style={{color: '#009345'}}></i>
                          </a>&nbsp;&nbsp;
                          <a href="#" data-id={usersListValue.id} onClick={this.deleteClicked.bind(this)}>
                            <i className="fa fa-trash fa-lg" title="Delete This users Details" aria-hidden="true" style={{color: '#EB1C22'}}></i>
                          </a>
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

      <Modal isOpen={this.state.small} toggle={this.toggleSmall}
        className={'modal-sm ' + this.props.className}>
      <ModalHeader toggle={this.toggleSmall}> Delete User Details </ModalHeader>
      <ModalBody>
        <strong>
        <center>
          Are Sure to delete this User Details ?
        </center>
        </strong>
      </ModalBody>
      <ModalFooter>
        <Button color="success" onClick={(e)=>{this.toggleSmall('deleteCategoryOrderListPermitted')}} >yes</Button>{' '}
        <Button color="danger" onClick={(e)=>{this.toggleSmall('deleteCategoryOrderListDenied')}} >No</Button>
      </ModalFooter>
      </Modal>
    </Row>
    )
  }
}



export default User;
