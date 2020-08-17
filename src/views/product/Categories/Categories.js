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
} from 'reactstrap';
const base = process.env.REACT_APP_ADMIN_SERVER_URL;

class Categories extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.toggleFade = this.toggleFade.bind(this);
    this.state = {
      productsCategory: [],
      productsSpecialCategory: [],
      collapse: true,
      fadeIn: true,
      timeout: 300,
      modal: false,
      small: false,
      categoryDeleteId: 0,

      categoryName: '',
      parentCategory: '',
      categoryDescription: '',
      isActive: '',
      isUpdateClicked: false,
      categoryID: ''
    };

    this.handleGet = this.handleGet.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.toggleSmall = this.toggleSmall.bind(this);

    this.handleGetEditForm = this.handleGetEditForm.bind(this);

  }

  componentDidMount() {
    console.log('component mount executed');

    const userName = localStorage.getItem('userName');
    const userPassword = localStorage.getItem('userPassword');
    if(userName===null && userPassword === null)
    {
      this.props.history.push("/login");
    }

    fetch(base+'/api/categories', {
      method: 'GET'
    })
    .then(res => {
      console.log(res);
      return res.json()
    })
    .then(users => {
      console.log(users.data);
      this.setState({
        productsCategory : users.data
      })
      return false;
    });

    fetch(base+'/api/specialCategoryListForCategory', {
      method: 'GET'
    })
    .then(res => {
      console.log(res);
      return res.json()
    })
    .then(category => {
      console.log(category.data);

      let categoryList = [];

      for ( let i = 0; i < category.data.length; i++) {
        if (category.data[i] != null) {
          categoryList[i] = category.data[i];
        }
      }

      console.log('Category List : ', categoryList);

      this.setState({
        productsSpecialCategory : categoryList
      });
      console.log('Special Category : ', this.state.productsSpecialCategory);
      return false;
    });
  }

  handleReset () {
      window.location = '/category/categories';
  }

  toggleSmall(event) {
    if (event == 'Yes') {
      console.log('Permitted');
      fetch(base+`/api/deleteCategory/?id=${this.state.categoryDeleteId}`, {
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
            window.location = '/category/categories';
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
            ToastsStore.warning("Category Info deletion Faild. Please try again !!");
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

  handleGet(event) {
    fetch(base+'/api/categories', {
      method: 'GET'
    })
    .then(res => {
      console.log(res);
      return res.json()
    })
    .then(users => {
      console.log(users.data);
      this.setState({ users })
      return false;
    });
    // .then(console.log(response));
  }

  handleGetEditForm (event) {
      console.log('Edit form called and id : ', event.currentTarget.dataset['id']);

      this.setState({
          categoryID: event.currentTarget.dataset['id']
      })

      fetch(base+`/api/get-category-for-edit/?id=${event.currentTarget.dataset['id']}`, {
        method: 'GET'
      })
      .then(res => {
        console.log(res);
        return res.json()
      })
      .then(user => {
        console.log(user.data);

        this.setState({
            categoryName: user.data[0].category_name,
            parentCategory: user.data[0].parent_category_id,
            categoryDescription: user.data[0].description,
            isActive: user.data[0].status,
            isUpdateClicked: true
        });

        return false;
      });
  }

  handleSubmit(event) {
    event.preventDefault();
    console.log(this.state.categoryName);

    console.log(this.state);

    const { categoryName, parentCategory, categoryDescription, isActive } = this.state;

    fetch(base+'/api/saveCategory' , {
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
        ToastsStore.success("Category Successfully inserted !!");
        console.log(info.success);

        setTimeout(
          function() {
          // this.props.history.push("/product/vendor");
            window.location = '/category/categories';
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
          ToastsStore.warning("Category Insertion Faild. Please try again !!");
          console.log(info.success);
        }
      }

    })
  }

  handleChange(event) {
    // this.setState({value: event.target.value});
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    // alert(value)
    // alert(name)

    this.setState({
      [name]: value
    });
  }

  toggle() {
    this.setState({ collapse: !this.state.collapse });
  }

  toggleFade() {
    this.setState((prevState) => { return { fadeIn: !prevState }});
  }

  deleteItem (event) {
    console.log('Delete Purchase Id : ', event.currentTarget.dataset['id']);

    this.setState({
      small: !this.state.small,
      categoryDeleteId: event.currentTarget.dataset['id']
    });
  }

  render() {

    return (
      <Row>
      <Col xs="12" md="6">
        <Card>
          <CardHeader>
              {
                  this.state.isUpdateClicked == false ?
                  <strong>Add New Category</strong>
                  :
                  <strong>Edit New Category</strong>
              }
          </CardHeader>
          <ToastsContainer store={ToastsStore}/>
          <CardBody>
            <Form action="" method="post" encType="multipart/form-data" onSubmit={this.handleSubmit} onChange={this.handleChange} className="form-horizontal">

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="categoryName">Category Name</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="text" id="categoryName" name="categoryName" value={this.state.categoryName} required="true" placeholder="Text" />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="parentCategory">Parent Category</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="select" name="parentCategory" id="parentCategory" value={this.state.parentCategory} onChange={this.handleChange}>
                    <option value="0">Please select</option>
                    {
                      this.state.productsSpecialCategory.map((productsCategoryValue, key) =>
                        // productsCategory.parent_category_id == productsCategoryValue.id ? productsCategoryValue.category_name : null
                        <option value={key}> {productsCategoryValue} </option>
                      )
                    }
                  </Input>
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="categoryDescription">Category Description</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="text" id="categoryDescription" name="categoryDescription" value={this.state.categoryDescription} required="true" placeholder="Text" />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="isActive">Status</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="select" name="isActive" id="isActive" value={this.state.isActive} onChange={this.handleChange}>
                    <option value="0">Please select</option>
                    <option value="1">Active</option>
                    <option value="2">Inactive</option>
                  </Input>
                </Col>
              </FormGroup>

              <center>
                  {
                      this.state.isUpdateClicked == false ?
                      <Button type="submit" size="sm" color="success"><i className="fa fa-dot-circle-o"></i> Submit</Button>
                      :
                      <Button type="submit" size="sm" color="success"><i className="fa fa-dot-circle-o"></i> Update</Button>
                  }

                &nbsp;<Button type="reset" size="sm" color="danger" onClick={this.handleReset}><i className="fa fa-ban"></i> Reset</Button>
              </center>


            </Form>
          </CardBody>
          <CardFooter>
          {/* <Button type="submit" size="sm" color="primary"><i className="fa fa-dot-circle-o"></i> Submit</Button>&nbsp;
            <Button type="button" size="sm" color="primary" onClick={this.handleGet}><i className="fa fa-dot-circle-o"></i> Get Data</Button>&nbsp;
            <Button type="reset" size="sm" color="danger"><i className="fa fa-ban"></i> Reset</Button> */}
          </CardFooter>
        </Card>
      </Col>

      <Col xs="12" lg="6">
            <Card>
              <CardHeader>
                <Row>
                  <Col md="6">
                    <i className="fa fa-align-justify"></i> Category List
                  </Col>
                  <Col md="6">
                    {/*<Button type="button" size="sm" color="primary" onClick={this.handleGet}><i className="fa fa-dot-circle-o"></i> Get Data</Button>&nbsp;*/}
                  </Col>
                </Row>
              </CardHeader>

              <CardBody>
                <Table responsive bordered>
                  <thead>
                  <tr>
                    <th>Category Name</th>
                    <th>Parent Category</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                  </thead>
                  <tbody>

                    {
                      this.state.productsCategory.map((productsCategory, key) =>
                        <tr>
                          <td>{productsCategory.category_name}</td>
                          <td>
                          {
                            this.state.productsCategory.map((productsCategoryValue, key) =>
                              productsCategory.parent_category_id == productsCategoryValue.id ? productsCategoryValue.category_name : null
                            )
                          }
                          </td>
                          <td>{productsCategory.description}</td>
                          <td>{productsCategory.status}</td>
                          <td>
                            <center>
                                <a href="#">
                                    <i className="fa fa-edit fa-lg"  title="Edit Category Info" aria-hidden="true" style={{color: '#009345'}} data-id={productsCategory.id} onClick={this.handleGetEditForm.bind(this)} ></i>
                                </a>&nbsp;
                                <a href="#" onClick={this.deleteItem.bind(this)} id="deleteIds" ref="dataIds" data-id={productsCategory.id}>
                                    <i className="fa fa-trash fa-lg" title="Delete Category Details" aria-hidden="true" style={{color: '#EB1C22'}}></i>
                                </a>
                            </center>
                          </td>
                        </tr>
                      )
                    }

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

          <Modal isOpen={this.state.small} toggle={this.toggleSmall}
                 className={'modal-sm ' + this.props.className}>
            <ToastsContainer store={ToastsStore}/>
            <ModalHeader toggle={this.toggleSmall}>Delete Purchase</ModalHeader>
            <ModalBody>
              Are You Sure To Delete This Category ?
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



export default Categories;
