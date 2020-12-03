import React, { Component } from "react";
import { ToastsContainer, ToastsStore } from "react-toasts";
import cookie from "react-cookies";

import { logoutFunction } from "../../DynamicLogout/Logout";

import {
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Pagination,
  PaginationItem,
  PaginationLink,
  Table,
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
} from "reactstrap";
const base = process.env.REACT_APP_ADMIN_SERVER_URL;

class WeightType extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.toggleFade = this.toggleFade.bind(this);
    this.state = {
      
      collapse: true,
      fadeIn: true,
      timeout: 300,
      modal: false,
      small: false,
      weightId: 0,
      weightList: [],
      serialNumber: 0,
      buttonName: "submitButton",
      buttonPermittedFor: "submit",
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.toggleSmall = this.toggleSmall.bind(this);
  }

  componentDidMount() {
    const userName = localStorage.getItem("userName");
    const userPassword = localStorage.getItem("userPassword");
    if (userName === null && userPassword === null) {
      this.props.history.push("/login");
    }
    this.handleGet();
  }

  toggleSmall(event) {
    if (event == "Yes") {
      console.log("Permitted");
      fetch(base + `/api/deleteWeightType/?id=${this.state.weightId}`, {
        method: "GET",
        headers: { Authorization: "Atiq " + cookie.load("token") },
      })
        .then((res) => {
          console.log(res);
          return res.json();
        })
        .then((infos) => {
          console.log("Data : ", infos);

          if (infos.success == true) {
            ToastsStore.success(infos.message);

            this.handleGet();

            setTimeout(() => {
              this.setState({
                small: !this.state.small,
                weightId: 0,
              });
              // window.location = '/category/categories';
            }, 500);
          } else {
            if (infos.status == 403) {
              console.log(infos);

              ToastsStore.warning(
                "Your session is expired. Please Login again"
              );

              setTimeout(() => {
                logoutFunction(localStorage.userName);
              }, 1000);
            } else {
              ToastsStore.warning(infos.message);

              this.handleGet();

              setTimeout(() => {
                this.setState({
                  small: !this.state.small,
                });
                // window.location = '/category/categories';
              }, 1000);
            }
          }

          return false;
        });
    } else {
      this.setState({
        small: !this.state.small,
      });
    }

    console.log(event);
  }

  handleGet() {
    fetch(base + "/api/getWeightType", {
      method: "GET",
      headers: { Authorization: "Atiq " + cookie.load("token") },
    })
      .then((res) => {
        console.log(res);
        return res.json();
      })
      .then((infos) => {
        this.setState({
          weightList: infos.data,
        });
        return false;
      });
  }

  handleSubmit(event) {
    event.preventDefault();

    if (this.state.buttonPermittedFor == "submit") {
      fetch(base + "/api/saveWeightType", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: "Atiq " + cookie.load("token"),
        },
        body: JSON.stringify(this.state),
      })
        .then((result) => result.json())
        .then((info) => {
          if (info.success == true) {
            ToastsStore.success(info.message);
            this.setState({
              name: "",
            });
            this.handleGet();
          } else {
            if (info.status == 403) {
              ToastsStore.warning(
                "Your session is expired. Please Login again"
              );
              setTimeout(() => {
                logoutFunction(localStorage.userName);
              }, 1000);
            } else {
              ToastsStore.warning(info.message);
            }
          }
        });
    } else {
      fetch(base + "/api/editWeightType", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: "Atiq " + cookie.load("token"),
        },
        body: JSON.stringify(this.state),
      })
        .then((result) => result.json())
        .then((info) => {
          if (info.success == true) {
            ToastsStore.success(info.message);
            this.setState({
              name: "",
              weightId: 0,
              buttonName: "submitButton",
              buttonPermittedFor: "submit",
            });
            this.handleGet();
          } else {
            if (info.status == 403) {
              ToastsStore.warning(
                "Your session is expired. Please Login again"
              );
              setTimeout(() => {
                logoutFunction(localStorage.userName);
              }, 1000);
            } else {
              ToastsStore.warning(info.message);
              this.handleGet();
            }
          }
        });
    }
  }

  handleChange(event) {
    // this.setState({value: event.target.value});
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    // alert(value)
    // alert(name)

    this.setState({
      [name]: value,
    });
  }

  toggle() {
    this.setState({ collapse: !this.state.collapse });
  }

  toggleFade() {
    this.setState((prevState) => {
      return { fadeIn: !prevState };
    });
  }

  deleteItem(event) {
    console.log("Delete Id : ", event.currentTarget.dataset["id"]);

    this.setState({
      small: !this.state.small,
      weightId: event.currentTarget.dataset["id"],
    });
  }

  editItem(event) {
    this.setState({
      weightId: event.currentTarget.dataset["id"],
      buttonName: "updateButton",
      buttonPermittedFor: "update",
    });
    setTimeout(() => {
      fetch(base + `/api/getWeightTypeForUpdate/?id=${this.state.weightId}`, {
        method: "GET",
        headers: { Authorization: "Atiq " + cookie.load("token") },
      })
        .then((res) => {
          return res.json();
        })
        .then((infos) => {
          if (infos.success == true) {
            this.setState({
              name: infos.data,
            });
          } else {
            ToastsStore.warning(infos.message);
            this.handleGet();
          }
          return false;
        });
    }, 100);
  }

  handleReset(event) {
    this.setState({
      name: "",
      weightId: 0,
      buttonName: "submitButton",
      buttonPermittedFor: "submit",
    });

    console.log("Everything has resetted");
  }

  render() {
    return (
      <Row>
        <Col xs="12" md="6">
          <Card>
            <CardHeader>
              <strong>
                {this.state.buttonName == "submitButton"
                  ? "Add New Weight Type"
                  : "Uppdate Weight Type"}
              </strong>
            </CardHeader>
            <ToastsContainer store={ToastsStore} />
            <CardBody>
              <Form
                action=""
                method="post"
                encType="multipart/form-data"
                onSubmit={this.handleSubmit}
                onChange={this.handleChange}
                className="form-horizontal"
              >
                <FormGroup row>
                  <Col md="3">
                    <Label htmlFor="categoryName">Weight Type Name</Label>
                  </Col>
                  <Col xs="12" md="9">
                    <Input
                      type="text"
                      id="name"
                      name="name"
                      value={this.state.name}
                      required="true"
                      placeholder="Weight Type"
                    />
                  </Col>
                </FormGroup>

                <center>
                  <Button type="submit" size="sm" color="success">
                    <i className="fa fa-dot-circle-o"></i>{" "}
                    {this.state.buttonName == "submitButton"
                      ? "Submit"
                      : "Uppdate"}{" "}
                  </Button>
                  &nbsp;
                  <Button
                    type="reset"
                    size="sm"
                    color="danger"
                    onClick={this.handleReset.bind(this)}
                  >
                    <i className="fa fa-ban"></i> Reset
                  </Button>
                </center>
              </Form>
            </CardBody>
            <CardFooter></CardFooter>
          </Card>
        </Col>

        <Col xs="12" lg="6">
          <Card>
            <CardHeader>
              <Row>
                <Col md="12">
                  <i className="fa fa-align-justify"></i> Weight Type List
                </Col>
              </Row>
            </CardHeader>

            <CardBody>
              <Table responsive bordered>
                <thead>
                  <tr>
                    <th> Name </th>
                    <th>
                      {" "}
                      <center>Action</center>{" "}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.weightList.length > 0
                    ? this.state.weightList.map((weightListValue, key) => (
                        <tr>
                          <td>{weightListValue.name}</td>
                          <td>
                            <center>
                              <a
                                href="#"
                                onClick={this.editItem.bind(this)}
                                id="deleteIds"
                                ref="dataIds"
                                data-id={weightListValue.id}
                              >
                                <i
                                  className="fa fa-edit fa-lg"
                                  title="Edit Weight"
                                  aria-hidden="true"
                                  style={{ color: "#009345" }}
                                ></i>
                              </a>{" "}
                              <a
                                href="#"
                                onClick={this.deleteItem.bind(this)}
                                id="deleteIds"
                                ref="dataIds"
                                data-id={weightListValue.id}
                              >
                                <i
                                  className="fa fa-trash fa-lg"
                                  title="Delete Weight"
                                  aria-hidden="true"
                                  style={{ color: "#EB1C22" }}
                                ></i>
                              </a>
                            </center>
                          </td>
                        </tr>
                      ))
                    : null}
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </Col>

        <Modal
          isOpen={this.state.small}
          toggle={this.toggleSmall}
          className={"modal-sm " + this.props.className}
        >
          <ToastsContainer store={ToastsStore} />
          <ModalHeader toggle={this.toggleSmall}>
            Delete Weight Type
          </ModalHeader>
          <ModalBody>Are You Sure To Delete This Weight Type ?</ModalBody>
          <ModalFooter>
            <Button
              color="success"
              onClick={(e) => {
                this.toggleSmall("Yes");
              }}
            >
              Yes
            </Button>{" "}
            <Button
              color="danger"
              onClick={(e) => {
                this.toggleSmall("No");
              }}
            >
              No
            </Button>
          </ModalFooter>
        </Modal>
      </Row>
    );
  }
}

export default WeightType;
