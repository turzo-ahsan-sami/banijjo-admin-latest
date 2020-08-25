import React, { Component } from "react";
import ReactDOM from "react-dom";
import { ToastsContainer, ToastsStore } from "react-toasts";
import cookie from "react-cookies";
import axios from "axios";
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
  ListGroupItem,
} from "reactstrap";

const base = process.env.REACT_APP_ADMIN_SERVER_URL;
const ecourier_api_key = process.env.REACT_APP_ECOURIER_API_KEY;
const ecourier_api_secret = process.env.REACT_APP_ECOURIER_API_SECRET;
const ecourier_user_id = process.env.REACT_APP_ECOURIER_USERID;
const ecourier_content_type = process.env.REACT_APP_ECOURIER_CONTENT_TYPE;
const ecourier_api_url = process.env.REACT_APP_ECOURIER_API_URL;

class SalesReturn extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modal: false,
      large: false,
      courierModal: false,

      sales_id: 0,

      tags: "",
      collapse: true,
      fadeIn: true,
      timeout: 300,
      userName: "",
      currentDate: "",
      sales: [],
      product_info: [],
      editID: 0,
      customer_info: [],
      employee_id: 0,
      vendor_id: 0,
      sales_info: "",
      serialNo: 0,
    };

    this.toggleLargeView = this.toggleLargeView.bind(this);
    this.toggleCourierView = this.toggleCourierView.bind(this);
    this.sendToECourier = this.sendToECourier.bind(this);
  }

  componentDidMount() {
    const userName = localStorage.getItem("userName");
    const userPassword = localStorage.getItem("userPassword");

    this.state.userName = userName;

    let tempDate = new Date();
    let date =
      tempDate.getFullYear() +
      "-" +
      (tempDate.getMonth() + 1) +
      "-" +
      tempDate.getDate();

    this.state.currentDate = date;

    if (userName === null && userPassword === null) {
      this.props.history.push("/login");
    }

    if (localStorage.user_type === "vendor") {
      fetch(base + `/api/vendor_sales_info?id=${localStorage.employee_id}`, {
        method: "GET",
      })
        .then((res) => {
          console.log(res);
          return res.json();
        })
        .then((sales) => {
          console.log("Sales : ", sales.sales);

          this.setState({
            sales: sales.sales,
          });

          return false;
        });
    } else if (
      localStorage.user_type != "vendor" &&
      localStorage.user_type != "delivery_man"
    ) {
      fetch(base + "/api/sales_info", {
        method: "GET",
      })
        .then((res) => {
          console.log(res);
          return res.json();
        })
        .then((sales) => {
          console.log("Sales : ", sales.sales);

          this.setState({
            sales: sales.sales,
          });

          return false;
        });
    }
  }

  toggleLarge(event, value) {
    console.log("Event value : ", event);

    if (event === "Yes") {
      // this.setState({
      //     large: !this.state.large,
      // });
      if (localStorage.user_type === "vendor") {
        fetch(base + "/api/accept_sale", {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify(this.state),
        })
          .then((res) => {
            return res.json();
          })
          .then((sales) => {
            console.log(sales);
            if (sales.success === true) {
              ToastsStore.success("Sales Confirmed !!");

              setTimeout(() => {
                this.setState({
                  product_info: [],
                  customer_info: [],
                  editID: 0,
                  large: !this.state.large,
                });

                window.location = "/sales/sales";
              }, 1000);
            } else {
              ToastsStore.warning("Sales Confirmation Failed !!");
            }

            return false;
          });
      } else {
        fetch(base + "/api/confirm_sale", {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify(this.state),
        })
          .then((res) => {
            return res.json();
          })
          .then((sales) => {
            console.log(sales);
            if (sales.success === true) {
              ToastsStore.success("Sales Confirmed !!");

              setTimeout(() => {
                this.setState({
                  product_info: [],
                  customer_info: [],
                  editID: 0,
                  large: !this.state.large,
                });

                window.location = "/sales/sales";
              }, 1000);
            } else {
              ToastsStore.warning("Sales Confirmation Failed !!");
            }

            return false;
          });
      }
    } else if (event === "Yes accept") {
      console.log("admin accepted the product as vendor_id", value);

      fetch(
        base +
          `/api/accept_sale_by_admin?editID=${this.state.editID}&vendor_id=${value}`,
        {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify(this.state),
        }
      )
        .then((res) => {
          return res.json();
        })
        .then((sales) => {
          console.log(sales);
          if (sales.success === true) {
            ToastsStore.success("Sales Confirmed !!");

            setTimeout(() => {
              this.setState({
                product_info: [],
                customer_info: [],
                editID: 0,
                large: !this.state.large,
              });

              window.location = "/sales/sales";
            }, 1000);
          } else {
            ToastsStore.warning("Sales Confirmation Failed !!");
          }

          return false;
        });
    } else if (event === "Yes processing vendor") {
      fetch(
        base +
          `/api/processing_sale?editID=${this.state.editID}&vendor_id=${value}`,
        {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify(this.state),
        }
      )
        .then((res) => {
          return res.json();
        })
        .then((sales) => {
          console.log(sales);
          if (sales.success === true) {
            ToastsStore.success("Processing Confirmed !!");

            setTimeout(() => {
              this.setState({
                product_info: [],
                customer_info: [],
                editID: 0,
                large: !this.state.large,
              });

              window.location = "/sales/sales";
            }, 1000);
          } else {
            ToastsStore.warning("Failed !!");
          }

          return false;
        });
    } else if (event === "Yes processing") {
      fetch(
        base +
          `/api/processing_sale?editID=${this.state.editID}&vendor_id=${value}`,
        {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify(this.state),
        }
      )
        .then((res) => {
          return res.json();
        })
        .then((sales) => {
          console.log(sales);
          if (sales.success === true) {
            ToastsStore.success("Processing Confirmed !!");

            setTimeout(() => {
              this.setState({
                product_info: [],
                customer_info: [],
                editID: 0,
                large: !this.state.large,
              });

              window.location = "/sales/sales";
            }, 1000);
          } else {
            ToastsStore.warning("Failed !!");
          }

          return false;
        });
    } else if (event === "Yes ready to deliver") {
      fetch(
        base +
          `/api/ready_to_deliver_sale?editID=${this.state.editID}&vendor_id=${value}`,
        {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify(this.state),
        }
      )
        .then((res) => {
          return res.json();
        })
        .then((sales) => {
          console.log(sales);
          if (sales.success === true) {
            ToastsStore.success("Ready To Delivery Confirmed !!");

            setTimeout(() => {
              this.setState({
                product_info: [],
                customer_info: [],
                editID: 0,
                large: !this.state.large,
              });

              window.location = "/sales/sales";
            }, 1000);
          } else {
            ToastsStore.warning("Failed !!");
          }

          return false;
        });
    } else if (event === "Yes on going") {
      fetch(
        base +
          `/api/on_going_sale?editID=${this.state.editID}&vendor_id=${value}`,
        {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify(this.state),
        }
      )
        .then((res) => {
          return res.json();
        })
        .then((sales) => {
          console.log(sales);
          if (sales.success === true) {
            ToastsStore.success("On Going Confirmed !!");

            setTimeout(() => {
              this.setState({
                product_info: [],
                customer_info: [],
                editID: 0,
                large: !this.state.large,
              });

              window.location = "/sales/sales";
            }, 1000);
          } else {
            ToastsStore.warning("Failed !!");
          }

          return false;
        });
    } else if (event === "Yes delivered") {
      fetch(
        base +
          `/api/delivered_sale?editID=${this.state.editID}&vendor_id=${value}`,
        {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify(this.state),
        }
      )
        .then((res) => {
          return res.json();
        })
        .then((sales) => {
          console.log(sales);
          if (sales.success === true) {
            ToastsStore.success("Delivered Confirmed !!");

            setTimeout(() => {
              this.setState({
                product_info: [],
                customer_info: [],
                editID: 0,
                large: !this.state.large,
              });

              window.location = "/sales/sales";
            }, 1000);
          } else {
            ToastsStore.warning("Failed !!");
          }

          return false;
        });
    } else if (event === "Yes returned") {
      fetch(
        base +
          `/api/returned_sale?editID=${this.state.editID}&vendor_id=${value}`,
        {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify(this.state),
        }
      )
        .then((res) => {
          return res.json();
        })
        .then((sales) => {
          console.log(sales);
          if (sales.success === true) {
            ToastsStore.success("Returned Confirmed !!");

            setTimeout(() => {
              this.setState({
                product_info: [],
                customer_info: [],
                editID: 0,
                large: !this.state.large,
              });

              window.location = "/sales/sales";
            }, 1000);
          } else {
            ToastsStore.warning("Failed !!");
          }

          return false;
        });
    } else if (event === "No") {
      this.setState({
        product_info: [],
        customer_info: [],
        large: !this.state.large,
      });
    }
  }

  toggleLargeView(event) {
    console.log("Sales Id : ", event.currentTarget.dataset["id"]);
    console.log("Event value : ", event);

    this.setState({
      editID: event.currentTarget.dataset["id"],
      employee_id: localStorage.employee_id,
    });

    fetch(
      base +
        `/api/sales_details_info?id=${event.currentTarget.dataset["id"]}&userId=${localStorage.employee_id}`,
      {
        method: "GET",
      }
    )
      .then((res) => {
        console.log(res);
        return res.json();
      })
      .then((sales) => {
        console.log("Sales Details : ", sales.sales_details);
        console.log("Sales Info : ", sales.sales_info);
        console.log("product_info : ", sales.product_info);
        console.log("customer_info : ", sales.customer_info);

        this.setState({
          product_info: sales.product_info,
          customer_info: sales.customer_info,
          sales_info: sales.sales_info,
          large: !this.state.large,
        });

        return false;
      });
  }

  toggleCourierView(event) {    
    this.setState({
      sales_id : event.currentTarget.dataset["id"] || 0,
      courierModal : !this.state.courierModal,
    });
    return;
  }

  async sendToECourier(event){
    const sales_id = this.state.sales_id;

    const sales_info = await axios.get(
      `${base}/api/get_sales_info/${sales_id}`
    );
    

    const sales_type = sales_info.data.sales[0].sales_type;
    // const netAmount = sales_info.data[0].netAmount;
    // const total_sales_amount = sales_info.data[0].total_sales_amount;
    // const total_sales_quantity = sales_info.data[0].total_sales_quantity;

    const saleProductCustomerDetails = await axios.get(
      `${base}/api/getSaleProductCustomerDetails/${sales_id}`
    );
    if (saleProductCustomerDetails.data.length == 0) {
      ToastsStore.warning("Customer Address Not Found !!"); 
      return;
    }
    
    const customerName = saleProductCustomerDetails.data[0].name;
    const customerEmail = saleProductCustomerDetails.data[0].email;
    const customerPhoneNo = saleProductCustomerDetails.data[0].phone_number;
    const customerAddress = saleProductCustomerDetails.data[0].address;
    const customerCity = saleProductCustomerDetails.data[0].city;
    const customerThana = saleProductCustomerDetails.data[0].thana;
    const customerArea = saleProductCustomerDetails.data[0].area;
    const customerZipcode = saleProductCustomerDetails.data[0].zipcode;
    const total_amount =
      saleProductCustomerDetails.data[0].total_amount;
    const customer_payable_amount =
      saleProductCustomerDetails.data[0].customer_payable_amount;
    const sales_product_quantity =
      saleProductCustomerDetails.data[0].sales_product_quantity;
    const productSpecs = JSON.parse(
      saleProductCustomerDetails.data[0].product_specification_name
    );

    // Ecourier Options
    const options = {
      headers: {
        "API-KEY": ecourier_api_key,
        "API-SECRET": ecourier_api_secret,
        "USER-ID": ecourier_user_id,
        "Content-Type": ecourier_content_type,
        "Access-Control-Allow-Origin": "*",
      },
    };

    let url = `${ecourier_api_url}/packages`;
    let data = JSON.stringify({});
    const packages = await axios.post(url, data, options);
    if (packages.status != 200) {
      ToastsStore.warning("No Package Found !!"); 
      return;
    }

    console.log(
      customerName,
      customerEmail,
      customerPhoneNo,
      customerAddress,
      customerCity,
      customerThana,
      customerArea,
      customerZipcode,
      customer_payable_amount,
      sales_product_quantity,
      productSpecs,
      packages.data
    );

    const package_code = packages.data[0].package_code; // apply condition later
      
    
    url = `${ecourier_api_url}/order-place`;
    data = JSON.stringify({
      recipient_name: customerName,
      recipient_mobile: customerPhoneNo,
      recipient_city: customerCity,
      recipient_thana: customerThana,
      recipient_area: customerArea,
      recipient_address: customerAddress,
      package_code: package_code,
      product_price: total_amount,
      payment_method: sales_type == "cash" ? "COD" : "CCRD",
      recipient_zip: customerZipcode,
      number_of_item: sales_product_quantity,
      actual_product_price: customer_payable_amount,
      // recipient_landmark: "DBBL ATM",
      // pick_address: "Gudaraghat new mobile",
      // parcel_type: "BOX",
      // delivery_hour: "any",
      // requested_delivery_time: "2019-07-05",
      // pick_hub: "3",
      // product_id: "DAFS",
      // comments: "Please handle carefully",
    });
    const ecourierOrderPlace = await axios.post(url, data, options);
    if (ecourierOrderPlace.status != 200) { 
      ToastsStore.warning("Order Place Failed !!"); 
      return; 
    }
    const orderId = ecourierOrderPlace.data.ID;
    const courier_partner = "ecourier";

    const updateSalesDetailsForCourier = await axios.get(
      `${base}/api/updateSalesDetailsForCourier/${sales_id}/${orderId}/${courier_partner}`
    );
    
    this.setState({
      courierModal : false
    });
    ToastsStore.success("Order Placed for Courier Successfully !!");
  }

  render() {
    return (
      <Row>
        <ToastsContainer store={ToastsStore} />

        <Col xs="12" md="12">
          <Card>
            <CardHeader>
              {/* <i className="fa fa-align-justify"></i> Product Specification List */}
              <Row>
                <Col md="6">
                  <i className="fa fa-align-justify"></i> Sales Info
                </Col>
                <Col md="6"></Col>
              </Row>
            </CardHeader>
            <CardBody>
              <Table responsive bordered>
                <thead>
                  <tr>
                    <th>Sales Bill No</th>
                    <th>Sales Date</th>
                    <th>Quantity</th>
                    <th>Total Amount</th>
                    <th>Discount</th>
                    <th>Promo code</th>
                    <th>Sales Type</th>
                    <th>EMI</th>
                    <th>Confirmation</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.sales.map((sales_info, key) => (
                    <tr key={key}>
                      <td>{sales_info.sales_bill_no}</td>
                      <td>{sales_info.sales_date}</td>
                      <td>{sales_info.total_sales_quantity}</td>
                      <td>{sales_info.total_sales_amount}</td>
                      <td>{sales_info.discount_amount}</td>
                      <td>
                        {localStorage.user_type != "vendor"
                          ? sales_info.promo_code
                          : null}
                      </td>
                      <td>{sales_info.sales_type}</td>
                      <td>{sales_info.isEMI}</td>
                      <td>
                        {sales_info.isConfirmed === "False" ? (
                          <center>
                            {" "}
                            <i
                              className="fa fa-times fa-lg"
                              style={{ color: "red" }}
                            ></i>{" "}
                          </center>
                        ) : (
                          <center>
                            {" "}
                            <i
                              className="fa fa-check fa-lg"
                              style={{ color: "#009345" }}
                            ></i>{" "}
                          </center>
                        )}
                      </td>
                      <td>
                        {sales_info.isConfirmed === "False" ? (
                          <center>
                            <a href="#">
                              <i
                                className="fa fa-info-circle fa-lg"
                                data-id={sales_info.id}
                                data-info={"eidt_info"}
                                data-viewclicked={"viewclicked"}
                                title="View Details Info"
                                aria-hidden="true"
                                style={{ color: "#009345" }}
                                onClick={this.toggleLargeView.bind(this)}
                              ></i>
                            </a>
                          </center>
                        ) : (
                          <center>
                            {" "}
                            <i
                              className="fa fa-truck fa-lg"
                              title="Send to Courier Partner"
                              aria-hidden="true"
                              style={{ color: "#009345" }}
                              data-id={sales_info.id}
                              onClick={this.toggleCourierView.bind(this)}
                            ></i>{" "}
                          </center>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </Col>

        {/* CONFIRMATION WINDOW */}

        <Modal
          isOpen={this.state.large}
          toggle={this.toggleLarge}
          className={"modal-lg " + this.props.className}
        >
          <ModalHeader toggle={this.toggleLarge}>
            {" "}
            {localStorage.user_type != "vendor"
              ? "Confirm Sell"
              : "Accept Sell"}{" "}
          </ModalHeader>
          <ModalBody>
            <div>
              <div style={{ backgroundColor: "#D6D4D4" }}>
                <h4 style={{ marginLeft: "15px", paddingTop: "12px" }}>
                  Customer Info
                </h4>
                <hr />
                {/* <table style={{marginLeft: "30px"}}> */}
                <Table responsive bordered>
                  <tr>
                    <td>Name </td>
                    <td>{this.state.customer_info.name}</td>
                  </tr>
                  <tr>
                    <td>Email </td>
                    <td>{this.state.customer_info.email}</td>
                  </tr>
                  <tr>
                    <td>Phone Number </td>
                    <td>{this.state.customer_info.phone_number}</td>
                  </tr>
                  <tr>
                    <td>Address </td>
                    <td>{this.state.customer_info.address}</td>
                  </tr>
                </Table>
              </div>

              <hr />
              <div style={{ backgroundColor: "#D6D4D4" }}>
                <h4 style={{ marginLeft: "15px" }}>Order Info</h4>
              </div>

              <div>
                <Table responsive bordered>
                  <tr>
                    <td>Bill No </td>
                    <td>{this.state.sales_info.sales_bill_no}</td>
                  </tr>
                  <tr>
                    <td>Date </td>
                    <td>{this.state.sales_info.sales_date}</td>
                  </tr>
                  <tr>
                    <td>Transaction Type</td>
                    <td>{this.state.sales_info.sales_type}</td>
                  </tr>
                </Table>
              </div>

              <div style={{ backgroundColor: "#D6D4D4" }}>
                <h4 style={{ marginLeft: "15px" }}>Product Info</h4>
              </div>

              <Table responsive bordered>
                <tr>
                  <td>SL</td>
                  <td>Product Name</td>
                  <td>Details</td>
                  <td>Quantity</td>
                  <td>Unite Price</td>
                  <td>Discount Amount</td>
                  <td>Total Price</td>
                  <td>Delivery Charge</td>
                  <td>Accepted</td>
                </tr>
                <tbody>
                  {this.state.product_info.map((productValue, key) => (
                    <React.Fragment>
                      <tr>
                        <td>{++this.state.serialNo}</td>
                        <td>{productValue.product_name}</td>
                        <td>
                          <strong>Brand:</strong> {productValue.brand} <br />
                          <strong>Color:</strong> {productValue.color} <br />
                          <strong>Size:</strong> {productValue.size}
                        </td>
                        <td>{productValue.sales_product_quantity}</td>
                        <td>{productValue.unitPrice}</td>
                        <td>{productValue.discounts_amount}</td>
                        <td>{productValue.total_amount}</td>
                        <td>{productValue.deliveryCharge}</td>
                        <td
                          style={{
                            color:
                              productValue.is_accepted === "False"
                                ? "red"
                                : "green",
                          }}
                        >
                          {" "}
                          {productValue.is_accepted === "True"
                            ? "Yes"
                            : "No"}{" "}
                        </td>
                      </tr>
                      <tr>
                        <td colSpan="9" style={{ textAlign: "right" }}>
                          {productValue.user_type === "admin" ? (
                            productValue.is_accepted === "True" ? (
                              productValue.delivery_status === "sold" ? (
                                <Button
                                  color="success"
                                  onClick={(e) => {
                                    this.toggleLarge(
                                      "Yes processing",
                                      productValue.vendor_id
                                    );
                                  }}
                                >
                                  Processing
                                </Button>
                              ) : null
                            ) : (
                              <Button
                                color="success"
                                onClick={(e) => {
                                  this.toggleLarge(
                                    "Yes accept",
                                    productValue.vendor_id
                                  );
                                }}
                              >
                                Accept
                              </Button>
                            )
                          ) : null}
                          {productValue.user_type === "admin_manager" ? (
                            productValue.is_accepted === "True" ? (
                              productValue.delivery_status === "sold" ? (
                                <Button
                                  color="success"
                                  onClick={(e) => {
                                    this.toggleLarge(
                                      "Yes processing",
                                      productValue.vendor_id
                                    );
                                  }}
                                >
                                  Processing
                                </Button>
                              ) : null
                            ) : (
                              <Button
                                color="success"
                                onClick={(e) => {
                                  this.toggleLarge(
                                    "Yes accept",
                                    productValue.vendor_id
                                  );
                                }}
                              >
                                Accept
                              </Button>
                            )
                          ) : null}
                          {productValue.user_type === "vendor" ? (
                            productValue.is_accepted === "True" ? (
                              productValue.delivery_status === "sold" ? (
                                <Button
                                  color="success"
                                  onClick={(e) => {
                                    this.toggleLarge(
                                      "Yes processing vendor",
                                      productValue.vendor_id
                                    );
                                  }}
                                >
                                  Processing
                                </Button>
                              ) : null
                            ) : (
                              <Button
                                color="success"
                                onClick={(e) => {
                                  this.toggleLarge("Yes", "");
                                }}
                              >
                                Accept
                              </Button>
                            )
                          ) : null}
                          {productValue.delivery_status === "processing" ? (
                            <Button
                              color="success"
                              onClick={(e) => {
                                this.toggleLarge(
                                  "Yes ready to deliver",
                                  productValue.vendor_id
                                );
                              }}
                            >
                              Ready To Deliver
                            </Button>
                          ) : null}
                          {productValue.delivery_status ===
                          "ready to deliver" ? (
                            <Button
                              color="success"
                              onClick={(e) => {
                                this.toggleLarge(
                                  "Yes on going",
                                  productValue.vendor_id
                                );
                              }}
                            >
                              On Going
                            </Button>
                          ) : null}
                          {productValue.delivery_status === "on going" ? (
                            <Button
                              color="success"
                              onClick={(e) => {
                                this.toggleLarge(
                                  "Yes delivered",
                                  productValue.vendor_id
                                );
                              }}
                            >
                              Deliverd
                            </Button>
                          ) : null}{" "}
                          {productValue.delivery_status === "on going" ? (
                            <Button
                              color="danger"
                              onClick={(e) => {
                                this.toggleLarge(
                                  "Yes returned",
                                  productValue.vendor_id
                                );
                              }}
                            >
                              Returned
                            </Button>
                          ) : null}
                        </td>
                      </tr>
                    </React.Fragment>
                  ))}
                </tbody>
              </Table>
            </div>
          </ModalBody>
          <ModalFooter>
            {localStorage.user_type != "vendor" ? (
              <Button
                color="success"
                onClick={(e) => {
                  this.toggleLarge("Yes", "");
                }}
              >
                Yes
              </Button>
            ) : null}{" "}
            <Button
              color="danger"
              onClick={(e) => {
                this.toggleLarge("No", "");
              }}
            >
              No
            </Button>
          </ModalFooter>
        </Modal>

        {/* COURIER MODAL  */}
        <Modal
          isOpen={this.state.courierModal}
          toggle={this.toggleCourierView}
          className={"modal-lg " + this.props.className}
        >
          <ModalHeader toggle={this.toggleCourierView}>
            Send to Courier
          </ModalHeader>
          <ModalBody>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div style={{ padding: "2px" }}>
                <Button
                  color="success"
                  onClick={this.sendToECourier.bind(this)}                  
                >
                  e-Courier
                </Button>
              </div>
              <div style={{ padding: "2px" }}>
                <Button color="success" disabled>DHL</Button>
              </div>
              <div style={{ padding: "2px" }}>
                <Button color="success" disabled>Pathao Courier</Button>
              </div>
              <div style={{ padding: "2px" }}>
                <Button color="success" disabled>Shohoz</Button>
              </div>
            </div>
          </ModalBody>
        </Modal>
      </Row>
    );
  }
}

export default SalesReturn;

/*
SELECT 
sales.id AS id, sales.sales_bill_no AS sales_bill_no, sales.sales_type, sales.sales_date AS sales_date, sales.isConfirmed AS isConfirmed, sales.isEMI AS isEMI,
sales_details.sales_product_quantity AS total_sales_quantity, sales_details.total_amount AS total_sales_amount, sales_details.discounts_amount AS discount_amount, 

FROM sales 
JOIN sales_details 
ON sales.id = sales_details.salesBillId 
JOIN products 
ON sales_details.productId = products.id 

WHERE sales.softDel = 0 AND sales.status = 1 AND sales.isConfirmed = 2 AND products.vendor_id = '+req.query.id+' AND entry_user_type = "vendor"'
*/
