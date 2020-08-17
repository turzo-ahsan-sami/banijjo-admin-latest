import React, { Component } from 'react';
import {ToastsContainer, ToastsStore} from 'react-toasts';
import ImageUploader from 'react-images-upload';
import axios from 'axios';
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
const publicUrl = process.env.REACT_APP_PUBLIC_URL;

class BannerProducts extends Component {
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
      getDeleteId: -1,
      isDeleteClicked: '',
      name: '',
      url: '',
      description: '',
      editID: '',
      showImageAtEditClicked: '',
      isUpdateClicked: false
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.toggleSmall = this.toggleSmall.bind(this);

    this.handleGetEditForm = this.handleGetEditForm.bind(this);
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

    fetch(base+'/api/banner', {
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

  handleReset () {
      window.location = '/banner/add-main-banner';
  }

  handleGetEditForm (event) {
      console.log('Edit Clicked & id : ', event.currentTarget.dataset['id']);

      this.setState({
          editID: event.currentTarget.dataset['id']
      });

      fetch(base+`/api/getBannerData/?id=${event.currentTarget.dataset['id']}`, {
        method: 'GET'
      })
      .then(res => {
        return res.json()
      })
      .then(banner => {
        console.log(banner.data);

        if (banner.success ==true) {

            this.setState({
                name: banner.data[0].name,
                url: banner.data[0].url,
                description: banner.data[0].description,
                bannerImagesPreview:'',
                incrementState: -1,
                showImageAtEditClicked: banner.data[0].image,

                isUpdateClicked: true
            });

            setTimeout(() => {
                if (window.location.host == 'admin.banijjo.com.bd') {
                    this.setState({
                        dateFrom: banner.data[0].effective_from.split("T")[0],
                        dateTo: banner.data[0].effective_to.split("T")[0],
                    })
                }
                else if (window.location.host == 'localhost:3005') {
                    this.setState({
                        dateFrom: banner.data[0].effective_from.split(" ")[0],
                        dateTo: banner.data[0].effective_to.split(" ")[0],
                    })
                }
            }, 50);
        }
        else {
            ToastsStore.warning(banner.message);
        }

        console.log('States Value : ', this.state);

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
    data.append('date_from', JSON.stringify(this.state.dateFrom));
    data.append('date_to', JSON.stringify(this.state.dateTo));

    data.append('isUpdateClicked', JSON.stringify(this.state.isUpdateClicked));
    data.append('editID', JSON.stringify(this.state.editID));

    axios({
      method: 'post',
      url: base+'/api/saveBanner',
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
            // window.location = '/banner/add-main-banner';
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
            ToastsStore.warning("Failed");
            console.log(response.data.success);
          }
        }
      })
      .catch(function (response) {
        ToastsStore.success('Something Went Wrong');
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
      console.log('Banner Image Preview : ', this.state.bannerImagesPreview);
      console.log('Image only : ', this.state.image);
      console.log('States Value : ', this.state);
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

  toggleSmall(event) {
    if (event == 'deleteBannerPermitted') {
      console.log('deleteBannerPermitted ...');

      fetch(base+`/api/bannerDelete/?id=${this.state.getDeleteId}`, {
        method: 'GET',
        headers: {
          'Authorization': 'Atiq '+cookie.load('token')
        }
      })
      .then(res => {
        // console.log(res);
        return res.json()
      })
      .then(banner => {
        console.log(banner.data);
        if (banner.success == true) {
          ToastsStore.success(banner.message);

          this.setState({
            banner : banner.data
          })

          setTimeout(() => {
            this.setState({
              small: !this.state.small,
            });

          }, 1000);

        }
        else {

          if (banner.status == 403) {
            console.log(banner);

            ToastsStore.warning('Your session is expired. Please Login again');

            setTimeout(()=> {
              logoutFunction(localStorage.userName);
            }, 1000);

          }
          else {
            ToastsStore.success(banner.message);
            console.log(banner.success);
          }
        }


        // console.log('Vendor Data : ', this.state.vendorList);
        return false;
      });

    }
    else {
      this.setState({
        small: !this.state.small
      })
    }
  }

  deleteItem (event) {
    console.log('Delete item..');
    this.state.getDeleteId = event.currentTarget.dataset['id'];
    this.state.isDeleteClicked = event.currentTarget.dataset['deleteclicked'];

    setTimeout(() => {
      this.setState({
        small: !this.state.small,
      });
      console.log('Delete Id : ', this.state.getDeleteId);
    }, 200);
  }

  render() {

    return (
      <Row>
      <ToastsContainer store={ToastsStore}/>
      <Col xs="12" md="6">
        <Card>
          <CardHeader>
              {
                  this.state.isUpdateClicked == true?
                  <strong>Update Banner</strong>
                  :
                  <strong>Add New Banner</strong>
              }

          </CardHeader>
          <CardBody>
            <Form action="" method="post" encType="multipart/form-data" onSubmit={this.handleSubmit} onChange={this.handleChange} className="form-horizontal">

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="categoryName">Name</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="text" id="name" name="name" value={this.state.name} data-name={'name'}  required="true" placeholder="Category/Product/Banner Name" />
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
                      this.state.showImageAtEditClicked?<img width="100" height="80" src={`${publicUrl+'/upload/product/productImages/'+this.state.showImageAtEditClicked}`}></img>:null
                  }
                  <Input type="file" id="image" name="image" data-name={'image'} />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="date">Effective Date From</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="date" name="dateFrom" id="dateFrom" value={this.state.dateFrom} >

                  </Input>
                </Col>
              </FormGroup>

              <FormGroup row>
                <Col md="3">
                  <Label htmlFor="date">Effective Date To</Label>
                </Col>
                <Col xs="12" md="9">
                  <Input type="date" name="dateTo" id="dateTo" value={this.state.dateTo} >

                  </Input>
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
                      this.state.isUpdateClicked == true?
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
                    <i className="fa fa-align-justify"></i> Banner List
                  </Col>
                  <Col md="6">
                  </Col>
                </Row>
              </CardHeader>

              <CardBody>
                <Table responsive bordered>
                  <thead>
                  <tr>
                    <th>Category/Product/Banner Name</th>
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
                            <a href="#">
                                <i className="fa fa-edit fa-lg"  title="Edit Details Info" aria-hidden="true" style={{color: '#009345'}} data-id={bannerValue.id} onClick={this.handleGetEditForm.bind(this)}></i>
                            </a>&nbsp;
                            <a href="#" onClick={this.deleteItem.bind(this)} data-id={bannerValue.id}>
                                <i className="fa fa-trash fa-lg" title="Delete Products Details" aria-hidden="true" style={{color: '#EB1C22'}}></i>
                            </a>
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
            <ModalHeader toggle={this.toggleSmall}>
              Banner Delete
            </ModalHeader>
            <ModalBody>
              <strong>
                Are Sure to delete this Banner?
              </strong>
            </ModalBody>
            <ModalFooter>
              <Button color="success" onClick={(e)=>{this.toggleSmall('deleteBannerPermitted')}} >yes</Button>
              <Button color="danger" onClick={(e)=>{this.toggleSmall('deleteBannerDenied')}} >No</Button>
            </ModalFooter>
          </Modal>

    </Row>
    )
  }
}



export default BannerProducts;
