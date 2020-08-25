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

    this.toggleCourierView = this.toggleCourierView.bind(this);
    this.cancelCourierOrder = this.cancelCourierOrder.bind(this);
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
      fetch(
        base + `/api/vendor_sales_courier_info?id=${localStorage.employee_id}`,
        {
          method: "GET",
        }
      )
        .then((res) => {
          console.log(res);
          return res.json();
        })
        .then((sales) => {
          console.log("Sales : ", sales.sales);

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

          const url = `${ecourier_api_url}/track`;
          sales.sales.forEach((item) => {
            const data = JSON.stringify({
              ecr: item.courier_order_code,
            });
            axios.post(url, data, options).then((res) => {
              item.status = res.data.query_data.status[0].status;
              item.time = this.formatDate(res.data.query_data.status[0].time);
              this.setState({
                sales: sales.sales,
              });
            });
          });


          console.log(this.state.sales);

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

  formatDate(string){
    var options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(string).toLocaleDateString([],options);
  }

  toggleCourierView(event) {
    this.setState({
      sales_id: event.currentTarget.dataset["id"] || 0,
      courierModal: !this.state.courierModal,
    });
    return;
  }

  async cancelCourierOrder(event) {
    const sales_id = this.state.sales_id;

    const saleProductCustomerDetails = await axios.get(
      `${base}/api/getSaleProductCustomerDetails/${sales_id}`
    );

    if (saleProductCustomerDetails.data.length == 0) {
      ToastsStore.warning("Order Not Found !!");
      return;
    }

    const courier_order_code =
      saleProductCustomerDetails.data[0].courier_order_code;

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

    const url = `${ecourier_api_url}/cancel-order`;
    const data = JSON.stringify({
      tracking: courier_order_code,
      comment: "cancel comment",
    });
    const ecourierOrderPlace = await axios.post(url, data, options);
    if (ecourierOrderPlace.status != 200) {
      ToastsStore.warning("Order Cancel Failed !!");
      return;
    }

    this.setState({
      courierModal: false,
    });
    ToastsStore.success("Courier Order cancelled Successfully !!");
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
                  <i className="fa fa-align-justify"></i> Delivery Status
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
                    <th>Courier Partner</th>
                    <th>Courier Code</th>

                    <th>Status</th>
                    <th>Time</th>
                    <th>Cancel</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.sales.map((sales_info, key) => (
                    <tr key={key}>
                      <td>{sales_info.sales_bill_no}</td>
                      <td>{sales_info.sales_date}</td>
                      <td>{sales_info.courier_partner}</td>
                      <td>{sales_info.courier_order_code}</td>
                      <td>{sales_info.status}</td>
                      <td>{sales_info.time}</td>

                      <td>
                        <center>
                          <a href="#">
                            <i
                              className="fa fa-ban fa-lg"
                              data-id={sales_info.id}
                              data-info={"eidt_info"}
                              data-viewclicked={"viewclicked"}
                              title="Cancel Courier Order"
                              aria-hidden="true"
                              style={{ color: "#009345" }}
                              onClick={this.toggleCourierView.bind(this)}
                            ></i>
                          </a>
                        </center>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </Col>

        {/* COURIER MODAL  */}
        <Modal
          isOpen={this.state.courierModal}
          toggle={this.toggleCourierView}
          className={"modal-lg " + this.props.className}
        >
          <ModalHeader toggle={this.toggleCourierView}>
            Cancel Courier Order
          </ModalHeader>
          <ModalBody>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div style={{ padding: "2px" }}>
                <Button
                  color="success"
                  onClick={this.cancelCourierOrder.bind(this)}
                >
                  Confirm
                </Button>
              </div>
            </div>
          </ModalBody>
        </Modal>
      </Row>
    );
  }
}

export default SalesReturn;
