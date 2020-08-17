import React, { Component } from 'react';
import {ToastsContainer, ToastsStore} from 'react-toasts';
import ImageUploader from 'react-images-upload';
import axios from 'axios';
import { MDBDataTable } from 'mdbreact';
import { MDBBtn, MDBTable, MDBTableBody, MDBTableHead  } from 'mdbreact';


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

const bgColors = { "Default": "#81b71a",
"Blue": "#00B1E1",
"Cyan": "#37BC9B",
"Green": "#8CC152",
"Red": "#E9573F",
"Yellow": "#F6BB42",
};



class Products extends Component {
  
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.toggleFade = this.toggleFade.bind(this);

    this.displaySpecificationValueData = [];
    this.displaySpecificationDetailsData = [];
    this.specficationsAll = [];
    this.specificationDetailsFull = [];

    this.state = {
      // modal
      modal: false,
      large: false,
      productImagePreview:[],
      descriptionImages:[],
      descriptionPreviewImages:[],
      homeImage:'',
      categoryIdValue:'',

      // for text 
      productDescriptionFull: [{title: "", description: "", descriptionImage: ""}],
      images: [{productImage: ""}],
      pictures: [],
      productSPDFull: [],
      productSPD: [],
      productSpecificationBoxFun: [],
      productSPName: [],
      deleteProduct: [],

      // for products
      products: [],
      productsCategory: [],
      productsSpecificationName: [],
      productsSpecificationDetails: [],
      vendorList: [],
      productList: [],
      newProductCode: '',
      userList: [],
      userName: '',
      userCode: '',
      showProductsSpecificationValue : this.displaySpecificationValueData,
      postProductsSpecificationValue : "",
      showDisplaySpecificationDetailsData : this.displaySpecificationDetailsData,
      postProductsSpecificationDetails : "",
      // specficationsAll : [],
      specificationDetailsFullState : {},
      vendorId: '',
      productSKUcode : '',
      user_type: '',

      details : "",
      productSpecificationDetailsArray:[],

      // for checkbox
      
      collapse: true,
      fadeIn: true,
      timeout: 300,
      productImages:[],
      productImagesJson:[],
      imagePreview4:'',
      imagePreview5:'',
      imagePreview6:'',
      imagePreview7:'',
      imagePreview8:'',
      imagePreview9:'',
      imagePreview10:'',
      imagePreview11:'',
      imagePreview12:'',
      imagePreview13:'',
      allProductsArray:[]
    };

    // for modal
    this.toggleLarge = this.toggleLarge.bind(this);
    this.toggleSmall = this.toggleSmall.bind(this);

    // to get data from node.js
    // this.handleGetProductCategory = this.handleGetProductCategory.bind(this);

    // to submit the data
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleProductChange = this.handleProductChange.bind(this);
    this.detailsChange = this.detailsChange.bind(this);
    this.handleSPDFullChange = this.handleSPDFullChange.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleChangeSpecification = this.handleChangeSpecification.bind(this);
    this.createImages = this.createImages.bind(this);
  }

  componentDidMount() {
    console.log('component mount executed');

    this.state.userName = localStorage.getItem('userName');
    const userPassword = localStorage.getItem('userPassword');
    this.state.vendorId = localStorage.getItem('employee_id');
    this.state.user_type = localStorage.getItem('user_type');

    if(this.state.userName===null && userPassword === null)
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
    .then(category => {
      console.log(category.data); 
      this.setState({ 
        productsCategory : category.data
      })
      
      return false;
    });

    fetch(base+'/api/product_specification_names', {
      method: 'GET'
    })
    .then(res => {
      console.log(res);
      return res.json()
    })
    .then(specificationName => {
      console.log(specificationName.data); 
      this.setState({ 
        productsSpecificationName : specificationName.data
      })

      console.log('Specification Data : ', this.state.productsSpecificationName);
      return false;
    });

    fetch(base+'/api/product_specification_details', {
      method: 'GET'
    })
    .then(res => {
      console.log(res);
      return res.json()
    })
    .then(specificationName => {
      console.log(specificationName.data); 
      this.setState({ 
        productsSpecificationDetails : specificationName.data
      })

      console.log('Specification Data : ', this.state.productsSpecificationDetails);
      return false;
    });

  
    fetch(base+'/api/allProducts', {
      method: 'GET'
    })
    .then(res => {
      return res.json()
    })
    .then(allProducts => {
      this.setState({ 
        allProductsArray : allProducts.data
      })

      console.log('Specification Data : ', this.state.productsSpecificationDetails);
      return false;
    });

    fetch(base+'/api/vendor_list_for_product', {
      method: 'GET'
    })
    .then(res => {
      console.log(res);
      return res.json()
    })
    .then(vendors => {
      console.log(vendors.data); 
      this.setState({ 
        vendorList : vendors.data
      })

      this.state.vendorList.map ((value, key) => {
        if (value.email == this.state.userName) {
          this.state.userCode = value.code;
        }
      })

      console.log('Vendor Data : ', this.state.vendorList);
      return false;
    });

    fetch(base+'/api/user_list', {
      method: 'GET'
    })
    .then(res => {
      console.log(res);
      return res.json()
    })
    .then(userList => {
      console.log(userList.data); 
      this.setState({ 
        userList : userList.data
      })

      console.log('Vendor Data : ', this.state.userList);
      console.log('Local storage user name : ', this.state.userName);

      return false;
    });

    console.log('Trying to fetch product !');

    fetch(base+`/api/product_list/?id=${this.state.userName}`, {
      method: 'GET'
    })
    .then(res => {
      console.log(res);
      return res.json()
    })
    .then(products => {
      console.log('THe api response for products quesry : ', products.data); 
      this.setState({ 
        productList : products.data
      })

      let countProducts = this.state.productList.length+1;

      // while (countProducts.toString().length < 5) {
      //   countProducts = "0" + countProducts;
      //   console.log('product counter increment : ', countProducts.length);
      // }

      console.log('product counter increment Final : ', countProducts);

      this.setState ({
        newProductCode : countProducts
      })

      console.log('Vendor Data : ', this.state.productList);

      return false;
    });
  }

  
  // onChangeDescriptionHandler=(event,id)=>{
    
  //   let reader = new FileReader();
  //    let file = event.target.files[0];
  //    if (!file.name.match(/.(jpg|jpeg|png|gif)$/i)){
  //      ToastsStore.warning("Image is not valid");
  //      return false;
  //    }
  //    else{
  //      let imageObject = {}
  //      var serialNumber = id;
  //     //  imageObject.imageName = file.name;
  //     //  imageObject.serialNumber = event.currentTarget.getAttribute('dataId');
  //       this.state.descriptionImages.push(file);
 
  //      reader.onloadend = () => {
  //       //  let productImagePreviewObject = {}
  //       //  productImagePreviewObject.serialNumber = serialNumber;
  //       //  productImagePreviewObject.previewImage = reader.result;
  //        this.state.descriptionPreviewImages.push(reader.result);
  //    }
  //      reader.readAsDataURL(file);
  //    }
     
  //     console.log(this.state);
  //  }
 
 

  onChangeHandler=(event,id)=>{
    
   let reader = new FileReader();
    let file = event.target.files[0];
    if (!file.name.match(/.(jpg|jpeg|png|gif)$/i)){
      ToastsStore.warning("Image is not valid");
      return false;
    }
    else{
      let imageObject = {}
      var serialNumber = event.currentTarget.getAttribute('dataId');
      imageObject.imageName = file.name;
      imageObject.serialNumber = event.currentTarget.getAttribute('dataId');
      this.state.productImages.push(file);
      this.state.productImagesJson.push(imageObject);
      if(serialNumber==3){
        this.setState({homeImage:file.name})
      }


      reader.onloadend = () => {
        let productImagePreviewObject = {}
        productImagePreviewObject.serialNumber = serialNumber;
        productImagePreviewObject.previewImage = reader.result;
        // this.setState({ productImagePreview: [...this.state.productImagePreview[serialNumber], productImagePreviewObject] });
        if(serialNumber==3){this.setState({imagePreview3:reader.result})} 
        if(serialNumber==4){this.setState({imagePreview4:reader.result})} 
        if(serialNumber==5){this.setState({imagePreview5:reader.result})} 
        if(serialNumber==6){this.setState({imagePreview6:reader.result})} 
        if(serialNumber==7){this.setState({imagePreview7:reader.result})} 
        if(serialNumber==8){this.setState({imagePreview8:reader.result})} 
        if(serialNumber==9){this.setState({imagePreview9:reader.result})} 
        if(serialNumber==10){this.setState({imagePreview10:reader.result})} 
        if(serialNumber==11){this.setState({imagePreview11:reader.result})} 
        if(serialNumber==12){this.setState({imagePreview12:reader.result})} 
        if(serialNumber==13){this.setState({imagePreview13:reader.result})} 
        // const productImagePreviewn = { ...this.state };
        // productImagePreviewn[serialNumber] = reader.result;
        // this.setState({productImagePreview: productImagePreviewn});
        //  this.setState({productImagePreview productImagePreviewObject})
        
        //  this.state.productImagePreview.push(productImagePreviewObject);
        //  this.props.updateItem(this.state);
      
    }
      reader.readAsDataURL(file)
    }
    
     console.log(this.state);
  }


  handleSubmit(event) {
    // alert('submit')
    event.preventDefault();
    const data = new FormData(event.target);
    console.log('state printingL',this.state.productImages);
    console.log('state printingL',this.state.descriptionImages);
    console.log('state printingL',this.state);
    for (const file of this.state.productImages) {
      data.append('productFiles', file)
    }

    for (const fileDescription of this.state.descriptionImages) {
      data.append('productDescriptionFiles', fileDescription)
    }
    data.append('productImagesJson', JSON.stringify(this.state.productImagesJson));
    data.append('productSpecificationBoxFun', JSON.stringify(this.state.productSpecificationBoxFun));
    // data.append('specificationDetailsFullState', JSON.stringify(this.state.specificationDetailsFullState));
    data.append('productDescriptionFull', JSON.stringify(this.state.productDescriptionFull));
    data.append('homeImage', this.state.homeImage);
    data.append('vendor_id', localStorage.getItem('employee_id'));
    data.append('productSKUcode', this.state.productSKUcode);
    data.append('categoryIdValue', this.state.categoryIdValue);
     axios({
      method: 'post',
      url: base+'/api/saveProduct',
      data: data,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
      })
      .then(function (response) {
        console.log(response);
          //handle success
        // let  data =  response.json();
        if(response.data.message=="success"){
          ToastsStore.success("Product Successfully inserted !!");
                setTimeout(
                  function() {
                  window.location = '/product/products';
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




    

    // fetch(base+'/api/saveProduct' , {
    //   method: "POST",
    //   headers: {
    //     'Content-type': 'application/json'
    //   },
    //   body: JSON.stringify(this.state)
    // })
    // .then((result) => result.json())
    // .then((info) => { 
    //   if (info.success == true) {
    //     ToastsStore.success("Product Successfully inserted !!");
    //     console.log(info.success);
    //     console.log(info.message);
        
    //     setTimeout(
    //       function() {
    //         window.location = '/product/products';
    //       }
    //       .bind(this),
    //       3000
    //     );
    //   }
    //   else {
    //     ToastsStore.warning("Product Insertion Faild. Please try again !!");
    //     console.log(info.success);
    //     console.log(info.message);
    //   }
      
    // })

    
  }

  handleDelete (event) {
    // let data = event.currentTarget.dataset['data-id'];

    console.log('Delete handled' );
  }

  handleProductChange(event) {
    this.setState({value: event.target.value});
    // alert(event.target.value);
    let target = event.target;
    let value = target.type === 'checkbox' ? target.checked : target.value;
    let name = target.name;

    this.setState({
      [name]: value
    });
  }

  detailsChange(event) {
    // this.setState({value: event.target.value});
    alert('Details', event.target.value);
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });

  }

  addClick(){
    this.setState(prevState => ({ 
    	productDescriptionFull: [...prevState.productDescriptionFull, { title: "", description: "", descriptionImage: "" }]
    }))
  }

  addSPDClick(e){
    console.log("SPD : ", e.target.value);
    let targetedValue = e.target.value;
    this.setState(prevState => ({ 
    	productSPDFull: [...prevState.productSPDFull, { spd: ""}]
    }))
    this.state.productSPD.push(targetedValue);
  }

  addImageClick(){
    this.setState(prevState => ({ 
    	images: [...prevState.images, { productImage: ""}]
    }))
  }

  specificationBoxFun (e) {
    console.log("specificationBoxFun : ", e.target.value);
    this.setState(prevState => ({ 
    	productSpecificationBoxFun: [...prevState.productSpecificationBoxFun]
    }))
    this.state.productSpecificationBoxFun.push(e.target.value);
  }

  createSPDUI(){
    // alert('ok')
    return this.state.productSPDFull.map((el, i) => (

      <div key={i}>
        <FormGroup row>
         <Col xs="12" md="12">
          <Input placeholder="Destails Specification" name="spd" id="SPD" onChange={this.handleSPDFullChange.bind(this, i)}/>
          <br/>
         </Col>
        </FormGroup>
      </div>          
    ))
  }

  handleButtonClick(){
    console.log('this is listing buttons');
  }

   DatatablePage = () => {
    const data = {
      columns: [
        {
          label: 'Name',
          field: 'name',
          sort: 'asc',
          width: 150
        },
        {
          label: 'Position',
          field: 'position',
          sort: 'asc',
          width: 270
        },
        {
          label: 'Office',
          field: 'office',
          sort: 'asc',
          width: 200
        },
        {
          label: 'Age',
          field: 'age',
          sort: 'asc',
          width: 100
        },
        {
          label: 'Start date',
          field: 'date',
          sort: 'asc',
          width: 150
        },
        {
          label: 'Salary',
          field: 'salary',
          sort: 'asc',
          width: 100
        }
      ],
      rows: [
        {
          name: 'Tiger Nixon',
          position: 'System Architect',
          office: 'Edinburgh',
          age: '61',
          date: '2011/04/25',
          salary: <React.Fragment><Button onClick={this.handleButtonClick} color="default" className="mr-1 btn btn-success">Edit</Button>  <MDBBtn color="default" className="mr-1 btn btn-danger">Delete</MDBBtn></React.Fragment>

        },
        {
          name: 'Garrett Winters',
          position: 'Accountant',
          office: 'Tokyo',
          age: '63',
          date: '2011/07/25',
          salary: '$170'
        },
        {
          name: 'Ashton Cox',
          position: 'Junior Technical Author',
          office: 'San Francisco',
          age: '66',
          date: '2009/01/12',
          salary: '$86'
        },
        {
          name: 'Cedric Kelly',
          position: 'Senior Javascript Developer',
          office: 'Edinburgh',
          age: '22',
          date: '2012/03/29',
          salary: '$433'
        },
        {
          name: 'Airi Satou',
          position: 'Accountant',
          office: 'Tokyo',
          age: '33',
          date: '2008/11/28',
          salary: '$162'
        },
        {
          name: 'Brielle Williamson',
          position: 'Integration Specialist',
          office: 'New York',
          age: '61',
          date: '2012/12/02',
          salary: '$372'
        },
        {
          name: 'Herrod Chandler',
          position: 'Sales Assistant',
          office: 'San Francisco',
          age: '59',
          date: '2012/08/06',
          salary: '$137'
        },
        {
          name: 'Rhona Davidson',
          position: 'Integration Specialist',
          office: 'Tokyo',
          age: '55',
          date: '2010/10/14',
          salary: '$327'
        },
        {
          name: 'Colleen Hurst',
          position: 'Javascript Developer',
          office: 'San Francisco',
          age: '39',
          date: '2009/09/15',
          salary: '$205'
        },
        {
          name: 'Sonya Frost',
          position: 'Software Engineer',
          office: 'Edinburgh',
          age: '23',
          date: '2008/12/13',
          salary: '$103'
        },
        {
          name: 'Jena Gaines',
          position: 'Office Manager',
          office: 'London',
          age: '30',
          date: '2008/12/19',
          salary: '$90'
        },
        {
          name: 'Quinn Flynn',
          position: 'Support Lead',
          office: 'Edinburgh',
          age: '22',
          date: '2013/03/03',
          salary: '$342'
        },
        {
          name: 'Charde Marshall',
          position: 'Regional Director',
          office: 'San Francisco',
          age: '36',
          date: '2008/10/16',
          salary: '$470'
        },
        {
          name: 'Haley Kennedy',
          position: 'Senior Marketing Designer',
          office: 'London',
          age: '43',
          date: '2012/12/18',
          salary: '$313'
        },
        {
          name: 'Tatyana Fitzpatrick',
          position: 'Regional Director',
          office: 'London',
          age: '19',
          date: '2010/03/17',
          salary: '$385'
        },
        {
          name: 'Michael Silva',
          position: 'Marketing Designer',
          office: 'London',
          age: '66',
          date: '2012/11/27',
          salary: '$198'
        },
        {
          name: 'Paul Byrd',
          position: 'Chief Financial Officer (CFO)',
          office: 'New York',
          age: '64',
          date: '2010/06/09',
          salary: '$725'
        },
        {
          name: 'Gloria Little',
          position: 'Systems Administrator',
          office: 'New York',
          age: '59',
          date: '2009/04/10',
          salary: '$237'
        },
        {
          name: 'Bradley Greer',
          position: 'Software Engineer',
          office: 'London',
          age: '41',
          date: '2012/10/13',
          salary: '$132'
        },
        {
          name: 'Dai Rios',
          position: 'Personnel Lead',
          office: 'Edinburgh',
          age: '35',
          date: '2012/09/26',
          salary: '$217'
        },
        {
          name: 'Jenette Caldwell',
          position: 'Development Lead',
          office: 'New York',
          age: '30',
          date: '2011/09/03',
          salary: '$345'
        },
        {
          name: 'Yuri Berry',
          position: 'Chief Marketing Officer (CMO)',
          office: 'New York',
          age: '40',
          date: '2009/06/25',
          salary: '$675'
        },
        {
          name: 'Caesar Vance',
          position: 'Pre-Sales Support',
          office: 'New York',
          age: '21',
          date: '2011/12/12',
          salary: '$106'
        },
        {
          name: 'Doris Wilder',
          position: 'Sales Assistant',
          office: 'Sidney',
          age: '23',
          date: '2010/09/20',
          salary: '$85'
        },
        {
          name: 'Angelica Ramos',
          position: 'Chief Executive Officer (CEO)',
          office: 'London',
          age: '47',
          date: '2009/10/09',
          salary: '$1'
        },
        {
          name: 'Gavin Joyce',
          position: 'Developer',
          office: 'Edinburgh',
          age: '42',
          date: '2010/12/22',
          salary: '$92'
        },
        {
          name: 'Jennifer Chang',
          position: 'Regional Director',
          office: 'Singapore',
          age: '28',
          date: '2010/11/14',
          salary: '$357'
        },
        {
          name: 'Brenden Wagner',
          position: 'Software Engineer',
          office: 'San Francisco',
          age: '28',
          date: '2011/06/07',
          salary: '$206'
        },
        {
          name: 'Fiona Green',
          position: 'Chief Operating Officer (COO)',
          office: 'San Francisco',
          age: '48',
          date: '2010/03/11',
          salary: '$850'
        },
        {
          name: 'Shou Itou',
          position: 'Regional Marketing',
          office: 'Tokyo',
          age: '20',
          date: '2011/08/14',
          salary: '$163'
        },
        {
          name: 'Michelle House',
          position: 'Integration Specialist',
          office: 'Sidney',
          age: '37',
          date: '2011/06/02',
          salary: '$95'
        },
        {
          name: 'Suki Burks',
          position: 'Developer',
          office: 'London',
          age: '53',
          date: '2009/10/22',
          salary: '$114'
        },
        {
          name: 'Prescott Bartlett',
          position: 'Technical Author',
          office: 'London',
          age: '27',
          date: '2011/05/07',
          salary: '$145'
        },
        {
          name: 'Gavin Cortez',
          position: 'Team Leader',
          office: 'San Francisco',
          age: '22',
          date: '2008/10/26',
          salary: '$235'
        },
        {
          name: 'Martena Mccray',
          position: 'Post-Sales support',
          office: 'Edinburgh',
          age: '46',
          date: '2011/03/09',
          salary: '$324'
        },
        {
          name: 'Unity Butler',
          position: 'Marketing Designer',
          office: 'San Francisco',
          age: '47',
          date: '2009/12/09',
          salary: '$85'
        },
        {
          name: 'Howard Hatfield',
          position: 'Office Manager',
          office: 'San Francisco',
          age: '51',
          date: '2008/12/16',
          salary: '$164'
        },
        {
          name: 'Hope Fuentes',
          position: 'Secretary',
          office: 'San Francisco',
          age: '41',
          date: '2010/02/12',
          salary: '$109'
        },
        {
          name: 'Vivian Harrell',
          position: 'Financial Controller',
          office: 'San Francisco',
          age: '62',
          date: '2009/02/14',
          salary: '$452'
        },
        {
          name: 'Timothy Mooney',
          position: 'Office Manager',
          office: 'London',
          age: '37',
          date: '2008/12/11',
          salary: '$136'
        },
        {
          name: 'Jackson Bradshaw',
          position: 'Director',
          office: 'New York',
          age: '65',
          date: '2008/09/26',
          salary: '$645'
        },
        {
          name: 'Olivia Liang',
          position: 'Support Engineer',
          office: 'Singapore',
          age: '64',
          date: '2011/02/03',
          salary: '$234'
        },
        {
          name: 'Bruno Nash',
          position: 'Software Engineer',
          office: 'London',
          age: '38',
          date: '2011/05/03',
          salary: '$163'
        },
        {
          name: 'Sakura Yamamoto',
          position: 'Support Engineer',
          office: 'Tokyo',
          age: '37',
          date: '2009/08/19',
          salary: '$139'
        },
        {
          name: 'Thor Walton',
          position: 'Developer',
          office: 'New York',
          age: '61',
          date: '2013/08/11',
          salary: '$98'
        },
        {
          name: 'Finn Camacho',
          position: 'Support Engineer',
          office: 'San Francisco',
          age: '47',
          date: '2009/07/07',
          salary: '$87'
        },
        {
          name: 'Serge Baldwin',
          position: 'Data Coordinator',
          office: 'Singapore',
          age: '64',
          date: '2012/04/09',
          salary: '$138'
        },
        {
          name: 'Zenaida Frank',
          position: 'Software Engineer',
          office: 'New York',
          age: '63',
          date: '2010/01/04',
          salary: '$125'
        },
        {
          name: 'Zorita Serrano',
          position: 'Software Engineer',
          office: 'San Francisco',
          age: '56',
          date: '2012/06/01',
          salary: '$115'
        },
        {
          name: 'Jennifer Acosta',
          position: 'Junior Javascript Developer',
          office: 'Edinburgh',
          age: '43',
          date: '2013/02/01',
          salary: '$75'
        },
        {
          name: 'Cara Stevens',
          position: 'Sales Assistant',
          office: 'New York',
          age: '46',
          date: '2011/12/06',
          salary: '$145'
        },
        {
          name: 'Hermione Butler',
          position: 'Regional Director',
          office: 'London',
          age: '47',
          date: '2011/03/21',
          salary: '$356'
        },
        {
          name: 'Lael Greer',
          position: 'Systems Administrator',
          office: 'London',
          age: '21',
          date: '2009/02/27',
          salary: '$103'
        },
        {
          name: 'Jonas Alexander',
          position: 'Developer',
          office: 'San Francisco',
          age: '30',
          date: '2010/07/14',
          salary: '$86'
        },
        {
          name: 'Shad Decker',
          position: 'Regional Director',
          office: 'Edinburgh',
          age: '51',
          date: '2008/11/13',
          salary: '$183'
        },
        {
          name: 'Michael Bruce',
          position: 'Javascript Developer',
          office: 'Singapore',
          age: '29',
          date: '2011/06/27',
          salary: '$183'
        },
        {
          name: 'Donna Snider',
          position: 'Customer Support',
          office: 'New York',
          age: '27',
          date: '2011/01/25',
          salary: '$112'
        }
      ]
    };
  
    return (
      <MDBDataTable
        striped
        bordered
        large
        data={data}
      />
    );
   
  }

  
  handleChange(i, e) {
    const { name, value } = e.target;

    console.log('inside handle');

    if (name == 'descriptionImage') {
      let reader = new FileReader();
      let file = e.target.files[0];

      let productDescriptionFull = [...this.state.productDescriptionFull];
      productDescriptionFull[i] = {...productDescriptionFull[i], [name]: file.name};
      this.setState({ productDescriptionFull });

  
      this.state.descriptionImages.push(file);
 
      reader.onloadend = () => {
        // let descriptionPreviewImages = [...this.state.descriptionPreviewImages];
        // descriptionPreviewImages[i] = reader.result;
        // this.setState({ descriptionPreviewImages }, console.log(this.state));
        // this.state.descriptionPreviewImages.push(reader.result);
         this.setState({ descriptionPreviewImages: [...this.state.descriptionPreviewImages, reader.result] });

       // this.state.descriptionPreviewImages.push(reader.result);
    }
      reader.readAsDataURL(file);

       console.log(this.state);
      console.log(productDescriptionFull);
      // console.log(descriptionPreviewImages);
    }
    else {
      let productDescriptionFull = [...this.state.productDescriptionFull];
      productDescriptionFull[i] = {...productDescriptionFull[i], [name]: value};
      this.setState({ productDescriptionFull });
    }

    // alert(name);
    // alert(value);
    
  }

  createUI(){
     return this.state.productDescriptionFull.map((el, i) => (
       <div key={i}>
         <FormGroup row>
         <Col md="3">
            <Label htmlFor="description">Product Description</Label>
          </Col>
          <Col xs="12" md="9">
            <Row>
              <Col md="11">
                <Input placeholder="Title" name="title" id="title" onChange={this.handleChange.bind(this, i)} />
              </Col>
              <Col md="1">
                <span>
                  <a href="#">
                    <i className="fa fa-window-close" onClick={this.removeClick.bind(this, i)}></i>
                  </a>
                </span>&nbsp;
              </Col>
            </Row>
            <br/>
            <Row>
              <Col md="11">
                <Input type="textarea" name="description" id="description" rows="9" placeholder="Description..." onChange={this.handleChange.bind(this, i)} />
              </Col>
              <Col md="1">
                
              </Col>
            </Row>
            <br />
            <Row>
            <Col md="12" md="9">
          {
            this.state.descriptionPreviewImages[i]?<img src={this.state.descriptionPreviewImages[i]} height="100" width="100"></img>
            :''
          }
              <Input type="file" id="descriptionImage" name="descriptionImage" onChange= {this.handleChange.bind(this, i)}/>
            </Col>
            </Row>
          </Col>
         </FormGroup>
    	  
          
    	  {/* <Input type='button' value='remove' onClick={this.removeClick.bind(this, i)}/> */}
       </div>          
     ))
  }

   findArrayElementByTitle(array, id) {
    return array.find((element) => {
      return element.serialNumber === id;
    })
  }

 createImages = ()=>{
    // this.props.updateItem(this.state)
  var previewListImages = [];
  previewListImages = this.state.productImagePreview;
  var imagePreview3 = this.state.imagePreview3;
  var imagePreview4 = this.state.imagePreview4;
  var imagePreview5 = this.state.imagePreview5;
  var imagePreview6 = this.state.imagePreview6;
  var imagePreview7 = this.state.imagePreview7;
  var imagePreview8 = this.state.imagePreview8;
  var imagePreview9 = this.state.imagePreview9;
  var imagePreview10 = this.state.imagePreview10;
  var imagePreview11 = this.state.imagePreview11;
  var imagePreview12 = this.state.imagePreview12;
  var imagePreview13 = this.state.imagePreview13;


  let imageView = [];
  for(var i=3;i<13;i++){
  // var data = previewListImages;

  // console.log(i-3);
  // console.log('ppp',previewListImages[i-3]);
 
    if(i==7){
      imageView.push(<div style={{height:"10px",width:"100%"}}></div>)
    }
    else if(i==11){
      imageView.push(<div style={{height:"10px",width:"100%"}}></div>)
    }
    imageView.push(
      <Col xs="12" md="3">   
      <label for="file-input">
        {
          
          i==3&&imagePreview3? <img width="120" height="100" src={imagePreview3}/>
          :i==4&&imagePreview4? <img width="120" height="100" src={imagePreview4}/>
          :i==5&&imagePreview5? <img width="120" height="100" src={imagePreview5}/>
          :i==6&&imagePreview6? <img width="120" height="100" src={imagePreview6}/>
          :i==7&&imagePreview7? <img width="120" height="100" src={imagePreview7}/>
          :i==8&&imagePreview8? <img width="120" height="100" src={imagePreview8}/>
          :i==9&&imagePreview9? <img width="120" height="100" src={imagePreview9}/>
          :i==10&&imagePreview10? <img width="120" height="100" src={imagePreview10}/>
          :i==11&imagePreview11? <img width="120" height="100" src={imagePreview11}/>
          :i==12&&imagePreview12? <img width="120" height="100" src={imagePreview12}/>
          :i==13&&imagePreview13? <img width="120" height="100" src={imagePreview13}/>
          :
          <img width="120" height="100" src={publicUrl+"/productFormatedImages/Asset"+i+".png"}/>
        }
        </label>
        <input style={{visibility:"none"}} dataId={i} type="file" onChange= {(e)=>this.onChangeHandler(e,i)}  name="image" />
    </Col>
    )
  }
  return imageView;
}

  createImageUI(){

                  return( 
                    <React.Fragment>
                            <FormGroup row>
                                <Col md="12">
                                <Label htmlFor="productImage"> UPload Product Image</Label>
                                </Col>
                                  </FormGroup>
                                        <FormGroup row>
                                {this.createImages()}
                          </FormGroup>
                    </React.Fragment>
                    )  
  }



  handleChangeSpecification(key, e) {

    console.log(e.target);
    console.log(key);
    let i =0;
    const { name, value } = e.target;
    console.log('name',key);
    console.log('value',value);
    let specificationDetailsFull = [...this.specificationDetailsFull];
    specificationDetailsFull = {...specificationDetailsFull, value};
    this.specificationDetailsFull[key] = specificationDetailsFull;
    this.state.specificationDetailsFullState[key] = specificationDetailsFull;
    console.log('Consoling details sdfsf',this.specificationDetailsFull);
    this.setState({ specificationDetailsFull });
    // let specificationDetailsObject = {}
    // specificationDetailsObject.specificationName = key;
    // specificationDetailsObject.value = value;
    //this.state.productSpecificationDetailsArray.push(specificationDetailsObject);
    //this.setState({ productSpecificationDetailsArray: [...this.state.productSpecificationDetailsArray, specificationDetailsObject] },console.log('descrilkption',this.state));




  }

  handleSPDFullChange(i, e) {
    
    const { name, value } = e.target;
    // alert(name);
    // alert(value);
    let productSPDFull = [...this.state.productSPDFull];
    productSPDFull[i] = {...productSPDFull[i], [name]: value};
    this.setState({ productSPDFull });
  }
 
  removeClick(i){
    let productDescriptionFull = [...this.state.productDescriptionFull];
    productDescriptionFull.splice(i, 1);
    this.setState({ productDescriptionFull });
  }

  handleImageChange(i, e) {
    const { name, value } = e.target;
    let images = [...this.state.images];
    images[i] = {...images[i], [name]: value};
    this.setState({ images });
  }
 
  removeImageClick(i){
    let images = [...this.state.images];
    images.splice(i, 1);
    this.setState({ images });
  }

  toggle() {
    this.setState({ collapse: !this.state.collapse });
  }

  toggleFade() {
    this.setState((prevState) => { return { fadeIn: !prevState }});
  }

  getInitialState () {
    return {value: 'select'}
  }

  changeSpecification = (event) => {
    console.log('change specification cc : ', event.target.value);
    let targetedValue = event.target.value;
    var count = 0 ;
    // this.setState({specficationsAll: []});
    // this.state.specficationsAll=[];
    this.specficationsAll=[];
    this.setState({categoryIdValue: event.target.value});

    this.state.productSKUcode = 'BNJ-000'+this.state.vendorId+'-0000'+this.state.newProductCode;
    

    // this.displaySpecificationDetailsData.length=0;

    console.log('Array : ', this.displaySpecificationValueData);
    
    this.setState(prevState => ({ 
    	productSPName: [...prevState.productSPName]
    }))
    this.state.productSPName.push(targetedValue);

    this.setState({value: event.target.value});

    // {
    //   this.state.specficationsAll.push(<Col md="5">{'Product Specifications '} :</Col>)
    //   this.state.productsSpecificationName.map((productsSpecificationNameValue, key) =>
      
    //     event.target.value == productsSpecificationNameValue.category_id ? 
    //     <div row>
    //       {this.state.specficationsAll.push(<Col md="5">{productsSpecificationNameValue.specification_name} :</Col>)}
    //       {
    //         JSON.parse(productsSpecificationNameValue.value).map((productsSpecificationNameValueParsed, key) =>
    //           {this.state.specficationsAll.push(<Col md="7"><input type="checkbox" name="specificationBox" value={event.target.value+" : "+productsSpecificationNameValueParsed} onClick={this.specificationBoxFun.bind(this)}/> {productsSpecificationNameValueParsed}</Col>)}
    //           )
    //       }
    //     </div>
    //     : 
    //     null
    //   )
    // }
      
        
    // {
    //   this.state.productsSpecificationDetails.map((productsSpecificationDetailsValue, key) =>
        
    //       JSON.parse(productsSpecificationDetailsValue.specification_details_name).map((productsSpecificationDetailsValueParsed, key) =>
    //         event.target.value == productsSpecificationDetailsValue.category_id ? 
    //         this.state.specficationsAll.push(<div><Label htmlFor="productSpecificationDetails">Product SpecificationDetails : </Label><Input type="text" id="detailsId" onChange={this.handleChangeSpecification.bind(this)} name="details" value={productsSpecificationDetailsValueParsed+" : "}  /><br /></div>) : 
    //         null
    //       )
    //   )
    // }

    // if (this.state.specficationsAll.length == 1) {
    //   this.state.specficationsAll.push(<div row><Col md="12"><strong>Note : </strong>No Specificaton Found For This Product Category</Col></div>);
    // }
    // this.displaySpecificationValueData.push(<hr/>);

    let counter = 0;
    let counters = 0;
    console.log('Consoling specifiation',this.state.productsSpecificationName);

    {
      this.state.productsSpecificationName.map((productsSpecificationNameValue, key) =>
      
        event.target.value == productsSpecificationNameValue.category_id ? 
          <div row>
            {this.specficationsAll.push(<Col md="3">{ counter == 0 ? 'Product Specifications ' : null }</Col>)}
            {this.specficationsAll.push(<Col md="9">{productsSpecificationNameValue.specification_name} :</Col>)}
            {++counter}
            {
              JSON.parse(productsSpecificationNameValue.value).map((productsSpecificationNameValueParsed, key) =>
                <div>
                  {this.specficationsAll.push(<Col md="3"></Col>)}
                  {this.specficationsAll.push(<Col md="9"><input type="checkbox" name="specificationBox" value={event.target.value+":"+productsSpecificationNameValue.id+":"+productsSpecificationNameValueParsed} onClick={this.specificationBoxFun.bind(this)}/> {productsSpecificationNameValueParsed}</Col>)}
                </div>
              )
            }
          </div>
        : 
        null
      )
    }
      
        
    {
      this.state.productsSpecificationDetails.map((productsSpecificationDetailsValue, key) =>
        JSON.parse(productsSpecificationDetailsValue.specification_details_name).map((productsSpecificationDetailsValueParsed, key) =>
          <div row>
            {
              event.target.value == productsSpecificationDetailsValue.category_id ? 
              // this.specficationsAll.push(<div> { counters == 0 ? <Col md="3"><Label htmlFor="productSpecificationDetails">Product Specification Details&nbsp; </Label></Col> : <Col md="3"></Col> } <Col md="9"> {productsSpecificationDetailsValueParsed}&nbsp; <Input type="text" id="detailsId" /*onChange={this.handleChangeSpecification.bind(this)}*/ name={"detailsId : "+productsSpecificationDetailsValueParsed+" "} /*value={productsSpecificationDetailsValueParsed+" : "}*/  /> </Col> </div>) : 
              <div>
                {this.specficationsAll.push(<Col md="3">{ counters == 0 ? <Label htmlFor="productSpecificationDetails">Product Specification Details&nbsp; </Label> : null }</Col>)}
                {this.specficationsAll.push(<Col md="9">{productsSpecificationDetailsValueParsed}&nbsp; <Input type="text" id="detailsId" onChange={this.handleChangeSpecification.bind(this, productsSpecificationDetailsValueParsed)} name={"detailsId"} /*value={productsSpecificationDetailsValueParsed+" : "}*/  /></Col>)}
                {++counters}
              </div>
              :null
            }
            
          </div>
          
        )
      )
    }

    if (this.specficationsAll.length == 1) {
      this.specficationsAll.push(<div row><Col md="12"><strong>Note : </strong>No Specificaton Found For This Product Category</Col></div>);
    }

  }

  changeDetailsSpecification = (event) => {
    
    console.log('change Details specification : ', event.target.value);
    this.setState({value: event.target.value});

    // this.displaySpecificationDetailsData.push(<div><Input type="text" id="detailsId" name="details" value="" /><br /></div>);
    
    {
      this.state.productsSpecificationDetails.map((productsSpecificationDetailsValue, key) =>
        
          JSON.parse(productsSpecificationDetailsValue.specification_details_name).map((productsSpecificationDetailsValueParsed, key) =>
            event.target.value == productsSpecificationDetailsValueParsed ? 
            this.displaySpecificationDetailsData.push(<div><Input type="text" id="detailsId" name="details" value={productsSpecificationDetailsValueParsed+" : "}  /><br /></div>) : 
            null
          )
      )
    }

    console.log( this.displaySpecificationDetailsData);
  }

  toggleLarge() {
    this.setState({
      large: !this.state.large,
    });
  }

  toggleSmall(event) {
    console.log('data-id : ', event.target.value);
    this.setState({
      small: !this.state.small,
    });
  }

  handlevendorList (event) {
    console.log(event.target.value);

    this.state.vendorId = event.target.value;

    fetch(`http://admin.banijjo.com.bd:3002/api/getVendorWiseProductList/?id=${event.target.value}` , {
      method: "GET"
    })
    .then((result) => result.json())
    .then((info) => { 
      console.log('Product SKU : ', info.data);
      
      console.log(this.state.productSKUcode);
      this.setState({
        productSKUcode : info.data
      })
    })


  }
  
  render() {
    
    return (
      <Row>
      <Col md="12">
        <Card>
          <CardHeader >
            <Row>
              <Col md="6"><i className="fa fa-align-justify"></i> Product List</Col>

              <Col md="6">
                  <Button color="success" onClick={this.toggleLarge} className="mr-1"> <i className="fa fa-plus-circle"></i> Add New Product</Button>
              </Col>
            </Row>
          </CardHeader>
          
          <CardBody>

{this.DatatablePage()}


            <Table responsive bordered>
              <thead>
              <tr>
                <th>Product Name</th>
                <th>Product Image</th>
                <th>Product SKU</th>
                <th>Product Category Name</th>
                <th>Vendor Name</th>
                <th>QC Status</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
              </thead>
              <tbody>
              {

                this.state.productList.map((productListValue, key) =>
                    <tr>
                      <td>{productListValue.product_name}</td>
                      <td>
                        {
                          productListValue.home_image?<img width="100" height="80" src={publicUrl+'/upload/product/productImages/'+productListValue.home_image}></img>
                          :
                          <img width="100" height="80" src={publicUrl+'/upload/vendor/personal/default.png'}></img> 
                        }

                      </td>
                      <td>{productListValue.product_sku}</td>
                      
                      {/* <td>{productListValue.product_sku}</td> */}
                      <td>
                      {
                        this.state.productsCategory.map((productsCategoryValue, key) =>
                          productListValue.category_id == productsCategoryValue.id ? productsCategoryValue.category_name: null
                        )
                      }
                      </td>

                    
                      <td>
                      {
                        this.state.vendorList.map((vendorListValue, key) =>
                          productListValue.vendor_id == vendorListValue.id ?vendorListValue.name: null
                        )
                      }
                      </td>

                     
                      
                      <td>{productListValue.qc_status}</td>
                      <td>

                        {productListValue.status == 'active' ? <Badge color="success">Active</Badge> : <Badge color="secondary">Inactive</Badge> }
                        
                      </td>
                      <td>
                      <center>
                        <a href="#">
                          <i className="fa fa-info-circle" title="View Product Info"></i>
                        </a>&nbsp;
                        <a href="#">
                          <i className="fa fa-edit" title="Edit Product Info"></i>
                        </a>&nbsp;
                        <a href="#" onClick={this.toggleSmall.bind(this)} id="deleteIds" ref="dataIds" data-id={productListValue.id} value={productListValue.id}>
                          <i className="fa fa-window-close-o" title="Delete This Product"></i>
                        </a>
                      </center>
                      </td>
                    </tr>
                  )
              }

              {/* <tr>
                <td>Paĉjo Jadon</td>
                <td>2012/02/01</td>
                <td>Staff</td>
                <td>
                  <Badge color="danger">Banned</Badge>
                </td>
              </tr>
              <tr>
                <td>Micheal Mercurius</td>
                <td>2012/02/01</td>
                <td>Admin</td>
                <td>
                  <Badge color="secondary">Inactive</Badge>
                </td>
              </tr>
              <tr>
                <td>Ganesha Dubhghall</td>
                <td>2012/03/01</td>
                <td>Member</td>
                <td>
                  <Badge color="warning">Pending</Badge>
                </td>
              </tr>
              <tr>
                <td>Hiroto Šimun</td>
                <td>2012/01/21</td>
                <td>Staff</td>
                <td>
                  <Badge color="success">Active</Badge>
                </td>
              </tr> */}
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
        <ModalHeader toggle={this.toggleSmall}>Delete Product</ModalHeader>
        <ModalBody>
          <strong> 
            <center>
            Are Sure to delete this product ?
            </center>
          </strong>
        </ModalBody>
        <ModalFooter>
          <Button color="success" onClick={(e)=>{this.toggleSmall(); this.handleDelete();}}>yes</Button>{' '}
          <Button color="danger" onClick={this.toggleSmall}>No</Button>
        </ModalFooter>
      </Modal>

      <Modal style={{Width:"120% !important",right:"15% !important"}} isOpen={this.state.large} toggle={this.toggleLarge}
        className={'modal-lg ' + this.props.className} >
        <ToastsContainer store={ToastsStore}/>
        <ModalHeader toggle={this.toggleLarge}></ModalHeader>
        <ModalBody>
          
          {/* add new product */}
          <Row>
            <Col xs="12" md="12">
              <Card>
                <CardHeader>
                  <strong>Add Product</strong> 
                </CardHeader>
                <CardBody>
                  <Form action="" method="post" encType="multipart/form-data" onSubmit={this.handleSubmit} onChange={this.handleProductChange} className="form-horizontal">
                    <FormGroup row>
                      <Col md="3">
                        <Label htmlFor="productName">Product Name</Label>
                      </Col>
                      <Col xs="12" md="9">
                        <Input type="text" id="productName" name="productName" placeholder="Product Name" />
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col md="3">
                        <Label htmlFor="productCategory">Product Category </Label>
                      </Col>
                      <Col xs="12" md="9">
                        <Input type="select" name="productCategory" onChange={this.changeSpecification} id="productCategory"  value={this.state.value}>
                          <option value="0">Please select</option>
                          {
                            this.state.productsCategory.map((productsCategoryValue, key) =>
                              <option value={productsCategoryValue.id}> {productsCategoryValue.category_name} </option>
                            ) 
                          }
                        </Input>
                      </Col>
                    </FormGroup>
                    
                    <FormGroup row>
                      <Col md="3">
                        <Label htmlFor="productBrand">Brand Name</Label>
                      </Col>
                      <Col xs="12" md="9">
                        <Input type="text" id="productBrand" name="productBrand" placeholder="Brand Name" />
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col md="3">
                        <Label htmlFor="productPrice">Product Price</Label>
                      </Col>
                      <Col xs="12" md="9">
                        <Input type="text" id="productPrice" name="productPrice" placeholder="Product Price" />
                      </Col>
                    </FormGroup>
                    
                    {
                      this.state.user_type == 'vendor' ?
                          
                      <div>
                        <FormGroup row>
                          <Col md="3">
                            <Label htmlFor="vendorList">Vendor </Label>
                          </Col>
                          <Col xs="12" md="9">
                            <Input  type="text" id="vendorId" name="vendorId" placeholder="" readOnly="true" value={this.state.userName} />
                          </Col>
                        </FormGroup>
                      </div>
                      :
                      <div>
                        <FormGroup row>
                          <Col md="3">
                            <Label htmlFor="vendorList">Vendor List</Label>
                          </Col>
                          <Col xs="12" md="9">
                            <Input type="select" name="vendorId" id="vendorId" onChange={this.handlevendorList.bind(this)} value={this.state.vendorId}>
                              <option value="0">Please select</option>
                              {
                                this.state.vendorList.map((vendorListValue, key) =>
                                  <option value={vendorListValue.id}> {vendorListValue.name} </option>
                                )
                              }
                            </Input>
                          </Col>
                        </FormGroup>
                      </div>
                    }

                    {
                      this.state.userList.map((userListValue, key) =>
                      userListValue.username == this.state.userName ? 
                        userListValue.user_type == 'vendor' ?
                          <div>
                            <FormGroup row>
                              <Col md="3">
                                <Label htmlFor="productSKU">Product SKU</Label>
                              </Col>
                              
                              <Col xs="12" md="9">
                                <Input type="text" id="productSKU" name="productSKU" placeholder="Product SKU" readOnly="true" value=/*{'BNJ-'+this.state.userCode+'-'+this.state.newProductCode}*/{this.state.productSKUcode} />
                              </Col>
                            </FormGroup>
                          </div>
                        :
                        <div>
                          <FormGroup row>
                            <Col md="3">
                              <Label htmlFor="productSKU">Product SKU</Label>
                            </Col>
                            <Col xs="12" md="9">
                              <Input type="text" id="productSKU" name="productSKU" placeholder="Product SKU" readOnly="true" value={this.state.productSKUcode} />
                            </Col>
                          </FormGroup>
                        </div>
                      :
                      null
                      )
                    }

                    {/* <FormGroup row>
                      <Col md="3">
                        <Label htmlFor="productSKU">Product SKU</Label>
                      </Col>
                      <Col xs="12" md="9">
                        <Input type="text" id="productSKU" name="productSKU" placeholder="Product SKU" readOnly="true" value={'BNJ-'+this.state.userCode+'-00000'} />
                      </Col>
                    </FormGroup> */}

                    
                    {/* <FormGroup row>
                      <Col md="3">
                        <Label htmlFor="productSpecification">Product Specification</Label>
                      </Col>
                      <Col xs="12" md="9">
                        <Input type="select" name="productSpecification" id="productSpecification" onChange={this.changeSpecification} value={this.state.value}>
                          <option value="0">Please select</option>
                          {
                            this.state.productsSpecificationName.map((productsSpecificationNameValue, key) =>
                              <option key={key} value={productsSpecificationNameValue.id}> {productsSpecificationNameValue.specification_name} </option>
                            )
                          }
                        </Input>
                      </Col>
                    </FormGroup> */}

                    {/* Color according to the specificatoion */}
                    <FormGroup row style={{border: '2px', solid: '#000'}}>
                      {this.specficationsAll}
                    </FormGroup>

                    {/* <FormGroup row>
                      <Col md="3">
                        <Label htmlFor="productDetailsSpecification">Product Details Specification</Label>
                      </Col>
                      <Col xs="12" md="9">
                        <Input type="select" name="productDetailsSpecification" id="productDetailsSpecification" onChange={this.addSPDClick.bind(this)} >
                          <option value="0">Please select</option>
                          {
                            this.state.productsSpecificationDetails.map((productsSpecificationDetailsValue, key) =>
                            productsSpecificationDetailsValue.category_id == 1 ?
                              JSON.parse(productsSpecificationDetailsValue.specification_details_name).map((productsSpecificationDetailsValueParsed, key) =>
                                <option value={productsSpecificationDetailsValueParsed}> {productsSpecificationDetailsValueParsed} </option>
                              ) :
                              null
                            )
                          }
                        </Input>
                      </Col>
                    </FormGroup> */}

                    {/* Color according to the specificatoion */}
                    <FormGroup row>
                      <Col md="3">
                      </Col>
                      <Col xs="12" md="9">
                        {/* {colorMessage}
                        {sizeMessage}
                        {weightMessage} */}
                        {/* {this.createSPDUI()} */}
                      </Col>
                    </FormGroup>

                    {this.createUI()}
                    
                    <FormGroup row>
                      <Col md="3">
                        
                      </Col>
                      <Col xs="12" md="9">
                        <Button color="primary" className="btn-pill btn btn-light btn-block" size="sm" onClick={this.addClick.bind(this)}> <i className="fa fa-plus-square"></i> Add More</Button>
                        &nbsp;
                      </Col>
                    </FormGroup>

                    {this.createImageUI()}

                    <Button type="submit" size="sm" color="success"><i className="fa fa-dot-circle-o"></i> Submit</Button>&nbsp;
                    <Button type="reset" size="sm" color="danger"><i className="fa fa-ban"></i> Reset</Button>
                  </Form>
                </CardBody>
                <CardFooter>
                  
                </CardFooter>
              </Card>
            </Col>
         
         
         
          </Row>

        </ModalBody>
        {/* <ModalFooter>
          <Button color="secondary" onClick={this.toggleLarge}>Cancel</Button>
        </ModalFooter> */}
      </Modal>
      
    </Row>
    
    )
  }
}



export default Products;
