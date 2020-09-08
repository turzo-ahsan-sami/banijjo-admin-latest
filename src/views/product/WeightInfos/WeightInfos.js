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

class WeightInfos extends Component {
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
      weightTypeList: [],
      weightInfoList: [],
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
      fetch(base + `/apiv2/deleteWeightInfo/?id=${this.state.weightId}`, {
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
    fetch(base + "/apiv2/getWeightInfos", {
      method: "GET",
      headers: { Authorization: "Atiq " + cookie.load("token") },
    })
      .then((res) => {
        console.log(res);
        return res.json();
      })
      .then((infos) => {
        console.log(infos.data);
        this.setState({
          weightInfoList: infos.data,
        });
        return false;
      });

    fetch(base + "/apiv2/getWeightType", {
      method: "GET",
      headers: { Authorization: "Atiq " + cookie.load("token") },
    })
      .then((res) => {
        console.log(res);
        return res.json();
      })
      .then((infos) => {
        console.log(infos.data);
        this.setState({
          weightTypeList: infos.data,
        });
        return false;
      });
    // .then(console.log(response));
  }

  handleSubmit(event) {
    event.preventDefault();

    if (this.state.buttonPermittedFor == "submit") {
      fetch(base + "/apiv2/saveWeightInfo", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: "Atiq " + cookie.load("token"),
        },
        body: JSON.stringify(this.state),
      })
        .then((result) => result.json())
        .then((info) => {
          console.log(info);
          if (info.success == true) {
            ToastsStore.success(info.message);
            console.log(info.success);

            this.setState({
              weight: "",
              weightType: "",
            });

            this.handleGet();
          } else {
            if (info.status == 403) {
              console.log(info);

              ToastsStore.warning(
                "Your session is expired. Please Login again"
              );

              setTimeout(() => {
                logoutFunction(localStorage.userName);
              }, 1000);
            } else {
              ToastsStore.warning(info.message);
              console.log(info.success);
            }
          }
        });
    } else {
      console.log("Permitted for update");

      fetch(base + "/apiv2/editWeightInfos", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: "Atiq " + cookie.load("token"),
        },
        body: JSON.stringify(this.state),
      })
        .then((result) => result.json())
        .then((info) => {
          console.log(info);
          if (info.success == true) {
            ToastsStore.success(info.message);
            console.log(info.success);

            this.setState({
              weight: "",
              weightType: "",
              weightId: 0,
              buttonName: "submitButton",
              buttonPermittedFor: "submit",
            });

            this.handleGet();
          } else {
            if (info.status == 403) {
              console.log(info);

              ToastsStore.warning(
                "Your session is expired. Please Login again"
              );

              setTimeout(() => {
                logoutFunction(localStorage.userName);
              }, 1000);
            } else {
              ToastsStore.warning(info.message);
              console.log(info.success);
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
    console.log("Edit Id : ", event.currentTarget.dataset["id"]);

    this.setState({
      weightId: event.currentTarget.dataset["id"],
      buttonName: "updateButton",
      buttonPermittedFor: "update",
    });

    setTimeout(() => {
      fetch(base + `/apiv2/getWeightInfoForUpdate/?id=${this.state.weightId}`, {
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
            this.setState({
              weight: infos.data["weight"],
              weightType: infos.data["weight_type_id"],
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
                {" "}
                {this.state.buttonName == "submitButton"
                  ? "Add New Weight"
                  : "Uppdate Weight"}{" "}
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
                    <Label htmlFor="vendorList">Weight Type</Label>
                  </Col>
                  <Col xs="12" md="9">
                    <Input
                      type="select"
                      name="weightType"
                      id="weightType"
                      onChange={this.handleChange.bind(this)}
                      value={this.state.weightType}
                    >
                      <option value="0">Please select</option>
                      {this.state.weightTypeList.map((weightTypeListValue, key) => (
                        <option value={weightTypeListValue.id} key={key}>
                          {" "}
                          {weightTypeListValue.name}{" "}
                        </option>
                      ))}
                    </Input>
                  </Col>
                </FormGroup>

                <FormGroup row>
                  <Col md="3">
                    <Label htmlFor="categoryName">Weight</Label>
                  </Col>
                  <Col xs="12" md="9">
                    <Input
                      type="text"
                      id="weight"
                      name="weight"
                      value={this.state.weight || 0}
                      required={true}
                      onChange={this.handleChange.bind(this)}
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
                  <i className="fa fa-align-justify"></i> Weight Info List
                </Col>
              </Row>
            </CardHeader>

            <CardBody>
              <Table responsive bordered>
                <thead>
                  <tr>
                    <th>Weight</th>
                    <th> Name </th>
                    <th>
                      {" "}
                      <center>Action</center>{" "}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.weightInfoList.length > 0
                    ? this.state.weightInfoList.map((weightInfoListValue, key) => (
                        <tr key={key}>
                          <td>{weightInfoListValue.weight}</td>
                          <td>{weightInfoListValue.name}</td>
                          <td>
                            <center>
                              <a
                                href="#"
                                onClick={this.editItem.bind(this)}
                                id="deleteIds"
                                ref="dataIds"
                                data-id={weightInfoListValue.id}
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
                                data-id={weightInfoListValue.id}
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
          <ModalHeader toggle={this.toggleSmall}>Delete Weight Info</ModalHeader>
          <ModalBody>Are You Sure To Delete This Weight Info ?</ModalBody>
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

export default WeightInfos;
