import React, { Component } from 'react';
import {ToastsContainer, ToastsStore} from 'react-toasts';
import ImageUploader from 'react-images-upload';
import axios from 'axios';

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
} from 'reactstrap';
const base = process.env.REACT_APP_ADMIN_SERVER_URL;
const publicUrl = process.env.REACT_APP_PUBLIC_URL;
// const FormData = require('form-data');

class Vendor extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.toggleFade = this.toggleFade.bind(this);
    this.state = {
      vendorList: [],
      pictures: [],
      collapse: true,
      fadeIn: true,
      timeout: 300,
      imageURL:'',
      selectedFile: null,
      vendorImagePreview:''
      // allFilesInfo:[]
    };

    // this.handleSubmit = this.handleSubmit.bind(this);
    this.handleProductChange = this.handleProductChange.bind(this);
    this.handleUploadImage = this.handleUploadImage.bind(this);
    this.onDrop = this.onDrop.bind(this);
  }

  toggle() {
    this.setState({ collapse: !this.state.collapse });
  }

  toggleFade() {
    this.setState((prevState) => { return { fadeIn: !prevState }});
  }

  componentDidMount() {
    fetch(base+'/api/vendor_list_for_product', {
      method: 'GET'
    })
    .then(res => {
      // console.log(res);
      return res.json()
    })
    .then(vendors => {
      console.log(vendors.data);
      this.setState({
        vendorList : vendors.data
      })

      // console.log('Vendor Data : ', this.state.vendorList);
      return false;
    });
  }

  handleProductChange(event) {
    // this.setState({value: event.target.value});
    // alert(event.target.input.files[0]);
    let target = event.target;
    let value = target.type === 'checkbox' ? target.checked : target.value;
    let name = target.name;

    this.setState({
      [name]: value
    });
  }

  onDrop(picture) {

    this.setState({
        pictures: this.state.pictures.concat(picture),
    });

  }

  // handleSubmit (event) {
  //   event.preventDefault();
  //   console.log('submitted value : ', this.state);
  //   console.log('submitted Image : ', this.state.image);
  //   console.log('submitted Image value : ', this.state.pictures[0].path);

  //   // this.setState({
  //   //   pictures: this.state.pictures.concat(this.state.image),
  //   // });

  //   console.log('submitted Picture value : ', this.state.pictures);

  //   fetch('/api/saveVendor' , {
  //     method: "POST",
  //     headers: {
  //       'Content-type': 'application/json'
  //     },
  //     body: JSON.stringify(this.state)
  //   })
  //   .then((result) => result.json())
  //   .then((info) => {
  //     if (info.success == true) {
  //       ToastsStore.success("Vendor Successfully inserted !!");
  //       console.log(info.success);
  //       setTimeout(
  //         function() {
  //         // this.props.history.push("/product/vendor");
  //         window.location = '/product/vendor';
  //         }
  //         .bind(this),
  //         3000
  //       );
  //     }
  //     else {
  //       ToastsStore.warning("Product Insertion Faild. Please try again !!");
  //       console.log(info.success);
  //     }

  //   })
  // }

  handleUploadImage(ev) {
    ev.preventDefault();
    const data = new FormData(ev.target);
    // for (const file of this.state.allFilesInfo) {
    //   data.append('file', file)
    // }
     data.append('file', this.state.selectedFile);
    // data.append('file', this.state.allFilesInfo);
    // console.log(data);
    // fetch('/api/saveVendor', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'multipart/form-data'
    //   },
    //   body: data
    // }).then((response) => {
    //   response.json()
    //   .then((data) => {
    //     console.log(data);
    //     // this.setState({ imageURL: `http://localhost:8000/${body.file}` });
    //   });
    // });

    axios({
      method: 'post',
      url: base+'/api/saveVendor',
      data: data,
      //  headers: FormData.getHeaders()
      })
      .then(function (response) {
          //handle success
        // let  data =  response.json();
        if(response.data.message=="success"){
          ToastsStore.success("Vendor Successfully inserted !!");
                setTimeout(
                  function() {
                  window.location = '/product/vendor';
                  }
                  .bind(this),
                  3000
                );
        }
      })
      .catch(function (response) {
          //handle error
          console.log(response);
      });
  }


  onChangeHandler=event=>{
    // let testFileInfo = {}
    //  testFileInfo.selectedFile = event.target.files[0];
  //   const  fileInput = event.target.files[0];


  //    this.setState({selectedFile:event.target.files[0]})
  //  //  this.state.allFilesInfo.push(event.target.files[0]);
  //  var reader = new FileReader();
  //  reader.onload = (e) => {
  //    this.state.vendorImage = event.target.files[0];
  //  }
  //  reader.readAsDataURL(fileInput);




   let reader = new FileReader();
    let file = event.target.files[0];
    if (!file.name.match(/.(jpg|jpeg|png|gif)$/i)){
      ToastsStore.warning("Image is not valid");
      return false;
    }
    else{
      reader.onloadend = () => {
        this.setState({
          selectedFile: file,
          vendorImagePreview: reader.result
        },()=>{console.log(this.state)});
    }
      reader.readAsDataURL(file)
    }
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
            <strong>Add Vendor</strong>
          </CardHeader>
          <CardBody>
            <Form  refs action="" method="post" encType="multipart/form-data" className="form-horizontal" onSubmit={this.handleUploadImage}  onChange={this.handleProductChange}>
              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="name">Vendor Name</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="text" id="name" name="name" placeholder="Vendor Name" />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="email">Vendor Email</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="text" id="email" name="email" placeholder="Vendor Name" />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="phoneNumber">Vendor Phone Number</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="text" id="phoneNumber" name="phoneNumber" placeholder="Vendor Phone Number" />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="website">Vendor Website</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="text" id="website" name="website" placeholder="Vendor Website" />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="address">Address</Label>
                </Col>
                <Col xs="12" md="9">
                      <Input type="textarea" name="address" id="address" rows="9"
                             placeholder="Address..." />
                    </Col>
              </FormGroup>

              {/* <FormGroup row>
                <Col md="3">
                  <Label htmlFor="image">Vendor Image</Label>
                </Col>
                <Col xs="12" md="9">
                      <Input type="file" id="image" name="image" />
                    </Col>
              </FormGroup> */}

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="image">Vendor Image</Label>
                </Col>
                <Col xs="12" md="9">
                    <label for="file-input">
                      <img src={publicUrl+"/productFormatedImages/Asset3.png"}/>
                    </label>

                    <Input style={{visibility:"hidden"}} type="file" onChange={this.onChangeHandler} id="file-input" name="image" />
                    <div style={{height:"10px"}}></div>
                    {$imagePreview}
                </Col>
              </FormGroup>
              <Button type="submit" size="sm" color="primary"><i className="fa fa-dot-circle-o"></i> Submit</Button>&nbsp;
              <Button type="reset" size="sm" color="danger"><i className="fa fa-ban"></i> Reset</Button>
            </Form>
          </CardBody>
          <CardFooter>

          </CardFooter>
        </Card>
      </Col>

      <Col xs="12" lg="6">
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> Vendor List
              </CardHeader>
              <CardBody>
                <Table responsive bordered>
                  <thead>
                  <tr>
                    <th>Vendor Name</th>
                    <th>Vendor Image</th>
                    <th>Email</th>
                    <th>Website</th>
                    <th>Address</th>
                    <th>Status</th>
                  </tr>
                  </thead>
                  <tbody>
                  {
                    this.state.vendorList.map((vendorListValue, key) =>
                    <tr>
                      <td>{vendorListValue.name}</td>
                      <td>
                      {
                        vendorListValue.image?<img width="60" height="60" src={publicUrl+'/upload/vendor/'+vendorListValue.image}></img>
                        :
                        <img width="60" height="60" src={publicUrl+'/upload/vendor/default.png'}></img>
                      }

                        </td>
                      <td>{vendorListValue.email}</td>
                      <td>{vendorListValue.website}</td>
                      <td>{vendorListValue.address}</td>
                      <td>
                        {vendorListValue.status == 'active' ? <Badge color="success">Active</Badge> : <Badge color="secondary">Inactive</Badge> }
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
    </Row>
    )
  }
}



export default Vendor;
