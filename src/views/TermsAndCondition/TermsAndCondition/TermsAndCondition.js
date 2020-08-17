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
} from 'reactstrap';

const base = process.env.REACT_APP_ADMIN_SERVER_URL;
const publicUrl = process.env.REACT_APP_PUBLIC_URL;

class TermsAndCondition extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.toggleFade = this.toggleFade.bind(this);
    this.state = {
      collapse: true,
      fadeIn: true,
      timeout: 300,
      isUpdateClicked: 0,
      termsAndCondition: [],
      condition_type: [],
      termsCondition: '',
      updateId : ''
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.reSet = this.reSet.bind(this);
  }

  componentDidMount () {
    const userName = localStorage.getItem('userName');
    const userPassword = localStorage.getItem('userPassword');
    if(userName===null && userPassword === null)
    {
      this.props.history.push("/login");
    }

    fetch(base+'/api/getTermsAndCondition', {
      method: 'GET'
    })
    .then(res => {
      // console.log(res);
      return res.json()
    })
    .then(termsAndCondition => {
      console.log(termsAndCondition.data);
      this.setState({
        termsAndCondition : termsAndCondition.data[0],
        condition_type :  termsAndCondition.data[1],
      })

      // console.log('Terms & Condition Data : ', this.state.termsAndCondition[0].terms_and_conditions);
      return false;
    });
  }

  toggle() {
    this.setState({ collapse: !this.state.collapse });
  }

  toggleFade() {
    this.setState((prevState) => { return { fadeIn: !prevState }});
  }

  handleSubmit (event) {
    event.preventDefault();
    console.log(this.state);

    if (this.state.isUpdateClicked == 1) {
        fetch(base+'/api/updateTermsAndCondition' , {
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
            ToastsStore.success("Data Inserted Successfully !!");

            this.setState({
              termsAndCondition : info.data[0],
              condition_type :  info.data[1],
              termsCondition: '',
              isUpdateClicked: 0,
              updateId : ''
            })

            console.log(info.success);

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
              ToastsStore.warning("Data Did Not Inserted !!");
              console.log(info.success);
            }

          }

      });
    }
    else {
        fetch(base+'/api/saveTermsAndCondition' , {
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
            ToastsStore.success("Data Inserted Successfully !!");

            this.setState({
              termsAndCondition : info.data[0],
              condition_type :  info.data[1],
              termsCondition: '',
              isUpdateClicked: 0
            })

            console.log(info.success);

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
              ToastsStore.warning("Data Did Not Inserted !!");
              console.log(info.success);
            }

          }

      });
    }

  }

  handleChange (event) {
    let target = event.target;

    let value = target.value;
    let name = target.name;

    this.setState ({
      [name]: value
    });

  }

  updateClicked (event) {
      event.preventDefault();
      console.log(event.currentTarget.dataset.id );
      console.log(event.currentTarget.dataset.type_id);
    this.setState({
      isUpdateClicked: 1,
      updateId : event.currentTarget.dataset.id
    });

    fetch(base+`/api/getTermsAndConditionInfoForUpdate?id=${event.currentTarget.dataset.id}&typeId=${event.currentTarget.dataset.type_id}`, {
      method: 'GET',
    })
    .then(res => {
      // console.log(res);
      return res.json()
    })
    .then(termsAndCondition => {
        console.log('isUpdateClicked : ',this.state.isUpdateClicked);
        console.log(termsAndCondition.data);

        this.setState({
          termsCondition : termsAndCondition.data[0][0].terms_and_conditions,
          conditionType : termsAndCondition.data[1][0].name
        })

        console.log('Terms & Condition Data : ', this.state.termsCondition);
        console.log('Terms & Condition Data : ', termsAndCondition.data[0][0].terms_and_conditions);
        console.log('conditionType Name : ', termsAndCondition.data[1][0].name);
        return false;
    });
  }

  reSet (event) {
    this.setState({
      termsCondition : '',
      isUpdateClicked: 0
    })
  }

  render() {

    return (
      <Row>
        <ToastsContainer store={ToastsStore}/>
        <Col xs="12" md="6">
        <Card>
            <CardHeader>
              <strong>
              Terms & Condition
              </strong>
            </CardHeader>
            <CardBody>
              <Form refs action="" method="post" encType="multipart/form-data" className="form-horizontal" onSubmit={this.handleSubmit}>

                <FormGroup row>
                  <Col md="3">
                    <Label htmlFor="name">Type</Label>
                  </Col>
                  <Col xs="12" md="9">
                      {
                          this.state.isUpdateClicked == 1 ?
                          <Input type="text" id="conditionType" name="conditionType" value={this.state.conditionType} readOnly />
                          :
                          <Input type="select" name="conditionType" onChange={this.handleChange.bind(this)} id="conditionType" value={this.state.conditionType} required >
                          <option value="0">Please select</option>
                          {
                            this.state.condition_type.map((condition_type_value, key) =>
                                <option value={condition_type_value.id}> {condition_type_value.name} </option>
                            )
                          }
                          </Input>
                      }
                    {/* <Input type="textarea" id="termsCondition" name="termsCondition" value={this.state.termsCondition} onChange={this.handleChange.bind(this)} placeholder="Terms & Condition" required /> */}
                  </Col>
                </FormGroup>

                <FormGroup row>
                  <Col md="3">
                    <Label htmlFor="name">Terms & Condition</Label>
                  </Col>
                  <Col xs="12" md="9">
                    <Input type="textarea" id="termsCondition" name="termsCondition" value={this.state.termsCondition} onChange={this.handleChange.bind(this)} placeholder="Terms & Condition" required />
                  </Col>
                </FormGroup>

                <center>
                  {
                    this.state.isUpdateClicked == 1 ?
                    <Button type="submit" size="sm" color="success" ><i className="fa fa-dot-circle-o"></i> update </Button>
                    :
                    <Button type="submit" size="sm" color="success"><i className="fa fa-dot-circle-o"></i> Submit </Button>
                  }&nbsp;
                  <Button type="reset" size="sm" color="danger" onClick={this.reSet}><i className="fa fa-dot-circle-o"></i> Reset </Button>
                </center>

              </Form>
            </CardBody>
          </Card>
        </Col>
        <Col xs="12" md="6">
          <Card>
            <CardHeader>

            </CardHeader>
            <CardBody>
              <Table responsive bordered>
                <thead>
                <tr>
                  <th>Condition Type</th>
                  <th>Terms & Condition</th>
                  <th>Action</th>
                </tr>
                </thead>
                <tbody>
                  {
                    this.state.termsAndCondition.length > 0 ?
                    this.state.termsAndCondition.map((termsAndConditionValue, key) =>
                    <tr>
                      <React.Fragment>
                        <td>
                          {
                            this.state.condition_type.map((condition_type_value, key)=>
                            condition_type_value.id == termsAndConditionValue.condition_type_id ?
                            condition_type_value.name
                            :
                            null
                            )
                          }
                        </td>
                        <td>
                          {termsAndConditionValue.terms_and_conditions}
                        </td>
                        <td>
                        <a href="#" ref="updateId" data-id={termsAndConditionValue.id} data-type_id={termsAndConditionValue.condition_type_id} onClick={this.updateClicked.bind(this)}>
                          <i className="fa fa-edit fa-lg"  title="Edit users Details Info" aria-hidden="true" style={{color: '#009345'}}></i>
                        </a>
                        </td>
                      </React.Fragment>
                    </tr>
                    )
                    :
                    null
                  }
                {/* <tr>
                    {
                      this.state.termsAndCondition.length > 0 ?
                      <React.Fragment>
                          <td>
                          {this.state.termsAndCondition[0].terms_and_conditions}
                          </td>
                          <td>
                          <a href="#" ref="updateId" data-id={this.state.termsAndCondition[0].id} data-type_id={this.state.termsAndCondition[0].condition_type_id} onClick={this.updateClicked.bind(this)}>
                            <i className="fa fa-edit fa-lg"  title="Edit users Details Info" aria-hidden="true" style={{color: '#009345'}}></i>
                          </a>
                          </td>
                      </React.Fragment>
                      :null
                    }
                </tr> */}
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </Col>
    </Row>

    )
  }
}



export default TermsAndCondition;
