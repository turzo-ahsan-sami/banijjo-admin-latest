import React, { Component } from 'react';
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

import Dropdowns from '../../Base/Dropdowns';

class SoldProductsList extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.toggleFade = this.toggleFade.bind(this);
    this.state = {
      collapse: true,
      fadeIn: true,
      timeout: 300
    };
  }

  componentDidMount () {
    const userName = localStorage.getItem('userName');
    const userPassword = localStorage.getItem('userPassword');
    if(userName===null && userPassword === null)
    {
      this.props.history.push("/login");
    }
  }

  toggle() {
    this.setState({ collapse: !this.state.collapse });
  }

  toggleFade() {
    this.setState((prevState) => { return { fadeIn: !prevState }});
  }
  render() {

    return (
      <Row>
        <Col md="12">
          <Card>
            <CardHeader>

              <Row>
                <Col md="6"><i className="fa fa-align-justify"></i> Product List</Col>
                <Col md="6"><Dropdowns/></Col>
              </Row>
              
            </CardHeader>
            <CardBody>
              <Table responsive bordered>
                <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Product Category</th>
                  <th>Sold Date</th>
                  <th>Delivery Status</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <td>Pompeius René</td>
                  <td>N/A</td>
                  <td>2012/01/21</td>
                  <td>
                    <Badge color="success">Delivered</Badge>
                  </td>
                </tr>
                <tr>
                  <td>Paĉjo Jadon</td>
                  <td>N/A</td>
                  <td>2012/01/21</td>
                  <td>
                    <Badge color="success">Delivered</Badge>
                  </td>
                </tr>
                <tr>
                  <td>Micheal Mercurius</td>
                  <td>N/A</td>
                  <td>2012/01/21</td>
                  <td>
                    <Badge color="secondary">On Going</Badge>
                  </td>
                </tr>
                <tr>
                  <td>Ganesha Dubhghall</td>
                  <td>N/A</td>
                  <td>2012/01/21</td>
                  <td>
                    <Badge color="warning">In House</Badge>
                  </td>
                </tr>
                <tr>
                  <td>Hiroto Šimun</td>
                  <td>N/A</td>
                  <td>2012/01/21</td>
                  <td>
                    <Badge color="success">Delivered</Badge>
                  </td>
                </tr>
                </tbody>
              </Table>
              <Pagination>
                <PaginationItem><PaginationLink previous tag="button">Prev</PaginationLink></PaginationItem>
                <PaginationItem active>
                  <PaginationLink tag="button">1</PaginationLink>
                </PaginationItem>
                <PaginationItem className="page-item"><PaginationLink tag="button">2</PaginationLink></PaginationItem>
                <PaginationItem><PaginationLink tag="button">3</PaginationLink></PaginationItem>
                <PaginationItem><PaginationLink tag="button">4</PaginationLink></PaginationItem>
                <PaginationItem><PaginationLink next tag="button">Next</PaginationLink></PaginationItem>
              </Pagination>
            </CardBody>
          </Card>
        </Col>
    </Row>
    
    )
  }
}



export default SoldProductsList;
