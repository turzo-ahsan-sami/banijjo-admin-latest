import React, { Component } from 'react';
import {ToastsContainer, ToastsStore} from 'react-toasts';
import ImageUploader from 'react-images-upload';
import axios from 'axios';
import cookie from 'react-cookies';

import {logoutFunction} from './../DynamicLogout/Logout';

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
const publicUrl = process.env.REACT_APP_PUBLIC_URL;

class Advertisement extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.toggleFade = this.toggleFade.bind(this);
    this.state = {
      imageName: '',
      image: [],
      bannerImagesPreview:'',
      incrementState: -1,
      banner: [],
      collapse: true,
      fadeIn: true,
      timeout: 300,
      imgWidth: 0,
      imgHeight: 0,
      isSubmitAllowed: true,
      exportToken: '',
      modal: false,
      small: false,
      advertisementDeleteId: 0,
      name: '',
      url: '',
      description: '',
      editID: '',
      showImageAtEditClicked: '',
      isUpdateClicked: false
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.toggleSmall = this.toggleSmall.bind(this);

    this.handleGetEditForm = this.handleGetEditForm.bind(this);
  }

  handleReset () {
      window.location = '/advertisement/add-advertisement';
  }

  handleGetEditForm (event) {
      console.log('Edit Clicked & id : ', event.currentTarget.dataset['id']);

      this.setState({
          editID: event.currentTarget.dataset['id']
      });

      fetch(base+`/api/getAdvertisementData/?id=${event.currentTarget.dataset['id']}`, {
        method: 'GET'
      })
      .then(res => {
        return res.json()
      })
      .then(advertisement => {
        console.log(advertisement.data);

        if (advertisement.success ==true) {

            this.setState({
                name: advertisement.data[0].name,
                url: advertisement.data[0].url,
                description: advertisement.data[0].description,
                bannerImagesPreview:'',
                incrementState: -1,
                showImageAtEditClicked: advertisement.data[0].image,
                isUpdateClicked: true
            });
        }
        else {
            ToastsStore.warning(advertisement.message);
        }

        console.log('States Value : ', this.state);

        return false;
      });
  }

  toggleSmall(event) {
    if (event == 'Yes') {
      console.log('Permitted');
      fetch(base+`/api/deleteAdvertisement/?id=${this.state.featureNameDeleteId}`, {
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
            window.location = '/advertisement/add-advertisement';
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
            ToastsStore.warning("Faild. Please try again !!");
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

  componentDidMount() {
    // const { path } = './src/views/Pages/Login';
    // import (`${path}`)
    // .then(exportToken => this.setState({ exportToken: exportToken }))
    console.log('component mount executed ');
    // console.log('Exported Token : ', userExportedJWToken);

    const userName = localStorage.getItem('userName');
    const userPassword = localStorage.getItem('userPassword');
    if(userName===null && userPassword === null)
    {
      this.props.history.push("/login");
    }

    console.log('token in cookies : ', cookie.load('token'));

    // `/api/banner/?id=${cookie.load('token')}`
    // '/api/banner'

    fetch(base+'/api/advertisement', {
      method: 'GET',
      headers: new Headers({
        'Authorization': 'Atiq '+cookie.load('token')
      })
    })
    .then(res => {
      console.log(res);
      return res.json()
    })
    .then(banner => {
      console.log(banner.data);
      this.setState({
        banner : banner.data
      })
      return false;
    });

  }

  handleSubmit(event) {
    event.preventDefault();
    console.log('State values are : ', this.state);
    console.log('Image File : ', this.state.image[0]);

    const data = new FormData(event.target);
    if(this.state.image.length>0){
      console.log('has value');
      for (const file of this.state.image) {
        data.append('imageFile', file)
      }
    }
    else{
      console.log('no value');
      data.append('imageFile', false);
    }

    data.append('name', JSON.stringify(this.state.name));
    data.append('image', JSON.stringify(this.state.imageName));
    data.append('description', JSON.stringify(this.state.description));
    data.append('url', JSON.stringify(this.state.url));

    if (this.state.isUpdateClicked == true) {
        data.append('isUpdateClicked', JSON.stringify(this.state.isUpdateClicked));
        data.append('editID', JSON.stringify(this.state.editID));
    }

    axios({
      method: 'post',
      url: base+'/api/saveAdvertisement',
      data: data,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data',
        'Authorization': 'Atiq '+cookie.load('token')
      }
    })
    .then(function (response) {
      console.log(response);
      //handle success
      // let  data =  response.json();
      if(response.data.success==true){
        ToastsStore.success(response.data.message);
        setTimeout(
          function() {
            window.location = '/advertisement/add-advertisement';
          }
          .bind(this),
          3000
          );
        }
        else {
          if (response.data.status == 403) {
            console.log(response.data);

            ToastsStore.warning('Your session is expired. Please Login again');

            setTimeout(()=> {
              logoutFunction(localStorage.userName);
            }, 1000);

          }
          else {
            ToastsStore.warning("Faild. Please try again !!");
            console.log(response.data.success);
          }
        }
      })
      .catch(function (response) {
        ToastsStore.success(response.data.message);
        console.log(response);
      });

  }



  handleChange(event) {

    if (event.target.name == 'image') {
      console.log('Image : ', event.target.name);

      let reader = new FileReader();
      let file = event.target.files[0];

      console.log(file);

      this.state.image.push(file);

      // STARTED FOR IMAGE FILE SIZE
      let img = document.createElement('img');

      img.src = URL.createObjectURL(event.target.files[0]);

      let imgWidth = 0, imgHeight = 0;

      console.log(img);

      console.log('before onload function : executed')
      img.onload = function() {
        console.log(img.width+' - '+img.height);

        imgWidth = img.width;
        imgHeight = img.height;
      };

      // start image dimesion limitation

      // setTimeout(() => {
      //
      //   if (imgWidth == 568 && imgHeight == 314) {
      //     this.setState({
      //       imgWidth: imgWidth,
      //       imgHeight: imgHeight,
      //       isSubmitAllowed: true
      //     })
      //   }
      //   else {
      //     this.setState({
      //       imgWidth: imgWidth,
      //       imgHeight: imgHeight,
      //       isSubmitAllowed: false
      //     })
      //   }
      // }, 1000);

      // ended image dimesion limitation

      // this.setState({
      //   imgWidth: img.onload = () => img.width
      // })
      //
      // console.log('From Calback function : ', this.state.imgWidth);

      // END OF IMAGE FILE SIZE

      // MAIN IMAGE FILE WORKS----------------

      console.log('outside Width : '+imgWidth+' height : '+imgHeight);

      this.setState({
        incrementState: ++this.state.incrementState,
        imageName: event.target.files[0].name,
        showImageAtEditClicked: ''
      })

      reader.onloadend = () => {
        this.setState({ bannerImagesPreview: [ ...this.state.bannerImagesPreview, reader.result] });
      }

      reader.readAsDataURL(file);

      console.log('File event : ', event.target.files[0].name);
      console.log(this.state.bannerImagesPreview);
      console.log(this.state.image);
    }
    else {
      console.log('else working for', event.target.name);
      const target = event.target;
      const value = target.type === 'checkbox' ? target.checked : target.value;
      const name = target.name;

      this.setState({
        [name]: value
      });
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
      <ToastsContainer store={ToastsStore}/>
      <Col xs="12" md="6">
        <Card>
          <CardHeader>
              {
                  this.state.isUpdateClicked == true ?
                  <strong>Update Advertisement</strong>
                  :
                  <strong>Add New Advertisement</strong>
              }

          </CardHeader>
          <CardBody>
            <Form action="" method="post" encType="multipart/form-data" onSubmit={this.handleSubmit} onChange={this.handleChange} className="form-horizontal">

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="categoryName">Title</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="text" id="name" name="name" value={this.state.name} data-name={'name'}  required="true" placeholder="Title" />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="categoryName">Image</Label>
                </Col>
                <Col xs="12" md="9">
                  {
                    this.state.bannerImagesPreview?<img src={this.state.bannerImagesPreview[this.state.incrementState]} height="100" width="100"></img>
                    :''
                  }
                  {
                      this.state.showImageAtEditClicked? <img width="100" height="80" src={`${publicUrl+'/upload/product/productImages/'+this.state.showImageAtEditClicked}`}></img>: null
                  }
                  <Input type="file" id="image" name="image" data-name={'image'} />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="categoryDescription">Description</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="text" id="description" name="description" value={this.state.description} data-name={'description'} required="true" placeholder="Description" />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="categoryDescription">Related URL</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="text" id="url" name="url" value={this.state.url} data-name={'url'} required="true" placeholder="Related URL" />
                </Col>
              </FormGroup>

              <center>
                {
                    this.state.isUpdateClicked == true ?
                    <Button type="submit" size="sm" color="success"><i className="fa fa-dot-circle-o"></i> Update</Button>
                    :
                  this.state.isSubmitAllowed == true ?
                  <Button type="submit" size="sm" color="success"><i className="fa fa-dot-circle-o"></i> Submit</Button>
                  :
                  <Button type="submit" size="sm" color="success" disabled><i className="fa fa-dot-circle-o"></i> Submit</Button>
                }
                &nbsp;

                <Button type="reset" size="sm" color="danger" onClick={this.handleReset}><i className="fa fa-ban"></i> Reset</Button>
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
                    <i className="fa fa-align-justify"></i> Advertisement List
                  </Col>
                  <Col md="6">
                  </Col>
                </Row>
              </CardHeader>

              <CardBody>
                <Table responsive bordered>
                  <thead>
                  <tr>
                    <th>Title</th>
                    <th>Product Image</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                  </thead>
                  <tbody>

                  {
                    this.state.banner.map((bannerValue, key) =>
                      <tr>
                        <td>{bannerValue.name}</td>
                        <td>
                          {
                            bannerValue.image?
                            <img width="100" height="80" src={`${publicUrl+'/upload/product/productImages/'+bannerValue.image}`}></img>
                            // <img width="100" height="80" src={publicUrl+'/upload/product/productImages/'+`${productListValue.home_image}`}></img>
                            :
                            <img width="100" height="80" src={publicUrl+'/upload/vendor/personal/default.png'}></img>
                          }
                        </td>
                        <td>{bannerValue.description}</td>
                        <td>
                        {
                          bannerValue.status == 1 ?
                          <i class="fa fa-check fa-lg" style={{color: '#009345'}}></i>
                          :
                          <i class="fa fa-times fa-lg" style={{color: '#009345'}}></i>
                        }
                        </td>
                        <td>
                          <center>
                              <a href="#">
                                  <i className="fa fa-edit fa-lg"  title="Edit Details Info" aria-hidden="true" style={{color: '#009345'}} data-id={bannerValue.id} onClick={this.handleGetEditForm.bind(this)}></i>
                              </a>&nbsp;
                            <a href="#" onClick={this.deleteItem.bind(this)} id="deleteIds" ref="dataIds" data-id={bannerValue.id}>
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
              Are You Sure To Delete This Advertisement ?
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



export default Advertisement;
