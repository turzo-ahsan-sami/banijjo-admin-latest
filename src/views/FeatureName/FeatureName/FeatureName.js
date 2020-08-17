import React, { Component } from 'react';
import {ToastsContainer, ToastsStore} from 'react-toasts';
import cookie from 'react-cookies';

import {logoutFunction} from '../../DynamicLogout/Logout';

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
  ListGroupItem
} from 'reactstrap';
const base = process.env.REACT_APP_ADMIN_SERVER_URL;


class FeatureName extends Component {
  constructor(props) {
    super(props);

    this.state = {
      collapse: true,
      fadeIn: true,
      timeout: 300,
      feature_name: [],
      limitCheck: '',
      codeAvailabilityCheck: '',
      modal: false,
      small: false,
      featureNameDeleteId: 0,
      isUpdateClicked: false,
      editID: '',
      featureName: '',
      featureCode: ''
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.toggleSmall = this.toggleSmall.bind(this);

    this.handleGetEditForm = this.handleGetEditForm.bind(this);
  }

  handleReset () {
      window.location = '/feature/feature_name';
  }

  handleGetEditForm (event) {
      console.log('Edit clicked & id : ', event.currentTarget.dataset['id']);

      this.setState({
          isUpdateClicked: true,
          editID: event.currentTarget.dataset['id']
      });

      fetch(base+`/api/getFeatureNameInfo/?id=${event.currentTarget.dataset['id']}`, {
        method: 'GET'
      })
      .then(res => {
        console.log(res);
        return res.json()
      })
      .then(category => {
        console.log('Data : ', category.data);

        this.setState({
            featureName: category.data[0].name,
            featureCode: category.data[0].code
        });

        return false;
      });
  }

  toggleSmall(event) {
    if (event == 'Yes') {
      console.log('Permitted');
      fetch(base+`/api/deleteFeatureName/?id=${this.state.featureNameDeleteId}`, {
        method: 'GET',
        headers: {'Authorization': 'Atiq '+cookie.load('token')}
      })
      .then(res => {
        console.log(res);
        return res.json()
      })
      .then(categoryDelete => {
        console.log('Data : ', categoryDelete);

        if (categoryDelete.success == true) {
          ToastsStore.success(categoryDelete.message);

          setTimeout(() => {
            this.setState({
              small: !this.state.small,
            });
            window.location = '/feature/feature_name';
          }, 1000);
        }
        else {
          if (categoryDelete.status == 403) {
            console.log(categoryDelete);

            ToastsStore.warning('Your session is expired. Please Login again');

            setTimeout(()=> {
              logoutFunction(localStorage.userName);
            }, 1000);

          }
          else {
            ToastsStore.warning("User Info deletion Faild. Please try again !!");
            console.log(categoryDelete.success);
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

  deleteItem (event) {
    console.log('Delete Purchase Id : ', event.currentTarget.dataset['id']);

    this.setState({
      small: !this.state.small,
      featureNameDeleteId: event.currentTarget.dataset['id']
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    console.log(this.state.categoryName);

    console.log(this.state);

    if (this.state.limitCheck == '' && this.state.codeAvailabilityCheck == '') {
      fetch(base+'/api/saveFeatureName' , {
        method: "POST",
        headers: {
          'Content-type': 'application/json',
          'Authorization': 'Atiq '+cookie.load('token')
        },
        body: JSON.stringify(this.state)
      })
      .then((result) => result.json())
      .then((info) => {
        console.log(info);

        if (info.success == true) {
          ToastsStore.success("Feature Name Successfully inserted !!");
          console.log(info.success);

          setTimeout(
            function() {
              window.location = '/feature/feature_name';
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
            ToastsStore.warning("Feature Name Insertion Faild. Please try again !!");
            console.log(info.success);
          }
        }

      })
    }
    else {
      if (this.state.limitCheck != '') {
        ToastsStore.warning("Feature Name Insertion Faild. Code value should be less than or equal to the 10");
      }
      else if (this.state.codeAvailabilityCheck != '') {
        ToastsStore.warning("Feature Name Insertion Faild. This code is already exist in the database");
      }

    }


  }

  handleChange(event) {
    console.log('vendor ID : ', event.target.value);

    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    // alert(value)
    // alert(name)

    if (name == 'featureCode') {
      if (Number(value) > Number(10)) {
        this.limitExited();
      }
      else {
        this.state.limitCheck = '';

        // fetch(base+`/api/feature_name_code_check/?id=${value}`, {
        //   method: 'GET',
        //   headers: {'Authorization': 'Atiq '+cookie.load('token')}
        // })
        // .then(res => {
        //   console.log(res);
        //   return res.json()
        // })
        // .then(feature_code_result => {
        //   console.log(feature_code_result.data);
        //
        //   if (Number(feature_code_result.data) == Number(0)) {
        //     this.state.codeAvailabilityCheck = '';
        //   }
        //   else {
        //     this.codeAvailabilityCheck();
        //   }
        //
        //   return false;
        // });

      }
    }

    this.setState({
      [name]: value
    });
  }

  limitExited () {
    this.setState({
      limitCheck: 'Limitation Error !! The value of the code should have less than or equal to the 10 !!',
      codeAvailabilityCheck: ''
    })
  }

  codeAvailabilityCheck () {
    console.log('code is available !');

    this.setState({
      codeAvailabilityCheck: 'This given code is already exist in the database ! So please choose another code which value is less than 10 !',
      limitCheck: ''
    })

    console.log(this.state.codeAvailabilityCheck);
  }

  componentDidMount() {
    fetch(base+'/api/feature_name', {
      method: 'GET'
    })
    .then(res => {
      console.log(res);
      return res.json()
    })
    .then(feature_name => {
      console.log(feature_name.data);
      this.setState({
        feature_name : feature_name.data
      })
      return false;
    });
  }

  render() {

    return (
      <Row>
      <Col xs="12" md="6">
        <Card>
          <CardHeader>
            <strong>Add New Feature Name</strong>
          </CardHeader>
          <ToastsContainer store={ToastsStore}/>
          <CardBody>
            <Form action="" method="post" encType="multipart/form-data" onSubmit={this.handleSubmit} onChange={this.handleChange} className="form-horizontal">

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="featureName">Feature Name</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="text" id="featureName" name="featureName" value={this.state.featureName} required="true" placeholder="Feature Name" />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="featureName">Feature Code</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="text" id="featureCode" name="featureCode" value={this.state.featureCode} required="true" placeholder="Feature Code" />
                  <p style={{color: 'red'}}>
                    {this.state.limitCheck}
                  </p>
                  <p style={{color: 'red'}}>
                    {this.state.codeAvailabilityCheck}
                  </p>
                </Col>

              </FormGroup>

              <center>
                <Button type="submit" size="sm" color="success"><i className="fa fa-dot-circle-o"></i> Submit</Button>&nbsp;

                <Button type="reset" size="sm" color="danger" onClick={this.handleReset}><i className="fa fa-ban"></i> Reset</Button>
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
                <Row>
                  <Col md="6">
                    <i className="fa fa-align-justify"></i> Feature List
                  </Col>
                  <Col md="6">
                    {/* <Button type="button" size="sm" color="primary" onClick={this.handleGet}><i className="fa fa-dot-circle-o"></i> Get Data</Button>&nbsp; */}
                  </Col>
                </Row>
              </CardHeader>

              <CardBody>
                <Table responsive bordered>
                  <thead>
                  <tr>
                    <th>Feature Name</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                  </thead>
                  <tbody>

                    {
                      this.state.feature_name.map((feature_name_value, key) =>
                        <tr>
                          <td>{ feature_name_value.name }</td>
                          {
                            feature_name_value.status == 1 ?
                              <td><Badge color="success">Active</Badge></td>
                            :
                              <td><Badge color="secondary">Inactive</Badge></td>
                          }
                          <td>
                            <center>
                                <a href="#">
                                    <i className="fa fa-edit fa-lg"  title="Edit Details Info" aria-hidden="true" style={{color: '#009345'}} data-id={feature_name_value.id} onClick={this.handleGetEditForm.bind(this)}></i>
                                </a>&nbsp;
                                <a href="#" onClick={this.deleteItem.bind(this)} id="deleteIds" ref="dataIds" data-id={feature_name_value.id}>
                                    <i className="fa fa-trash fa-lg" title="Delete Products Details" aria-hidden="true" style={{color: '#EB1C22'}}></i>
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
            <ToastsContainer store={ToastsStore}/>
            <ModalHeader toggle={this.toggleSmall}>Delete Purchase</ModalHeader>
            <ModalBody>
              Are You Sure To Delete This Feature Name ?
            </ModalBody>
            <ModalFooter>
              <Button color="success" onClick={(e)=>{this.toggleSmall('Yes')}} >Yes</Button>{' '}
              <Button color="danger" onClick={(e)=>{this.toggleSmall('No')}} >No</Button>
            </ModalFooter>
          </Modal>

    </Row>
    )
  }
}



export default FeatureName;
