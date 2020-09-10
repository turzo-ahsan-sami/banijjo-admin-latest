import React, { Component } from "react";
import ReactDOM from "react-dom";
import { ToastsContainer, ToastsStore } from "react-toasts";
import cookie from "react-cookies";

import "./tag.scss";
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

class ProductSpecifications extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.toggleFade = this.toggleFade.bind(this);

    this.AddValuesRef = React.createRef();
    this.ProductSpecificationValArray = [];

    this.state = {
      productsCategory: [],
      productsActualCategory: [],
      productsSpecificationDetails: [],
      specificationDetails: [],
      ProductSpecificationValues: [],
      ProductSpecificationValuesArray: [],
      tags: "",
      collapse: true,
      fadeIn: true,
      timeout: 300,
      sizeType: [],
      weightType: [],
      specificationName: "",
      editID: "",
      isUpdateClicked: false,
      specificationType: "",
      categoryId: "",
      type: "",
      isChecking: false,

      small: false,
      specId: 0,
      selectedProductCategoryIds: []
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleProductChange = this.handleProductChange.bind(this);

    this.handleGetEditForm = this.handleGetEditForm.bind(this);
    this.toggleSmall = this.toggleSmall.bind(this);
  }

  handleMultipleSelectChange = (event) => {
    let opts = [], opt;
    for (let i = 0, len = event.target.options.length; i < len; i++) {
      opt = event.target.options[i];
      if (opt.selected) {
        opts.push(opt.value);
      }
    }
    this.setState({selectedProductCategoryIds: opts});    
  };

  handleReset() {
    window.location = "/product/products-specifications";
  }

  handleGetEditForm(event) {
    this.setState({
      editID: event.currentTarget.dataset["id"],
    });

    fetch(
      base +
        `/api/getProductSpecificationData/?id=${event.currentTarget.dataset["id"]}`,
      {
        method: "GET",
      }
    )
      .then((res) => {
        return res.json();
      })
      .then((specs) => {
        console.log(specs.data);
        if (specs.success == true) {
          this.setState({
            // specificationType: specs.data[0].type,
            specificationType: specs.data[0].specification_type,
            categoryId: specs.data[0].category_id,
            isUpdateClicked: true,
            // specification: specs.data[0].type != 0 ? "Others" : "",
            specification: specs.data[0].specification_type,
            isChecking: true,
          });
        } else {
          ToastsStore.warning(specs.message);
        }

        console.log("States Value : ", this.state);

        return false;
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

  componentDidMount() {
    const userName = localStorage.getItem("userName");
    const userPassword = localStorage.getItem("userPassword");
    if (userName === null && userPassword === null) {
      this.props.history.push("/login");
    }

    fetch(base + "/api/categories", {
      method: "GET",
    })
      .then((res) => {
        console.log(res);
        return res.json();
      })
      .then((category) => {
        console.log(category.data);
        this.setState({
          productsActualCategory: category.data,
        });

        return false;
      });

    fetch(base + "/api/getSizeType", {
      method: "GET",
    })
      .then((res) => {
        console.log(res);
        return res.json();
      })
      .then((sizeType) => {
        console.log(sizeType.data);
        this.setState({
          sizeType: sizeType.data,
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
      .then((weightType) => {
        console.log(weightType.data);
        this.setState({
          weightType: weightType.data,
        });

        return false;
      });

    console.log("Check Check : ");

    fetch(base + "/api/specialCategoryListForSpecification", {
      method: "GET",
    })
      .then((res) => {
        console.log("Response From Special Category : ", res);
        return res.json();
      })
      .then((category) => {
        let categoryList = [];
        console.log("Category List Name : ");
        console.log("Category List : ", category.data);

        for (let i = 0; i < category.data.length; i++) {
          if (category.data[i] != null) {
            categoryList[i] = category.data[i];
          }
        }

        console.log("Category List updated : ", categoryList);

        this.setState({
          productsCategory: categoryList,
        });

        console.log("Category List final state : ", categoryList);

        return false;
      });

    fetch(base + "/apiv2/product_specification_names", {
      method: "GET",
    })
      .then((res) => {
        console.log(res);
        return res.json();
      })
      .then((specificationName) => {
        this.setState({
          productsSpecificationDetails: specificationName.data,
        });
        return false;
      });
  }

  handleAddTags(event) {
    console.log(event.target.value);

    this.setState({
      tags: event.target.value,
    });

    console.log("Tag : ", this.state.Tags);
  }

  handleProductChange(event) {
    let target = event.target;
    let value = target.type === "checkbox" ? target.checked : target.value;
    let name = target.name;

    this.setState({
      [name]: value,
    });

    if (this.state.specification == "Size") {
      for (var i = 0; i < this.state.sizeType.length; i++) {
        if (this.state.sizeType[i].id == value) {
          this.setState({
            specificationName: this.state.sizeType[i].name,
          });
        }
      }
    }
    if (this.state.specification == "Weight") {
      for (var i = 0; i < this.state.weightType.length; i++) {
        if (this.state.weightType[i].id == value) {
          this.setState({
            specificationName: this.state.weightType[i].name,
          });
        }
      }
    }
    // if (this.state.specification == "Others") {
    //   for (var i = 0; i < this.state.sizeType.length; i++) {
    //     if (this.state.sizeType[i].id == value) {
    //       this.setState({
    //         specificationName: this.state.sizeType[i].name,
    //       });
    //     }
    //   }
    // }

    if (this.state.isUpdateClicked == true) {
      // this.setState({
      //     isChecking: true
      // })
    }

    console.log(name + " : " + value);
  }

  handleAddValues(event) {
    this.setState({
      // ProductSpecificationValuesArray: this.state.ProductSpecificationValues
    });

    this.state.ProductSpecificationValuesArray.push(
      this.state.ProductSpecificationValues
    );

    // this.ProductSpecificationValArray.push(this.state.ProductSpecificationValues);

    ReactDOM.findDOMNode(this.refs.clear).value = "";
  }

  handleAddChange(event) {
    this.setState({ ProductSpecificationValues: event.target.value });
  }

  handleSubmit(event) {
    console.log(this.state);
    event.preventDefault();
    // return;

    fetch(base + "/apiv2/saveSpecification", {
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
          ToastsStore.success("Product Specification Successfully inserted !!");
          console.log(info);
          setTimeout(
            function () {
              // this.props.history.push("/product/products");
              window.location = "/product/products-specifications";
            }.bind(this),
            3000
          );
        } else {
          if (info.status == 403) {
            console.log(info);

            ToastsStore.warning("Your session is expired. Please Login again");

            setTimeout(() => {
              logoutFunction(localStorage.userName);
            }, 1000);
          } else {
            ToastsStore.warning("Product Insertion Faild. Please try again !!");
            console.log(info.success);
          }
        }
      });
  }

  handleRadioButton(event) {
    // console.log(event.target.value);
  }

  deleteItem(event) {
    console.log("Delete Id : ", event.currentTarget.dataset["id"]);
    this.setState({
      small: !this.state.small,
      specId: event.currentTarget.dataset["id"],
    });
  }

  toggleSmall(event) {
    if (event == "Yes") {
      console.log("Permitted");
      fetch(
        base + `/apiv2/deleteProductSpecificationName/?id=${this.state.specId}`,
        {
          method: "GET",
          headers: { Authorization: "Atiq " + cookie.load("token") },
        }
      )
        .then((res) => {
          console.log(res);
          return res.json();
        })
        .then((infos) => {
          console.log("Data : ", infos);

          if (infos.success == true) {
            ToastsStore.success(infos.message);
            setTimeout(
              function () {
                window.location = "/product/products-specifications";
              }.bind(this),
              1000
            );
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
              setTimeout(() => {
                this.setState({
                  small: !this.state.small,
                });
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
  }

  render() {
    return (
      <Row>
        <ToastsContainer store={ToastsStore} />
        <Col xs="12" md="6">
          <Card>
            <CardHeader>
              {this.state.isUpdateClicked == true ? (
                <strong>Update Product Specification</strong>
              ) : (
                <strong>Add Product Specification</strong>
              )}
            </CardHeader>
            <CardBody>
              <Form
                action=""
                method="post"
                onSubmit={this.handleSubmit}
                onChange={this.handleProductChange}
                encType="multipart/form-data"
                className="form-horizontal"
              >
                <FormGroup row>
                  <Col md="3">
                    <Label htmlFor="select">Pick The Specification</Label>
                  </Col>
                  {this.state.isUpdateClicked == true ? (
                    <Col xs="12" md="9">
                      <span style={{ marginLeft: "30px" }}>
                        {" "}
                        <Input
                          type="radio"
                          name="specification"
                          value="Color"
                          checked={
                            this.state.specification == "Color"
                              ? this.state.isChecking
                              : ""
                          }
                        />{" "}
                        Color
                      </span>

                      <span style={{ marginLeft: "30px" }}>
                        {" "}
                        <Input
                          type="radio"
                          name="specification"
                          value="Size"
                          checked={
                            this.state.specification == "Size"
                              ? this.state.isChecking
                              : ""
                          }
                        />{" "}
                        Size
                      </span>

                      <span style={{ marginLeft: "30px" }}>
                        {" "}
                        <Input
                          type="radio"
                          name="specification"
                          value="Weight"
                          checked={
                            this.state.specification == "Weight"
                              ? this.state.isChecking
                              : ""
                          }
                        />{" "}
                        Weight
                      </span>
                    </Col>
                  ) : (
                    <Col xs="12" md="9">
                      <span style={{ marginLeft: "30px" }}>
                        {" "}
                        <Input
                          type="radio"
                          name="specification"
                          value="Color"
                        />
                        Color
                      </span>

                      <span style={{ marginLeft: "30px" }}>
                        {" "}
                        <Input type="radio" name="specification" value="Size" />
                        Size
                      </span>

                      <span style={{ marginLeft: "30px" }}>
                        {" "}
                        <Input
                          type="radio"
                          name="specification"
                          value="Weight"
                        />
                        Weight
                      </span>
                    </Col>
                  )}
                </FormGroup>

                <>
                  {this.state.specification == "Size" ? (
                    <FormGroup row>
                      <Col md="3">
                        <Label htmlFor="categoryId">Size Type</Label>
                      </Col>
                      <Col xs="12" md="9">
                        <Input
                          type="select"
                          name="specificationType"
                          id="specificationType"
                          value={this.state.specificationType}
                        >
                          <option value="0">Please select</option>
                          {this.state.sizeType.map((sizeTypeValue, key) => (
                            <option value={sizeTypeValue.id}>
                              {" "}
                              {sizeTypeValue.name}{" "}
                            </option>
                          ))}
                        </Input>
                      </Col>
                    </FormGroup>
                  ) : null}

                  {this.state.specification == "Weight" ? (
                    <FormGroup row>
                      <Col md="3">
                        <Label htmlFor="categoryId">Weight Type</Label>
                      </Col>
                      <Col xs="12" md="9">
                        <Input
                          type="select"
                          name="specificationType"
                          id="specificationType"
                          value={this.state.specificationType}
                        >
                          <option value="0">Please select</option>
                          {this.state.weightType.map((weightTypeValue, key) => (
                            <option value={weightTypeValue.id}>
                              {" "}
                              {weightTypeValue.name}{" "}
                            </option>
                          ))}
                        </Input>
                      </Col>
                    </FormGroup>
                  ) : null}
                </>

                <FormGroup row>
                  <Col md="3">
                    <Label htmlFor="categoryId">Product Category</Label>
                  </Col>
                  <Col xs="12" md="9">
                    <Input
                      type="select"
                      name="categoryId"
                      id="categoryId"
                      // value={this.state.categoryId}
                      value={this.state.selectedProductCategoryIds}
                      onChange={this.handleMultipleSelectChange}
                      multiple
                      style={{ height: "30vh" }}
                    >
                      <option value="0">All Categories</option>
                      {this.state.productsCategory.map(
                        (productsCategoryValue, key) => (
                          <option value={key} key={key}>
                            {" "}
                            {productsCategoryValue}{" "}
                          </option>
                        )
                      )}
                    </Input>
                  </Col>
                </FormGroup>

                <FormGroup row>
                  <Col md="3">
                    <Label htmlFor="select">Status</Label>
                  </Col>
                  <Col xs="12" md="9">
                    <Input type="select" name="select" id="select">
                      <option value="2">Active</option>
                      <option value="3">Inactive</option>
                    </Input>
                  </Col>
                </FormGroup>
                <center>
                  {this.state.isUpdateClicked == true ? (
                    <Button type="submit" size="sm" color="success">
                      <i className="fa fa-dot-circle-o"></i> Update
                    </Button>
                  ) : (
                    <Button type="submit" size="sm" color="success">
                      <i className="fa fa-dot-circle-o"></i> Submit
                    </Button>
                  )}
                  &nbsp;
                  <Button
                    type="reset"
                    size="sm"
                    color="danger"
                    onClick={this.handleReset}
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
              <i className="fa fa-align-justify"></i> Product Specification List
            </CardHeader>
            <CardBody>
              <Table responsive bordered>
                <thead>
                  <tr>
                    <th>Specification Type</th>
                    <th>Specification Name</th>
                    <th>Product Category</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.productsSpecificationDetails.map(
                    (productsSpecificationDetailsValue, key) => (
                      <tr key={key}>
                        <td>
                          {productsSpecificationDetailsValue.specification_type}
                        </td>
                        <td>
                          {productsSpecificationDetailsValue.specification_name}
                        </td>
                        <td>
                          {productsSpecificationDetailsValue.category_name}
                        </td>
                        <td>
                          <center>
                            <a href="#">
                              <i
                                className="fa fa-edit fa-lg"
                                title="Edit Details Info"
                                aria-hidden="true"
                                style={{ color: "#009345" }}
                                data-id={productsSpecificationDetailsValue.id}
                                onClick={this.handleGetEditForm.bind(this)}
                              ></i>
                            </a>
                            &nbsp;
                            <a
                              href="#"
                              onClick={this.deleteItem.bind(this)}
                              id="deleteIds"
                              ref="dataIds"                      
                              data-id={productsSpecificationDetailsValue.id}
                            >
                              <i
                                className="fa fa-trash fa-lg"
                                title="Delete colors"
                                aria-hidden="true"
                                style={{ color: "#EB1C22" }}
                              ></i>
                            </a>
                          </center>
                        </td>
                      </tr>
                    )
                  )}
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
            Delete Product Specification
          </ModalHeader>
          <ModalBody>Are You Sure To Delete This Specification ?</ModalBody>
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

export default ProductSpecifications;
