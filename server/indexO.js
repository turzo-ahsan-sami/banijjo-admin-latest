const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();
var session = require('express-session');
var fs = require('fs');
const multer = require('multer');

// const upload = multer({dest: 'upload/'});
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'upload/')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '.png')
  }
})
var upload = multer({ storage: storage })
var type = upload.single('image');

var isNullOrEmpty = require('is-null-or-empty');

app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({key: 'username', secret: 'ambalabanijjopluscom'}));

const dbConnection = mysql.createConnection ({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'ecommerce'
});

dbConnection.connect((err) => {
  if (err) {
      throw err;
  }
  console.log('Connected to database');
});

// app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
  extended: true
}));


app.get('/api/categories', (req, res) => {
  dbConnection.query('SELECT * FROM category ORDER BY id DESC', function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: error, data: results, message: 'category list.' });
  });
});

app.get('/api/product_specification_names', (req, res) => {
  dbConnection.query('SELECT * FROM product_specification_names ORDER BY id DESC', function (error, results, fields) {
    console.log(results);
    if (error) throw error;
    return res.send({ error: error, data: results, message: 'sepecification name list.' });
  });
});

app.get('/api/product_specification_details', (req, res) => {
  dbConnection.query('SELECT * FROM product_specification_details WHERE status="active" ORDER BY id DESC', function (error, results, fields) {
    console.log(results);
    if (error) throw error;
    return res.send({ error: error, data: results, message: 'sepecification name list.' });
  });
});

app.get('/api/vendor_list_for_product', (req, res) => {
  dbConnection.query('SELECT * FROM vendor ORDER BY id DESC', function (error, results, fields) {
    console.log(results);
    if (error) throw error;
    return res.send({ error: error, data: results, message: 'sepecification name list.' });
  });
});

app.get('/api/product_list', (req, res) => {
  console.log('Session Values : ', req.query.id);

  dbConnection.query('SELECT employee_id, user_type FROM user WHERE username="'+ req.query.id +'"', function (error, results, fields) {
    console.log('User Type : ', results[0].user_type);
    if (error) throw error;
    if (results[0].user_type == 'vendor') {
      vendor_products (results[0].employee_id, res);
    }
    else {
      admin_products (res);
    }
    // return res.send({ error: error, data: results, message: 'sepecification name list.' });
  });

  // dbConnection.query('SELECT * FROM products ORDER BY id DESC', function (error, results, fields) {
  //   console.log('THE result is : ', results);
  //   if (error) throw error;
  //   return res.send({ error: error, data: results, message: 'sepecification name list.' });
  // });
});

function vendor_products (vendor_id, res) {
  console.log('Inside the vendor_products function & vendor is : ', vendor_id);
  dbConnection.query('SELECT * FROM products WHERE vendor_id = "'+ vendor_id +'" ORDER BY id DESC', function (error, results, fields) {
    console.log(results);
    if (error) throw error;
    return res.send({ error: error, data: results, message: 'sepecification name list.' });
  });
}

function admin_products (res) {
  dbConnection.query('SELECT * FROM products ORDER BY id DESC', function (error, results, fields) {
    console.log(results);
    if (error) throw error;
    // return results;
    return res.send({ error: error, data: results, message: 'sepecification name list.' });
  });
}

// app.get('/api/product_list_vendor_wise', (req, res) => {
//   console.log('Vendor Id : ', req.body);
//   dbConnection.query('SELECT * FROM products ORDER BY id DESC', function (error, results, fields) {
//     console.log(results);
//     if (error) throw error;
//     return res.send({ error: error, data: results, message: 'sepecification name list.' });
//   });
// });

app.get('/api/user_list', (req, res) => {
  dbConnection.query('SELECT * FROM user', function (error, results, fields) {
    console.log(results);
    if (error) throw error;
    return res.send({ error: error, data: results, message: 'sepecification name list.' });
  });
});

app.post('/api/saveProduct',(req,res)=>{
  console.log('The Request : ', req.body);

  return res.send({success: true});

  // try {
  //   if ((isNullOrEmpty(req.body.productName) == false) && (isNullOrEmpty(req.body.productPrice) == false) && (isNullOrEmpty(req.body.productSKU) == false) && (req.body.productCategory != 0) && (isNullOrEmpty(req.body.productBrand) == false) && (req.body.vendorId != 0)) {

  //     var insert_sql_query = "INSERT INTO products (product_name, category_id, product_sku, product_specification_id, product_specification_name, product_specification_details, product_specification_details_description, product_full_description, qc_status, image, vendor_id, status) VALUES ('"+req.body.productName+"', '"+req.body.productCategory+"', '"+req.body.productSKU+"', '"+JSON.stringify(req.body.productSPName)+"', '"+JSON.stringify(req.body.productSpecificationBoxFun)+"', '"+JSON.stringify(req.body.productSPD)+"', '"+JSON.stringify(req.body.productSPDFull)+"', '"+JSON.stringify(req.body.productDescriptionFull)+"', '1', '"+JSON.stringify(req.body.images)+"', '"+req.body.vendorId+"', '1' )";

  //     dbConnection.query(insert_sql_query, function (err, result) {
          
  //         if (result) {
  //             console.log("1 record inserted to category");
  //             return res.send({success: true, server_message: result});
  //         }
  //         else {
  //             console.log('Error to inseret at category : ', err);
  //             return res.send({success: false, error: err});
  //         }

  //     });
  //   }
  //   else{
  //     return res.send({success: false});
  //   }
    
  // }
  // catch (error) {
  //     if (error) return res.send({success: false, error: 'Error has occured at the time of insert data to PRODUCTS table', request : req.body});
  // }

});

app.post('/api/vendor-registration',(req,res)=>{
  console.log('The Request : ', req.body);

  var checkVendorEntry = 0

  if (req.body.userPassword == req.body.userRePassword) {

    try {
      if ((isNullOrEmpty(req.body.userName) == false) && (isNullOrEmpty(req.body.userPassword) == false) && (isNullOrEmpty(req.body.userEmail) == false) ) {
  
        var insert_sql_query = "INSERT INTO vendor (name, email, website, address, status) VALUES ('"+req.body.name+"', '"+req.body.userEmail+"', '"+req.body.userWebsite+"', '"+req.body.userAddress+"', 'active')";
  
        dbConnection.query(insert_sql_query, function (err, result) {
            
            if (result) {
              console.log("1 record inserted to vendor");
              selectVendorInfo (req.body.userEmail, req.body.userName, req.body.userPassword);
            }
            else {
                console.log('Error to inseret at vendor : ', err);
                return res.send({success: false, error: err});
            }
        });
      }
      else{
        return res.send({success: false});
      }
    }
    catch (error) {
      if (error) return res.send({success: false, error: 'Error has occured at the time of insert data to PRODUCTS table', request : req.body});
    }

    function selectVendorInfo (email, userName, userPassword) {
      console.log('email : ', email);
      select_sql_query = "SELECT id FROM vendor WHERE email='"+email+"'";
      dbConnection.query(select_sql_query, function (error, results, fields) {
        console.log('Results From Vendor', results);
        insertUserInfo (email, userPassword, results[0].id);
        if (error) throw error;
        // return res.send({ error: error, data: results, message: 'sepecification name list.' });
      });
      // return 
    }

    function insertUserInfo (userName, userPassword, employee_id) {
      try {
        var insert_sql_query = "INSERT INTO user (username, password, employee_id, user_type) VALUES ('"+userName+"', '"+userPassword+"', '"+employee_id+"', 'vendor')";
  
        dbConnection.query(insert_sql_query, function (err, result) {
            console.log('user insert result : ', result);
            console.log('user error result : ', err);
            if (result) {
                console.log("1 record inserted to user");
                return res.send({success: true, server_message: result});
            }
            else {
                console.log('Error to inseret at user : ', err);
                return res.send({success: false, error: err});
            }
        });
      }
      catch (error) {
        if (error) return res.send({success: false, error: 'Error has occured at the time of insert data to PRODUCTS table', request : req.body});
      }
    }
    

    }
    else {
      Console.log('Not OK !!');
      return res.send({success: false});
    }
    

});

app.post('/api/user-login', (req, res) => {
  console.log('User Name : ', req.body.username);
  console.log('User Password : ', req.body.password);

  var sessionStorage = '';

  select_sql_query = "SELECT username,email,user_status FROM user WHERE username='"+req.body.username+"' AND password='"+req.body.password+"'";

  dbConnection.query(select_sql_query, function (error, results) {
    console.log("results",results);
    if (results.length > 0) {
      req.session.username = results[0].username;
      req.session.email = results[0].email;
      req.session.user_status = results[0].user_status;
      sessionStorage = req.session;

      console.log(req.session);
      var success = true;
    }
    else {
      var success = false;
    }
    if (error) throw error;
    return res.send({ error: error, success: success, session: sessionStorage, message: 'sepecification name list.' });
  });
});

app.get('/api/testing', (req, res) => {

  console.log(req.session);
  return res.send({ session: req.session}); 
});

app.get('/api/user-logout', (req, res) => {

  req.session.destroy(function(error) {
    if (error) throw error;
    return res.send({ error: error, data: err, message: 'Error to logout.' });
  });
  
});

app.post('/api/saveVendor', type, (req,res)=>{
  console.log('The Request For Files: ', req.file);
  console.log('The Request For Other Values: ', req.body);

  // const file = req.file
  // res.send(file)

  // var tmp_path = req.file.path;
  // var target_path = 'uploads/' + req.file.filename;

  // console.log('tmp path : ', tmp_path);
  // console.log('target path : ', target_path);

  // var src = fs.createReadStream(tmp_path);
  // console.log(src);
  // var dest = fs.createWriteStream(target_path);
  // src.pipe(dest);

  // src.on('end', function() { return res.send({success: true, request:req.body}); });
  // src.on('error', function(err) { return res.send({success: false, request:req.body}); });

  // return res.send({success: true, request:req.body});

  try {
    var insert_sql_query = "INSERT INTO vendor (name, email, website, address, status) VALUES ('"+req.body.name+"', '"+req.body.email+"', '"+req.body.website+"', '"+req.body.address+"', '1' )";

    dbConnection.query(insert_sql_query, function (err, result) {
        
        if (result) {
            console.log("1 record inserted to category");
            return res.send({success: true, server_message: result});
        }
        else {
            console.log('Error to inseret at category : ', err);
            return res.send({success: false, error: err});
        }

    });
    
  }
  catch (error) {
      if (error) return res.send({success: false, error: 'Error has occured at the time of insert data to PRODUCTS table', request : req.body});
  }

});

app.post('/api/saveSpecification',(req,res)=>{
  values = req.body.values;
  var valuesArray = values.split(" ");

  console.log('The Request values : ', req.body.ProductSpecificationValuesArray);
  console.log('The Request values json formate : ', JSON.stringify(req.body.ProductSpecificationValuesArray));
  console.log('The Request name : ', req.body.name);
  console.log('The Request categoryId : ', req.body.categoryId);

  // return res.send({success: true});

  try {
    var insert_sql_query = "INSERT INTO product_specification_names (specification_name, category_id, value, status) VALUES ('"+req.body.name+"', '"+req.body.categoryId+"', '"+JSON.stringify(req.body.ProductSpecificationValuesArray)+"', '1' )";

    dbConnection.query(insert_sql_query, function (err, result) {
        
        if (result) {
            console.log("1 record inserted to category");
            return res.send({success: true, server_message: result});
        }
        else {
            console.log('Error to inseret at category : ', err);
            return res.send({success: false, error: err});
        }

    });
    
  }
  catch (error) {
      if (error) return res.send({success: false, error: 'Error has occured at the time of insert data to PRODUCTS table', request : req.body});
  }

});

app.post('/api/saveSpecificationDetails',(req,res)=>{
  values = req.body.specification_details_name;
  // var valuesArray = values.split(" ");
  
  console.log('The Request : ', req.body.ProductSpecificationValuesArray);

  // return res.send({success: true});

  try {
    var insert_sql_query = "INSERT INTO product_specification_details (category_id, specification_details_name, status) VALUES ('"+req.body.categoryId+"', '"+JSON.stringify(req.body.ProductSpecificationValuesArray)+"', '1' )";

    dbConnection.query(insert_sql_query, function (err, result) {
        
        if (result) {
            console.log("1 record inserted to category");
            return res.send({success: true, server_message: result});
        }
        else {
            console.log('Error to inseret at category : ', err);
            return res.send({success: false, error: err});
        }

    });
    
  }
  catch (error) {
      if (error) return res.send({success: false, error: 'Error has occured at the time of insert data to PRODUCTS table', request : req.body});
  }

});

app.post('/api/saveCategory',(req,res)=>{

    try {
        var insert_sql_query = "INSERT INTO category (category_name, description, parent_category_id, status) VALUES ('"+req.body.categoryName+"', '"+req.body.categoryDescription+"', '"+req.body.parentCategory+"', '"+req.body.isActive+"')";

        dbConnection.query(insert_sql_query, function (err, result) {
            
            if (result) {
                console.log("1 record inserted to category");
                return res.send({success: true, server_message: result});
            }
            else {
                console.log('Error to inseret at category : ', err);
                return res.send({error: err});
            }

        });
    }
    catch (error) {
        if (error) return res.send({error: 'Error has occured at the time of insert data to CATEGORY table', request : req.body});
    }
    
    console.log(req);
});

app.listen(3001, () =>
  console.log('Express server is running on localhost:3001')
);