const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
var session = require('express-session');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const fileUpload = require('express-fileupload');
var path = require('path');
var unique = require('array-unique');
const app = express();
const util = require('util');
var cookieParser = require('cookie-parser');
var async = require('async');
var cors = require('cors');
const pad = require("pad");
const nodemailer = require("nodemailer");
var isNullOrEmpty = require('is-null-or-empty');
const https = require("https");
// const https = require('https').globalAgent.options.ca = require('ssl-root-cas/latest').create();
const crypto = require('crypto');
const compress_images = require("compress-images");

// var key = fs.readFileSync(__dirname + "\\ssl\\server.key");
// var cert = fs.readFileSync(__dirname + "\\ssl\\server.crt");
// var credentials = {
//   key: key,
//   cert: cert
// };

const credentials = {
  key: fs.readFileSync(__dirname + "\\privatekey.pem"),
  cert: fs.readFileSync(__dirname + "\\certificate.pem")
};

// require('https').globalAgent.options.ca = require('ssl-root-cas/latest').create();

app.use(fileUpload());
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Headers");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    next();
});

// var corsOptions = {
//   origin: 'http://localhost:3002',
//   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// }

// const upload = multer({dest: 'upload/'});

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

var isNullOrEmpty = require('is-null-or-empty');

// app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({ key: 'username', secret: 'ambalabanijjopluscom' }));

const dbConnection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'ecommerce',
  dateStrings:true
});

dbConnection.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to database');
});

const query = util.promisify(dbConnection.query).bind(dbConnection);

const mailBox = nodemailer.createTransport({
  service: 'banijjo',
  auth: {
      // user: process.env.GMAIL_USER,
      // pass: process.env.GMAIL_PASS,
      user: 'info@banijjo.com.bd',
      pass: 'banijjo!@#$%'
  },
  tls: {
        rejectUnauthorized: false
    }
});

app.post('/api/saveVendor', verifyToken, (req, res) => {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      res.sendStatus(403);
    }
    else {
      if (req.files === null) {
        return res.status(400).json({ msg: 'No file uploaded' });
      }

      const file = req.files.file;

      file.mv(`${__dirname}/../public/upload/vendor/${file.name}`, err => {
        if (err) {
          console.error(err);
          return res.status(500).send(err);
        }
        try {
          var insert_sql_query = "INSERT INTO vendor (name, email, website, address, status,image) VALUES ('" + req.body.name + "', '" + req.body.email + "', '" + req.body.website + "', '" + req.body.address + "', '1','" + file.name + "' )";

          dbConnection.query(insert_sql_query, function (err, result) {

            if (result) {
              console.log("1 record inserted to category");
              return res.send({ success: true, message: "success" });
            }
            else {
              console.log('Error to inseret at category : ', err);
              return res.send({ success: false, error: err });
            }

          });

        }
        catch (error) {
          if (error) return res.send({ success: false, error: 'Error has occured at the time of insert data to PRODUCTS table', message: req.body });
        }
      });
    }
  });

});



app.get('/api/category_order_list_delete', verifyToken, async function(req, res, next) {
  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if (err) {
      res.status(403).send({success: false, message: 'jwt expired', status: '403'});
    }
    else {
      try {
        const category_order_delete = await query('DELETE FROM category_order');
        return res.send({ success: true, message: 'success' });
      } catch (e) {
        console.log('Error : ', e);
        return res.send({ success: false, message: 'error' });
      }

    }
  });

});

app.get('/api/nav_category_order_list_delete', verifyToken, async function(req, res, next) {
  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if (err) {
      res.status(403).send({success: false, message: 'jwt expired', status: '403'});
    }
    else {
      try {
        const category_order_delete = await query('DELETE FROM category_top_navbar');
        return res.send({ success: true, message: 'success' });
      } catch (e) {
        return res.send({ success: false, message: 'failed' });
      }

    }
  });

});

app.get('/api/search_filter_categories', verifyToken, (req, res) => {
  console.log('categoryList Values : ', req.query.categoryList);

  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      res.sendStatus(403);
    }
    else {
      dbConnection.query('SELECT * FROM category WHERE parent_category_id = 0', function (error, results, fields) {

        if (error) throw error;
        return res.send({ data: results, message: 'data' });

      });
    }
  });

  // return res.send({ success: 'true', data: req.query.id, message: 'data' });

});

app.get('/api/search_filter_nav_categories', verifyToken, (req, res) => {
  console.log('categoryList Values : ', req.query.categoryList);

  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      res.sendStatus(403);
    }
    else {
      dbConnection.query('SELECT * FROM category', function (error, results, fields) {

        if (error) throw error;
        return res.send({ data: results, message: 'data' });

      });
    }
  });

  // return res.send({ success: 'true', data: req.query.id, message: 'data' });

});

app.get('/api/search_category_for_order_list', verifyToken, (req, res) => {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      res.sendStatus(403);
    }
    else {
      console.log('Searched Text : ', req.query.search_string);
      dbConnection.query('SELECT * FROM category WHERE parent_category_id = 0 AND category_name LIKE "%'+ req.query.search_string +'%"', function (error, results, fields) {
        if (error) throw error;
        return res.send({ data: results, message: 'data' });
      });
    }
  });

  // return res.send({ success: 'true', data: req.query.id, message: 'data' });
});

app.get('/api/search_nav_category_for_order_list', verifyToken, (req, res) => {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      res.sendStatus(403);
    }
    else {
      console.log('Searched Text : ', req.query.search_string);
      dbConnection.query('SELECT * FROM category WHERE category_name LIKE "%'+ req.query.search_string +'%"', function (error, results, fields) {
        if (error) throw error;
        return res.send({ data: results, message: 'data' });
      });
    }
  });

  // return res.send({ success: 'true', data: req.query.id, message: 'data' });
});

app.get('/api/category_order_list', async function(req, res, next) {
  const category_order_select = await query('SELECT * FROM category_order where status = 1');
  console.log('category_order : ', category_order_select);
  return res.send({ success: true, data: category_order_select, message: 'data' });
});

app.get('/api/nav_category_order_list', async function(req, res, next) {
  const category_order_select = await query('SELECT * FROM category_top_navbar where status = 1');
  console.log('category_order for top : ', category_order_select);
  return res.send({ success: true, data: category_order_select, message: 'data' });
});

app.post('/api/save_selected_category_order', verifyToken, async function(req, res, next) {
  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if (err) {
      res.status(403).send({success: false, message: 'jwt expired', status: '403'});
    }
    else {
      try {
        console.log('selected category submitted value : ', req.body);
        const category_order_select = await query('SELECT COUNT(id) AS total_category_order_size FROM category_order where status = 1');
        if (category_order_select[0].total_category_order_size > 0) {
          const category_order_delete = await query('DELETE FROM category_order');
        }
        else {
          console.log('Not Working ! ', category_order_select[0].total_category_order_size);
        }

        console.log('Category Order List : ', req.body.PurchaseList);

        for ( const i in req.body.PurchaseList ) {
          console.log(req.body.PurchaseList[i].categoryName);

          const category_order_insert = await query("INSERT INTO category_order (category_id, category_name, effectiveDate, status) VALUES ('"+req.body.PurchaseList[i].categoryId+"', '"+req.body.PurchaseList[i].categoryName+"', '"+req.body.effectiveDate+"', '1')");
          console.log('inserted result : ', category_order_insert);
          
          const update_sql_query = await query ("update category_order set slug = slugify(category_name, id) WHERE id = '"+category_order_insert.insertId+"'");
        }

        

        // const update_sql_query = await query ("update category_order set slug = slugify(category_name, id) WHERE ");

        return res.send({ success: true, message: 'success' });

      } catch (e) {
        console.log('Error : ', e);

        return res.send({ success: false, message: 'failed' });

      }

    }
  });

});

app.post('/api/save_selected_nav_category_order', verifyToken, async function(req, res, next) {
  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if (err) {
      res.status(403).send({success: false, message: 'jwt expired', status: '403'});
    }
    else {
      try {
        console.log('selected category submitted value : ', req.body);
        const category_order_select = await query('SELECT COUNT(id) AS total_category_order_size FROM category_top_navbar where status = 1');
        if (category_order_select[0].total_category_order_size > 0) {
          const category_order_delete = await query('DELETE FROM category_top_navbar');
        }
        else {
          console.log('Not Working ! ', category_order_select[0].total_category_order_size);
        }
        for ( const i in req.body.PurchaseList ) {
          console.log(req.body.PurchaseList[i].categoryName);

          const category_order_insert = await query("INSERT INTO category_top_navbar (category_id, category_name, effectiveDate, status) VALUES ('"+req.body.PurchaseList[i].categoryId+"', '"+req.body.PurchaseList[i].categoryName+"', '"+req.body.effectiveDate+"', '1')");
        
          const update_sql_query = await query ("update category_top_navbar set slug = slugify(category_name, id) WHERE id = '"+category_order_insert.insertId+"'");
        }

        

        return res.send({ success: true, message: 'success' });
      } catch (e) {
        console.log('Error : ', e);
        return res.send({ success: false, message: 'Failed' });
      }

    }
  });

});



app.get('/api/category_feature_list', async function(req, res, next) {
  const category_order_select = await query('SELECT * FROM featured_category where status = 1');
  return res.send({ success: true, data: category_order_select, message: 'data' });
});
app.get('/api/category_feature_list_delete', verifyToken, async function(req, res, next) {

  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if (err) {
      res.status(403).send({success: false, message: 'jwt expired', status: '403'});
    }
    else {
      try {
        const category_order_delete = await query('DELETE FROM featured_category');
        return res.send({ success: true, message: 'success' });
      } catch (e) {
        console.log('Error : ', e);
        return res.send({ success: false, message: 'failed' });
      }

    }
  });

});
app.post('/api/save_feature_category', verifyToken, async function(req, res, next) {
  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if (err) {
      res.status(403).send({success: false, message: 'jwt expired', status: '403'});
    }
    else {
      try {
        console.log('selected category submitted value : ', req.body);
        const category_order_select = await query('SELECT COUNT(id) AS total_category_order_size FROM featured_category where status = 1');
        if (category_order_select[0].total_category_order_size > 0) {
          const category_order_delete = await query('DELETE FROM featured_category');
        }
        else {
          console.log('Not Working ! ', category_order_select[0].total_category_order_size);
        }
        console.log('Request Category : ', req.body.PurchaseList);
        console.log('Request effective date : ', req.body.effectiveDate);
        for ( const i in req.body.PurchaseList ) {
          console.log(req.body.PurchaseList[i].categoryName);

          const category_order_insert = await query("INSERT INTO featured_category (category_id, category_name, effectiveDate, status) VALUES ('"+req.body.PurchaseList[i].categoryId+"', '"+req.body.PurchaseList[i].categoryName+"', '"+req.body.effectiveDate+"', '1')");
        }

        return res.send({ success: true, message: 'Data Saved Succesfully' });
      } catch (e) {
        console.log('Error : ', e);

        return res.send({ success: false, message: 'Data Saving Error' });
      }

    }
  });

});

app.post('/api/checkUsername', (req, res) => {
  try{
    var query = "Select COUNT(*) as countUsername from user where username='"+ req.body.inputValue+"'";
    dbConnection.query(query, function (err, result) {
      if (result[0].countUsername!=0) {
        return res.send({ success: true, message: false });
      }
      else {
        console.log('Error to inseret at category : ', err);
        return res.send({ success: false, message: true });
      }
    });
  }
  catch (error) {
    if (error) return res.send({ success: false, error: 'Error has occured', request: req.body });
  }
});


app.post('/api/checkShopExist', (req, res) => {
  try{
      console.log('check shop exist : ', req.body.inputValue);
    var query = "Select COUNT(*) as countShop from vendor_details where shop_name='"+req.body.inputValue+"'";
    dbConnection.query(query, function (err, result) {
      if (result[0].countShop!=0) {
        return res.send({ success: true, message: false });
      }
      else {
        console.log('may be available: ', err);
        return res.send({ success: false, message: true });
      }
    });
  }
  catch (error) {
    if (error) return res.send({ success: false, error: 'Error has occured', request: req.body });
  }
});

app.get('/api/get-category-for-edit', async function (req, res) {
    try {
        var getCategoryInfo = await query ('SELECT * FROM category WHERE softDel = 0 AND id = '+ req.query.id);

        return res.send({success: true, data: getCategoryInfo});
    } catch (e) {
        console.log('Error : ', e);

        return res.send({success: false, data: getCategoryInfo});
    }

});

app.get('/api/categories', (req, res) => {
  dbConnection.query('SELECT * FROM category WHERE softDel = 0 ORDER BY id DESC', function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: error, data: results, message: 'category list.' });
  });
});

app.get('/api/parent-categories', (req, res) => {
  dbConnection.query('SELECT * FROM category WHERE parent_category_id = 0 ORDER BY id DESC', function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: error, data: results, message: 'category list.' });
  });
});

app.get('/api/sales-bill-no', async function (req, res) {
  console.log('Get Sales Bill No ');
  console.log('User Type : ', req.query.userType);
  console.log('User Id : ', req.query.empId);

  if (req.query.userType == 'super_admin' || req.query.userType == 'admin' || req.query.userType == 'admin_manager') {
    const sells_bill_no = await query ('SELECT DISTINCT sales.id, sales.sales_bill_no FROM sales_details INNER JOIN sales ON sales_details.salesBillId = sales.id INNER JOIN products ON sales_details.productId = products.id WHERE sales_details.delivery_status = 1 AND sales_details.status = 1 AND sales.status = 1 AND products.status = 1 AND products.isApprove = 1 AND products.softDelete = 0');
    console.log('sells_bill_no : ', sells_bill_no);
    return res.send({ data: sells_bill_no, message: 'sells bill list.' });
  }
  else if (req.query.userType == 'vendor') {
    const sells_bill_no = await query ('SELECT DISTINCT sales.id, sales.sales_bill_no FROM sales_details INNER JOIN sales ON sales_details.salesBillId = sales.id INNER JOIN products ON sales_details.productId = products.id WHERE sales_details.delivery_status = 1 AND sales_details.status = 1 AND sales.status = 1 AND products.status = 1 AND products.isApprove = 1 AND products.softDelete = 0 AND products.vendor_id = '+req.query.empId);

    return res.send({ data: sells_bill_no, message: 'sells bill list.' });
  }
  else {
    return res.send({ data: [], message: 'sells bill list.' });
  }

});

app.get('/api/get-product-sales-bill-wise', async function (req, res) {

  const get_products_info = await query('SELECT DISTINCT sales_details.productId, products.product_name FROM sales_details INNER JOIN products ON sales_details.productId = products.id WHERE sales_details.delivery_status = 1 AND sales_details.status = 1 AND products.status = 1 AND products.isApprove = 1 AND products.softDelete = 0 AND sales_details.salesBillId = '+req.query.billId);

  return res.send({ data: get_products_info, message: 'product list.' });
});

app.get('/api/delete-delivery-system', verifyToken, async function (req, res) {

  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if (err) {
      // res.sendStatus(403).send({ success: false });
      res.status(403).send({success: false, message: 'jwt expired', status: '403'});
    }
    else {
      try {
        const delete_sales_bill_according_to_delivery = await query('UPDATE sales_details SET comission_amount=null, vendor_payable_amount=null, chalan_no=null, delivery_status=1, delivery_date = null WHERE delivery_status != 1 AND status = 1 AND id = '+req.query.id);

        return res.send({ success: true, data: delete_sales_bill_according_to_delivery, message: 'product list.' });
      } catch (e) {
        console.log('Error : ', e);

        return res.send({ success: false, data: [], message: 'Failed.' });
      }

    }
  });

});

app.get('/api/edit-delivery-system', verifyToken, async function (req, res) {

  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if (err) {
      res.sendStatus(403).send({ success: false });
    }
    else {
      try {
        const get_data_for_edit = await query('SELECT sales.sales_bill_no, products.product_name, sales_details.salesBillId, sales_details.productId, sales_details.delivery_status, sales_details.delivery_date, sales_details.chalan_no FROM sales_details INNER JOIN sales ON sales_details.salesBillId = sales.id INNER JOIN products ON sales_details.productId = products.id WHERE sales_details.id = '+req.query.id);

        return res.send({ success: true, data: get_data_for_edit, message: 'Edit Info.' });
      }
      catch (err) {
        console.log('Error at edit delivery system : ', err);

        return res.send({ success: false, data: err, message: 'Edit Info.' });
      }

    }
  });

});

app.get('/api/get-delivery-list', async function (req, res) {

  const get_sales_bill_according_to_delivery = await query('SELECT * FROM sales_details WHERE delivery_status != 1 AND status = 1');

  return res.send({ data: get_sales_bill_according_to_delivery, message: 'product list.' });
});

app.get('/api/get-chalan-bill-no', async function (req, res) {

  const get_products_info = await query('SELECT COUNT(chalan_no) AS chalan_no FROM sales_details WHERE chalan_no IS NOT NULL');

  console.log('get_products_info : ', get_products_info);

  if (get_products_info[0].chalan_no > 0) {
    const get_products_info_string = await query('SELECT chalan_no FROM sales_details WHERE chalan_no IS NOT NULL');

    var tmp = 0;

    for (var i = 0; i < get_products_info_string.length; i++) {
      var chalan_string = get_products_info_string[i].chalan_no;

      chalan_string = chalan_string.split("-");

      console.log('chalan_string : ', chalan_string[1]);

      if (parseInt(chalan_string[1]) >= parseInt(tmp)) {
        tmp = parseInt(chalan_string[1]);
      }

    }

    // var count = get_products_info_string.match(/\d*$/);
    //
    // get_products_info_string = get_products_info_string.substr(0, count.index) + (++count[0]);
    //
    console.log('get_products_info_string : ', get_products_info_string);
    console.log('tmp : ', tmp);

    tmp = ++tmp;

    console.log('tmp after increment : ', tmp);

    let new_chalan_no = pad(5, tmp, '0');

    new_chalan_no = 'BNJ-'+new_chalan_no;

    return res.send({ data: new_chalan_no, message: 'product list.' });
  }
  else {

    let new_chalan_no = ++get_products_info[0].chalan_no;

    new_chalan_no = pad(5, new_chalan_no, '0');

    new_chalan_no = 'BNJ-'+new_chalan_no;

    return res.send({ data: new_chalan_no, message: 'product list.' });

  }


});

app.get('/api/vendor-payment-vendors', (req, res) => {
  dbConnection.query('SELECT * FROM vendor_details WHERE softDel = 0 AND status = 1 ORDER BY id DESC', function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: error, data: results, message: 'category list.' });
  });
});

app.get('/api/get-delivery-charge', (req, res) => {
  dbConnection.query('SELECT * FROM deliver_and_charge WHERE status = 1 AND softDel = 0 ORDER BY id DESC', function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: error, data: results, message: 'category list.' });
  });
});

app.get('/api/get-vat-tax', (req, res) => {
  dbConnection.query('SELECT * FROM vat_tax WHERE status = 1 AND softDel = 0 ORDER BY id DESC', function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: error, data: results, message: 'category list.' });
  });
});

app.post('/api/save_delivery_charge', verifyToken, async function(req, res, next) {

    console.log('special Category List For Specification');

    var category_id = "'"+req.body.CategoryList+"'";
    var type = "'"+req.body.type+"'";
    var max_range = "'"+req.body.maxRange+"'";
    var charge = "'"+req.body.charge+"'";
    var effective_date = "'"+req.body.date+"'";

    jwt.verify(req.token, 'secretkey', async function (err, authData) {
      if (err) {
        // res.sendStatus(403).send({ success: false });
        res.status(403).send({success: false, message: 'jwt expired', status: '403'});
      }
      else {
        try {
          const category_name = await query('INSERT INTO  deliver_and_charge (category_id, type, max_range, charge, effective_date, softDel, status) values ('+category_id+','+type+','+max_range+', '+charge+', '+effective_date+', 0, 1)');

          return res.send({ success: true, data: category_name, message: 'Success' });
        } catch (e) {
          return res.send({ success: false, data: [], message: 'Faild' });
        }

      }
    });

  });

  app.post('/api/update_delivery_system', verifyToken, async function(req, res, next) {
    var status = "'"+req.body.status+"'";
    var chalanNo = "'"+req.body.chalanNo+"'";

    jwt.verify(req.token, 'secretkey', async function (err, authData) {
      if (err) {
        res.status(403).send({success: false, message: 'jwt expired', status: '403'});
      }
      else {
        try {
          const update_sales_details_product_wise = await query ('UPDATE sales_details SET delivery_status='+status+' WHERE chalan_no='+chalanNo);

          return res.send({ success: true, data: [], message: 'delivery system updated' });
        }
        catch (err) {
          console.log('Erro at the time of delivery system update : ', err);

          return res.send({ success: false, data: [], message: 'delivery system updated' });
        }
      }
    });
  });

  app.post('/api/save_delivery_system', verifyToken, async function(req, res, next) {

      console.log('Delivery system submitted : ', req.body);

      var chalanNo = "'"+req.body.chalanNo+"'";
      // var productsSlelected = "'"+req.body.productsSlelected+"'";
      var status = "'"+req.body.status+"'";
      var salesBillNo = "'"+req.body.salesBillNo+"'";
      var date = "'"+req.body.date+"'";

      jwt.verify(req.token, 'secretkey', async function (err, authData) {
        if (err) {
          res.status(403).send({success: false, message: 'jwt expired', status: '403'});
        }
        else {

          try {
            for (var i = 0; i < req.body.productsSlelected.length; i++) {

              const vendorIds = await query ('SELECT DISTINCT vendor_id FROM products WHERE id = '+req.body.productsSlelected[i]);

              console.log('Vendors : ', vendorIds);
              console.log('Vendors : ', vendorIds[0].vendor_id);
              console.log('Products : ', req.body.productsSlelected[i]);

              const get_commision_value = await query('SELECT agreement_percentage FROM vendor_agreement WHERE vendor_id = '+vendorIds[0].vendor_id);

              console.log('get_commision_value : ', get_commision_value);

              if (!isNullOrEmpty(get_commision_value) && get_commision_value.length > 0) {

                const get_product_wise_total_amount = await query('SELECT customer_payable_amount FROM sales_details WHERE productId = '+req.body.productsSlelected[i]+' AND salesBillId = '+req.body.salesBillNo);

                console.log('get_product_wise_total_amount : ', get_product_wise_total_amount);

                const comission_amount = (parseInt(get_commision_value[0].agreement_percentage) * parseInt(get_product_wise_total_amount[0].customer_payable_amount))/parseInt(100);

                console.log('comission_amount : ', comission_amount);

                var vendor_payable_amount = parseInt(get_product_wise_total_amount[0].customer_payable_amount) - parseInt(comission_amount);

                const update_sales_details_product_wise = await query ('UPDATE sales_details SET comission_amount = '+comission_amount+', vendor_payable_amount = '+vendor_payable_amount+', chalan_no='+chalanNo+', delivery_status='+status+', delivery_date='+date+' WHERE productId='+req.body.productsSlelected[i]+' AND salesBillId='+salesBillNo);

                console.log('update_sales_details_product_wise : ', update_sales_details_product_wise);
              }

            }

            return res.send({ success: true, data: [], message: 'delivery system updated' });
          }
          catch (err) {
            console.log('error', err);
            return res.send({ success: false, data: err, message: 'delivery system not updated' });
          }

        }
      });

       // return res.send({ success: true, data: [], message: 'category list.' });

    });

app.post('/api/save_vat_tax', verifyToken, async function(req, res, next) {

    console.log('special Category List For Specification');

    var category_id = "'"+req.body.CategoryList+"'";
    var vat = "'"+req.body.vat+"'";
    var tax = "'"+req.body.tax+"'";
    var effective_date = "'"+req.body.date+"'";

    console.log(category_id);
    console.log(vat);
    console.log(tax);
    console.log(effective_date);

    jwt.verify(req.token, 'secretkey', async function (err, authData) {
      if (err) {
        // res.sendStatus(403).send({ success: false });
        res.status(403).send({success: false, message: 'jwt expired', status: '403'});
      }
      else {
        try {

            if (req.body.isUpdateClicked == true) {
                const category_name = await query('UPDATE  vat_tax SET category_id = '+category_id+', vat = '+vat+', tax = '+tax+', effective_date = '+effective_date+', softDel = 0, status = 1 WHERE id = '+req.body.editID);

                return res.send({ success: true, data: category_name, message: 'success.' });
            }
            else {
                const category_name = await query('INSERT INTO  vat_tax (category_id, vat, tax, effective_date, softDel, status) values ('+category_id+', '+vat+', '+tax+', '+effective_date+', 0, 1)');

                return res.send({ success: true, data: category_name, message: 'success.' });
            }

        } catch (e) {
          console.log('Error : ', e);
          return res.send({ success: false, data: category_name, message: 'Error' });
        }

        // return res.send({ success: true, data: 'category_name', message: 'category list.' });
      }
    });

  });

app.get('/api/getVatAndTaxData', async function(req, res, next) {
    try {
        const sql_query = await query ('SELECT * FROM vat_tax WHERE softDel = 0 AND status = 1 AND id = '+req.query.id);

        return res.send({ success: true, data: sql_query, message: 'success' });
    } catch (e) {
        console.log('Error : ', e);

        return res.send({ success: false, message: 'failed' });
    }
});

app.get('/api/delete-vat-tax', verifyToken, async function(req, res, next) {

    console.log('special Category List For Specification');

    jwt.verify(req.token, 'secretkey', async function (err, authData) {
      if (err) {
        // res.sendStatus(403).send({ success: false });
        res.status(403).send({success: false, message: 'jwt expired', status: '403'});
      }
      else {
        try {
          const category_name = await query('UPDATE vat_tax SET status = 2, softDel = 1 WHERE id = '+req.query.id);

          return res.send({ success: true, message: 'success' });
        } catch (e) {
          return res.send({ success: false, message: 'failed' });
        }

        // return res.send({ success: true, data: 'category_name', message: 'category list.' });
      }
    });

  });

app.get('/api/delete-delivery-charge', verifyToken, async function(req, res, next) {

    console.log('special Category List For Specification');

    jwt.verify(req.token, 'secretkey', async function (err, authData) {
      if (err) {
        res.status(403).send({success: false, message: 'jwt expired', status: '403'});
      }
      else {
        try {
          const category_name = await query('UPDATE deliver_and_charge SET status = 2, softDel = 1 WHERE id = '+req.query.id);

          return res.send({ success: true, message: 'Success' });
        } catch (e) {
          return res.send({ success: false, message: 'Failed' });
        }

        // return res.send({ success: true, data: 'category_name', message: 'category list.' });
      }
    });

  });



app.get('/api/specialCategoryListForSpecification', async function(req, res, next) {
    const parentAndChild = [];
    const parentAndChildRelation = [];

    let relationIndex = 0;

    console.log('special Category List For Specification');

    const category_name = await query('SELECT * FROM category');

    for ( const i in category_name ) {

      if (category_name[i].parent_category_id == 0) {
        parentAndChild[category_name[i].id] = category_name[i].category_name;
      }

      for ( const j in parentAndChild ) {
        if (category_name[i].parent_category_id == j) {
          parentAndChild[category_name[i].id] = parentAndChild[j]+'->'+category_name[i].category_name;
          ++relationIndex;
          parentAndChildRelation[relationIndex] = category_name[i].parent_category_id;
        }
      }

    }

    for ( const i in unique(parentAndChildRelation) ) {
      delete parentAndChild[parentAndChildRelation[i]];
    }

    for ( const i in parentAndChild ) {
      console.log('Consoling Chid Category : ','index : '+i+' value : '+parentAndChild[i]);
    }

    return res.send({ data: parentAndChild, message: 'category list.' });

  });

app.get('/api/product_specification_names', (req, res) => {
  dbConnection.query('SELECT product_specification_names.id AS id, product_specification_names.specification_name AS specification_name, product_specification_names.category_id AS category_id, product_specification_names.type AS type, category.category_name AS category_name FROM product_specification_names JOIN category ON product_specification_names.category_id = category.id WHERE product_specification_names.status = 1 AND product_specification_names.softDel = 0 ORDER BY product_specification_names.id DESC', function (error, results, fields) {
    console.log(results);
    if (error) throw error;
    return res.send({ error: error, data: results, message: 'sepecification name list.' });
  });
});

// app.get('/api/product_specification_details', (req, res) => {
//   dbConnection.query('SELECT * FROM product_specification_details WHERE status="active" ORDER BY id DESC', function (error, results, fields) {
//     console.log(results);
//     if (error) throw error;
//     return res.send({ error: error, data: results, message: 'sepecification name list.' });
//   });
// });

// ADD NEW USERS...
app.get('/api/getAllCreatedUsers', async function (req, res)  {

  const selected_user = await query('SELECT * FROM user WHERE user_type != "super_admin" AND user_type != "vendor" AND user_type != "customer" AND status="active" AND softDel = 0');

  console.log('selected users : ', selected_user);

  return res.send({ data: selected_user });
});

app.get('/api/delete_users', verifyToken, async function (req, res)  {

  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if (err) {
      res.status(403).send({success: false, message: 'jwt expired', status: '403'});
    }
    else {
      const delete_user = await query('UPDATE user SET softDel = 1, status = 2 WHERE id = '+ req.query.id);

      const selected_user = await query('SELECT * FROM user WHERE user_type != "super_admin" AND user_type != "vendor" AND user_type != "customer" AND status="active" AND softDel = 0');

      console.log('selected users : ', selected_user);

      return res.send({ data: selected_user, success: true, message: 'User Deleted' });
    }
  });

});

app.get('/api/update_users_clicked', async function (req, res)  {

  const selected_user = await query('SELECT * FROM user WHERE user_type != "super_admin" AND user_type != "vendor" AND user_type != "customer" AND status="active" AND softDel = 0 AND id = '+req.query.id);

  console.log('selected users : ', selected_user);

  return res.send({ data: selected_user, success: true, message: 'User update infos' });
});

app.post('/api/saveCreateUsers', verifyToken, async function (req, res)  {
  console.log('User Creation Requested Submission values : ', req.body);

  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if (err) {
      res.status(403).send({success: false, message: 'jwt expired', status: '403'});
    }
    else {
      var username = "'"+req.body.name+"'";
      var password = "'"+req.body.password+"'";
      var email = "'"+req.body.email+"'";
      var employee_id = "'"+req.body.employeeId+"'";
      var user_type = "'"+req.body.type+"'";
      var user_status = "'"+req.body.userStatus+"'";
      var create_date = "'"+req.body.createdDate+"'";
      var status = "'"+req.body.status+"'";

      const create_user = await query("INSERT INTO user (username, password, email, employee_id, user_type, user_status, create_date, status) VALUES ("+username+","+password+","+email+","+employee_id+","+user_type+","+user_status+","+create_date+","+status+")");

      console.log(create_user);

      const selected_user = await query('SELECT * FROM user WHERE user_type != "super_admin" AND user_type != "vendor" AND user_type != "customer" AND status="active" AND softDel = 0');

      return res.send({ success: true, result: create_user, all_users: selected_user, message: 'sepecification name list.' });
    }
  });

});

app.post('/api/updateCreateUsers', verifyToken, async function (req, res)  {
  console.log('User Creation Requested Submission values : ', req.body);

  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if (err) {
      res.status(403).send({success: false, message: 'jwt expired', status: '403'});
    }
    else {
      var username = "'"+req.body.name+"'";
      var password = "'"+req.body.password+"'";
      var email = "'"+req.body.email+"'";
      var employee_id = "'"+req.body.employeeId+"'";
      var user_type = "'"+req.body.type+"'";
      var user_status = "'"+req.body.userStatus+"'";
      var create_date = "'"+req.body.createdDate+"'";
      var status = "'"+req.body.status+"'";

      const create_user = await query("UPDATE user SET username = "+username+", password = "+password+", email = "+ email +", employee_id = "+ employee_id+", user_type = "+user_type +", user_status = "+ user_status +", user_status = "+user_status+", updated_date = "+create_date+", status = "+status+" WHERE id = "+req.body.updateId+"");

      console.log("UPDATE user SET username = "+username+", password = "+password+", email = "+ email +", employee_id = "+ employee_id+", user_type = "+user_type +", user_status = "+ user_status +", user_status = "+user_status+", updated_date = "+create_date+", status = "+status+"");

      const selected_user = await query('SELECT * FROM user WHERE user_type != "super_admin" AND user_type != "vendor" AND user_type != "customer" AND status="active" AND softDel = 0');

      return res.send({ success: true, result: 'checking', all_users: selected_user, message: 'sepecification name list.' });
    }
  });

});

// GET USER INFO FOR MY PROFILE
app.get('/api/getUserInfo', async function (req, res)  {

  const selected_user = await query('SELECT * FROM vendor WHERE status="active" AND softDel = 0 AND id = '+req.query.id);

  // const selected_vendor = await query('SELECT * FROM vendor WHERE status="active" AND softDel = 0 AND id = '+req.query.id);

  const selected_vendor_details = await query('SELECT * FROM vendor_details WHERE status=1 AND softDel = 0 AND vendor_id = '+req.query.id);

  console.log('selected users : ', selected_user);

  return res.send({ data_vendor: selected_user, data_vendor_details: selected_vendor_details });
});

// UPDATE USER INFO FOR MY PROFILE [BASIC]
app.post('/api/updateUserBasicInfos', verifyToken, async function (req, res)  {

  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if (err) {
      res.sendStatus(403);
    }
    else {
      try {
        console.log('Requested Data : ', req.body);

        const update_vendor_basic_info = await query ('UPDATE vendor SET name = '+JSON.stringify(req.body.bName)+', email = '+JSON.stringify(req.body.bEmail)+', website = '+JSON.stringify(req.body.bWebsite)+', address = '+JSON.stringify(req.body.bAddress)+' WHERE id = '+req.body.user_employee_id);

        return res.send({ success: true, data: [], message: 'Data Updated Succesfully' });

      } catch (e) {
        console.log('Error at the time of data update at vendor table', e);

        return res.send({ success: false, data: e, message: 'Data Update Faild' });

      }
    }
  });

});

// UPDATE USER INFO FOR MY PROFILE [PERSONAL]
app.post('/api/updateUserPersonalInfos', verifyToken, async function (req, res)  {

  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if (err) {
      res.sendStatus(403);
    }
    else {
      try {
        console.log('Requested Data : ', req.body);

        if(req.files!=null){
          if(!req.body.personalImageFile){
            var productFilesArray = [];
            productFilesArray = req.files.personalImageFile;

            if(Array.isArray(productFilesArray)){
              productFilesArray.map(function(file,index){
                file.mv(`${__dirname}/../public/upload/vendor/${file.name}`, err => {
                  if (err) {
                    console.error(err);
                    return res.status(500).send(err);
                  }
                });
              })
            }
            else{
              let productFiles = req.files.personalImageFile;
              console.log('req.files.pImageFile : ', req.files.personalImageFile);

              productFiles.mv(`${__dirname}/../public/upload/vendor/${productFiles.name}`, err => {
                if (err) {
                  console.error(err);
                  return res.status(500).send(err);
                }
              });
            }
          }
        }

        console.log('req.body.pName : ', req.body.personalName);
        console.log('req.body.personalImageName : ', req.body.personalImageName);

        const update_vendor_basic_info = await query ('UPDATE vendor_details SET name = '+req.body.personalName+', email = '+req.body.personalEmail+', nid = '+req.body.personalNid+', present_address = '+req.body.personalAddress+', vendorImage = '+JSON.stringify(req.body.personalImageName)+' WHERE vendor_id = '+req.body.personalEmployeeId);

        return res.send({ success: true, data: [], message: 'Data Updated Succesfully' });

      } catch (e) {
        console.log('Error at the time of data update at vendor table', e);

        return res.send({ success: false, data: e, message: 'Data Update Faild' });

      }
    }
  });

});

// UPDATE USER INFO FOR MY PROFILE [BUSINESS]
app.post('/api/updateUserBusinessInfos', verifyToken, async function (req, res)  {

  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if (err) {
      res.sendStatus(403);
    }
    else {
      try {
        console.log('Requested Data : ', req.body);

        const update_vendor_basic_info = await query ('UPDATE vendor_details SET trade_licence = '+JSON.stringify(req.body.trade_licence)+', tin = '+JSON.stringify(req.body.tin)+', business_start_date = '+JSON.stringify(req.body.bsd)+', web_address = '+JSON.stringify(req.body.web_address)+', business_address = '+JSON.stringify(req.body.business_address)+' WHERE vendor_id = '+req.body.user_employee_id);

        return res.send({ success: true, data: [], message: 'Data Updated Succesfully' });

      } catch (e) {
        console.log('Error at the time of data update at vendor table', e);

        return res.send({ success: false, data: e, message: 'Data Update Faild' });

      }
    }
  });

});

// UPDATE VENDOR INFOS BY ADMIN]
app.post('/api/vendorUpdateByAdmin', verifyToken, async function (req, res)  {

  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if (err) {
      return res.send({success: false, message: 'jwt expired', status: '403'});
    }
    else {
      try {
        console.log('Requested Data : ', req.body);
        console.log('Requested Files : ', req.files);

        if(req.files!=null){
          console.log('File Exist');
          if(!req.body.personalImageFile){
            var productFilesArray = [];
            productFilesArray = req.files.personalImageFile;

            if(Array.isArray(productFilesArray)){
              productFilesArray.map(function(file,index){
                file.mv(`${__dirname}/../public/upload/vendor/${file.name}`, err => {
                  if (err) {
                    console.error(err);
                    return res.status(500).send(err);
                  }
                });
              })
            }
            else{
              let productFiles = req.files.personalImageFile;
              console.log('req.files.pImageFile : ', req.files.personalImageFile);

              productFiles.mv(`${__dirname}/../public/upload/vendor/${productFiles.name}`, err => {
                if (err) {
                  console.error(err);
                  return res.status(500).send(err);
                }
              });
            }
          }
          else if (!req.body.shopImageFile) {
            console.log('shopImageFile Exist');
            var productFilesArray = [];
            productFilesArray = req.files.shopImageFile;
            console.log('req.files.pImageFile as ARRAY : ', req.files.personalImageFile);

            if(Array.isArray(productFilesArray)){
              productFilesArray.map(function(file,index){
                console.log('Moving from array....');
                file.mv(`${__dirname}/../public/upload/vendor/${file.name}`, err => {
                  if (err) {
                    console.error(err);
                    return res.status(500).send(err);
                  }
                });
              })
            }
            else{
              let productFiles = req.files.shopImageFile;
              console.log('req.files.pImageFile : ', req.files.personalImageFile);

              productFiles.mv(`${__dirname}/../public/upload/vendor/${productFiles.name}`, err => {
                if (err) {
                  console.error(err);
                  return res.status(500).send(err);
                }
              });
            }
          }
          else {
            console.log('Image Not assigned Properly');
          }
        }
        else {
          console.log('File not exist');
        }

        const update_vendor_basic_info = await query ('UPDATE vendor SET name = '+req.body.basicName+', email = '+req.body.basicEmail+', website = '+req.body.basicWebsite+', address = '+req.body.basicAddress+' WHERE id = '+req.body.user_employee_id);

        const update_vendor_info = await query ('UPDATE vendor_details SET name = '+req.body.personalName+', email = '+req.body.personalEmail+', nid = '+req.body.personalNid+', present_address = '+req.body.personalAddress+', vendorImage = '+JSON.stringify(req.body.personalImageName)+', trade_licence = '+req.body.b_trade_licence+', tin = '+req.body.b_tin+', business_start_date = '+req.body.b_bsd+', web_address = '+req.body.b_web_address+', business_address = '+req.body.b_business_address+', shop_name = '+req.body.ShopName+', shop_language = '+req.body.ShopLanguage+', shop_country = '+req.body.ShopCountry+', shop_currency = '+req.body.ShopCurrency+', logo = '+JSON.stringify(req.body.shopImageLogo)+', cover_photo = '+JSON.stringify(req.body.shopImageCoverPhoto)+' WHERE vendor_id = '+req.body.user_employee_id);

        return res.send({ success: true, data: [], message: 'Data Updated Succesfully' });

      } catch (e) {
        console.log('Requested Data : ', req.body);

        console.log('req.body.personalName : ', req.body.personalName);

        console.log('Error at the time of data update at vendor table', e);

        return res.send({ success: false, data: e, message: 'Data Update Faild' });

      }
    }
  });

});

// UPDATE USER INFO FOR MY PROFILE [SHOP]
app.post('/api/updateUserShopInfos', verifyToken, async function (req, res)  {

  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if (err) {
      res.sendStatus(403);
    }
    else {
      try {
        console.log('Requested Data : ', req.body);

        if(req.files!=null){
          console.log('Files Exist');
          if(!req.body.shopImageFile){
            console.log('shopImageFile Exist');
            var productFilesArray = [];
            productFilesArray = req.files.shopImageFile;
            console.log('req.files.pImageFile as ARRAY : ', req.files.personalImageFile);

            if(Array.isArray(productFilesArray)){
              productFilesArray.map(function(file,index){
                console.log('Moving from array....');
                file.mv(`${__dirname}/../public/upload/vendor/${file.name}`, err => {
                  if (err) {
                    console.error(err);
                    return res.status(500).send(err);
                  }
                });
              })
            }
            else{
              let productFiles = req.files.shopImageFile;
              console.log('req.files.pImageFile : ', req.files.personalImageFile);

              productFiles.mv(`${__dirname}/../public/upload/vendor/${productFiles.name}`, err => {
                if (err) {
                  console.error(err);
                  return res.status(500).send(err);
                }
              });
            }
          }
          else {
            console.log('pblm in shopImageFile .....');
          }
        }

        console.log('req.body.ShopName : ', req.body.ShopName);

        const update_vendor_basic_info = await query ('UPDATE vendor_details SET shop_name = '+req.body.ShopName+', shop_language = '+req.body.ShopLanguage+', shop_country = '+req.body.ShopCountry+', shop_currency = '+req.body.ShopCurrency+', logo = '+JSON.stringify(req.body.shopImageLogo)+', cover_photo = '+JSON.stringify(req.body.shopImageCoverPhoto)+' WHERE vendor_id = '+req.body.personalEmployeeId);

        let vendorShopNameForSlug = JSON.parse(req.body.ShopName).toLowerCase();
        vendorShopNameForSlug = vendorShopNameForSlug.split(' ').join('-');
        vendorShopNameForSlug = vendorShopNameForSlug+'-'+JSON.parse(req.body.personalEmployeeId);

        console.log('productNameForSlug : ' + vendorShopNameForSlug + ' and id is : ' + JSON.parse(req.body.personalEmployeeId));

        const update_vendor_slug_info = await query ('UPDATE vendor_details SET slug = '+JSON.stringify(vendorShopNameForSlug)+' WHERE vendor_id = '+req.body.personalEmployeeId);

        return res.send({ success: true, data: [], message: 'Data Updated Succesfully' });

      } catch (e) {
        console.log('Error at the time of data update at vendor table', e);

        return res.send({ success: false, data: e, message: 'Data Update Faild' });

      }
    }
  });

});

app.get('/api/vendor_list_for_product', (req, res) => {
  dbConnection.query('SELECT vendor.id AS id, vendor.name AS name, vendor.email AS email, vendor.website AS website, vendor.address AS address, vendor.status AS status, vendor_details.vendorImage AS vendorImage, vendor_details.step_completed AS step_completed FROM vendor JOIN vendor_details ON vendor.id=vendor_details.vendor_id WHERE vendor.status = 1 AND vendor_details.status = 1 ORDER BY vendor.id DESC', function (error, results, fields) {
    console.log(results);
    if (error) throw error;
    return res.send({ error: error, data: results, message: 'sepecification name list.' });
  });
});

app.get('/api/deletePurchase', verifyToken, async function (req, res) {
  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if (err) {
      res.status(403).send({success: false, message: 'jwt expired', status: '403'});
    }
    else {
      try {

        const discountList = await query('UPDATE inv_purchase SET softDel = 1, status = 0 WHERE id = '+req.query.id);
        return res.send({ success: true, data: [], message: 'Purchase Deleted Succesfully !' });

      } catch (e) {
        console.log('Error occured at the time of purchase delete');
        console.log(e);

        return res.send({ success: false, data: [], message: 'urchase Deleted Faied !' });
      }
    }
  });

});

app.get('/api/confirmPurchase', verifyToken, async function (req, res) {
  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if (err) {
      res.status(403).send({success: false, message: 'jwt expired', status: '403'});
    }
    else {
      try {

        const updatePurchase = await query('UPDATE inv_purchase SET isConfirmed = 2 WHERE id = '+req.query.id);

        var currentdate = new Date();
        var datetime = currentdate.getFullYear() + "-"
                        + (currentdate.getMonth()+1)  + "-"
                        + currentdate.getDate();

        var selectFromPurchaseDatails = await query ('SELECT inv_purchase_details.productId, inv_purchase_details.colorId, inv_purchase_details.sizeId, inv_purchase_details.quantity, inv_purchase.supplierId FROM inv_purchase_details JOIN inv_purchase ON inv_purchase_details.purchaseId = inv_purchase.id WHERE inv_purchase_details.status = 1 AND inv_purchase_details.purchaseId = '+ req.query.id);

        console.log('Purchase ID : ', req.query.id);
        console.log('selectedPurchasedProduct : ', selectFromPurchaseDatails );

        for (var i = 0; i < selectFromPurchaseDatails.length; i++) {
          console.log('selected products purchase : ', selectFromPurchaseDatails[i]);
          const insert_at_stock = await query ('INSERT INTO stock (productId, vendorId, colorId, sizeId, quantity, softDel, status, createdBy, createdAt) VALUES ('+JSON.stringify(selectFromPurchaseDatails[i].productId)+', '+JSON.stringify(selectFromPurchaseDatails[i].supplierId)+', '+selectFromPurchaseDatails[i].colorId+', '+JSON.stringify(selectFromPurchaseDatails[i].sizeId)+', '+JSON.stringify(selectFromPurchaseDatails[i].quantity)+', '+'0'+', '+'1'+', '+req.query.employee_id+', '+datetime+')')
        }

        return res.send({ success: true, data: [], message: 'Purchase Return confirmed Succesfully !' });

      } catch (e) {
        console.log('Error occured at the time of purchase confirmation');
        console.log(e);

        return res.send({ success: false, data: [], message: 'Purchase Return Confirmation Failed !' });
      }
    }
  });

});

app.get('/api/confirmPurchaseReturn', verifyToken, async function (req, res) {
  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if (err) {
      res.status(403).send({success: false, message: 'jwt expired', status: '403'});
    }
    else {
      try {

        const updatePurchase = await query('UPDATE inv_purchase_return SET isConfirmed = 2 WHERE id = '+req.query.id);

        var currentdate = new Date();
        var datetime = currentdate.getFullYear() + "-"
                        + (currentdate.getMonth()+1)  + "-"
                        + currentdate.getDate();

        var selectFromPurchaseDatails = await query ('SELECT inv_purchase_return_details.productId, inv_purchase_return_details.colorId, inv_purchase_return_details.sizeId, inv_purchase_return_details.quantity, inv_purchase_return.supplierId FROM inv_purchase_return_details JOIN inv_purchase_return ON inv_purchase_return_details.purchaseReturnId = inv_purchase_return.id WHERE inv_purchase_return_details.status = 1 AND inv_purchase_return_details.purchaseReturnId = '+ req.query.id);

        console.log('Purchase ID : ', req.query.id);
        console.log('selectedPurchasedProduct : ', selectFromPurchaseDatails );

        for (var i = 0; i < selectFromPurchaseDatails.length; i++) {
          console.log('selected products purchase : ', selectFromPurchaseDatails[i]);
          var quantity = Number(selectFromPurchaseDatails[i].quantity) * Number(-1);
          console.log('Quantity : ', quantity);
          const insert_at_stock = await query ('INSERT INTO stock (productId, vendorId, colorId, sizeId, quantity, softDel, status, createdBy, createdAt) VALUES ('+JSON.stringify(selectFromPurchaseDatails[i].productId)+', '+JSON.stringify(selectFromPurchaseDatails[i].supplierId)+', '+selectFromPurchaseDatails[i].colorId+', '+JSON.stringify(selectFromPurchaseDatails[i].sizeId)+', '+JSON.stringify(quantity)+', '+'0'+', '+'1'+', '+req.query.employee_id+', '+datetime+')')
        }

        return res.send({ success: true, data: [], message: 'Purchase confirmed Succesfully !' });

      } catch (e) {
        console.log('Error occured at the time of purchase confirmation');
        console.log(e);

        return res.send({ success: false, data: [], message: 'Purchase Confirmation Failed !' });
      }
    }
  });

});

app.get('/api/deletePurchaseReturn', verifyToken, async function (req, res) {
  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if (err) {
      res.status(403).send({success: false, message: 'jwt expired', status: '403'});
    }
    else {
      try {

        const discountList = await query('UPDATE inv_purchase_return SET softDel = 1, status = 0 WHERE id = '+req.query.id);
        return res.send({ success: true, data: [], message: 'Purchase Deleted Succesfully !' });

      } catch (e) {
        console.log('Error occured at the time of purchase delete');
        console.log(e);

        return res.send({ success: false, data: [], message: 'urchase Deleted Faied !' });
      }
    }
  });

});

app.get('/api/search_products', verifyToken, (req, res) => {
  console.log('Vendor Values : ', req.query.vendorId);
  console.log('Vendor Values : ', req.query.id);

  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      res.sendStatus(403);
    }
    else {
      dbConnection.query('SELECT * FROM products WHERE vendor_id = "'+ req.query.vendorId +'" AND product_name LIKE "%'+ req.query.id +'%" OR product_sku LIKE "%'+ req.query.id +'%" ', function (error, results, fields) {

        if (error) throw error;
        return res.send({ data: results, message: 'data' });

      });

      // return res.send({ success: 'true', data: req.query.id, message: 'data' });
    }
  });

});

app.get('/api/search_products_for_purchase', verifyToken, (req, res) => {
  console.log('Vendor Values : ', req.query.vendorId);
  console.log('Vendor Values : ', req.query.id);

  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      res.sendStatus(403);
    }
    else {
      dbConnection.query('SELECT * FROM products WHERE entry_user_type = "'+req.query.user_type+'" AND vendor_id = "'+ req.query.vendorId +'" AND product_name LIKE "%'+ req.query.id +'%" OR product_sku LIKE "%'+ req.query.id +'%" ', function (error, results, fields) {

        if (error) throw error;
        return res.send({ data: results, message: 'data' });

      });

      // return res.send({ success: 'true', data: req.query.id, message: 'data' });
    }
  });

});

app.get('/api/search_products_for_purchase_edit', verifyToken, async function (req, res) {
  console.log('Vendor Values : ', req.query.vendorId);
  console.log('Vendor Values : ', req.query.id);

  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if (err) {
      res.sendStatus(403);
    }
    else {
      try {
        var get_product = await query ('SELECT products.id, products.product_name, products.product_sku, color_infos.name, size_infos.size, inv_purchase_details.quantity, inv_purchase_details.price FROM inv_purchase_details INNER JOIN color_infos ON inv_purchase_details.colorId = color_infos.id INNER JOIN size_infos ON inv_purchase_details.sizeId = size_infos.id INNER JOIN products ON inv_purchase_details.productId = products.id WHERE products.vendor_id = "'+ req.query.vendorId +'" AND products.product_name LIKE "%'+ req.query.id +'%" OR products.product_sku LIKE "%'+ req.query.id +'%"');

        console.log('Products : ', get_product);

        return res.send({ success: 'true', data: get_product, message: 'data' });

      } catch (e) {
        console.log('Error : ', e);

        return res.send({ success: 'false', data: [], message: e });
      }

    }
  });

});

app.get('/api/getSpecificationNamesValues', verifyToken, async function (req, res) {
  console.log('Vendor Values : ', req.query.vendorId);
  console.log('Vendor Values : ', req.query.id);

  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if (err) {
      res.sendStatus(403);
    }
    else {
      try {
        const get_specification_list = await query ('SELECT product_specification_name FROM products WHERE id = '+req.query.id);

        var parse_specification_values = JSON.parse(get_specification_list[0].product_specification_name);

        var colorListParse = parse_specification_values['color'];
        var sizeListParse = parse_specification_values['size'];

        var colorList = [];
        var sizeList = [];

        for (var i = 0; i < colorListParse.length; i++) {
          const color_name = await query ('SELECT name FROM color_infos WHERE id = '+colorListParse[i].colorId);

          var colorOBJ = {};

          colorOBJ.id = colorListParse[i].colorId;
          colorOBJ.name = color_name[0].name;

          colorList.push(colorOBJ);
        }

        for (var i = 0; i < sizeListParse.length; i++) {
          const size_name = await query ('SELECT size FROM size_infos WHERE id = '+sizeListParse[i]);

          var sizeOBJ = {};

          sizeOBJ.id = sizeListParse[i];
          sizeOBJ.size = size_name[0].size;

          sizeList.push(sizeOBJ);
        }

        console.log('color : ', colorList);
        console.log('size : ', sizeList);

        return res.send({ success : true, data : get_specification_list, colorList : colorList, sizeList : sizeList });

      } catch (e) {
        console.log('Error : ', e);

        return res.send({ success : false, error: e, data : [], colorList : [], sizeList : [] });
      }

    }
  });

});

app.get('/api/search_products_for_discount', verifyToken, (req, res) => {
  console.log('Vendor id : ', req.query.vendorId);
  console.log('Category id : ', req.query.categoryid);
  console.log('Search string : ', req.query.id);

  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      res.sendStatus(403);
    }
    else {
        console.log('req.query.vendorId : ', req.query.vendorId);

        try {
            if (req.query.vendorId == 0) {
                dbConnection.query('SELECT * FROM products WHERE category_id = "'+ req.query.categoryid +'" AND product_name LIKE "%'+ req.query.id +'%" OR product_sku LIKE "%'+ req.query.id +'%" ', function (error, results, fields) {

                  if (error) throw error;
                  console.log('Result is : ', results);
                  return res.send({ success: true, data: results, message: 'data' });
                });
            }
            else {
                dbConnection.query('SELECT * FROM products WHERE vendor_id = "'+ req.query.vendorId +'" AND category_id = "'+ req.query.categoryid +'" AND product_name LIKE "%'+ req.query.id +'%" OR product_sku LIKE "%'+ req.query.id +'%" ', function (error, results, fields) {

                  if (error) throw error;
                  console.log('Result is : ', results);
                  return res.send({ success: true, data: results, message: 'data' });
                });
            }
        } catch (e) {
            console.log('Error : ', e);

            return res.send({ success: false, data: e, message: 'error' });
        }



      // return res.send({ success: 'true', data: req.query.id, message: 'data' });
    }
  });

});

app.post('/api/save_discount', verifyToken, async function (req, res) {
  console.log('Submitted For Discount : ', req.body.discountProvider);
  console.log('Submitted For Discount : ', req.body.discountList);

  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if (err) {
      res.status(403).send({success: false, message: 'jwt expired', status: '403'});
    }
    else {
      try {

        var type = "'"+req.body.type+"'";
        var owner = "'"+req.body.discountProvider+"'";
        var ownerId = "'"+req.body.vendorId+"'";
        var employee_id = "'"+req.body.employeeId+"'";
        var effective_from = "'"+req.body.dateFrom+"'";
        var effective_to = "'"+req.body.dateTo+"'";
        var categoryId = "'"+req.body.categoryId+"'";
        // var status = "'"+req.body.status+"'";

        if (req.body.checkAllProduct) {
          var discountListArray = [];

          const select_product_by_category = await query('SELECT * FROM products WHERE status = 1 AND isApprove = 1 AND softDelete = 0 AND category_id = '+req.body.categoryId);

          console.log('select_product_by_category : ', select_product_by_category);

          for (var i = 0; i < select_product_by_category.length; i++) {

            var discountListObject = {};
            discountListObject.id = select_product_by_category[i].id;
            discountListObject.productName = select_product_by_category[i].product_name;
            discountListObject.discount = req.body.amountOrPercantageForAll;

            discountListArray.push(discountListObject);
          }

          console.log('discountListArray : ', discountListArray);

          var discountList = "'"+JSON.stringify(discountListArray)+"'";

          console.log('discountList : ', discountList);

          if (req.body.isUpdateClicked == true) {
              if (owner == 1) {
                const insert_discount = await query('UPDATE discount SET discount_type = '+type+', discount_owner = '+owner+', discount_owner_id = '+employee_id+', category_id = '+categoryId+', product_id = '+discountList+', effective_from = '+effective_from+', effective_to = '+effective_to+' WHERE id = '+req.body.editID);
              }
              else {
                const insert_discount = await query('UPDATE discount SET discount_type = '+type+', discount_owner = '+owner+', discount_owner_id = '+ownerId+', category_id = '+categoryId+', product_id = '+discountList+', effective_from = '+effective_from+', effective_to = '+effective_to+' WHERE id = '+req.body.editID);
              }
              return res.send({ success: true, data: [], message: 'data' });
          }
          else {
              if (owner == 1) {
                const insert_discount = await query('INSERT INTO discount (discount_type, discount_owner, discount_owner_id, category_id, product_id, effective_from, effective_to) VALUES ('+type+', '+owner+', '+employee_id+', '+categoryId+', '+discountList+', '+effective_from+', '+effective_to+')');
              }
              else {
                const insert_discount = await query('INSERT INTO discount (discount_type, discount_owner, discount_owner_id, category_id, product_id, effective_from, effective_to) VALUES ('+type+', '+owner+', '+ownerId+', '+categoryId+', '+discountList+', '+effective_from+', '+effective_to+')');
              }
              return res.send({ success: true, data: [], message: 'data' });
          }

        }
        else {
          var discountListArray = [];

          for (var i = 0; i < req.body.discountList.length; i++) {
            var discountListObject = {};
            discountListObject.id = req.body.discountList[i].id;
            discountListObject.productName = req.body.discountList[i].productName;
            discountListObject.discount = req.body.discountList[i].amountOrPercantage;

            discountListArray.push(discountListObject);
          }

          console.log('discountListArray : ', discountListArray);

          var discountList = "'"+JSON.stringify(discountListArray)+"'";

          console.log('discountList : ', discountList);

          if (req.body.isUpdateClicked == true) {
              if (owner == 1) {
                const insert_discount = await query('UPDATE discount SET discount_type = '+type+', discount_owner = '+owner+', discount_owner_id = '+employee_id+', product_id = '+discountList+', effective_from = '+effective_from+', effective_to = '+effective_to+' WHERE id = '+req.body.editID);
              }
              else {
                const insert_discount = await query('UPDATE discount SET discount_type = '+type+', discount_owner = '+owner+', discount_owner_id = '+ownerId+', product_id = '+discountList+', effective_from = '+effective_from+', effective_to = '+effective_to+' WHERE id = '+req.body.editID);
              }
              return res.send({ success: true, data: [], message: 'data' });
          }
          else {
              if (owner == 1) {
                const insert_discount = await query('INSERT INTO discount (discount_type, discount_owner, discount_owner_id, product_id, effective_from, effective_to) VALUES ('+type+', '+owner+', '+employee_id+', '+discountList+', '+effective_from+', '+effective_to+')');
              }
              else {
                const insert_discount = await query('INSERT INTO discount (discount_type, discount_owner, discount_owner_id, product_id, effective_from, effective_to) VALUES ('+type+', '+owner+', '+ownerId+', '+discountList+', '+effective_from+', '+effective_to+')');
              }
              return res.send({ success: true, data: [], message: 'data' });
          }
        }

      } catch (e) {
        console.log('Error at the time of data insert into discount table...');
        console.log(e);
        return res.send({ success: false, data: [], message: 'data' });
      }

      //
      // const create_user = await query("INSERT INTO user (username, password, email, employee_id, user_type, user_status, create_date, status) VALUES ("+username+","+password+","+email+","+employee_id+","+user_type+","+user_status+","+create_date+","+status+")");



    }
  });

});

app.get('/api/getDiscountData', async function (req, res) {
    try {
        const sql_query = await query ('SELECT * FROM discount WHERE id = '+ req.query.id);

        res.send({success: true, data: sql_query});
    } catch (e) {
        console.log(e);

        res.send({success: false, message: 'Something went wrong!'})
    }
});

app.get('/api/deleteDiscount', verifyToken, async function (req, res) {
  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if (err) {
      res.status(403).send({success: false, message: 'jwt expired', status: '403'});
    }
    else {
      try {

        const discountList = await query('UPDATE discount SET softDel = 1, status = 0 WHERE id = '+req.query.id);
        return res.send({ success: true, data: discountList, message: 'data' });

      } catch (e) {
        console.log('Error occured at the time of discount delete');
        console.log(e);

        return res.send({ success: false, data: discountList, message: 'data' });
      }
    }
  });

});

app.get('/api/discountList', async function (req, res) {
  if (req.query.userType == 'vendor') {
    const discountList = await query('SELECT * FROM discount WHERE status = 1 AND softDel = 0 AND discount_owner_id = '+ req.query.id);
    return res.send({ success: true, data: discountList, message: 'data' });
  }
  else {
    const discountList = await query('SELECT * FROM discount WHERE status = 1 AND softDel = 0');
    return res.send({ success: true, data: discountList, message: 'data' });
  }

});

// PROMOCODE----------------------------------------------STARTED

app.post('/api/save_promocode', verifyToken, async function (req, res) {
  console.log('Submitted For Promocode : ', req.body);

  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if (err) {
      res.status(403).send({success: false, message: 'jwt expired', status: '403'});
    }
    else {
      try {
        var invoiceamount = "'"+req.body.invoiceamount+"'";
        var promoAmount = "'"+req.body.promoAmount+"'";
        var promoPercantage = "'"+req.body.promoPercantage+"'";
        var employee_id = "'"+req.body.userId+"'";
        var effective_from = "'"+req.body.dateFrom+"'";
        var effective_to = "'"+req.body.dateTo+"'";
        var isMultiple = "'"+req.body.isMultiple+"'";
        var promocode = "'"+req.body.promocode+"'";
        var times = "'"+req.body.times+"'";

        console.log('times : ', times);
        console.log('times : ', req.body.times);
        console.log('isMultiple : ', req.body.isMultiple);
        console.log('isUpdateCalled : ', req.body.isUpdateClicked);

        if (req.body.isMultiple == 1) {

            if (req.body.isUpdateClicked == true) {
                const insert_promocode = await query('UPDATE promocode SET promo_code = '+promocode+', invoice_amount = '+invoiceamount+', promo_amount = '+promoAmount+', promo_percantage = '+promoPercantage+', effective_from = '+effective_from+', effective_to = '+effective_to+', isMultiple = '+isMultiple+', times = '+times+', entry_by = '+employee_id+'WHERE id = '+ req.body.editID);
            }
            else {
                const insert_promocode = await query('INSERT INTO promocode (promo_code, invoice_amount, promo_amount, promo_percantage, effective_from, effective_to, isMultiple, times, entry_by) VALUES ('+promocode+', '+invoiceamount+', '+promoAmount+', '+promoPercantage+', '+effective_from+', '+effective_to+', '+isMultiple+', '+times+', '+employee_id+')');
            }

          return res.send({ success: true, data: [], message: 'data' });
        }
        else {

            if (req.body.isUpdateClicked == true) {
                const insert_promocode = await query('UPDATE promocode SET promo_code = '+promocode+', invoice_amount = '+invoiceamount+', promo_amount = '+promoAmount+', promo_percantage = '+promoPercantage+', effective_from = '+effective_from+', effective_to = '+effective_to+', isMultiple = '+isMultiple+', entry_by= '+employee_id+'WHERE id = '+ req.body.editID);
            }
            else {
                const insert_promocode = await query('INSERT INTO promocode (promo_code, invoice_amount, promo_amount, promo_percantage, effective_from, effective_to, isMultiple, entry_by) VALUES ('+promocode+', '+invoiceamount+', '+promoAmount+', '+promoPercantage+', '+effective_from+', '+effective_to+', '+isMultiple+', '+employee_id+')');
            }

          return res.send({ success: true, data: [], message: 'data' });
        }

      } catch (e) {
        console.log('Error at the time of data insert into Promocode table...');
        console.log(e);
        return res.send({ success: false, data: [], message: 'data' });
      }

    }
  });

});

app.get('/api/promocode', async function (req, res) {
  const promocode = await query('SELECT COUNT(id) AS id FROM promocode WHERE status = 1 AND softDel = 0');

  console.log('Promocode : ', promocode);

  var createdPromocode = promocode[0].id;
  ++createdPromocode;
  createdPromocode = pad(5, createdPromocode, '0');
  createdPromocode = 'P-'+createdPromocode;

  console.log('Promocode after : ', createdPromocode);

  return res.send({ success: true, data: createdPromocode, message: 'data' });
});

app.get('/api/promocodeList', async function (req, res) {
  const promocodeList = await query('SELECT * FROM promocode WHERE status = 1 AND softDel = 0');

  console.log('Promocode List : ', promocodeList);

  return res.send({ success: true, data: promocodeList, message: 'data' });
});

app.get('/api/getPromocodeData', async function (req, res) {
    try {
        const sql_query = await query ('SELECT * FROM promocode WHERE softDel = 0 AND status = 1 AND id = '+req.query.id);
        console.log(sql_query);
        res.send({success: true, data: sql_query});
    } catch (e) {
        console.log(e);

        res.send({success:false, message: 'Something went wrong!'})
    }
});

app.get('/api/deletePromocode', verifyToken, async function (req, res) {
  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if (err) {
      res.status(403).send({success: false, message: 'jwt expired', status: '403'});
    }
    else {
      try {

        const discountList = await query('UPDATE promocode SET softDel = 1, status = 0 WHERE id = '+req.query.id);
        return res.send({ success: true, data: discountList, message: 'data' });

      } catch (e) {
        console.log('Error occured at the time of promocode delete');
        console.log(e);

        return res.send({ success: false, data: discountList, message: 'data' });
      }
    }
  });

});

// PROMOCODE---------------------------------------ENDED

// PURCHASE EDIT STARTED---------------------------STARTED

app.get('/api/getPurchaseInfoForUpdate', verifyToken, async function(req, res, next) {

  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if (err) {
      res.sendStatus(403);
    }
    else {

      try {
        console.log('Requested For : ', req.query.id);

        const get_info_from_purchase = await query ('SELECT * FROM inv_purchase WHERE softDel = 0 AND id = '+req.query.id);

        const get_info_from_purchase_details = await query('SELECT * FROM inv_purchase_details WHERE status = 1 AND purchaseId = '+req.query.id);

        const get_product = await query ('SELECT products.id, products.product_name, products.product_sku, color_infos.name, size_infos.size, inv_purchase_details.colorId, inv_purchase_details.sizeId, inv_purchase_details.quantity, inv_purchase_details.price, inv_purchase_details.totalPrice FROM inv_purchase_details INNER JOIN color_infos ON inv_purchase_details.colorId = color_infos.id INNER JOIN size_infos ON inv_purchase_details.sizeId = size_infos.id INNER JOIN products ON inv_purchase_details.productId = products.id WHERE inv_purchase_details.status = 1 AND inv_purchase_details.purchaseId = '+req.query.id);

        const supplierName = await query('SELECT name FROM vendor WHERE id = '+get_info_from_purchase[0].supplierId);

        console.log('Purchase Update Info : ', get_product);

        return res.send({ success: true, data: [get_info_from_purchase[0], get_info_from_purchase_details, supplierName[0].name, get_product], message: 'data for purchase update' });
      } catch (e) {
        console.log('Error at the time fetching data for purchase update....');
        console.log(e);

        return res.send({ success: false, data: [], message: 'data for purchase update' });
      }

    }
  });

});

// PURCHASE EDIT---------------------------ENDED

// PURCHASE RETURN EDIT STARTED---------------------------STARTED

app.get('/api/getPurchaseReturnInfoForUpdate', verifyToken, async function(req, res, next) {

  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if (err) {
      res.sendStatus(403);
    }
    else {

      try {
        console.log('Requested For : ', req.query.id);

        const get_info_from_purchase = await query ('SELECT * FROM inv_purchase_return WHERE softDel = 0 AND id = '+req.query.id);

        const get_info_from_purchase_details = await query('SELECT * FROM inv_purchase_return_details WHERE status = 1 AND purchaseReturnId = '+req.query.id);

        const get_product = await query ('SELECT products.id, products.product_name, products.product_sku, color_infos.name, size_infos.size, inv_purchase_return_details.colorId, inv_purchase_return_details.sizeId, inv_purchase_return_details.quantity, inv_purchase_return_details.price, inv_purchase_return_details.totalPrice FROM inv_purchase_return_details INNER JOIN color_infos ON inv_purchase_return_details.colorId = color_infos.id INNER JOIN size_infos ON inv_purchase_return_details.sizeId = size_infos.id INNER JOIN products ON inv_purchase_return_details.productId = products.id WHERE inv_purchase_return_details.status = 1 AND inv_purchase_return_details.purchaseReturnId = '+req.query.id);

        const supplierName = await query('SELECT name FROM vendor WHERE id = '+get_info_from_purchase[0].supplierId);

        console.log('Purchase Update Info : ', get_product);

        return res.send({ success: true, data: [get_info_from_purchase[0], get_info_from_purchase_details, supplierName[0].name, get_product], message: 'data for purchase update' });
      } catch (e) {
        console.log('Error at the time fetching data for purchase update....');
        console.log(e);

        return res.send({ success: false, data: [], message: 'data for purchase update' });
      }

    }
  });

});

// PURCHASE RETURN EDIT---------------------------ENDED

app.get('/api/bill_no', async function(req, res, next) {
  const user_type = await query('SELECT user_type FROM user WHERE status = 1 AND softDel = 0 AND employee_id = '+ req.query.id);

  if (user_type[0].user_type == 'admin' || user_type[0].user_type == 'admin_manager' || user_type[0].user_type == 'super_admin') {
    const count_id = await query('SELECT COUNT(id) AS count_id FROM inv_purchase WHERE status = 1 AND storedBy = '+ req.query.id);

    var bill_no = Number(count_id[0].count_id) + 1;

    bill_no = 'BNJ-'+bill_no;

    console.log('Bill No : ', bill_no);

    return res.send({ success: true, data: bill_no, message: 'data' });
  }
  else {
    const count_id = await query('SELECT COUNT(id) AS count_id FROM inv_purchase WHERE status = 1 AND storedBy = '+ req.query.id);

    var bill_no = Number(count_id[0].count_id) + 1;

    const shop_name = await query('SELECT shop_name FROM vendor_details WHERE status = 1 AND vendor_id = '+ req.query.id);

    bill_no = shop_name[0].shop_name+'-'+bill_no;

    console.log('Bill No : ', bill_no);

    return res.send({ success: true, data: bill_no, message: 'data' });
  }

});

app.get('/api/getAllPurchase', async function(req, res, next) {
  const user_type = await query('SELECT user_type FROM user WHERE status = 1 AND softDel = 0 AND employee_id = '+ req.query.id);

  console.log('ID is : ', req.query.id);

  console.log('User Type : ', user_type[0].user_type);

  if (user_type[0].user_type == 'admin' || user_type[0].user_type == 'admin_manager' || user_type[0].user_type == 'super_admin') {
    const getAllPurchase = await query('SELECT * FROM inv_purchase  WHERE status = 1 AND storedBy = 0');

    console.log('getting admins data');

    return res.send({ success: true, data: getAllPurchase, message: 'data' });
  }
  else {
    const getAllPurchase = await query('SELECT * FROM inv_purchase  WHERE status = 1 AND softDel = 0 AND storedBy = '+ req.query.id);

    console.log('getting vendors data');

    return res.send({ success: true, data: getAllPurchase, message: 'data' });
  }

  // return res.send({ success: true,  message: 'data' });

});

// app.get('/api/product_list', (req, res) => {
//   console.log('Session Values : ', req.query.id);

//   dbConnection.query('SELECT employee_id, user_type FROM user WHERE username="'+ req.query.id +'"', function (error, results, fields) {
//     console.log('User Type : ', results[0].user_type);
//     if (error) throw error;
//     if (results[0].user_type == 'vendor') {
//       vendor_products (results[0].employee_id, res);
//     }
//     else {
//       admin_products (res);
//     }

//   });

// });

// function vendor_products (vendor_id, res) {
//   console.log('Inside the vendor_products function & vendor is : ', vendor_id);
//   dbConnection.query('SELECT * FROM products WHERE vendor_id = "'+ vendor_id +'" ORDER BY id DESC', function (error, results, fields) {
//     console.log(results);
//     if (error) throw error;
//     return res.send({ error: error, data: results, message: 'sepecification name list.' });
//   });
// }

// function admin_products (res) {
//   dbConnection.query('SELECT * FROM products ORDER BY id DESC', function (error, results, fields) {
//     console.log(results);
//     if (error) throw error;
//     // return results;
//     return res.send({ error: error, data: results, message: 'sepecification name list.' });
//   });
// }

// app.get('/api/product_list_vendor_wise', (req, res) => {
//   console.log('Vendor Id : ', req.body);
//   dbConnection.query('SELECT * FROM products ORDER BY id DESC', function (error, results, fields) {
//     console.log(results);
//     if (error) throw error;
//     return res.send({ error: error, data: results, message: 'sepecification name list.' });
//   });
// });

app.get('/api/updateShop', (req, res) => {
  // dbConnection.query("UPDATE user SET user_status='approved'", function (error, results) {
  //   console.log(results);1
  //   if (error) throw error;


  //   return res.send({ error: error, data: results, message: 'success' });
  // });

  return res.send({ error: error, data: 'results', message: 'success' });
});

app.get('/api/user_list', (req, res) => {
  dbConnection.query('SELECT * FROM user', function (error, results, fields) {
    console.log(results);
    if (error) throw error;
    return res.send({ error: error, data: results, message: 'sepecification name list.' });
  });
});

app.post('/api/saveVendor', verifyToken, (req, res) => {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      res.sendStatus(403);
    }
    else {
      if (req.files === null) {
        return res.status(400).json({ msg: 'No file uploaded' });
      }
      else{

        try {
          const file = req.files.file;
          file.mv(`${__dirname}/../public/upload/vendor/personal/${file.name}`, err => {
            if (err) {
              console.error(err);
              return res.status(500).send(err);
            }
          });
          var insert_sql_query = "INSERT INTO vendor (name, email, website, address,image, status) VALUES ('" + req.body.name + "', '" + req.body.email + "', '" + req.body.website + "', '" + req.body.address + "','" + file.name + "', '1' )";
          dbConnection.query(insert_sql_query, function (err, result) {

            if (result) {
              res.status(200).json({ message: 'success' });
            }
            else {
              console.log('Error to inseret at category : ', err);
              return res.send({ success: false, error: err });
            }
          });

        }
        catch (error) {
          if (error) return res.send({ success: false, error: 'Error has occured at the time of insert data to PRODUCTS table', request: req.body });
        }
      }
    }
  });

});

// app.get('/api/allProducts', (req, res) => {
//   dbConnection.query('SELECT * FROM products ORDER BY id DESC', function (error, results, fields) {
//     console.log(results);
//     if (error) throw error;
//     return res.send({ error: error, data: results, message: 'product list.' });
//   });
// });

app.get('/api/specialCategoryListForSpecification', async function(req, res, next) {
  const parentAndChild = [];
  const parentAndChildRelation = [];
  let relationIndex = 0;
  const category_name = await query('SELECT * FROM category');
  for ( const i in category_name ) {
    if (category_name[i].parent_category_id == 0) {
      parentAndChild[category_name[i].id] = category_name[i].category_name;
    }

    for ( const j in parentAndChild ) {
      if (category_name[i].parent_category_id == j) {
        parentAndChild[category_name[i].id] = parentAndChild[j]+'->'+category_name[i].category_name;
        ++relationIndex;
        parentAndChildRelation[relationIndex] = category_name[i].parent_category_id;
      }
    }
  }

  for ( const i in unique(parentAndChildRelation) ) {
    delete parentAndChild[parentAndChildRelation[i]];
  }

  for ( const i in parentAndChild ) {
    console.log('Consoling Chid Category : ','index : '+i+' value : '+parentAndChild[i]);
  }

  return res.send({ data: parentAndChild, message: 'category list.' });

});

app.get('/api/banner', verifyToken, async function (req, res)  {
  const selected_terms_and_condition = await query('SELECT * FROM banner WHERE softDel = 0 AND status = 1');

  console.log('api Token : ', req.token);

  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    console.log();
    if (err) {
      console.log(err);
      res.sendStatus(403);
    }
    else {

      console.log('selected users : ', selected_terms_and_condition);

      return res.send({ data: selected_terms_and_condition });
    }
  });

});

app.get('/api/advertisement', verifyToken, async function (req, res)  {
  const selected_terms_and_condition = await query('SELECT * FROM advertisement WHERE softDel = 0');

  console.log('api Token : ', req.token);

  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    console.log();
    if (err) {
      console.log(err);
      res.sendStatus(403);
    }
    else {

      console.log('selected users : ', selected_terms_and_condition);

      return res.send({ data: selected_terms_and_condition });
    }
  });

});

app.get('/api/getBannerData', async function (req, res) {
    try {
        const data = await query ('SELECT * FROM banner WHERE softDel = 0 AND status = 1 AND id = '+req.query.id);

        res.send({success : true, data : data, message: 'Executed'});
    } catch (e) {
        console.log('Error : ', e);

        res.send({success : false, data : e, message: 'Something went wrong. Please try again !'});
    }
});

app.get('/api/bannerDelete', verifyToken, async function (req, res) {
  console.log('Request : ', req.query.id);

  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if (err) {
      res.status(403).send({success: false, message: 'jwt expired', status: '403'});
    }
    else {
      try {
        const delete_banner = await query ('UPDATE banner SET softDel = 1, status = 0 WHERE id = '+req.query.id);

        const data = await query ('SELECT * FROM banner WHERE softDel = 0 AND status = 1');

        return res.send({success: true, data: data, message: 'Banner Deleted Succesfully !'});
      } catch (e) {
        console.log('Error occured at the time of delete operation in banner table');
        console.log(e);

        return res.send({success: false, error: err, message: 'Banner Delete Operation Failed'});
      }
    }
  });
});

app.post('/api/saveSubBanner', verifyToken, (req, res) => {
  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if (err) {
      res.sendStatus(403);
    }
    else {
      try {
        console.log('Requested Data : ', req.body.productsInfos);

        for (var i = 0; i < JSON.parse(req.body.productsInfos).length; i++) {
          console.log (JSON.parse(req.body.productsInfos)[i]);

          const insert_data_into_featured_banner_products_table = await query('INSERT INTO featured_banner_products (category_id, product_id, vendor_id, softDel, status) VALUES ('+JSON.parse(req.body.productsInfos)[i].categoryId+', '+JSON.parse(req.body.productsInfos)[i].productId+', '+JSON.parse(req.body.productsInfos)[i].vendorId+', 0, 1)');
        }

        return res.send({success: true, data: '', message: 'sub banner inserted'});
      } catch (e) {
        console.log('Error .... ! ', e);
        return res.send({success: false, error: err, message: 'Error at the time of banner insertion'});
      }
    }
  });
});

app.post('/api/saveBanner', verifyToken, (req, res) => {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      return res.send({success: false, message: 'jwt expired', status: '403'});
    }
    else {
      // res.json({
      //   message: 'Posts Created...',
      //   authData: authData
      // });

      try {
        let INPUT_path_to_your_images = "";
        let OUTPUT_path = "";
        let imageNameForCompress = '';
        let isAnyError = false;

        if(req.files!=null){
          if(!req.body.imageFile){
            var productFilesArray = [];
            productFilesArray = req.files.imageFile;
            console.log('Image Array : ', productFilesArray);
            if(Array.isArray(productFilesArray)){
              console.log('inside 1');
              productFilesArray.map(function(file,index){
                console.log('inside 2');
                file.mv(`${__dirname}/../public/upload/product/productImages/${file.name}`, err => {
                  if (err) {
                    console.error(err);
                    return res.status(500).send(err);
                  }
                });
              })
            }
            else{
              let productFiles = req.files.imageFile;
              console.log('outside 1');
              productFiles.mv(`${__dirname}/../public/upload/product/productImages/${productFiles.name}`, err => {
                console.log('outside 2');
                imageNameForCompress = productFiles.name;
                if (err) {
                  console.error(err);
                  isAnyError = true;
                  return res.status(500).send(err);
                }
              });

              // we are compressing the image...
              setTimeout(()=> {
                if (isAnyError == false) {
                  INPUT_path_to_your_images = `${__dirname}/../public/upload/product/productImages/${imageNameForCompress}`;
                  console.log('image path & name : ', `${__dirname}/../public/upload/product/productImages/${imageNameForCompress}`);

                  OUTPUT_path = `${__dirname}/../public/upload/product/compressedProductImages/`;

                  compress_images(INPUT_path_to_your_images, OUTPUT_path, { compress_force: false, statistic: true, autoupdate: true }, false,
                    { jpg: { engine: "mozjpeg", command: ["-quality", "60"] } },
                    { png: { engine: "pngquant", command: ["--quality=20-50"] } },
                    { svg: { engine: "svgo", command: "--multipass" } },
                    { gif: { engine: "gifsicle", command: ["--colors", "64", "--use-col=web"] } },
                    function (error, completed, statistic) {
                      console.log("-------------");
                      console.log(error);
                      console.log(completed);
                      console.log(statistic);
                      console.log("-------------");
                    }
                  );
                }
              }, 500);

            }
          }
        }

        console.log('Image Name : ', req.body.name[0]);
        console.log('is Update clicked : ', req.body);

        if (JSON.parse(req.body.isUpdateClicked) == true) {
            console.log('inside');
            if(!req.body.imageFile){
                var sql_query = "UPDATE banner SET name = '"+req.body.name[0]+"', image = '"+req.body.image.toString().replace(/"/g, "")+"', effective_from = '"+JSON.parse(req.body.date_from)+"', effective_to = '"+JSON.parse(req.body.date_to)+"', description = '"+JSON.parse(req.body.date_to)+"', description = '"+req.body.description[0]+"', url = '"+req.body.url[0]+"', softDel = 0, status = 1 WHERE id = "+JSON.parse(req.body.editID);
            }
            else {
                var sql_query = "UPDATE banner SET name = '"+req.body.name[0]+"', effective_from = '"+JSON.parse(req.body.date_from)+"', effective_to = '"+JSON.parse(req.body.date_to)+"',  description = '"+req.body.description[0]+"', url = '"+req.body.url[0]+"', softDel = 0, status = 1 WHERE id = "+JSON.parse(req.body.editID);
            }

        }
        else {
            console.log('outside');
            var sql_query = "INSERT INTO banner (name, image, effective_from, effective_to, description, url, softDel, status) VALUES ('"+req.body.name[0]+"', '"+req.body.image.toString().replace(/"/g, "")+"', '"+JSON.parse(req.body.date_from)+"', '"+JSON.parse(req.body.date_to)+"', '"+req.body.description[0]+"', '"+req.body.url[0]+"', 0, 1 )";
        }

        console.log('SQL query : ', sql_query);

        dbConnection.query(sql_query, function (err, result) {
          if (result) {
            console.log("1 record inserted to banner");
            return res.send({success: true, server_message: result, message: 'Banner Inserted successfully !'});
          }
          else {
            console.log('Error to inseret at banner : ', err);
            return res.send({success: false, error: err, message: 'DB Error'});
          }
        });

      }
      catch(error) {
        console.log("Consolingggg",error);

        if (error) return res.send({ success: false, error: 'Error has occured at the time of insert data to banner table', request: req.body });
      }
    }
  });

});

app.get('/api/getAdvertisementData', async function (req, res) {
    try {

        const sql_query = await query ('SELECT * FROM advertisement WHERE softDel = 0 AND status = 1 AND id = '+ req.query.id);

        return res.send({ success: true, data: sql_query, message: 'success' });

    } catch (e) {
        console.log('Error : ', e);

        return res.send({ success: false, message: 'DB Error' });
    }
});

app.get('/api/deleteAdvertisement', verifyToken, async function (req, res) {
  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if (err) {
      res.status(403).send({success: false, message: 'jwt expired', status: '403'});
    }
    else {
      try {
        // const delete_from_category = await query ('DELETE FROM category WHERE id = '+req.query.id);

        const delete_from_category = await query ('UPDATE advertisement SET softDel = 1, status = 0 WHERE id = '+req.query.id);

        return res.send({ success: true, message: 'Dleted successfully' });
      } catch (e) {
        console.log('Error at the time of delete from feature_name table',e);

        return res.send({ success: false, message: 'DB Error' });
      }
    }
  });
});

app.post('/api/saveAdvertisement', verifyToken, (req, res) => {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      return res.send({success: false, message: 'jwt expired', status: '403'});
    }
    else {

      try {
        if(req.files!=null){
          if(!req.body.imageFile){
            var productFilesArray = [];
            productFilesArray = req.files.imageFile;
            console.log('Image Array : ', productFilesArray);
            if(Array.isArray(productFilesArray)){
              console.log('inside 1');
              productFilesArray.map(function(file,index){
                console.log('inside 2');
                file.mv(`${__dirname}/../public/upload/product/productImages/${file.name}`, err => {
                  if (err) {
                    console.error(err);
                    return res.status(500).send(err);
                  }
                });
              })
            }
            else{
              let productFiles = req.files.imageFile;
              console.log('outside 1');
              productFiles.mv(`${__dirname}/../public/upload/product/productImages/${productFiles.name}`, err => {
                console.log('outside 2');
                if (err) {
                  console.error(err);
                  return res.status(500).send(err);
                }
              });
            }
          }
        }

        console.log('Image Name : ', req.body.name[0]);

        if (JSON.parse(req.body.isUpdateClicked) == true) {
            console.log('inside');
            if(!req.body.imageFile){
                var sql_query = "UPDATE advertisement SET name = '"+req.body.name[0]+"', image = '"+req.body.image.toString().replace(/"/g, "")+"', description = '"+req.body.description[0]+"', url = '"+req.body.url[0]+"', softDel = 0, status = 1 WHERE id = "+JSON.parse(req.body.editID);
            }
            else {
                var sql_query = "UPDATE advertisement SET name = '"+req.body.name[0]+"', description = '"+req.body.description[0]+"', url = '"+req.body.url[0]+"', softDel = 0, status = 1 WHERE id = "+JSON.parse(req.body.editID);
            }

        }
        else {
            console.log('outside');
            var sql_query = "INSERT INTO advertisement (name, image, description, url, softDel, status) VALUES ('"+req.body.name[0]+"', '"+req.body.image.toString().replace(/"/g, "")+"', '"+req.body.description[0]+"', '"+req.body.url[0]+"', 0, 1 )";
        }



        dbConnection.query(sql_query, function (err, result) {
          if (result) {
            console.log("1 record inserted to banner");
            return res.send({success: true, server_message: result, message: 'Advertisement Inserted successfully !'});
          }
          else {
            console.log('Error to inseret at banner : ', err);
            return res.send({success: false, error: err, message: 'DB Error'});
          }
        });

      }
      catch(error) {
        console.log("Consolingggg",error);

        if (error) return res.send({ success: false, error: 'Error has occured at the time of insert data to banner table', request: req.body });
      }
    }
  });

});

app.get('/api/get-product-edit', verifyToken, async function (req, res) {

  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if (err) {
      console.log('Error at the time of get-product-edit api execution', err);
      res.sendStatus(403);
    }
    else {
      try {

        console.log('edit id : ', req.query.id);

        const selected_products = await query('SELECT * FROM products where softDelete = 0 AND status = 1 AND id = '+req.query.id);

        console.log('Selected product infos for product edit : ', selected_products);

        console.log('Product Name : ', selected_products[0].id);
        console.log('Product Category Id : ', selected_products[0].category_id);

        var product_category_name = await query('SELECT category_name FROM category where status = 1 AND id = '+selected_products[0].category_id);

        var product_vendor_name = await query('SELECT name FROM vendor_details where softDel = 0 AND status = 1 AND vendor_id = '+selected_products[0].vendor_id);

        var specification_name_parse = JSON.parse(selected_products[0].product_specification_name);

        var all_specification_name = await query('SELECT id, specification_name, type FROM product_specification_names WHERE softDel = 0 AND status = 1 AND category_id = '+ selected_products[0].category_id);

        var color_infos = await query('SELECT id, name FROM color_infos where softDel = 0 AND status = 1');

        console.log('specification_name_parse : ', specification_name_parse.color);

        var picked_color_loop = specification_name_parse.color;
        var picked_size_loop = specification_name_parse.size;

        var specificationMainArray = [];

        for (var i = 0; i < all_specification_name.length; i++) {
          var specificationMainObject= {};

          specificationMainObject.id = all_specification_name[i].id;
          specificationMainObject.specification_name = all_specification_name[i].specification_name;
          specificationMainObject.type = all_specification_name[i].type;

          if (all_specification_name[i].type == 0) {
            // lets check which colors are picked by user
            var colorArr = [];
            var countColor = 0;
            for (var x = 0; x < color_infos.length; x++) {
              var colorOBJ = {};
              for (var y = 0; y < picked_color_loop.length; y++) {
                if(picked_color_loop[y].colorId == color_infos[x].id) {
                  colorOBJ.id = picked_color_loop[y].colorId;
                  colorOBJ.name = color_infos[x].name;
                  colorOBJ.imageName = picked_color_loop[y].imageName;
                  colorOBJ.isChecked = true;
                  ++countColor;
                  break;
                }
              }
              if (countColor == 0) {
                colorOBJ.id = color_infos[x].id;
                colorOBJ.name = color_infos[x].name;
                colorOBJ.imageName = "";
                colorOBJ.isChecked = false;
              }
              colorArr.push(colorOBJ);
              countColor = 0;
            }

            specificationMainObject.colors = colorArr;

          }
          else {
            var size_infos = await query ('SELECT id, size FROM size_infos WHERE softDel = 0 AND status = 1 AND size_type_id = '+all_specification_name[i].type);

            var sizeArray = [];

            for (var j = 0; j < size_infos.length; j++) {
              var sizeOBJ = {};
              var sizeCounter = 0;

              for (var x = 0; x < picked_size_loop.length; x++) {
                // lets check which sizes are picked by user
                if (picked_size_loop[x] == size_infos[j].id) {
                  sizeOBJ.id = size_infos[j].id;
                  sizeOBJ.size = size_infos[j].size;
                  sizeOBJ.isChecked = true;
                  ++sizeCounter;
                  break;
                }
              }

              if (sizeCounter == 0) {
                sizeOBJ.id = size_infos[j].id;
                sizeOBJ.size = size_infos[j].size;
                sizeOBJ.isChecked = false;
                sizeCounter = 0;
              }

              sizeArray.push(sizeOBJ);
            }
            specificationMainObject.sizeInfo = sizeArray;
          }

          specificationMainArray.push(specificationMainObject);
        }

        console.log('Size Infos : ', size_infos);
        console.log('all_specification_name : ', all_specification_name);
        console.log('specificationMainArray : ', specificationMainArray);

        console.log('Specificaton details : ', selected_products[0].product_specification_details_description);

        var metaTagsArr = JSON.parse(selected_products[0].metaTags);

        var tagsArr = [];

        console.log('Meta Tags : ', metaTagsArr);

        if (metaTagsArr != null) {
          for (var i = 0; i < metaTagsArr.length; i++) {
            var tagsOBJ = {};
            tagsOBJ.index = i;
            tagsOBJ.displayValue = metaTagsArr[i];
            tagsArr.push(tagsOBJ);
          }
        }

        var productSpecificationBoxFun1 = [];
        var productSpecificationBoxFun = [];

        console.log('specification_name_parse color :', specification_name_parse['color']);

        if (specification_name_parse['color'] != undefined) {
          for (var i = 0; i < specification_name_parse['color'].length; i++) {
            var color = {}
            color.colorId = specification_name_parse['color'][i].colorId;
            color.imageName = specification_name_parse['color'][i].imageName;
            productSpecificationBoxFun1.push(color);
          }
        }

        if (specification_name_parse['size'] != undefined) {
          for (var i = 0; i < specification_name_parse['size'].length; i++) {
            productSpecificationBoxFun.push(specification_name_parse['size'][i]);
          }
        }


        data = {
          'pId'    : selected_products[0].id,
          'pName'  : selected_products[0].product_name,
          'cId'    : selected_products[0].category_id,
          'cName'  : product_category_name[0].category_name,
          'pSKU'   : selected_products[0].product_sku,
          'pPrice' : selected_products[0].productPrice,
          'pBrand' : selected_products[0].brand_name,
          'pVendor': selected_products[0].vendor_id,
          'pvName' : product_vendor_name[0].name,
          'pSN'    : specification_name_parse,
          'aPSN'   : specificationMainArray,
          'pSD'    : JSON.parse(selected_products[0].product_specification_details_description),
          'actualTags': JSON.parse(selected_products[0].metaTags),
          'tags'   : tagsArr,
          'entry_user_type' : selected_products[0].entry_user_type,
          'description'     : JSON.parse(selected_products[0].product_full_description),
          'images' : JSON.parse(selected_products[0].image),
          'productSpecificationBoxFun1' : productSpecificationBoxFun1,
          'productSpecificationBoxFun' : productSpecificationBoxFun,
          'colorImageObjects' : specification_name_parse['color'],
        };

        console.log('Category name : ', product_category_name[0].category_name);
        console.log('SKU : ', selected_products[0].product_sku);

        return res.send({ success: true, data: data });

      } catch (e) {
        console.log('Errors : ', e);

        return res.send({ success: false, data: [] });
      }

    }
  });

});

app.get('/api/addMoreColor', verifyToken, async function (req, res) {
  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if (err) {
      res.sendStatus(403);
    }
    else {

      try {

        console.log('Name : ', req.query.addNewColor);

        const insert_into_color_infos = await query ('INSERT INTO color_infos (name, softDel, status) VALUES ('+JSON.stringify(req.query.addNewColor)+', 0, 1)');

        return res.send({ success: true, message: 'Added successfully' });

      } catch (e) {
        console.log('Error : ', e);

        return res.send({ success: false, message: 'DB Error' });
      }

    }
  });
});

app.get('/api/addMoreSize', verifyToken, async function (req, res) {
  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if (err) {
      res.sendStatus(403);
    }
    else {

      try {

        console.log('Name : ', req.query.size);

        const insert_into_color_infos = await query ('INSERT INTO size_infos (size, size_type_id, softDel, status) VALUES ('+JSON.stringify(req.query.size)+', '+JSON.stringify(req.query.sizeType)+', 0, 1)');

        return res.send({ success: true, message: 'Inserted successfully' });

      } catch (e) {
        console.log('Error : ', e);

        return res.send({ success: false, message: 'DB Error' });
      }

    }
  });
});

app.post('/api/saveProduct', verifyToken, (req, res) => {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      return res.send({success: false, message: 'jwt expired', status: '403'});
    }
    else {
      console.log('Requested Data to entry : ', req.body);
      console.log('Images File : ', req.body.colorImages);
      console.log('Images File true/false : ', !req.body.colorFiles);
      console.log('Image Object : ', req.body.colorImageObjects);
      console.log('Only Color id : ', req.body.productSpecificationBoxFun1);
      console.log('Size Values : ', req.body.productSpecificationBoxFun);
      try {
        console.log('In the try block...');
        if(req.files!=null){
          console.log('Check image files...');
          console.log('req.body.productFiles : ', req.files.productFiles);
          console.log('req.body.productFiles : ', req.body.productImagesJson);

          console.log('Resized Image Files array : ', req.body.productResizedImages);

          if(!req.body.productFiles){
            console.log('Image files exist...');
            var productFilesArray = [];
            productFilesArray = req.body.productResizedImages;
            if(Array.isArray(productFilesArray)){
              console.log('An array...');
              productFilesArray.map(function(file,index){
                console.log('Index value is : ', index);
                console.log('fileNameExclude : ', req.body.fileNameExclude[index]);

                var imageName = req.body.fileNameExclude[index]+'.png';
                console.log('image Name : ', imageName);
                var productFiles = file;

                console.log('Product file before match : ', productFiles);

                var matches = productFiles.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/), response = {};

                // if (matches.length !== 3) {
                //   // return new Error('Invalid input string');
                //   console.log('Error : invalid image type...');
                // }

                response.type = matches[1];
                response.data = new Buffer(matches[2], 'base64');

                fs.writeFile(`${__dirname}/../public/upload/product/productImages/${imageName}`, response.data, (err) => {
                  if (err) throw err;
                  console.log('The file has been saved!');
                });

              })
            }
            else{
              console.log('Not array...');
              console.log('Product SKU : ', req.body.productSKU);
              var imageName = req.body.fileNameExclude+'.png';
              console.log('image Name : ', imageName);
              var productFiles = req.body.productResizedImages;


              var matches = productFiles.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/), response = {};

              // if (matches.length !== 3) {
              //   // return new Error('Invalid input string');
              //   console.log('Error : invalid image type...');
              // }

              response.type = matches[1];
              response.data = new Buffer(matches[2], 'base64');

              fs.writeFile(`${__dirname}/../public/upload/product/productImages/${imageName}`, response.data, (err) => {
                if (err) throw err;
                console.log('The file has been saved!');
              });

              console.log('After converting image from Base64 to Bufer data : ', response);
            }

            // console.log('Base 64 images : ', productFilesArray);

          }

          if(!req.body.productDescriptionFiles){
            if(req.files.productDescriptionFiles){

              if(Array.isArray(req.files.productDescriptionFiles)){
                req.files.productDescriptionFiles.map(function(file,index){
                  file.mv(`${__dirname}/../public/upload/product/productDescriptionImages/${file.name}`, err => {
                    if (err) {
                      console.error(err);
                      return res.status(500).send(err);
                    }
                  });
                })
              }
              else{
                let productDescriptionFiles = req.files.productDescriptionFiles;
                productDescriptionFiles.mv(`${__dirname}/../public/upload/product/productDescriptionImages/${productDescriptionFiles.name}`, err => {
                  if (err) {
                    console.error(err);
                    return res.status(500).send(err);
                  }
                });
              }
            }
          }

          // colors images
          if(!req.body.colorFiles){
            console.log('Inside Color images');
            var productFilesArray = [];
            productFilesArray = req.files.colorFiles;
            if(Array.isArray(productFilesArray)){
              console.log('Inside color files');
              productFilesArray.map(function(file,index){
                file.mv(`${__dirname}/../public/upload/product/productImages/${file.name}`, err => {
                  if (err) {
                    console.error(err);
                    return res.status(500).send(err);
                  }
                });
              })
            }
            else{
              let productFiles = req.files.colorFiles;
              console.log('Inside color files');
              productFiles.mv(`${__dirname}/../public/upload/product/productImages/${productFiles.name}`, err => {
                if (err) {
                  console.error(err);
                  return res.status(500).send(err);
                }
              });
            }
          }
        }

        var specificationValues = '';
        var specificationKey = '';
        var specificationArray = [];
        var specificationNameArray = [];
        var productDescriptionFullState = {};
        var fullStateData = JSON.parse(req.body.specificationDetailsFullState);

        var specificationBoxFun = JSON.parse(req.body.productSpecificationBoxFun);
        console.log('specificationBoxFun : ', specificationBoxFun);

        var specificationBoxFun1 = JSON.parse(req.body.productSpecificationBoxFun1);
        console.log('specificationBoxFun1 (Color Ids) : ', specificationBoxFun1);

        var colorImageObjects = JSON.parse(req.body.colorImageObjects);
        console.log('colorImageObjects : ', colorImageObjects);
        console.log('colorImageObjects length : ', colorImageObjects.length);

        var specifiationOBJ = {};

        if (specificationBoxFun1.length > 0 && colorImageObjects.length > 0) {
          specifiationOBJ.color = colorImageObjects;
          specifiationOBJ.size = specificationBoxFun;

          console.log('All Current Specification (Both exist) : ', JSON.stringify(specifiationOBJ));
        }
        else if (specificationBoxFun1.length > 0 && colorImageObjects.length == 0) {
          specifiationOBJ.color = specificationBoxFun1;
          specifiationOBJ.size = specificationBoxFun;

          console.log('All Current Specification : ', JSON.stringify(specifiationOBJ));
        }
        else if (specificationBoxFun1.length == 0 && colorImageObjects.length > 0) {
          specifiationOBJ.color = colorImageObjects;
          specifiationOBJ.size = specificationBoxFun;

          console.log('All Current Specification : ', JSON.stringify(specifiationOBJ));
        }

        var metaTags = JSON.parse(req.body.metaTags);
        var tags = [];

        // console.log('Meta Tags are : ', tags);
        console.log('Meta Tags are : ', metaTags);
        for (var i = 0; i < metaTags.length; i++) {
          console.log('Meta Tags : ', metaTags[i].displayValue);
          tags.push(metaTags[i].displayValue);
        }

        console.log('Tags : ', tags);

        var specificationArray1 = [];

        var loopCounter = Object.values(fullStateData).length + 1;
        for (var i = 0; i < loopCounter; i++) {
          if (i < Object.values(fullStateData).length) {
            let testObject = {};
            specificationValues = Object.values(Object.values(fullStateData)[i]);

            specificationKey = Object.keys(fullStateData)[i];
            testObject.specificationDetailsName = specificationKey;
            testObject.specificationDetailsValue = specificationValues[0];
            specificationArray1.push(testObject);
          }
          else if (i == Object.values(fullStateData).length) {

          }
        }


        var insert_sql_query = "INSERT INTO products (product_name, category_id, product_sku, productPrice, brand_name, product_specification_name, product_specification_details_description, product_full_description, qc_status, image,home_image, vendor_id, entry_by, entry_user_type, status, isApprove, metaTags) VALUES ('"+req.body.productName+"', '"+req.body.categoryIdValue+"', '"+req.body.productSKUcode+"', '"+req.body.productPrice+"', '"+req.body.productBrand+"', '"+JSON.stringify(specifiationOBJ)+"','"+JSON.stringify(specificationArray1)+"' , '"+req.body.productDescriptionFull+"', '1', '"+req.body.productImagesJson+"','"+req.body.homeImage+"', '"+req.body.vendor_id+"', '"+req.body.employee_id+"', '"+req.body.user_type+"', '1', 2, '"+JSON.stringify(tags)+"' )";

        var insertId = '';
        var flag = false;
        var productNameForSlug = req.body.productName;

        setTimeout(()=> {
          dbConnection.query(insert_sql_query, function (err, result) {
            if (result) {
              console.log("1 record inserted to product");
              console.log('Product sql insert query returned : ', result.insertId);

              insertId = result.insertId;
              flag = true;

              console.log('Flag', flag);

              // return res.send({success: true, server_message: result, message: 'success'});
            }
          });
        }, 300);

        setTimeout(()=> {
          if (flag == true) {
            // productNameForSlug = productNameForSlug.toLowerCase();
            // // productNameForSlug = productNameForSlug.replace(' ', '-');
            // productNameForSlug = productNameForSlug.split(' ').join('-');
            // productNameForSlug = productNameForSlug+'-'+insertId;

            // console.log('productNameForSlug : ' + productNameForSlug + ' and id is : ' + insertId);

            var update_sql_query_for_product = "update products set slug = slugify(product_name, id) WHERE id = '"+insertId+"'";
            // var update_sql_query_for_product = "UPDATE products SET slug = '"+productNameForSlug+"' WHERE id = '"+insertId+"'";

            dbConnection.query(update_sql_query_for_product, function (err, result) {
              if (result) {
                console.log("1 record updated to product for slug");

                return res.send({success: true, server_message: result, message: 'success'});
              }
              else {
                console.log('Error a the time of product update for slug : ', err);

                return res.send({success: false, error: err, message: 'DB Error for slug update'});
              }
            });

          }
          else {
            console.log('Error at the time of product insert : ', err);

            return res.send({success: false, error: err, message: 'DB Error of product insert'});
          }
        }, 700);



      }
      catch (error) {
        console.log("Consolingggg",error);

        if (error) return res.send({ success: false, error: 'Error has occured at the time of insert data to PRODUCTS table', request: req.body });
      }
    }
  });

});
app.post('/api/updateProduct', verifyToken, (req, res) => {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      return res.send({success: false, message: 'jwt expired', status: '403'});
    }
    else {
      try {
        if(req.files!=null){

          // if(!req.body.productFiles){
          //   var productFilesArray = [];
          //   productFilesArray = req.files.productFiles;
          //   if(Array.isArray(productFilesArray)){
          //     productFilesArray.map(function(file,index){
          //       file.mv(`${__dirname}/../public/upload/product/productImages/${file.name}`, err => {
          //         if (err) {
          //           console.error(err);
          //           return res.status(500).send(err);
          //         }
          //       });
          //     })
          //   }
          //   else{
          //     let productFiles = req.files.productFiles;
          //     productFiles.mv(`${__dirname}/../public/upload/product/productImages/${productFiles.name}`, err => {
          //       if (err) {
          //         console.error(err);
          //         return res.status(500).send(err);
          //       }
          //     });
          //   }
          // }

          if(!req.body.productFiles){

            var productFilesArray = [];
            productFilesArray = req.body.productResizedImages;
            if(Array.isArray(productFilesArray)){

              productFilesArray.map(function(file,index){

                var imageName = req.body.fileNameExclude[index]+'.png';
                console.log('image Name : ', imageName);
                var productFiles = file;

                var matches = productFiles.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/), response = {};

                if (matches.length !== 3) {
                  console.log('Error : invalid image type...');
                }

                response.type = matches[1];
                response.data = new Buffer(matches[2], 'base64');

                fs.writeFile(`${__dirname}/../public/upload/product/productImages/${imageName}`, response.data, (err) => {
                  if (err) throw err;
                  console.log('The file has been saved!');
                });

              })
            }
            else{

              var imageName = req.body.fileNameExclude+'.png';
              var productFiles = req.body.productResizedImages;

              var matches = productFiles.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/), response = {};

              if (matches.length !== 3) {
                console.log('Error : invalid image type...');
              }

              response.type = matches[1];
              response.data = new Buffer(matches[2], 'base64');

              fs.writeFile(`${__dirname}/../public/upload/product/productImages/${imageName}`, response.data, (err) => {
                if (err) throw err;
                console.log('The file has been saved!');
              });

              console.log('After converting image from Base64 to Bufer data : ', response);
            }

          }

          if(!req.body.productDescriptionFiles){
            if(req.files.productDescriptionFiles){

              if(Array.isArray(req.files.productDescriptionFiles)){
                req.files.productDescriptionFiles.map(function(file,index){
                  file.mv(`${__dirname}/../public/upload/product/productDescriptionImages/${file.name}`, err => {
                    if (err) {
                      console.error(err);
                      return res.status(500).send(err);
                    }
                  });
                })
              }
              else{
                let productDescriptionFiles = req.files.productDescriptionFiles;
                productDescriptionFiles.mv(`${__dirname}/../public/upload/product/productDescriptionImages/${productDescriptionFiles.name}`, err => {
                  if (err) {
                    console.error(err);
                    return res.status(500).send(err);
                  }
                });
              }
            }
          }

          // colors images
          if(!req.body.colorFiles){
            console.log('Inside Color images', req.files.colorFiles);
            var productFilesArray = [];
            productFilesArray = req.files.colorFiles;
            if(Array.isArray(productFilesArray)){
              console.log('Inside color files');
              productFilesArray.map(function(file,index){
                file.mv(`${__dirname}/../public/upload/product/productImages/${file.name}`, err => {
                  if (err) {
                    console.error(err);
                    return res.status(500).send(err);
                  }
                });
              })
            }
            else{
              let productFiles = req.files.colorFiles;
              console.log('Inside color files');
              productFiles.mv(`${__dirname}/../public/upload/product/productImages/${productFiles.name}`, err => {
                if (err) {
                  console.error(err);
                  return res.status(500).send(err);
                }
              });
            }
          }
        }

        var checkCounter = 0;
        var specificationValues = '';
        var specificationKey = '';
        var specificationArray = [];
        var specificationNameArray = [];
        var productDescriptionFullState = {};
        var fullStateData = JSON.parse(req.body.specificationDetailsFullState);

        var loopCounter = Object.values(fullStateData).length + 1;
        for (var i = 0; i < loopCounter; i++) {
          if (i < Object.values(fullStateData).length) {
            let testObject = {};
            specificationValues = Object.values(Object.values(fullStateData)[i]);

            specificationKey = Object.keys(fullStateData)[i];
            testObject.specificationDetailsName = specificationKey;
            testObject.specificationDetailsValue = specificationValues[0];
            specificationArray.push(testObject);
          }
          else if (i == Object.values(fullStateData).length) {

          }
        }

        // var specificationBoxFun = JSON.parse(req.body.productSpecificationBoxFun);
        // var counter = 0;
        // for (var i = 0; i < specificationBoxFun.length; i++) {
        //   let testObject = {};
        //   ++counter;
        //   var spliting = specificationBoxFun[i].split(':');
        //   testObject.categoryId = spliting[0];
        //   testObject.specificationNameId = spliting[1];
        //   testObject.specificationNameValue = spliting[2];
        //   specificationNameArray.push(testObject);
        //   if (counter == specificationBoxFun.length) {
        //     // console.log("Specificationdf Names",specificationNameArray);return false;
        //
        //   }
        // }

        console.log('Home Image : ', req.body.homeImage);
        console.log('Product Images JSON : ', JSON.parse(req.body.productImagesJson));

        console.log('Requested Body : ', req.body);

        // new color, color image, specifiation
        var specificationBoxFun = JSON.parse(req.body.productSpecificationBoxFun);
        console.log('specificationBoxFun : ', specificationBoxFun);

        var specificationBoxFun1 = JSON.parse(req.body.productSpecificationBoxFun1);
        console.log('specificationBoxFun1 (Color Ids) : ', specificationBoxFun1);

        // var colorImageObjects = JSON.parse(req.body.colorImageObjects);
        var colorImageObjects = [];
        if (req.body.colorImageObjects != 'undefined') {
            var colorImageObjects = JSON.parse(req.body.colorImageObjects);
        }
        else {
            var colorImageObjects = [];
        }
        console.log('colorImageObjects : ', colorImageObjects);
        console.log('colorImageObjects length : ', colorImageObjects.length);

        // creating the latest value of the colorImageObjects
        for (var i = 0; i < colorImageObjects.length; ) {
          var index = i;
          index = index+1;

          if (typeof colorImageObjects[index] === 'undefined') {
            i++;
          }
          else {
            if (colorImageObjects[i].colorId == colorImageObjects[index].colorId) {
              // console.log('Splicing : '+colorImageObjects[i].colorId+' - '+colorImageObjects[index].colorId);
              colorImageObjects.splice(i, 1);
            }
            else {
              i++;
            }
          }

        }

        // creating the latest value of the specificationBoxFun1
        for (var i = 0; i < specificationBoxFun1.length; ) {
          var index = i;
          index = index+1;

          if (typeof specificationBoxFun1[index] === 'undefined') {
            i++;
          }
          else {
            if (specificationBoxFun1[i].colorId == specificationBoxFun1[index].colorId) {
              // console.log('Splicing : '+specificationBoxFun1[i].colorId+' - '+specificationBoxFun1[index].colorId);
              specificationBoxFun1.splice(i, 1);
            }
            else {
              i++;
            }
          }

        }

        console.log('After compare specificationBoxFun1 : ', specificationBoxFun1);
        console.log('After compare specificationBoxFun1 length : ', specificationBoxFun1.length);

        // merge colorImageObjects & specificationBoxFun1
        for (var i = 0; i < specificationBoxFun1.length; i++) {
          var counterSpecification = 0;
          for (var j = 0; j < colorImageObjects.length; j++) {
            if (specificationBoxFun1[i].colorId == colorImageObjects[j].colorId) {
              ++counterSpecification;
            }
          }

          if (counterSpecification == 0) {
            colorImageObjects.push(specificationBoxFun1[i]);
          }

        }

        console.log('After compare colorImageObjects : ', colorImageObjects);
        console.log('After compare colorImageObjects length : ', colorImageObjects.length);

        // comapre the size array
        var specifiationOBJ = {};
        var specificationBoxFunArr = [];

        var specificationBoxFunCompare = specificationBoxFun;

        for (var i = 0; i < specificationBoxFun.length; i++) {
          var coutValues = 0;

          for (var j = 0; j < specificationBoxFunCompare.length; j++) {
            if (specificationBoxFun[i] == specificationBoxFunCompare[j]) {
              ++coutValues;
            }
          }

          if (coutValues == 1) {
            specificationBoxFunArr.push(specificationBoxFun[i]);
          }
        }

        // assign the color and size values in the specificationOBJ object
        specifiationOBJ.color = colorImageObjects;
        specifiationOBJ.size = specificationBoxFunArr;

        console.log('specifiationOBJ : ', specifiationOBJ);

        var metaTags = JSON.parse(req.body.metaTags);
        var tags = [];

        // console.log('Meta Tags are : ', tags);
        console.log('Meta Tags are : ', metaTags);
        for (var i = 0; i < metaTags.length; i++) {
          console.log('Meta Tags : ', metaTags[i].displayValue);
          tags.push(metaTags[i].displayValue);
        }

        console.log('Tags : ', tags);

        var updateId = '';
        var flag = false;
        var productNameForSlug = req.body.productName;

        // IF IMAGES UPDATED ALONG WITH HOME IMAGE

        console.log('Home Image : ',req.body.homeImage);

        if (req.body.homeImage !== 'NAN' && req.body.homeImage != undefined) {
          ++checkCounter;
          console.log('Home Image Exist...');

          var select_sql_query_for_update = "SELECT image FROM products WHERE id = '"+req.body.getEditId+"'";

          var dataForImages = [];
          var productImagesJsonParsed = JSON.parse(req.body.productImagesJson);

          dbConnection.query(select_sql_query_for_update, function (err, result) {
            if (result) {
              console.log("1 record fetched from products");
              // return res.send({success: true, server_message: result, message: 'success'});
              dataForImages = result[0].image;
              dataForImages = JSON.parse(dataForImages);
            }
            else {
              console.log('Error to fetched from products : ', err);
              // return res.send({success: false, error: err, message: 'DB Error'});
            }
          });

          setTimeout(()=>{
            console.log('setTimeout......');
            console.log('Selected data ...... ', dataForImages);

            for (var j = 0; j < productImagesJsonParsed.length; j++) {
              var countLoop = 0;
              console.log('productImagesJsonParsed[i].serialNumber : ', productImagesJsonParsed[j].serialNumber);

              for (var i = 0; i < dataForImages.length; i++) {
                if (dataForImages[i].serialNumber == productImagesJsonParsed[j].serialNumber) {
                  dataForImages[i].imageName = productImagesJsonParsed[j].imageName;
                  ++countLoop;
                }
              }

              if (countLoop == 0) {
                var image = {};
                image.imageName = productImagesJsonParsed[j].imageName;
                image.serialNumber = productImagesJsonParsed[j].serialNumber;
                console.log('countLoop : ', countLoop);
                dataForImages.push(image);
              }
            }

          }, 200);

          setTimeout(()=> {
            console.log('dataForImages after comparison :', dataForImages);

            var update_sql_query_for_product = "UPDATE products SET product_name = '"+req.body.productName+"', productPrice = '"+req.body.productPrice+"', brand_name = '"+req.body.productBrand+"', product_specification_name = '"+JSON.stringify(specifiationOBJ)+"', image = '"+JSON.stringify(dataForImages)+"', home_image = '"+req.body.homeImage+"', isApprove = 2, metaTags = '"+JSON.stringify(tags)+"' WHERE id = '"+req.body.getEditId+"'";

            dbConnection.query(update_sql_query_for_product, function (err, result) {
              if (result) {
                console.log("1 record updated to products home image updated", update_sql_query_for_product);
                updateId = req.body.getEditId;
                flag = true;
                // return res.send({success: true, server_message: result, message: 'success'});
              }
              else {
                console.log('Error at the time of product update : ', err);
                return res.send({success: false, error: err, message: 'DB Error'});
              }
            });

          }, 400);

          setTimeout(()=> {
            if (flag == true) {
              // productNameForSlug = productNameForSlug.toLowerCase();
              // // productNameForSlug = productNameForSlug.replace(' ', '-');
              // productNameForSlug = productNameForSlug.split(' ').join('-');
              // productNameForSlug = productNameForSlug+'-'+updateId;

              // console.log('productNameForSlug : ' + productNameForSlug + ' and id is : ' + updateId);

              // var update_sql_query_for_product = "UPDATE products SET slug = '"+productNameForSlug+"' WHERE id = '"+updateId+"'";
              var update_sql_query_for_product = "update products set slug = slugify(product_name, id) WHERE id = '"+updateId+"'";

              dbConnection.query(update_sql_query_for_product, function (err, result) {
                if (result) {
                  console.log("1 record updated to product for slug");

                  return res.send({success: true, server_message: result, message: 'success'});
                }
                else {
                  console.log('Error a the time of product update for slug : ', err);

                  return res.send({success: false, error: err, message: 'DB Error'});
                }
              });

            }
            else {
              console.log('Error at the time of product insert : ', err);

              return res.send({success: false, error: err, message: 'DB Error'});
            }
          }, 700);

          console.log('checking setTimeout......');

        }

        // IF IMAGES UPDATED BUT HOME IMAGE IS SAME AS BEFORE

        if (JSON.parse(req.body.productImagesJson).length > 0) {
          console.log('Product Images JSON Exist...');

          var select_sql_query_for_update = "SELECT image FROM products WHERE id = '"+req.body.getEditId+"'";

          var dataForImages = [];
          var productImagesJsonParsed = JSON.parse(req.body.productImagesJson);

          dbConnection.query(select_sql_query_for_update, function (err, result) {
            if (result) {
              console.log("1 record fetched from products");
              // return res.send({success: true, server_message: result, message: 'success'});
              dataForImages = result[0].image;
              dataForImages = JSON.parse(dataForImages);
            }
            else {
              console.log('Error to fetched from products : ', err);
              // return res.send({success: false, error: err, message: 'DB Error'});
            }
          });

          setTimeout(()=>{
            console.log('setTimeout......');
            console.log('Selected data ...... ', dataForImages);

            for (var j = 0; j < productImagesJsonParsed.length; j++) {
              var countLoop = 0;
              console.log('productImagesJsonParsed[i].serialNumber : ', productImagesJsonParsed[j].serialNumber);

              for (var i = 0; i < dataForImages.length; i++) {
                if (dataForImages[i].serialNumber == productImagesJsonParsed[j].serialNumber) {
                  dataForImages[i].imageName = productImagesJsonParsed[j].imageName;
                  ++countLoop;
                }
              }

              if (countLoop == 0) {
                var image = {};
                image.imageName = productImagesJsonParsed[j].imageName;
                image.serialNumber = productImagesJsonParsed[j].serialNumber;
                console.log('countLoop : ', countLoop);
                dataForImages.push(image);
              }
            }

          }, 200);

          setTimeout(()=> {
            if (checkCounter == 0) {
              console.log('dataForImages after comparison :', dataForImages);

              var update_sql_query_for_product = "UPDATE products SET product_name = '"+req.body.productName+"', productPrice = '"+req.body.productPrice+"', brand_name = '"+req.body.productBrand+"', product_specification_name = '"+JSON.stringify(specifiationOBJ)+"', image = '"+JSON.stringify(dataForImages)+"', isApprove = 2, metaTags = '"+JSON.stringify(tags)+"' WHERE id = '"+req.body.getEditId+"'";

              dbConnection.query(update_sql_query_for_product, function (err, result) {
                if (result) {
                  console.log("1 record updated to products but home image not updated");

                  updateId = req.body.getEditId;
                  flag = true;

                  // return res.send({success: true, server_message: result, message: 'success'});
                }
                else {
                  console.log('Error to inseret at category : ', err);
                  return res.send({success: false, error: err, message: 'DB Error'});
                }
              });
            }

          }, 400);

          setTimeout(()=> {
            if (flag == true) {
              // productNameForSlug = productNameForSlug.toLowerCase();
              // // productNameForSlug = productNameForSlug.replace(' ', '-');
              // productNameForSlug = productNameForSlug.split(' ').join('-');
              // productNameForSlug = productNameForSlug+'-'+updateId;

              // console.log('productNameForSlug : ' + productNameForSlug + ' and id is : ' + updateId);

              // var update_sql_query_for_product = "UPDATE products SET slug = '"+productNameForSlug+"' WHERE id = '"+updateId+"'";

              var update_sql_query_for_product = "update products set slug = slugify(product_name, id) WHERE id = '"+updateId+"'";

              dbConnection.query(update_sql_query_for_product, function (err, result) {
                if (result) {
                  console.log("1 record updated to product for slug");

                  return res.send({success: true, server_message: result, message: 'success'});
                }
                else {
                  console.log('Error a the time of product update for slug : ', err);

                  return res.send({success: false, error: err, message: 'DB Error'});
                }
              });

            }
            else {
              console.log('Error at the time of product insert : ', err);

              return res.send({success: false, error: err, message: 'DB Error'});
            }
          }, 700);

        }

        // IF IMAGES ARE NOT UPDATED

        if ((req.body.homeImage === 'NAN' || req.body.homeImage == undefined) && JSON.parse(req.body.productImagesJson).length == 0) {
          var update_sql_query_for_product = "UPDATE products SET product_name = '"+req.body.productName+"', productPrice = '"+req.body.productPrice+"', brand_name = '"+req.body.productBrand+"', product_specification_name = '"+JSON.stringify(specifiationOBJ)+"', isApprove = 2, metaTags = '"+JSON.stringify(tags)+"' WHERE id = '"+req.body.getEditId+"'";

          dbConnection.query(update_sql_query_for_product, function (err, result) {
            if (result) {
              console.log("1 record updated to products but no image updated");
              updateId = req.body.getEditId;
              flag = true;
              // return res.send({success: true, server_message: result, message: 'success'});
            }
            else {
              console.log('Error to inseret at category : ', err);
              return res.send({success: false, error: err, message: 'DB Error'});
            }
          });

          setTimeout(()=> {
            if (flag == true) {
              // productNameForSlug = productNameForSlug.toLowerCase();
              // // productNameForSlug = productNameForSlug.replace(' ', '-');
              // productNameForSlug = productNameForSlug.split(' ').join('-');
              // productNameForSlug = productNameForSlug+'-'+updateId;

              // console.log('productNameForSlug : ' + productNameForSlug + ' and id is : ' + updateId);

              // var update_sql_query_for_product = "UPDATE products SET slug = '"+productNameForSlug+"' WHERE id = '"+updateId+"'";

              var update_sql_query_for_product = "update products set slug = slugify(product_name, id) WHERE id = '"+updateId+"'";

              dbConnection.query(update_sql_query_for_product, function (err, result) {
                if (result) {
                  console.log("1 record updated to product for slug");

                  return res.send({success: true, server_message: result, message: 'success'});
                }
                else {
                  console.log('Error a the time of product update for slug : ', err);

                  return res.send({success: false, error: err, message: 'DB Error'});
                }
              });

            }
            else {
              console.log('Error at the time of product insert : ', err);

              return res.send({success: false, error: err, message: 'DB Error'});
            }
          }, 500);
        }

        // var insert_sql_query = "INSERT INTO products (product_name, category_id, product_sku, productPrice, product_specification_name, product_specification_details_description, product_full_description, qc_status, image,home_image, vendor_id, status, isApprove) VALUES ('"+req.body.productName+"', '"+req.body.categoryIdValue+"', '"+req.body.productSKUcode+"', '"+req.body.productPrice+"', '"+JSON.stringify(specificationNameArray)+"','"+JSON.stringify(specificationArray)+"' , '"+req.body.productDescriptionFull+"', '1', '"+req.body.productImagesJson+"','"+req.body.homeImage+"', '"+req.body.vendor_id+"', '1', 2 )";


      }
      catch (error) {
        console.log("Consolingggg",error);

        if (error) return res.send({ success: false, error: 'Error has occured at the time of insert data to PRODUCTS table', request: req.body });
      }
    }
  });

});

app.post('/api/saveProductLL', (req, res) => {
  if (req.files === null) {
    return res.status(400).json({ msg: 'No file uploaded' });
  }
  else{

    try {
      //  var productFile = [];
      //  var producDescriptiontFile = [];
      // productFile = req.files.productFiles;
      // producDescriptiontFile = req.files.productDescriptionFiles;
      // console.log('Consoling pp files',productFile);return false;


      if(req.files.productFiles){
        if(Array.isArray(req.files.productFiles)){
          req.files.productFiles.map(function(file,index){
            file.mv(`${__dirname}/../public/upload/product/productImages/${file.name}`, err => {
              if (err) {
                console.error(err);
                return res.status(500).send(err);
              }
            });
          })
        }
        else{

          let productFiles = req.files.productFiles;
          productFiles.mv(`${__dirname}/../public/upload/product/productImages/${productFiles.name}`, err => {
            if (err) {
              console.error(err);
              return res.status(500).send(err);
            }
          });
        }
      }
      console.log('consoling product files is array',Array.isArray(req.files.productFiles));

      if(req.files.productDescriptionFiles){
        if(Array.isArray(req.files.productDescriptionFiles)){
          req.files.productDescriptionFiles.map(function(file,index){
            file.mv(`${__dirname}/../public/upload/product/productDescriptionImages/${file.name}`, err => {
              if (err) {
                console.error(err);
                return res.status(500).send(err);
              }
            });
          })
        }
        else{
          let fileDescription = req.files.producDescriptiontFile;
          fileDescription.mv(`${__dirname}/../public/upload/product/productDescriptionImages/${fileDescription.name}`, err => {
            if (err) {
              console.error(err);
              return res.status(500).send(err);
            }
          });
        }
      }
      console.log('insert_sql_query');

      var insert_sql_query = "INSERT INTO products (product_name, category_id, product_sku, product_specification_name, product_specification_details_description, product_full_description, qc_status, image,home_image, vendor_id, status) VALUES ('"+req.body.productName+"', '"+req.body.categoryIdValue+"', '"+req.body.productSKUcode+"', '"+JSON.stringify(req.body.productSpecificationBoxFun)+"', 'oo', '"+JSON.stringify(req.body.productDescriptionFull)+"', '1', '"+JSON.stringify(req.body.productImagesJson)+"','"+req.body.homeImage+"', '"+req.body.vendor_id+"', '1' )";
      dbConnection.query(insert_sql_query, function (err, result) {

        if (result) {
          console.log("1 record inserted to category");
          return res.send({success: true, server_message: result, message: 'success'});
        }
        else {
          console.log('Error to inseret at category : ', err);
          return res.send({success: false, error: err, message: 'DB Error'});
        }
      });
    }
    catch (error) {
      if (error) return res.send({ success: false, error: 'Error has occured at the time of insert data to PRODUCTS table', request: req.body });
    }
  }
});

app.post('/api/saveProductpp',(req,res)=>{
  console.log('The Request : ', req.files.productFiles);
  console.log('Specification Name : ', req.body.productSpecificationBoxFun);
  console.log('specification details : ', Object.values(req.body.specificationDetailsFullState));
  var specificationValues = '';
  var specificationKey = '';
  var specificationArray = [];
  var loopCounter = Object.values(req.body.specificationDetailsFullState).length + 1;
  console.log(JSON.stringify(specificationArray));
  new Promise (function (resolve, reject) {
    for (var i = 0; i < loopCounter; i++) {
      if (i < Object.values(req.body.specificationDetailsFullState).length) {
        let testObject = {};
        specificationValues = Object.values(Object.values(req.body.specificationDetailsFullState)[i]);

        specificationKey = Object.keys(req.body.specificationDetailsFullState)[i];
        testObject.specificationDetailsName = specificationKey;
        testObject.specificationDetailsValue = specificationValues[0];
        specificationArray.push(testObject);

        // specificationArray[i] = specificationKey+' : '+specificationValues[0];

        console.log('The values are consoling : ', specificationArray);
        console.log('The values are : ', specificationKey);
      }
      else if (i == Object.values(req.body.specificationDetailsFullState).length) {
        resolve(specificationArray);
      }
      else {
        reject('rejected');
      }
    }
  }).then( function (resolve) {
    console.log('Testing', JSON.stringify(resolve));
    // resolve(resolve);
    //return JSON.stringify(resolve);
    return resolve;
  }).then( function (resolve) {
    try {
      if ((isNullOrEmpty(req.body.productName) == false) && (isNullOrEmpty(req.body.productPrice) == false) && (isNullOrEmpty(req.body.productSKUcode) == false) && (req.body.productCategory != 0) && (isNullOrEmpty(req.body.productBrand) == false) && (req.body.vendorId != 0)) {

        var insert_sql_query = "INSERT INTO products (product_name, category_id, product_sku, product_specification_name, product_specification_details_description, product_full_description, qc_status, image, vendor_id, status) VALUES ('"+req.body.productName+"', '"+req.body.productCategory+"', '"+req.body.productSKUcode+"', '"+JSON.stringify(req.body.productSpecificationBoxFun)+"', '"+JSON.stringify(resolve)+"', '"+JSON.stringify(req.body.productDescriptionFull)+"', '1', '"+JSON.stringify(req.body.images)+"', '"+req.body.vendorId+"', '1' )";

        dbConnection.query(insert_sql_query, function (err, result) {

          if (result) {
            console.log("1 record inserted to category");
            return res.send({success: true, server_message: result, message: 'DB Success'});
          }
          else {
            console.log('Error to inseret at category : ', err);
            return res.send({success: false, error: err, message: 'DB Error'});
          }

        });
      }
      else{
        return res.send({success: false, message: 'required field'});
      }

    }
    catch (error) {
      if (error) return res.send({success: false, error: 'Error has occured at the time of insert data to PRODUCTS table', request : req.body, message: 'Exception'});
    }
    // return res.send({success: true, message: 'Check Promise'});
  }).catch(function (reject) {
    console.log(reject);
    return res.send({success: false, error: 'Error has occured at the time of insert data to PRODUCTS table', request : req.body, message: 'Promise Exception !!'});
  })
  // console.log(JSON.stringify(specificationName));
  // for (var i = 0; i < req.body.specificationDetailsFullState.length; i++) {
  //   // var splited = req.body.specificationDetailsFullState[i].split(':');
  //   // specificationDetails[i] = splited;
  //   console.log(req.body.specificationDetailsFullState[i]);
  // }
  // console.log('')
  // console.log(JSON.stringify( req.body.specificationDetailsFullState));
  // return res.send({success: true, message: 'Check Promise'});

});

// app.post('/api/saveProduct',(req,res)=>{
//   // console.log('The Request : ', req.body);

//   console.log('Specification Name : ', req.body.productSpecificationBoxFun);
//   console.log('specification details : ', Object.values(req.body.specificationDetailsFullState));

//   var specificationValues = '';
//   var specificationKey = '';
//   var specificationArray = [];
//   var specificationNameArray = [];
//   var loopCounter = Object.values(req.body.specificationDetailsFullState).length + 1;

//   console.log(JSON.stringify(specificationArray));

//   new Promise (function (resolve, reject) {

//     for (var i = 0; i < loopCounter; i++) {

//       if (i < Object.values(req.body.specificationDetailsFullState).length) {
//         let testObject = {};
//         specificationValues = Object.values(Object.values(req.body.specificationDetailsFullState)[i]);

//         specificationKey = Object.keys(req.body.specificationDetailsFullState)[i];
//         testObject.specificationDetailsName = specificationKey;
//         testObject.specificationDetailsValue = specificationValues[0];
//         specificationArray.push(testObject);

//         // specificationArray[i] = specificationKey+' : '+specificationValues[0];

//         console.log('The values are consoling : ', specificationArray);
//         console.log('The values are : ', specificationKey);
//       }
//       else if (i == Object.values(req.body.specificationDetailsFullState).length) {
//         resolve(specificationArray);
//       }
//       else {
//         reject('rejected');
//       }

//     }

//   }).then( function (resolve) {
//     var counter = 0;
//     for (var i = 0; i < req.body.productSpecificationBoxFun.length; i++) {
//       let testObject = {};
//       console.log ('fun box : ', req.body.productSpecificationBoxFun[i]);
//       ++counter;

//       var spliting = req.body.productSpecificationBoxFun[i].split(':');

//       console.log(spliting);

//       testObject.categoryId = spliting[0];
//       testObject.specificationNameId = spliting[1];
//       testObject.specificationNameValue = spliting[2];

//       specificationNameArray.push(testObject);

//       if (counter == req.body.productSpecificationBoxFun.length) {
//         return resolve;
//       }
//     }

//   }).then( function (resolve) {
//     console.log('Resolve and Values : ', specificationArray);

//     console.log('Product Name : ', req.body.productName);
//     console.log('Product Price : ', req.body.productPrice);
//     console.log('Product SKU : ', req.body.productSKUcode);
//     console.log('Product Category : ', req.body.productCategory);
//     console.log('Product Brand : ', req.body.productBrand);
//     console.log('Product Vendor : ', req.body.vendorId);

//     try {
//       if ((isNullOrEmpty(req.body.productName) == false) && (isNullOrEmpty(req.body.productPrice) == false) && (isNullOrEmpty(req.body.productSKUcode) == false) && (req.body.productCategory != 0) && (isNullOrEmpty(req.body.productBrand) == false) && (req.body.vendorId != 0)) {

//         var insert_sql_query = "INSERT INTO products (product_name, category_id, product_sku, product_specification_name, product_specification_details_description, product_full_description, qc_status, image, vendor_id, status) VALUES ('"+req.body.productName+"', '"+req.body.productCategory+"', '"+req.body.productSKUcode+"', '"+JSON.stringify(specificationNameArray)+"', '"+JSON.stringify(specificationArray)+"', '"+JSON.stringify(req.body.productDescriptionFull)+"', '1', '"+JSON.stringify(req.body.images)+"', '"+req.body.vendorId+"', '1' )";

//         dbConnection.query(insert_sql_query, function (err, result) {

//             if (result) {
//                 console.log("1 record inserted to category");
//                 return res.send({success: true, server_message: result, message: 'DB Success'});
//             }
//             else {
//                 console.log('Error to inseret at category : ', err);
//                 return res.send({success: false, error: err, message: 'DB Error'});
//             }

//         });
//       }
//       else{
//         return res.send({success: false, message: 'required field'});
//       }

//     }
//     catch (error) {
//         if (error) return res.send({success: false, error: 'Error has occured at the time of insert data to PRODUCTS table', request : req.body, message: 'Exception'});
//     }

//     // return res.send({success: true, message: 'Check Promise'});

//   }).catch(function (reject) {
//     console.log(reject);
//     return res.send({success: false, error: 'Error has occured at the time of insert data to PRODUCTS table', request : req.body, message: 'Promise Exception !!'});
//   })

//   // console.log(JSON.stringify(specificationName));

//   // for (var i = 0; i < req.body.specificationDetailsFullState.length; i++) {
//   //   // var splited = req.body.specificationDetailsFullState[i].split(':');
//   //   // specificationDetails[i] = splited;
//   //   console.log(req.body.specificationDetailsFullState[i]);
//   // }
//   // console.log('')
//   // console.log(JSON.stringify( req.body.specificationDetailsFullState));

//   // return res.send({success: true, message: 'Check Promise'});



// });

app.post('/api/vendor-registration',(req,res)=>{
  console.log('The Request : ', req.body);
  console.log('The Request password : ', req.body.userPassword);
  console.log('The Request re-password : ', req.body.userRePassword);
  console.log('is equal : ', req.body.userRePassword);

  var checkVendorEntry = 0

  if (req.body.userPassword == req.body.userRePassword) {

    try {
      if ((isNullOrEmpty(req.body.userName) == false) && (isNullOrEmpty(req.body.userPassword) == false) && (isNullOrEmpty(req.body.userEmail) == false) ) {

        var create = {name: req.body.name, email: req.body.userEmail, softDel: 0, status: 'active' };

        // var insert_sql_query = "INSERT INTO vendor (name, email, softDel, status) VALUES ('"+req.body.name+"', '"+req.body.userEmail+"', 0, 'active')";

        dbConnection.query('INSERT INTO vendor SET ?', create, function (err, result) {

          if (result) {
            console.log("1 record inserted to vendor");
            selectVendorInfo (req.body.userEmail, req.body.name, req.body.userName, req.body.userPassword);
          }
          else {
            console.log('Error to inseret at vendor : ', err);
            return res.send({success: false, error: err});
          }
        });
      }
      else{
        console.log('is-null-or-empty-check')
        return res.send({success: false});
      }
    }
    catch (error) {
      console.log('first try catch...');
      if (error) return res.send({success: false, error: 'Error has occured at the time of insert data to PRODUCTS table', request : req.body});
    }

    function selectVendorInfo (email, name, userName, userPassword) {
      console.log('email : ', email);
      console.log('email : ', userName);
      select_sql_query = "SELECT id FROM vendor WHERE email='"+email+"' AND name = '"+name+"'";
      console.log('Select query : ', select_sql_query);
      dbConnection.query(select_sql_query, function (error, results, fields) {
        console.log('Results From Vendor', results);
        insertUserInfo (userName, userPassword, results[0].id, email);
        if (error) throw error;
        // return res.send({ error: error, data: results, message: 'sepecification name list.' });
      });
      // return
    }

    function insertUserInfo (userName, userPassword, employee_id, email) {
      try {
        // var insert_sql_query = "INSERT INTO user (username, password, employee_id, user_type) VALUES ('"+userName+"', '"+userPassword+"', '"+employee_id+"', 'vendor')";

        var create = {username: userName, password: userPassword, email: email, employee_id: employee_id, user_type: 'vendor'};

        dbConnection.query('INSERT INTO user SET ?', create , function (err, result) {
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
        console.log('Error insert info...');
        if (error) return res.send({success: false, error: 'Error has occured at the time of insert data to PRODUCTS table', request : req.body});
      }
    }


  }
  else {
    console.log('Not OK !!');
    return res.send({success: false});
  }


});

app.post('/api/saveProductPurchase', verifyToken, async function (req, res) {
  console.log('Product Purchase : ', req.body);

  jwt.verify(req.token, 'secretkey', async function (err, authData) {

    if (err) {
      res.status(403).send({success: false, message: 'jwt expired', status: '403'});
    }
    else {
      if (req.body.isUpdateClicked == false) {
        try {

          var purchase_table_id = 0;
          var purchaseListArray = [];

          const insert_at_purchase = await query ('INSERT INTO inv_purchase (billNo, chalanNo, supplierId, storedBy, purchaseDate, totalQuantity, totalAmount, status) VALUES ( '+JSON.stringify(req.body.currentBillNo)+', '+JSON.stringify(req.body.chalanNo)+', '+JSON.stringify(req.body.vendorId)+', '+JSON.stringify(req.body.storedBy)+', '+JSON.stringify(req.body.currentDate)+', '+JSON.stringify(req.body.grandTotalQuantity)+', '+JSON.stringify(req.body.grandTotalPrice)+', 1 )');

          purchaseElements = req.body.PurchaseList;

          console.log('insert_at_purchase : ', insert_at_purchase.insertId);

          for (var i = 0; i < purchaseElements.length; i++) {
            var colorValue = purchaseElements[i].colorValue;
            var sizeValue = purchaseElements[i].sizeValue;

            if (colorValue === undefined) {
                colorValue = null;
            }
            else {
                colorValue = JSON.stringify(purchaseElements[i].colorValue);
            }

            if (sizeValue === undefined) {
                sizeValue = null;
            }
            else {
                sizeValue = JSON.stringify(purchaseElements[i].sizeValue);
            }

            const insert_at_purchase_details = await query ('INSERT INTO inv_purchase_details (purchaseId, billNo, productId, colorId, sizeId, quantity, price, totalPrice) VALUES ('+JSON.stringify(insert_at_purchase.insertId)+', '+JSON.stringify(req.body.currentBillNo)+', '+JSON.stringify(purchaseElements[i].id)+', '+colorValue+', '+sizeValue+', '+JSON.stringify(purchaseElements[i].productQuantity)+', '+JSON.stringify(purchaseElements[i].productPrice)+', '+JSON.stringify(purchaseElements[i].totalPrice)+')');

            console.log('insert_at_purchase_details : ', insert_at_purchase_details.insertId);

            // var currentdate = new Date();
            // var datetime = currentdate.getFullYear() + "-"
            //                 + (currentdate.getMonth()+1)  + "-"
            //                 + currentdate.getDate();
            //
            // const insert_at_stock = await query ('INSERT INTO stock (productId, vendorId, colorId, sizeId, quantity, softDel, status, createdBy, createdAt) VALUES ('+JSON.stringify(purchaseElements[i].id)+', '+JSON.stringify(req.body.vendorId)+', '+purchaseElements[i].colorValue+', '+JSON.stringify(purchaseElements[i].sizeValue)+', '+JSON.stringify(purchaseElements[i].productQuantity)+', '+'0'+', '+'1'+', '+req.body.employee_id+', '+datetime+')')

          }

          return res.send({success: true, message: 'Successfully inserted into inv_purchase_details table'});

        } catch (e) {
          console.log('Error : ', e);

          return res.send({success: false, error: e});
        }
      }
      else {
        console.log('Update working');

        try {

          var purchase_table_id = 0;
          var purchaseListArray = [];

          // const insert_at_purchase = await query ('INSERT INTO inv_purchase (billNo, chalanNo, supplierId, storedBy, purchaseDate, totalQuantity, totalAmount, status) VALUES ( '+JSON.stringify(req.body.currentBillNo)+', '+JSON.stringify(req.body.chalanNo)+', '+JSON.stringify(req.body.vendorId)+', '+JSON.stringify(req.body.storedBy)+', '+JSON.stringify(req.body.currentDate)+', '+JSON.stringify(req.body.grandTotalQuantity)+', '+JSON.stringify(req.body.grandTotalPrice)+', 1 )');

          const update_at_purchase = await query ('UPDATE inv_purchase SET totalQuantity= '+JSON.stringify(req.body.grandTotalQuantity)+', totalAmount = '+JSON.stringify(req.body.grandTotalPrice)+' WHERE softDel = 0 AND status = 1 AND id = '+req.body.purchaseId);

          purchaseElements = req.body.PurchaseList;

          console.log('insert_at_purchase : ', update_at_purchase);

          const update_all_details_to_inactive = await query ('UPDATE inv_purchase_details SET status = 0 WHERE purchaseId = '+req.body.purchaseId);

          for (var i = 0; i < purchaseElements.length; i++) {
            const select_from_purchase_details = await query ('SELECT COUNT(id) AS counter FROM inv_purchase_details WHERE purchaseId = '+req.body.purchaseId+' AND productId = '+purchaseElements[i].id+' AND colorId = '+purchaseElements[i].colorValue+' AND sizeId = '+purchaseElements[i].sizeValue+' AND quantity = '+purchaseElements[i].productQuantity+' AND price = '+purchaseElements[i].productPrice+' AND totalPrice = '+purchaseElements[i].totalPrice);

            console.log('select_from_purchase_details : ', select_from_purchase_details[0].counter);

            if (select_from_purchase_details[0].counter > 0) {
              const update_all_details_to_active = await query ('UPDATE inv_purchase_details SET status = 1 WHERE purchaseId = '+req.body.purchaseId+' AND productId = '+purchaseElements[i].id+' AND colorId = '+purchaseElements[i].colorValue+' AND sizeId = '+purchaseElements[i].sizeValue+' AND quantity = '+purchaseElements[i].productQuantity+' AND price = '+purchaseElements[i].productPrice+' AND totalPrice = '+purchaseElements[i].totalPrice);
            }
            else {
              const insert_at_purchase_details = await query ('INSERT INTO inv_purchase_details (purchaseId, billNo, productId, colorId, sizeId, quantity, price, totalPrice) VALUES ('+JSON.stringify(req.body.purchaseId)+', '+JSON.stringify(req.body.currentBillNo)+', '+JSON.stringify(purchaseElements[i].id)+', '+JSON.stringify(purchaseElements[i].colorValue)+', '+JSON.stringify(purchaseElements[i].sizeValue)+', '+JSON.stringify(purchaseElements[i].productQuantity)+', '+JSON.stringify(purchaseElements[i].productPrice)+', '+JSON.stringify(purchaseElements[i].totalPrice)+')');
            }

          }

          return res.send({success: true, message: 'Successfully inserted into inv_purchase_details table'});

        } catch (e) {
          console.log('Error : ', e);

          return res.send({success: false, error: e});
        }

      }

    }

  });

  // return res.send({ success: true, message: 'purchase inserted !' });
});

app.post('/api/posts-test', verifyToken, (req, res) => {
  console.log('api posts...');
  console.log('api Token : ', req.token);

  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      res.sendStatus(403);
    }
    else {
      res.json({
        message: 'Posts Created...',
        authData: authData
      });
    }
  });
});

app.get('/api/check-email', async function (req, res) {
  try {
    const check_email = await query('SELECT COUNT(id) AS count_id FROM user WHERE softDel = 0 AND status = 1 AND email LIKE "'+req.query.email+'"');

    console.log(req.query.email);
    console.log(check_email[0].count_id);

    if (check_email[0].count_id == 1) {
        return res.send({success: true, message: 'Successfully found!'});
    }
    else {
        return res.send({success: false, message: 'Did not find the email address!'});
    }
  }
  catch (error) {
    console.log(error);
    return res.send({success: false, message: 'Something went wrong! Please comeback later!'});
  }

});

app.post('/api/submit-email', async function (req, res) {
  try {
      console.log(req.body.email_address);

      const cipher = crypto.createCipher('aes192', 'a password');
      var encrypted = cipher.update(req.body.email_address, 'utf8', 'hex');
      encrypted += cipher.final('hex');

      var url = `http://localhost:3005/resetpassword/${encrypted}`

      var mailOption = {
          from : 'info@banijjo.com.bd',
          to : req.body.email_address,
          subject : 'Reset Password',
          // text : 'Please click the link below to reset your password!',
          html: `Please click the link to reset your password : <a href="${url}"> ${url} </a>`
      }

      mailBox.sendMail(mailOption, function (error, info) {
          if (error) {
              console.log(error);
          }
          else {
              console.log('Email sent : ', info,process);
          }
      })

      // mailBox.sendMail({
      //     to: req.body.email_address,
      //     subject: 'Reset Password',
      //     html: 'Please click the link below to reset your password!'
      // });

      return res.send({success: true, message: 'Succesfully sent the link to your email address!'});
  } catch (error) {
      console.log(error);
      return res.send({success: false, message: 'Something went wrong! Please comeback later!'});
  }
});

app.post('/api/submit-reset-password', async function (req, res) {
    try {

        const decipher = crypto.createDecipher('aes192', 'a password');
        var encrypted = req.body.email;
        var decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');

        const update_query = await query ('UPDATE user SET password = '+req.body.nPassword+' WHERE email = "'+decrypted+'"');

        console.log('Update query info : ', update_query);

        return res.send({success: true, message: 'Succesfully updated!'});

    } catch (e) {
        console.log(e);

        return res.send({success: false, message: 'Failed to update!'});
    }

});

app.post('/api/user-login', (req, res) => {

  try {

    console.log('User Name : ', req.body.username);
    console.log('User Password : ', req.body.password);

    var sessionStorage = '';

    // select_sql_query = "SELECT username,email,user_status,employee_id,user_type FROM user WHERE username='"+req.body.username+"' AND password='"+req.body.password+"'";

    select_sql_query = "SELECT username,email,user_status,employee_id,user_type FROM user WHERE username="+dbConnection.escape(req.body.username)+" AND password="+dbConnection.escape(req.body.password);

    console.log('QUERY : ', select_sql_query);

    dbConnection.query(select_sql_query, function (error, results) {

      try {

        console.log("results",results);

        if (results.length > 0) {
          req.session.username = results[0].username;
          req.session.email = results[0].email;
          req.session.user_status = results[0].user_status;
          req.session.employee_id = results[0].employee_id;
          req.session.user_type = results[0].user_type;
          sessionStorage = req.session;

          console.log(req.session);
          var success = true;
        }
        else {
          var success = false;
        }
        if (error) throw error;
        console.log('session storage : ', sessionStorage);

        console.log('server session storage : ', req.session);

        jwt.sign({sessionStorage: sessionStorage}, 'secretkey', {expiresIn: '1d'}, (err, token) => {
          if (err) {
            console.log('Error at the time of JWT generat : ', err);
            res.sendStatus(403);
          }
          else {
            console.log('JWT created....');
            console.log('Token : ', token);

            res.json({
              token: token,
              issuedAt: Date.now(),
              expiresIn: '86400000',
              // expiresIn: '30000',
              error: error,
              success: success,
              session: sessionStorage,
              message: 'Login messages.'
            });
          }
        });

      } catch (e) {
        console.log('Error at the time of login in the nested try catch block : ', e);

        return res.send({success:false, error: e});
      }

      // return res.send({ error: error, success: success, session: sessionStorage, message: 'sepecification name list.' });
    });

  } catch (e) {
    console.log('Error at the time of login outer try catch block : ', e);

    return res.send({success:false, error: e});
  }
});

app.post('/api/store-token', async function (req, res) {
  // console.log('store token api : ', req.body);
  console.log('store token of id api : ', req.body.id);

  var token = "'"+req.body.token+"'";
  // var token = req.body.token;

  // console.log('UPDATE user SET jwtoken = '+token+' WHERE employee_id = '+ req.body.id);

  try {
    const update_jwtoken = await query('UPDATE user SET jwtoken = '+token+' WHERE employee_id = '+ req.body.id+' softDel = 0');

    console.log(update_jwtoken);
  }
  catch (error) {
    console.log(error);
  }

  return res.send({ message: 'Stored token for this user' });
});

app.get('/api/parent-category', (req, res) => {
  console.log('User Name : ', req.body.username);
  console.log('User Password : ', req.body.password);

  var sessionStorage = '';

  select_sql_query = "SELECT * FROM category WHERE parent_category_id= 0";

  console.log('QUERY : ', select_sql_query);

  dbConnection.query(select_sql_query, function (error, results) {
    console.log("results",results);
    if (results.length > 0) {
      return res.send({ success: true, data: results,  message: 'successfully get the information from category' });
    }
    else {
      return res.send({ error: error, data: [],  message: 'Did not able to feltch from category table' });
    }
  });

});

app.get('/api/child-category', (req, res) => {
  console.log('Parent Category : ', req.query.id);

  select_sql_query = "SELECT * FROM category WHERE parent_category_id='"+req.query.id+"'";

  console.log('QUERY : ', select_sql_query);

  dbConnection.query(select_sql_query, function (error, results) {
    console.log("results",results);
    if (results.length > 0) {
      return res.send({ success: true, data: results,  message: 'successfully get the information from category' });
    }
    else {
      return res.send({ error: error, data: [],  message: 'Did not able to feltch from category table' });
    }
  });

  // return res.send({ success: true, message: 'successfully get the information from category' });

});

app.get('/api/user-logout', async function (req, res) {
  console.log('before logout : ', req.session);
  console.log('request username outside of the condition : ', req.query.id);
  console.log('session username outside of the condition : ', req.session.username);
  if (req.session.username != undefined) {
    if (req.session.username.match(req.query.id)) {
      console.log('session username : ', req.session.username);
      console.log('request username : ', req.query.id);

      req.session.destroy(function(error) {
        if (error) throw error;
        if (!error){
          var success = true;
          var error = '';
        }
        else {
          var success = false;
        }
        console.log('Logout API Result success : '+success+' : error : '+error+' : seesion status : '+req.session);
        return res.send({ error: error, success: success, message: 'Error to logout.' });
      });
    }
  }
  else {
    return res.send({ error: 'error', success: false, message: 'Error to logout.' });
  }

  // return res.send({ success: true, message: 'Error to logout.' });
});

app.post('/api/vendor-details-personal', verifyToken, async function (req, res) {
  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if (err) {
      res.sendStatus(403);
    }
    else {
      let INPUT_path_to_your_images = '';
      let OUTPUT_path = '';
      let imageNameForCompress = '';
      let isAnyError = false;

      if(req.files!=null){
        if(!req.body.imageFile){
          var productFilesArray = [];
          productFilesArray = req.files.imageFile;
          console.log('Image Array : ', productFilesArray);
          if(Array.isArray(productFilesArray)){
            console.log('inside 1');
            productFilesArray.map(function(file,index){
              console.log('inside 2');
              file.mv(`${__dirname}/../public/upload/vendor/${file.name}`, err => {
                if (err) {
                  console.error(err);
                  return res.status(500).send(err);
                }
              });
            })
          }
          else{
            let productFiles = req.files.imageFile;
            console.log('outside 1');
            productFiles.mv(`${__dirname}/../public/upload/vendor/${productFiles.name}`, err => {
              console.log('outside 2');
              imageNameForCompress = productFiles.name;
              if (err) {
                console.error(err);
                isAnyError = true;
                return res.status(500).send(err);
              }
            });

            // we are compressing the image...
            setTimeout(()=> {
              if (isAnyError == false) {
                INPUT_path_to_your_images = `${__dirname}/../public/upload/vendor/${imageNameForCompress}`;
                console.log('image path & name : ', `${__dirname}/../public/upload/vendor/${imageNameForCompress}`);

                OUTPUT_path = `${__dirname}/../public/upload/compressedVendorImages/`;

                compress_images(INPUT_path_to_your_images, OUTPUT_path, { compress_force: false, statistic: true, autoupdate: true }, false,
                  { jpg: { engine: "mozjpeg", command: ["-quality", "60"] } },
                  { png: { engine: "pngquant", command: ["--quality=20-50"] } },
                  { svg: { engine: "svgo", command: "--multipass" } },
                  { gif: { engine: "gifsicle", command: ["--colors", "64", "--use-col=web"] } },
                  function (error, completed, statistic) {
                    console.log("-------------");
                    console.log(error);
                    console.log(completed);
                    console.log(statistic);
                    console.log("-------------");
                  }
                );
              }
            }, 500);
          }
        }
      }

      // START TO INSERT DATA TO PRODUCTS TABLE.......................
      var resolve = '';

      // select_sql_query = "SELECT * FROM vendor_details WHERE vendor_id='"+req.body.vendorId+"' AND status='1'";
      //
      // console.log('QUERY : ', select_sql_query);
      //
      // dbConnection.query(select_sql_query, function (error, results) {
      //   console.log("results",results);
      //
      //   if (results.length > 0) {
      //     resolve = 'update';
      //   }
      //   else {
      //     resolve = 'insert';
      //   }
      // });

      const select_from_vendor_details_sql_query = await query('SELECT * FROM vendor_details WHERE status = 1 AND vendor_id = '+req.body.vendorId);
      const select_vendor_sql_query = await query('SELECT * FROM vendor WHERE status = 1 AND id = '+JSON.parse(req.body.vendorId));

      console.log('select_from_vendor_details_sql_query : ', select_from_vendor_details_sql_query);
      console.log('select_vendor_sql_query : ', select_vendor_sql_query);
      console.log('select_from_vendor_details_sql_query : ', select_from_vendor_details_sql_query.length);
      console.log('req.body.vendorId : ', JSON.parse(req.body.vendorId));
      console.log('req.body.vendorId : ', req.body.vendorId);

      var mobileNumber = '';
      var nid = '';
      var dob = '';
      var pAddress = '';
      var pImage = '';

      if (req.body.mobileNumber) {
          mobileNumber = JSON.parse(req.body.mobileNumber);
          console.log('mobileNumber : ', JSON.parse(req.body.mobileNumber));
      }
      else if (req.body.nationalIdName) {
          nid = JSON.parse(req.body.nationalIdName);
          console.log('nid : ',nid);
      }
      else if (req.body.dateOfBirthName) {
          dib = JSON.parse(req.body.dateOfBirthName);
      }
      else if (req.body.presentAddress) {
          pAddress = JSON.parse(req.body.presentAddress);
      }
      else if (req.body.image) {
          pImage = JSON.parse(req.body.image);
      }

      if ( select_from_vendor_details_sql_query.length == 0 ) {

        try {
          // var name = "'"+select_vendor_sql_query[0].name+"'";
          // var email = "'"+select_vendor_sql_query[0].email+"'";

          var name = select_vendor_sql_query[0].name;
          var email = select_vendor_sql_query[0].email;

          console.log('Trying to insert into vendor_details table... : '+name+' email : '+email);

          // const insert_sql_query = await query ('INSERT INTO vendor_details (mobile, nid, dob, present_address, vendor_id, step_completed, softDel, status) VALUES ('+mobile+', '+nid+', '+dob+', '+present_address+', '+vendor_id+', 1, 0, 1)'); /* old query */

          // const insert_sql_query = await query ('INSERT INTO vendor_details (name, email, mobile, nid, dob, present_address, vendor_id, vendorImage, step_completed, softDel, status) VALUES ('+name+', '+email+', '+req.body.mobileNumber+', '+req.body.nationalIdName+', '+req.body.dateOfBirthName+', '+req.body.presentAddress+', '+req.body.vendorId+', '+req.body.image+', 1, 0, 1)'); /* THIS IS THE MAIN QUERY */

          var insert = {name : name, email : email, mobile : mobileNumber, nid : nid, dob : dob, present_address : pAddress, vendor_id : JSON.parse(req.body.vendorId), vendorImage : pImage, step_completed : 1, softDel : 0, status : 1};

          console.log('Insert Query : ', insert);

          dbConnection.query('INSERT INTO vendor_details SET ?', insert, function (err, result) {
            console.log(result);
            console.log(err);

            if (result) {
              console.log("1 record inserted at vendor_details");
              return res.send({ success: true, message: 'personal info inserted'});
            }
            else if (err) {
              console.log("Error to update at vendor_details : ", err);
              return res.send({ success: false, message: 'Personal Details insertion failed !'});
            }

          });

          // return res.send({ success: true, message: insert_sql_query});
        }
        catch (error) {
          console.log('Error at the time of personal Details insertion : ', error);
          if (error) return res.send({success: false, error: 'Error has occured at the time of insert data to vendor_details table', request : req.body});
        }

      }
      else {
        console.log('Update needed : ', req.body);

        try {

          var update_sql_query = "UPDATE vendor_details SET  mobile = '"+mobileNumber+"', nid = '"+nid+"', dob = '"+dob+"', present_address = '"+pAddress+"' WHERE vendor_id = "+req.body.vendorId+" AND status = 1";

          console.log(update_sql_query);

          dbConnection.query(update_sql_query, function (err, result) {
            console.log(result);
            console.log(err);


            if (result) {
              console.log("1 record updated at vendor_details");
              return res.send({ success: true, message: update_sql_query});
            }
            else if (err) {
              console.log("Error to update at vendor_details : ", err);
              return res.send({ success: false, message: 'Personal Details Update failed !'});
            }

          });

        }
        catch (error) {
          console.log('Error : ', error);
          if (error) return res.send({success: false, message: 'catched', error: 'Error has occured at the time of update data to PRODUCTS table', request : req.body});
        }

      }

    }
  });

})


// app.post('/api/vendor-details-personal', verifyToken, (req, res) => {
//
//   console.log('Personal Details : ', req.body);
//
//   jwt.verify(req.token, 'secretkey', (err, authData) => {
//     if (err) {
//       res.sendStatus(403);
//     }
//     else {
//       new Promise (function (resolve, reject) {
//
//         select_sql_query = "SELECT * FROM vendor_details WHERE vendor_id='"+req.body.vendorId+"' AND status='1'";
//
//         console.log('QUERY : ', select_sql_query);
//
//         dbConnection.query(select_sql_query, function (error, results) {
//           console.log("results",results);
//
//           if (results.length > 0) {
//             resolve('update');
//           }
//           else {
//             resolve('insert');
//           }
//         });
//
//       }).then( function (resolve) {
//         console.log(resolve);
//
//         if ( resolve == 'insert' ) {
//
//           try {
//             var insert_sql_query = "INSERT INTO vendor_details (mobile, nid, dob, present_address, vendor_id, step_completed, softDel, status) VALUES ('"+req.body.mobileNumber+"', '"+req.body.nationalIdName+"', '"+req.body.dateOfBirthName+"', '"+req.body.presentAddress+"', '"+req.body.vendorId+"', 'step_one', 0, '1')";
//
//             dbConnection.query(insert_sql_query, function (err, result) {
//               console.log('vendor_details insert result : ', result);
//               console.log('vendor_details error result : ', err);
//               if (result) {
//                 console.log("1 record inserted to vendor_details");
//                 return res.send({success: true, message: '1 record inserted to vendor_details', result: result});
//               }
//               else {
//                 console.log('Error to inseret at user : ', err);
//                 return res.send({success: false, message: 'Error occured to insert data at vendor_details', error: err});
//               }
//             });
//           }
//           catch (error) {
//             if (error) return res.send({success: false, error: 'Error has occured at the time of insert data to PRODUCTS table', request : req.body});
//           }
//
//         }
//         else if (resolve == 'update') {
//           console.log('Update needed : ', req.body);
//
//           try {
//
//             var update_sql_query = "UPDATE vendor_details SET  mobile = '"+req.body.mobileNumber+"', nid = '"+req.body.nationalIdName+"', dob = '"+req.body.dateOfBirthName+"', present_address = '"+req.body.presentAddress+"', vendor_id = '"+req.body.vendorId+"' WHERE vendor_id = '"+req.body.vendorId+"' AND status = '1'";
//
//             console.log(update_sql_query);
//
//             // return res.send({success: true, message: 'recored updated'});
//
//             dbConnection.query(update_sql_query, function (err, result) {
//               console.log(result);
//               console.log(err);
//
//               // return res.send({ success: true, message: 'Personal Details Successfully Updated !'});
//
//               if (result) {
//                 console.log("1 record updated at vendor_details");
//                 return res.send({ success: true, message: update_sql_query});
//               }
//               else if (err) {
//                 console.log("Error to update at vendor_details : ", err);
//                 return res.send({ success: false, message: 'Personal Details Update failed !'});
//               }
//
//             });
//
//           }
//           catch (error) {
//             console.log('Error : ', error);
//             if (error) return res.send({success: false, message: 'catched', error: 'Error has occured at the time of update data to PRODUCTS table', request : req.body});
//           }
//
//         }
//         else{
//
//           reject('rejected');
//         }
//
//       }).catch(function (reject) {
//         console.log('Promise rejected', reject);
//       });
//     }
//   });
//
//   // return res.send({ success: true, message: 'Personal Details Successfully Inserted !'});
//
// });

app.get('/api/specialCategoryListForCategory', async function(req, res, next) {
  const parentAndChild = [];
  const parentAndChildRelation = [];
  let relationIndex = 0;
  console.log('special Category List For Specification');
  const category_name = await query('SELECT * FROM category');
  for ( const i in category_name ) {
    if (category_name[i].parent_category_id == 0) {
      parentAndChild[category_name[i].id] = category_name[i].category_name;
    }
    for ( const j in parentAndChild ) {
      if (category_name[i].parent_category_id == j) {
        parentAndChild[category_name[i].id] = parentAndChild[j]+'->'+category_name[i].category_name;
        ++relationIndex;
        parentAndChildRelation[relationIndex] = parentAndChild[category_name[i].id]
      }
    }
  }
  for ( const i in unique(parentAndChildRelation) ) {
    delete parentAndChild[parentAndChildRelation[i]];
  }
  for ( const i in parentAndChild ) {
    console.log('Consoling Chid Category : ','index : '+i+' value : '+parentAndChild[i]);
  }
  return res.send({ data: parentAndChild, message: 'category list.' });
});

app.get('/api/getVendorWiseProductList', (req, res) => {
  dbConnection.query("SELECT COUNT(id) AS count_id FROM products WHERE vendor_id = '"+req.query.id+"' AND status = 'active'", function (error, results, fields) {
    console.log(results[0].count_id);
    var count_product = Number(results[0].count_id) + Number(1);
    console.log(count_product);
    var SKU_part = 'BNJ-000'+req.query.id+'-0000'+count_product;
    if (error) throw error;
    return res.send({ error: error, data: SKU_part, message: 'vendor name list.' });
  });
});

app.post('/api/vendor-details-shop', verifyToken, async function (req, res) {

  console.log('Business Details : ', req.body);

  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if (err) {
      res.sendStatus(403);
    }
    else {
      try {
        let flag = false;
        let vendorNameForSlug = '';
        let INPUT_path_to_your_images = '';
        let OUTPUT_path = '';
        let imageNameForCompress = '';
        let isAnyError = false;

        if(req.files!=null){
          if(!req.body.imageFile){
            var productFilesArray = [];
            productFilesArray = req.files.imageFile;
            console.log('Image Array : ', productFilesArray);
            if(Array.isArray(productFilesArray)){
              console.log('inside 1');
              productFilesArray.map(function(file,index){
                console.log('inside 2');
                file.mv(`${__dirname}/../public/upload/vendor/${file.name}`, err => {
                  if (err) {
                    console.error(err);
                    return res.status(500).send(err);
                  }
                });
              })
            }
            else{
              let productFiles = req.files.imageFile;
              console.log('outside 1');
              productFiles.mv(`${__dirname}/../public/upload/vendor/${productFiles.name}`, err => {
                console.log('outside 2');
                imageNameForCompress = productFiles.name;
                if (err) {
                  console.error(err);
                  isAnyError = true;
                  return res.status(500).send(err);
                }
              });

              // we are compressing the image...
              setTimeout(()=> {
                if (isAnyError == false) {
                  INPUT_path_to_your_images = `${__dirname}/../public/upload/vendor/${imageNameForCompress}`;
                  console.log('image path & name : ', `${__dirname}/../public/upload/vendor/${imageNameForCompress}`);

                  OUTPUT_path = `${__dirname}/../public/upload/compressedVendorImages/`;

                  compress_images(INPUT_path_to_your_images, OUTPUT_path, { compress_force: false, statistic: true, autoupdate: true }, false,
                    { jpg: { engine: "mozjpeg", command: ["-quality", "60"] } },
                    { png: { engine: "pngquant", command: ["--quality=20-50"] } },
                    { svg: { engine: "svgo", command: "--multipass" } },
                    { gif: { engine: "gifsicle", command: ["--colors", "64", "--use-col=web"] } },
                    function (error, completed, statistic) {
                      console.log("-------------");
                      console.log(error);
                      console.log(completed);
                      console.log(statistic);
                      console.log("-------------");
                    }
                  );
                }
              }, 500);
            }
          }
        }

        var shopImage = null;
        var shopLanguageName = null;
        var shopCountryName = null;
        var shopCurrencyName = null;
        var your_description = null;
        var shopName = null;
        var vendorId = null;

        console.log(req.body.shopImage);

        setTimeout(() => {
            if (!req.body.shopImage) {
                shopImage = JSON.parse(req.body.shopImage);
            }
            if (!req.body.shopLanguageName) {
                shopLanguageName = JSON.parse(req.body.shopLanguageName);
            }
            if (!req.body.shopCountryName) {
                shopCountryName = JSON.parse(req.body.shopCountryName);
            }
            if (!req.body.shopCurrencyName) {
                shopCurrencyName = JSON.parse(req.body.shopCurrencyName);
            }
            if (!req.body.your_description) {
                your_description = JSON.parse(req.body.your_description);
            }
            if (!req.body.shopName) {
                shopName = JSON.parse(req.body.shopName);
                vendorNameForSlug = req.body.shopName;
            }
            if (!req.body.vendorId) {
                vendorId = JSON.parse(req.body.vendorId);
            }
        }, 50);

        // const update_sql_query = await query ('UPDATE vendor_details SET logo= '+req.body.shopImage+', shop_language = '+req.body.shopLanguageName+', shop_country = '+req.body.shopCountryName+', shop_currency = '+req.body.shopCurrencyName+', your_description = '+req.body.your_description+', shop_name = '+req.body.shopName+', step_completed = 2 WHERE vendor_id = '+req.body.vendorId+' AND status = 1');

        setTimeout(()=> {
            console.log('Shop Name : '+shopName+' Image : '+ shopImage);
            console.log('Shop Name : '+req.body.shopName+' Image : '+ req.body.shopImage+' - '+JSON.parse(req.body.shopName)+' - '+JSON.parse(req.body.shopImage));

            dbConnection.query('UPDATE vendor_details SET logo= ?, shop_language = ?, shop_country = ?, shop_currency = ?, your_description = ?, shop_name = ?, step_completed = ?  WHERE vendor_id = ? AND status = ?', [JSON.parse(req.body.shopImage), shopLanguageName, shopCountryName, shopCurrencyName, your_description, JSON.parse(req.body.shopName), 2, JSON.parse(req.body.vendorId), 1], function (err, result) {
              console.log(result);
              console.log(err);


              if (result) {
                console.log("1 record updated at vendor_details");
                flag = true;
                // return res.send({ success: true, message: 'shop info inserted'});
              }
              else if (err) {
                console.log("Error to update at vendor_details : ", err);
                return res.send({ success: false, message: 'shop info Update failed !'});
              }

            });
        }, 100);

        setTimeout(()=> {
          if (flag == true) {
            // vendorNameForSlug = JSON.parse(req.body.shopName).toLowerCase();
            // // vendorNameForSlug = vendorNameForSlug.replace(' ', '-');
            // vendorNameForSlug = vendorNameForSlug.split(' ').join('-');
            // vendorNameForSlug = vendorNameForSlug+'-'+JSON.parse(req.body.vendorId);

            // console.log('vendorNameForSlug : ' + vendorNameForSlug + ' and id is : ' + req.body.vendorId);

            // var update_sql_query = 'UPDATE vendor_details SET slug = '+JSON.stringify(vendorNameForSlug)+' WHERE vendor_id = '+JSON.parse(req.body.vendorId);

            var update_sql_query = 'update vendor_details set slug = slugify(shop_name, vendor_id) WHERE vendor_id = '+JSON.parse(req.body.vendorId);

            dbConnection.query(update_sql_query, function (err, result) {
              if (result) {
                console.log("1 record updated to vendor for slug");

                return res.send({success: true, server_message: result, message: 'success'});
              }
              else {
                console.log('Error a the time of vendor update for slug : ', err);

                return res.send({ success: false, message: 'shop info Update failed !'});
              }
            });

          }
          else {
            console.log('Error at the time of product insert : ', err);

            return res.send({success: false, message: 'shop info Update failed !'});
          }
        }, 700);

        // console.log("1 record updated at vendor_details", update_sql_query);
        // return res.send({ success: true, message: update_sql_query});

      } catch (e) {
        console.log("Error to update at vendor_details : ", e);
        return res.send({ success: false, message: 'shop info Update failed '});
      }
    }
  });

  // try {
  //
  //   // var update_sql_query = "UPDATE vendor_details SET shop_language = '"+req.body.shopLanguageName+"', shop_country = '"+req.body.shopCountryName+"', shop_currency = '"+req.body.shopCurrencyName+"', your_description = '"+req.body.your_description+"', shop_name = '"+req.body.shopName+"', step_completed = 'step_two' WHERE vendor_id = '"+req.body.vendorId+"' AND status = '1'";
  //
  //   dbConnection.query(update_sql_query, function (err, result) {
  //     console.log(result);
  //     console.log(err);
  //
  //     if (result) {
  //       console.log("1 record updated at vendor_details");
  //       return res.send({ success: true, message: update_sql_query});
  //     }
  //     else if (err) {
  //       console.log("Error to update at vendor_details : ", err);
  //       return res.send({ success: false, message: 'Personal Details Update failed !'});
  //     }
  //
  //   });
  //
  // }
  // catch (error) {
  //   console.log('Error : ', error);
  //   if (error) return res.send({success: false, message: 'catched', error: 'Error has occured at the time of update data to PRODUCTS table', request : req.body});
  // }


});

app.post('/api/vendor-details-business', verifyToken, async function (req, res) {
  console.log('Business Details : ', req.body);

  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if (err) {
      res.sendStatus(403);
    }
    else {
      try {
        let INPUT_path_to_your_images = '';
        let OUTPUT_path = '';
        let imageNameForCompress = '';
        let isAnyError = false;

        if(req.files!=null){
          if(!req.body.imageFile){
            var productFilesArray = [];
            productFilesArray = req.files.imageFile;
            console.log('Image Array : ', productFilesArray);
            if(Array.isArray(productFilesArray)){
              console.log('inside 1');
              productFilesArray.map(function(file,index){
                console.log('inside 2');
                file.mv(`${__dirname}/../public/upload/vendor/${file.name}`, err => {
                  if (err) {
                    console.error(err);
                    return res.status(500).send(err);
                  }
                });
              })
            }
            else{
              let productFiles = req.files.imageFile;
              console.log('outside 1');
              productFiles.mv(`${__dirname}/../public/upload/vendor/${productFiles.name}`, err => {
                console.log('outside 2');
                imageNameForCompress = productFiles.name;
                if (err) {
                  console.error(err);
                  isAnyError = true;
                  return res.status(500).send(err);
                }
              });

              // we are compressing the image...
              setTimeout(()=> {
                if (isAnyError == false) {
                  INPUT_path_to_your_images = `${__dirname}/../public/upload/vendor/${imageNameForCompress}`;
                  console.log('image path & name : ', `${__dirname}/../public/upload/vendor/${imageNameForCompress}`);

                  OUTPUT_path = `${__dirname}/../public/upload/compressedVendorImages/`;

                  compress_images(INPUT_path_to_your_images, OUTPUT_path, { compress_force: false, statistic: true, autoupdate: true }, false,
                    { jpg: { engine: "mozjpeg", command: ["-quality", "60"] } },
                    { png: { engine: "pngquant", command: ["--quality=20-50"] } },
                    { svg: { engine: "svgo", command: "--multipass" } },
                    { gif: { engine: "gifsicle", command: ["--colors", "64", "--use-col=web"] } },
                    function (error, completed, statistic) {
                      console.log("-------------");
                      console.log(error);
                      console.log(completed);
                      console.log(statistic);
                      console.log("-------------");
                    }
                  );
                }
              }, 500);
            }
          }
        }

        // assign all the values ...

        var tradeLicense = null;
        var businessStartDate = null;
        var tinNumber = null;
        var businessAddress = null;
        var webAddress = null;
        var vendorCategory = null;
        var productCategory = null;

        if (!req.body.tradeLicenceName) {
          tradeLicense = JSON.parse(req.body.tradeLicenceName);
        }
        if (!req.body.businessStartDateName) {
          businessStartDate = JSON.parse(req.body.businessStartDateName);
        }
        if (!req.body.tinName) {
          tinNumber = JSON.parse(req.body.tinName);
        }
        if (!req.body.businessAddressName) {
          businessAddress = JSON.parse(req.body.businessAddressName);
        }
        if (!req.body.webAddressName) {
          webAddress = JSON.parse(req.body.webAddressName);
        }
        if (!req.body.vendorCategoryName) {
            vendorCategory = JSON.parse(req.body.vendorCategoryName)
        }
        if (!req.body.productCategoryName) {
            productCategory = JSON.parse(req.body.productCategoryName);
        }
        // end of assignment..

        if (JSON.parse(req.body.transactionInformationName) == 'Cash') {
          // const update_vendor_details_for_business_details = await query ('UPDATE vendor_details SET cover_photo = '+req.body.businessImage+', trade_licence = '+req.body.tradeLicenceName+', business_start_date = '+req.body.businessStartDateName+', tin = '+req.body.tinName+', business_address = '+req.body.businessAddressName+', web_address = '+req.body.webAddressName+', transaction_information = '+req.body.transactionInformationName+', vendor_category = '+req.body.vendorCategoryName+', product_category = '+req.body.productCategoryName+', product_sub_category = '+req.body.productCategoryName+', step_completed = "completed" WHERE vendor_id = '+req.body.vendorId+' AND status = 1');

          dbConnection.query('UPDATE vendor_details SET cover_photo = ?,  trade_licence = ?, business_start_date = ?, tin = ?, business_address = ?, web_address = ?, transaction_information = ?, vendor_category = ?, product_category = ?, product_sub_category = ?, step_completed = ? WHERE vendor_id = ? AND status = ?', [JSON.parse(req.body.businessImage), tradeLicense, businessStartDate, tinNumber, businessAddress, webAddress, JSON.parse(req.body.transactionInformationName), vendorCategory, productCategory, productCategory, 'completed',  JSON.parse(req.body.vendorId), 1], function (err, result) {
            console.log(result);
            console.log(err);

            if (result) {
              console.log("1 record updated at vendor_details");
              console.log("req.body.vendorId : ", req.body.vendorId);
              // return res.send({ success: true, message: 'shop info inserted'});
              updateUserTableInfo(req.body.vendorId, res);
            }
            else if (err) {
              console.log("Error to update at vendor_details : ", err);
              return res.send({ success: false, message: 'shop info Update failed !'});
            }

          });

        }
        else {
          // const update_vendor_details_for_business_details = await query ('UPDATE vendor_details SET cover_photo = '+req.body.businessImage+', trade_licence = '+req.body.tradeLicenceName+', business_start_date = '+req.body.businessStartDateName+', tin = '+req.body.tinName+', business_address = '+req.body.businessAddressName+', web_address = '+req.body.webAddressName+', transaction_information = '+req.body.transactionInformationName+', bankName = '+req.body.bank+', account_name = '+req.body.accountName+', ac_no = '+req.body.accountNo+', branch = '+req.body.branch+', routing_no = '+req.body.routingNo+', vendor_category = '+req.body.vendorCategoryName+', product_category = '+req.body.productCategoryName+', product_sub_category = '+req.body.productCategoryName+', step_completed = "completed" WHERE vendor_id = '+req.body.vendorId+' AND status = 1');

          dbConnection.query('UPDATE vendor_details SET cover_photo = ?, trade_licence = ?, business_start_date = ?, tin = ?, business_address = ?, web_address = ?, transaction_information = ?, bankName = ?, account_name = ?, ac_no = ?, branch = ?, routing_no = ?, vendor_category = ?, product_category = ?, product_sub_category = ?, step_completed = ? WHERE vendor_id = ? AND status = ?', [JSON.parse(req.body.businessImage), tradeLicense, businessStartDate, tinNumber, businessAddress, webAddress, JSON.parse(req.body.transactionInformationName), JSON.parse(req.body.bank), JSON.parse(req.body.accountName), JSON.parse(req.body.accountNo), JSON.parse(req.body.branch), JSON.parse(req.body.routingNo), vendorCategory, productCategory, productCategory, 'completed', JSON.parse(req.body.vendorId), 1], function (err, result) {
            console.log(result);
            console.log(err);

            if (result) {
              console.log("1 record updated at vendor_business_details");
              console.log("req.body.vendorId : ", req.body.vendorId);
              // return res.send({ success: true, message: 'vendor details info inserted'});
              updateUserTableInfo(req.body.vendorId, res);
            }
            else if (err) {
              console.log("Error to update at vendor_details : ", err);
              return res.send({ success: false, message: 'vendor details insertion failed !'});
            }

          });

        }

        // const update_user_table = await query ('UPDATE user SET user_status = "completed" WHERE employee_id = '+JSON.parse(req.body.vendorId)+' AND status = 1');
        //
        // return res.send({ success: true, message: 'Personal Details Update successfully !'});
      } catch (e) {
        console.log('Error occured at the time of update .. ', e);

        const update_user_table = await query ('UPDATE vendor_details SET user_status = 1 WHERE employee_id = '+JSON.parse(req.body.vendorId));

        return res.send({ success: false, message: 'Personal Details Update rejected !'});
      }
    }
  });



  // new Promise (function (resolve, reject) {
  //   try {
  //     var update_sql_query = "UPDATE vendor_details SET trade_licence = '"+req.body.tradeLicenceName+"', business_start_date = '"+req.body.businessStartDateName+"', tin = '"+req.body.tinName+"', business_address = '"+req.body.businessAddressName+"', web_address = '"+req.body.webAddressName+"', transaction_information = '"+req.body.transactionInformationName+"', bankName = '"+req.body.bank+"', account_name = '"+req.body.accountName+"', ac_no = '"+req.body.accountNo+"', branch = '"+req.body.branch+"', routing_no = '"+req.body.routingNo+"', vendor_category = '"+req.body.vendorCategoryName+"', product_category = '"+req.body.productCategoryName+"', product_sub_category = '"+req.body.productCategoryName+"', step_completed = 'completed' WHERE vendor_id = '"+req.body.vendorId+"' AND status = '1'";
  //
  //     dbConnection.query(update_sql_query, function (err, result) {
  //       console.log(result);
  //       console.log(err);
  //
  //       if (result) {
  //         console.log("step_three record updated at vendor_details");
  //         resolve('update user table');
  //       }
  //       else if (err) {
  //         console.log("Error to update at vendor_details : ", err);
  //         reject('rejected');
  //       }
  //
  //     });
  //
  //   }
  //   catch (error) {
  //     console.log('Error : ', error);
  //     if (error) return res.send({success: false, message: 'catched', error: 'Error has occured at the time of update data to PRODUCTS table', request : req.body});
  //   }
  // }).then( function (resolve) {
  //   console.log('Need to update the user table !');
  //   try {
  //     var update_sql_query = "UPDATE user SET user_status = 'completed' WHERE employee_id = '"+req.body.vendorId+"' AND status = 'active'";
  //
  //     dbConnection.query(update_sql_query, function (err, result) {
  //       console.log(result);
  //       console.log(err);
  //
  //       if (result) {
  //         console.log("step_three record updated at vendor_details");
  //         return res.send({ success: true, message: 'Personal Details Update successfully !'});
  //       }
  //       else if (err) {
  //         console.log("Error to update at vendor_details : ", err);
  //         return res.send({ success: false, message: 'Personal Details Update failed !'});
  //       }
  //
  //     });
  //
  //   }
  //   catch (error) {
  //     console.log('Error : ', error);
  //     if (error) return res.send({success: false, message: 'catched', error: 'Error has occured at the time of update data to PRODUCTS table', request : req.body});
  //   }
  //
  // }).catch(function (reject) {
  //   console.log('Rejected !', reject);
  //   return res.send({ success: true });
  // });

});

function updateUserTableInfo (vendorID, res) {
    try {
        var update_sql_query = "UPDATE user SET user_status = 'completed' WHERE employee_id = "+vendorID+" AND softDel =0 AND status = 'active'";

        dbConnection.query(update_sql_query, function (err, result) {
            console.log(result);
            console.log(err);

            if (result) {
                console.log("step_three record updated at vendor_details");
                // return res.send({ success: true, message: 'Business Details Update successfully !'});
                getUserTableInfo (vendorID, res);
            }
            else if (err) {
                console.log("Error to update at vendor_details : ", err);
                return res.send({ success: false, message: 'Business Details Update failed !'});
            }

        });
    } catch (e) {
        console.log('Error : ', e);
        return res.send({ success: false, message: 'Business Details Update failed !'});
    }

}

function getUserTableInfo (vendorID, res) {
    try {
        var update_sql_query = "SELECT * FROM user WHERE employee_id = "+vendorID+" AND softDel =0 AND status = 'active'";

        dbConnection.query(update_sql_query, function (err, result) {
            console.log(result);
            console.log(err);

            if (result) {
                console.log("step_three record updated at vendor_details");
                // return res.send({ success: true, message: 'Business Details Update successfully !'});
                registerVendorAsCustomer (vendorID, result, res);
            }
            else if (err) {
                console.log("Error to update at vendor_details : ", err);
                return res.send({ success: false, message: 'Business Details Update failed !'});
            }

        });
    } catch (e) {
        console.log('Error : ', e);
        return res.send({ success: false, message: 'Business Details Update failed !'});
    }
}

function registerVendorAsCustomer (vendorID, result, res) {
    console.log('In the registerVendorAsCustomer function');
    console.log('User Name : ', result[0].username);
    console.log('User Password : ', result[0].password);
    console.log('User Email : ', result[0].email);

    try {
        var update_sql_query = "INSERT INTO customer (name, email, password) VALUES ("+JSON.stringify(result[0].username)+", "+JSON.stringify(result[0].email)+", "+JSON.stringify(result[0].password)+")";

        dbConnection.query(update_sql_query, function (err, result) {
            console.log(result);
            console.log(err);

            if (result) {
                console.log("step_three record updated at vendor_details and user table and also registered as customer.");
                return res.send({ success: true, message: 'Business Details Update successfully !'});
                // registerVendorAsCustomer (vendorID, result, res);
            }
            else if (err) {
                console.log("Error to update at vendor_details : ", err);
                return res.send({ success: false, message: 'Business Details Update failed !'});
            }

        });
    } catch (e) {
        console.log('Error : ', e);
        return res.send({ success: false, message: 'Business Details Update failed !'});
    }
}


// app.post('/api/saveVendor', (req,res)=>{
//   console.log('The Request For Files: ', req.file);
//   console.log('The Request For Other Values: ', req.body);

//   // const file = req.file
//   // res.send(file)

//   // var tmp_path = req.file.path;
//   // var target_path = 'uploads/' + req.file.filename;

//   // console.log('tmp path : ', tmp_path);
//   // console.log('target path : ', target_path);

//   // var src = fs.createReadStream(tmp_path);
//   // console.log(src);
//   // var dest = fs.createWriteStream(target_path);
//   // src.pipe(dest);

//   // src.on('end', function() { return res.send({success: true, request:req.body}); });
//   // src.on('error', function(err) { return res.send({success: false, request:req.body}); });

//   // return res.send({success: true, request:req.body});

//   try {
//     var insert_sql_query = "INSERT INTO vendor (name, email, website, address, status) VALUES ('"+req.body.name+"', '"+req.body.email+"', '"+req.body.website+"', '"+req.body.address+"', '1' )";

//     dbConnection.query(insert_sql_query, function (err, result) {

//       if (result) {
//         console.log("1 record inserted to category");
//         return res.send({success: true, server_message: result});
//       }
//       else {
//         console.log('Error to inseret at category : ', err);
//         return res.send({success: false, error: err});
//       }

//     });

//   }
//   catch (error) {
//     if (error) return res.send({success: false, error: 'Error has occured at the time of insert data to PRODUCTS table', request : req.body});
//   }

// });

app.post('/api/saveVendor', verifyToken, (req, res) => {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      res.sendStatus(403);
    }
    else {
      if (req.files === null) {
        return res.status(400).json({ msg: 'No file uploaded' });
      }
      else{

        try {
          const file = req.files.file;
          file.mv(`${__dirname}/../public/upload/vendor/personal/${file.name}`, err => {
            if (err) {
              console.error(err);
              return res.status(500).send(err);
            }
          });
          var insert_sql_query = "INSERT INTO vendor (name, email, website, address,image, status) VALUES ('" + req.body.name + "', '" + req.body.email + "', '" + req.body.website + "', '" + req.body.address + "','" + file.name + "', '1' )";
          dbConnection.query(insert_sql_query, function (err, result) {

            if (result) {
              res.status(200).json({ message: 'success' });
            }
            else {
              console.log('Error to inseret at category : ', err);
              return res.send({ success: false, error: err });
            }
          });

          // let sampleFile = [];
          // sampleFile = req.files.file;
          // sampleFile.map(function(file,index){
          //       file.mv(`${__dirname}/../public/upload/vendor/${file.name}`, err => {
          //         if (err) {
          //           console.error(err);
          //           return res.status(500).send(err);
          //         }
          //       });
          //       console.log(file.fileName);
          //     })


        }
        catch (error) {
          if (error) return res.send({ success: false, error: 'Error has occured at the time of insert data to PRODUCTS table', request: req.body });
        }
      }
    }
  });

});

app.get('/api/getProductSpecificationData', async function (req, res) {
    try {
        const sql_query = await query ('SELECT * FROM product_specification_names WHERE softDel = 0 AND status = 1 AND id = '+ req.query.id);

        return res.send({success: true, data: sql_query});
    } catch (e) {
        console.log(e);

        return res.send({success: false, error: e});
    }
});

app.post('/api/saveSpecification', verifyToken, (req,res)=>{
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      res.status(403).send({success: false, message: 'jwt expired', status: '403'});
    }
    else {
      // values = req.body.values;
      // var valuesArray = values.split(" ");
      //
      // console.log('The Request values : ', req.body.ProductSpecificationValuesArray);
      // console.log('The Request values json formate : ', JSON.stringify(req.body.ProductSpecificationValuesArray));
      // console.log('The Request name : ', req.body.name);
      // console.log('The Request categoryId : ', req.body.categoryId);

      // return res.send({success: true});

      try {
          console.log('req : ', req.body);
        if (req.body.specification == 'Color') {
            if (req.body.isUpdateClicked == true) {
                var sql_query = "UPDATE product_specification_names SET specification_name = '"+req.body.specification+"', category_id = '"+req.body.categoryId+"', type = 0, status = 1 WHERE id = "+req.body.editID;
            }
            else {
                var sql_query = "INSERT INTO product_specification_names (specification_name, category_id, type, status) VALUES ('"+req.body.specification+"', '"+req.body.categoryId+"', 0, '1' )";
            }
            console.log(sql_query);
          dbConnection.query(sql_query, function (err, result) {

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
        else {
            if (req.body.isUpdateClicked == true) {
                var sql_query = "UPDATE product_specification_names SET specification_name = '"+req.body.specificationName+"', category_id = '"+req.body.categoryId+"', type = '"+req.body.specificationType+"', status = 1 WHERE id = "+req.body.editID;
            }
            else {
                var sql_query = "INSERT INTO product_specification_names (specification_name, category_id, type, status) VALUES ('"+req.body.specificationName+"', '"+req.body.categoryId+"', '"+req.body.specificationType+"', '1' )";
            }
            console.log(sql_query);
          dbConnection.query(sql_query, function (err, result) {

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


      }
      catch (error) {
        if (error) return res.send({success: false, error: 'Error has occured at the time of insert data to PRODUCTS table', request : req.body});
      }
    }
  });

});

// app.post('/api/saveSpecificationDetails',(req,res)=>{
//   values = req.body.specification_details_name;
//   // var valuesArray = values.split(" ");

//   console.log('The Request : ', req.body.ProductSpecificationValuesArray);

//   // return res.send({success: true});

//   try {
//     var insert_sql_query = "INSERT INTO product_specification_details (category_id, specification_details_name, status) VALUES ('"+req.body.categoryId+"', '"+JSON.stringify(req.body.ProductSpecificationValuesArray)+"', '1' )";

//     dbConnection.query(insert_sql_query, function (err, result) {

//       if (result) {
//         console.log("1 record inserted to category");
//         return res.send({success: true, server_message: result});
//       }
//       else {
//         console.log('Error to inseret at category : ', err);
//         return res.send({success: false, error: err});
//       }

//     });

//   }
//   catch (error) {
//     if (error) return res.send({success: false, error: 'Error has occured at the time of insert data to PRODUCTS table', request : req.body});
//   }

// });

app.post('/api/saveCategory', verifyToken, (req,res)=>{
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      res.status(403).send({success: false, message: 'jwt expired', status: '403'});
    }
    else {
      try {
        var insertId = '';
        var flag = false;
        var categoryNameForSlug = req.body.categoryName;

        if (req.body.isUpdateClicked == true) {
            var sql_query = "UPDATE category SET category_name = '"+req.body.categoryName+"', description = '"+req.body.categoryDescription+"', parent_category_id = '"+req.body.parentCategory+"', status = '"+req.body.isActive+"' WHERE id = '"+req.body.categoryID+"'";
        }
        else {
            var sql_query = "INSERT INTO category (category_name, description, parent_category_id, status) VALUES ('"+req.body.categoryName+"', '"+req.body.categoryDescription+"', '"+req.body.parentCategory+"', '"+req.body.isActive+"')";
        }

        dbConnection.query(sql_query, function (err, result) {
            if (result) {
                console.log("1 operation performed !");
                insertId = result.insertId;
                flag = true;
                // return res.send({success: true, server_message: result});
            }
            else {
                console.log('Error to inseret at category : ', err);
                return res.send({success: false, server_message: err});
            }
        });

        if (req.body.isUpdateClicked == true) {
            insertId = req.body.categoryID;
        }

        setTimeout(()=> {
          if (flag == true) {
            // if (req.body.isUpdateClicked == true) {
            //   categoryNameForSlug = categoryNameForSlug.toLowerCase();
            //   // categoryNameForSlug = categoryNameForSlug.replace(' ', '-');
            //   categoryNameForSlug = categoryNameForSlug.split(' ').join('-');
            //   categoryNameForSlug = categoryNameForSlug+'-'+req.body.categoryID;

            //   console.log('productNameForSlug : ' + categoryNameForSlug + ' and id is : ' + req.body.categoryID);

            //   var update_sql_query_for_product = "UPDATE category SET slug = '"+categoryNameForSlug+"' WHERE id = '"+req.body.categoryID+"'";
            // }
            // else {
            //     categoryNameForSlug = categoryNameForSlug.toLowerCase();
            //     // categoryNameForSlug = categoryNameForSlug.replace(' ', '-');
            //     categoryNameForSlug = categoryNameForSlug.split(' ').join('-');
            //     categoryNameForSlug = categoryNameForSlug+'-'+insertId;

            //     console.log('productNameForSlug : ' + categoryNameForSlug + ' and id is : ' + insertId);

            //     var update_sql_query_for_product = "UPDATE category SET slug = '"+categoryNameForSlug+"' WHERE id = '"+insertId+"'";
            // }

            update_sql_query = "update category set slug = slugify(category_name, id) WHERE id = '"+insertId+"'";

            dbConnection.query(update_sql_query, function (err, result) {
              if (result) {
                console.log("1 record updated to category for slug");

                return res.send({success: true, server_message: result, message: 'success'});
              }
              else {
                console.log('Error a the time of category update for slug : ', err);

                return res.send({success: false, error: 'Error has occured at the time of insert data to CATEGORY table', message: 'DB Error'});
              }
            });

          }
          else {
            console.log('Error at the time of category insert : ', err);

            return res.send({success: false, error: 'Error has occured at the time of insert data to CATEGORY table', message: 'DB Error'});
          }
        }, 700);

      }
      catch (error) {
          if (error) return res.send({success: false, error: 'Error has occured at the time of insert data to CATEGORY table', request : req.body});
      }
    }
  });


  console.log(req);
});

app.get('/api/deleteCategory', verifyToken, async function (req, res) {
  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if (err) {
      res.status(403).send({success: false, message: 'jwt expired', status: '403'});
    }
    else {
      try {
        // const delete_from_category = await query ('DELETE FROM category WHERE id = '+req.query.id);

        const delete_from_category = await query ('UPDATE category SET softDel = 1 WHERE id = '+req.query.id);

        return res.send({ success: true, message: 'Dleted successfully' });
      } catch (e) {
        console.log('Error at the time of delete from category table',e);

        return res.send({ success: false, message: 'DB Error' });
      }
    }
  });
});

// Product->Specificaton->Color [Started]
app.post('/api/saveColors', verifyToken, async function (req, res) {
  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if (err) {
      res.status(403).send({success: false, message: 'jwt expired', status: '403'});
    }
    else {
      try {

        console.log('Name : ', req.body.name);

        const insert_into_color_infos = await query ('INSERT INTO color_infos (name, softDel, status) VALUES ('+JSON.stringify(req.body.name)+', 0, 1)');

        return res.send({ success: true, message: 'Inserted successfully', authData: authData });

      } catch (e) {
        console.log('Error : ', e);

        return res.send({ success: false, message: 'DB Error' });
      }
    }
  });
});

app.get('/api/getColors', async function (req, res) {
  try {
    const get_color_infos = await query ('SELECT * FROM color_infos WHERE softDel = 0 AND status = 1');

    return res.send({ success: true, data: get_color_infos });
  } catch (e) {
    console.log('Error : ', e);

    return res.send({ success: true, data: [] });
  }

});

app.get('/api/deleteColor', verifyToken, async function (req, res) {

  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if (err) {
      res.status(403).send({success: false, message: 'jwt expired', status: '403'});
    }
    else {
      try {
        const get_color_infos = await query ('UPDATE color_infos SET softDel = 1, status = 0 WHERE id = '+ req.query.id);

        return res.send({ success: true, message: 'Data Deleted Succesfully' });
      } catch (e) {
        console.log('Error : ', e);

        return res.send({ success: false, message: 'Data Deletion Failed' });
      }
    }
  });

});

app.get('/api/getColorInfoForUpdate', verifyToken, async function (req, res) {
  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if (err) {
      res.status(403).send({success: false, message: 'jwt expired', status: '403'});
    }
    else {
      try {
        const get_color_infos = await query ('SELECT name FROM color_infos WHERE softDel = 0 AND status = 1 AND id = '+ req.query.id);

        console.log(get_color_infos[0].name);

        return res.send({ success: true, data: get_color_infos[0].name });
      } catch (e) {
        console.log('Error : ', e);

        return res.send({ success: false, data: [], message: 'DB Error' });
      }
    }
  });

});

app.post('/api/editColorInfos', verifyToken, async function (req, res) {
  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if (err) {
      res.sendStatus(403);
    }
    else {
      try {
        const get_color_infos = await query ('UPDATE color_infos SET name = '+JSON.stringify(req.body.name)+' WHERE id = '+ req.body.colorId);

        return res.send({ success: true, message: 'Data Updated Succesfully' });
      } catch (e) {
        console.log('Error : ', e);

        return res.send({ success: false, message: 'DB Error' });
      }
    }
  });

});
// Product->Specificaton->Color [Ended]

// Product->Specificaton->Size Type [Started]
app.post('/api/saveSizeType', verifyToken, async function (req, res) {
  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if (err) {
      res.status(403).send({success: false, message: 'jwt expired', status: '403'});
    }
    else {
      try {

        console.log('Name : ', req.body.name);

        const insert_into_color_infos = await query ('INSERT INTO size_type (name, softDel, status) VALUES ('+JSON.stringify(req.body.name)+', 0, 1)');

        return res.send({ success: true, message: 'Inserted successfully' });

      } catch (e) {
        console.log('Error : ', e);

        return res.send({ success: false, message: 'DB Error' });
      }
    }
  });
});

app.get('/api/getSizeType', async function (req, res) {
  try {
    const get_color_infos = await query ('SELECT * FROM size_type WHERE softDel = 0 AND status = 1');

    return res.send({ success: true, data: get_color_infos });
  } catch (e) {
    console.log('Error : ', e);

    return res.send({ success: true, data: [] });
  }

});

app.get('/api/getSizeTypeInfoForUpdate', verifyToken, async function (req, res) {
  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if (err) {
      res.status(403).send({success: false, message: 'jwt expired', status: '403'});
    }
    else {
      try {
        const get_color_infos = await query ('SELECT name FROM size_type WHERE softDel = 0 AND status = 1 AND id = '+ req.query.id);

        console.log(get_color_infos[0].name);

        return res.send({ success: true, data: get_color_infos[0].name });
      } catch (e) {
        console.log('Error : ', e);

        return res.send({ success: false, data: [], message: 'DB Error' });
      }
    }
  });

});

app.post('/api/editSizeTypeInfos', verifyToken, async function (req, res) {
  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if (err) {
      res.status(403).send({success: false, message: 'jwt expired', status: '403'});
    }
    else {
      try {
        const get_color_infos = await query ('UPDATE size_type SET name = '+JSON.stringify(req.body.name)+' WHERE id = '+ req.body.colorId);

        return res.send({ success: true, message: 'Data Updated Succesfully' });
      } catch (e) {
        console.log('Error : ', e);

        return res.send({ success: false, message: 'DB Error' });
      }
    }
  });

});

app.get('/api/deleteSizeType', verifyToken, async function (req, res) {

  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if (err) {
      res.status(403).send({success: false, message: 'jwt expired', status: '403'});
    }
    else {

      try {
        const get_color_infos = await query ('UPDATE size_type SET softDel = 1, status = 0 WHERE id = '+ req.query.id);

        return res.send({ success: true, message: 'Data Deleted Succesfully' });
      } catch (e) {
        console.log('Error : ', e);

        return res.send({ success: false, message: 'Data Deletion Failed' });
      }

    }
  });

});
// Product->Specificaton->Size Type [Ended]

// Product->Specificaton->Size Infos [Started]
app.post('/api/saveSize', verifyToken, async function (req, res) {
  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if (err) {
      res.status(403).send({success: false, message: 'jwt expired', status: '403'});
    }
    else {
      try {

        console.log('Name : ', req.body.name);

        const insert_into_color_infos = await query ('INSERT INTO size_infos (size, size_type_id, softDel, status) VALUES ('+JSON.stringify(req.body.size)+', '+JSON.stringify(req.body.sizeType)+', 0, 1)');

        return res.send({ success: true, message: 'Inserted successfully' });

      } catch (e) {
        console.log('Error : ', e);

        return res.send({ success: false, message: 'DB Error' });
      }
    }
  });
});

app.get('/api/getSizeInfos', async function (req, res) {
  try {
    const get_size_infos = await query ('SELECT size_infos.id AS id, size_infos.size AS size, size_infos.size_type_id AS size_type_id, size_type.name FROM size_infos JOIN size_type ON size_infos.size_type_id = size_type.id WHERE size_infos.softDel = 0 AND size_infos.status = 1 AND size_type.softDel = 0 AND size_type.status = 1');

    return res.send({ success: true, data: get_size_infos });
  } catch (e) {
    console.log('Error : ', e);

    return res.send({ success: true, data: [] });
  }

});

app.get('/api/getSizeInfoForUpdate', verifyToken, async function (req, res) {
  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if (err) {
      res.sendStatus(403);
    }
    else {
      try {
        const get_color_infos = await query ('SELECT size_infos.size AS size, size_type.id AS size_type_id FROM size_infos JOIN size_type ON size_infos.size_type_id = size_type.id WHERE size_infos.softDel = 0 AND size_infos.status = 1 AND size_type.softDel = 0 AND size_type.status = 1 AND size_infos.id = '+ req.query.id);

        console.log(get_color_infos[0]);

        return res.send({ success: true, data: get_color_infos[0] });
      } catch (e) {
        console.log('Error : ', e);

        return res.send({ success: false, data: [], message: 'DB Error' });
      }
    }
  });

});

app.post('/api/editSizeInfos', verifyToken, async function (req, res) {
  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if (err) {
      res.status(403).send({success: false, message: 'jwt expired', status: '403'});
    }
    else {
      try {
        const get_color_infos = await query ('UPDATE size_infos SET size = '+JSON.stringify(req.body.size)+', size_type_id = '+JSON.stringify(req.body.sizeType)+' WHERE id = '+ req.body.colorId);

        return res.send({ success: true, message: 'Data Updated Succesfully' });
      } catch (e) {
        console.log('Error : ', e);

        return res.send({ success: false, message: 'DB Error' });
      }
    }
  });

});

app.get('/api/deleteSizeInfo', async function (req, res) {
  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if (err) {
      res.status(403).send({success: false, message: 'jwt expired', status: '403'});
    }
    else {
      try {
        const get_color_infos = await query ('UPDATE size_infos SET softDel = 1, status = 0 WHERE id = '+ req.query.id);

        return res.send({ success: true, message: 'Data Deleted Succesfully' });
      } catch (e) {
        console.log('Error : ', e);

        return res.send({ success: false, message: 'Data Deletion Failed' });
      }
    }
  });

});
// Product->Specificaton->Size Infos [Ended]

app.get('/api/search_filter_products', verifyToken, (req, res) => {
  console.log('Vendor Values : ', req.query.vendorId);
  console.log('categoryList Values : ', req.query.categoryList);

  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      res.sendStatus(403);
    }
    else {
      dbConnection.query('SELECT * FROM products WHERE vendor_id = "'+ req.query.vendorId +'" AND category_id = "'+req.query.categoryList+'"', function (error, results, fields) {

        if (error) throw error;
        return res.send({ data: results, message: 'data' });

      });
    }
  });

  // return res.send({ success: 'true', data: req.query.id, message: 'data' });

});

app.get('/api/search_purchase_products', verifyToken, (req, res) => {
  console.log('Vendor Values : ', req.query.vendorId);
  console.log('Vendor Values : ', req.query.id);

  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      res.sendStatus(403);
    }
    else {
      var searchedProducts = [];

      new Promise (function (resolve, reject) {

        dbConnection.query('SELECT id FROM products WHERE vendor_id = "'+ req.query.vendorId +'" AND product_name LIKE "%'+ req.query.id +'%" OR product_sku LIKE "%'+ req.query.id +'%" ', function (error, results, fields) {
          console.log(results);
          if (error) throw error;
          // return res.send({ data: results, message: 'data' });
          if (results.length > 0) {
            resolve(results);
          }
          else {
            reject('rejected');
          }

        });

      }).then( function (purchaseElements) {
        console.log(purchaseElements);

        async.forEachOf(purchaseElements, function (purchaseElement, i, inner_callback){

          var select_sql = "SELECT products.id AS id, products.product_name AS product_name, products.product_sku AS product_sku FROM products JOIN inv_purchase_details ON products.id = inv_purchase_details.productId WHERE products.id='"+purchaseElement.id+"' AND inv_purchase_details.productId='"+purchaseElement.id+"' ";



          dbConnection.query(select_sql, function(err, results, fields){
            if(!err){
              if (results.length > 0) {
                searchedProducts.push(results);
              }

              inner_callback(null);
            } else {
              console.log("Error while performing Query");
              inner_callback(err);
            };
          });
        }, function(err){
          if(err){
            //handle the error if the query throws an error
            console.log('Error at ASYNC');
            return res.send({ data: [], message: 'data' });
          }else{
            //whatever you wanna do after all the iterations are done
            console.log('Success at ASYNC');
            return res.send({ data: searchedProducts, message: 'data' });
          }
        });

      }).catch(function (reject) {
        console.log('Rejected');
        return res.send({ data: [], message: 'data' });
      })

      // return res.send({ success: 'true', data: req.query.id, message: 'data' });
    }
  });



});

app.get('/api/bill_no', (req, res) => {
  console.log('Vendor Id for Bill_No : ', req.query.vendorId);

  dbConnection.query('SELECT COUNT(id) AS count_id FROM inv_purchase WHERE supplierId = "'+ req.query.vendorId +'" AND status = "1" ', function (error, results, fields) {

    if (error) throw error;
    return res.send({ success: true, data: results, message: 'data' });

  });

  // return res.send({ success: 'true', data: req.query.id, message: 'data' });

});

app.get('/api/purchase_list', (req, res) => {
  console.log('Vendor Id for Bill_No : ', req.query.id);

  dbConnection.query('SELECT * FROM inv_purchase WHERE supplierId = "'+ req.query.id +'" AND status = "1" ', function (error, results, fields) {
    console.log('Purchase Bill List : ', results);
    if (error) throw error;
    return res.send({ success: true, data: results, message: 'data' });

  });

  app.post('/api/saveSalesReturn', verifyToken, (req, res) => {
    console.log('Sales Return Request : ', req.body);

    jwt.verify(req.token, 'secretkey', (err, authData) => {
      if (err) {
        res.sendStatus(403);
      }
      else {
        var purchase_table_id = 0;
        var purchaseListArray = [];

        promise = new Promise (function (resolve, reject) {

          try {
            var insert_sql_query = "INSERT INTO sales_return (salesReturnBillNo, salesBillId, customerId, salesDate, salesReturnDate, totalSalesReturnQuantity, totalSalesReturnAmount, totalSalesPayAmount, salesReturnPayAmount, status) VALUES ('"+req.body.purchaseReturnNo+"', '"+req.body.sales_bill_id+"', '"+req.body.customer_id+"', '"+req.body.sales_date+"', '"+req.body.purchaseReturnDate+"',        '"+req.body.grandTotalQuantity+"', '"+req.body.grandTotalPrice+"', '"+req.body.sales_pay_amount+"', '"+req.body.totalReturnAmount+"', '1')";

            dbConnection.query(insert_sql_query, function (err, result) {
              console.log('user insert result : ', result.insertId);
              console.log('user error result : ', err);
              if (result) {
                console.log("1 record inserted to user");
                // return res.send({success: true, server_message: result});
                resolve(result.insertId);
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

        }).then( function (resolve) {

          purchaseElements = req.body.PurchaseList;

          async.forEachOf(purchaseElements, function (purchaseElement, i, inner_callback){

            var insert_sql_query = "INSERT INTO sales_return_details (salesReturnId, salesReturnDate, productId, salesReturnQuantity, totalAmount, status) VALUES ('"+resolve+"', '"+req.body.purchaseReturnDate+"', '"+purchaseElement.id+"', '"+purchaseElement.productQuantity+"', '"+purchaseElement.totalPrice+"', '1')";

            dbConnection.query(insert_sql_query, function(err, results, fields){
              if(!err){
                console.log("Query Results : ", results);
                inner_callback(null);
              } else {
                console.log("Error while performing Query");
                inner_callback(err);
              };
            });
          }, function(err){
            if(err){
              console.log('ASYNC loop error !');
              return res.send({success: false, error: err});
            }else{
              console.log('Successfully inserted into inv_purchase_details table');
              return res.send({success: true, message: 'Successfully inserted into inv_purchase_details table'});
            }
          });

        }).catch(function (reject) {
          console.log('Promise rejected', reject);
          return res.send({success: false, error: err});
        });

        // return res.send({success: false, message: 'Successfully inserted into inv_purchase_details table'});
      }
    });

  });

  app.post('/api/saveProductPurchaseReturn', verifyToken, (req, res) => {
    console.log('Product Purchase : ', req.body);
    console.log('Product Purchase Return List : ', req.body.PurchaseList);

    jwt.verify(req.token, 'secretkey', (err, authData) => {
      if (err) {
        res.status(403).send({success: false, message: 'jwt expired', status: '403'});
      }
      else {
        var purchase_table_id = 0;
        var purchaseListArray = [];

        promise = new Promise (function (resolve, reject) {

          try {
            var insert_sql_query = "INSERT INTO inv_purchase_return (purchaseReturnBillNo, supplierId, purchaseReturnDate, totalQuantity, totalAmount, status) VALUES ('"+req.body.purchaseReturnNo+"', '"+req.body.vendorIdForPurchase+"', '"+req.body.purchaseReturnDate+"', '"+req.body.grandTotalQuantity+"', '"+req.body.grandTotalPrice+"', '1')";

            dbConnection.query(insert_sql_query, function (err, result) {
              console.log('user insert result : ', result.insertId);
              console.log('user error result : ', err);
              if (result) {
                console.log("1 record inserted to user");

                resolve(result.insertId);
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

        })
        .then( function (resolve) {
          console.log('returned value form previous state : ', resolve);
          console.log('purchase_table_id form previous state : ', purchase_table_id);
          purchaseElements = req.body.PurchaseList;
          console.log('ASYNC LOOP OUTSIDE');
          async.forEachOf(purchaseElements, function (purchaseElement, i, inner_callback){
            console.log('ASYNC LOOP INSIDE', purchaseElement);
            var insert_sql_query = "INSERT INTO inv_purchase_return_details (purchaseReturnId, purchaseReturnBillNo, productId, colorId, sizeId, quantity, price, totalPrice, status) VALUES ('"+resolve+"', '"+req.body.purchaseReturnNo+"', '"+purchaseElement.id+"', '"+purchaseElement.colorValue+"', '"+purchaseElement.sizeValue+"', '"+purchaseElement.productQuantity+"', '"+purchaseElement.productPrice+"', '"+purchaseElement.totalPrice+"', '1')";
            console.log(insert_sql_query);
            dbConnection.query(insert_sql_query, function(err, results, fields){
              if(!err){
                console.log("Query Results : ", results);
                inner_callback(null);
              } else {
                console.log("Error while performing Query");
                inner_callback(err);
              };
            });
          }, function(err){
            if(err){
              console.log('ASYNC loop error !');
              return res.send({success: false, error: err});
            }else{
              console.log('Successfully inserted into inv_purchase_details table');
              return res.send({success: true, message: 'Successfully inserted into inv_purchase_details table'});
            }
          });

        }).catch(function (reject) {
          console.log('Promise rejected', reject);
          return res.send({success: false, error: err});
        });

      }
    });


  });

  // return res.send({ success: 'true', data: req.query.id, message: 'data' });

});

app.post('/api/editProductPurchaseReturn', verifyToken, async function (req, res) {

  console.log('editProductPurchaseReturn route is executing...');

  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if (err) {
      console.log('JWT verification error', err);
      res.sendStatus(403);
    }
    else {
      try {

        console.log('Requested Data : ', req.body);

        var purchase_table_id = 0;
        var purchaseListArray = [];

        // const insert_at_purchase = await query ('INSERT INTO inv_purchase (billNo, chalanNo, supplierId, storedBy, purchaseDate, totalQuantity, totalAmount, status) VALUES ( '+JSON.stringify(req.body.currentBillNo)+', '+JSON.stringify(req.body.chalanNo)+', '+JSON.stringify(req.body.vendorId)+', '+JSON.stringify(req.body.storedBy)+', '+JSON.stringify(req.body.currentDate)+', '+JSON.stringify(req.body.grandTotalQuantity)+', '+JSON.stringify(req.body.grandTotalPrice)+', 1 )');

        const update_at_purchase = await query ('UPDATE inv_purchase_return SET totalQuantity= '+JSON.stringify(req.body.grandTotalQuantity)+', totalAmount = '+JSON.stringify(req.body.grandTotalPrice)+' WHERE softDel = 0 AND status = 1 AND id = '+req.body.purchaseReturnId);

        purchaseElements = req.body.PurchaseList;

        console.log('insert_at_purchase : ', update_at_purchase);

        const update_all_details_to_inactive = await query ('UPDATE inv_purchase_return_details SET status = 0 WHERE purchaseReturnId = '+req.body.purchaseReturnId);

        for (var i = 0; i < purchaseElements.length; i++) {
          const select_from_purchase_details = await query ('SELECT COUNT(id) AS counter FROM inv_purchase_return_details WHERE purchaseReturnId = '+req.body.purchaseReturnId+' AND productId = '+purchaseElements[i].id+' AND colorId = '+purchaseElements[i].colorValue+' AND sizeId = '+purchaseElements[i].sizeValue+' AND quantity = '+purchaseElements[i].productQuantity+' AND price = '+purchaseElements[i].productPrice+' AND totalPrice = '+purchaseElements[i].totalPrice);

          console.log('select_from_purchase_details : ', select_from_purchase_details[0].counter);

          if (select_from_purchase_details[0].counter > 0) {
            const update_all_details_to_active = await query ('UPDATE inv_purchase_return_details SET status = 1 WHERE purchaseReturnId = '+req.body.purchaseReturnId+' AND productId = '+purchaseElements[i].id+' AND colorId = '+purchaseElements[i].colorValue+' AND sizeId = '+purchaseElements[i].sizeValue+' AND quantity = '+purchaseElements[i].productQuantity+' AND price = '+purchaseElements[i].productPrice+' AND totalPrice = '+purchaseElements[i].totalPrice);
          }
          else {
            const insert_at_purchase_details = await query ('INSERT INTO inv_purchase_return_details (purchaseReturnId, purchaseReturnBillNo, productId, colorId, sizeId, quantity, price, totalPrice) VALUES ('+JSON.stringify(req.body.purchaseReturnId)+', '+JSON.stringify(req.body.purchaseReturnNo)+', '+JSON.stringify(purchaseElements[i].id)+', '+JSON.stringify(purchaseElements[i].colorValue)+', '+JSON.stringify(purchaseElements[i].sizeValue)+', '+JSON.stringify(purchaseElements[i].productQuantity)+', '+JSON.stringify(purchaseElements[i].productPrice)+', '+JSON.stringify(purchaseElements[i].totalPrice)+')');
          }

        }

        return res.send({success: true, message: 'Successfully updated the purchase return'});

      } catch (e) {
        console.log('Error : ', e);

        return res.send({success: false, error: e});
      }
    }
  });

});

app.get('/api/purchase_return_no', (req, res) => {

  dbConnection.query('SELECT COUNT(id) AS count_id FROM inv_purchase_return WHERE status = "1" ', function (error, results, fields) {

    if (error) throw error;
    return res.send({ success: true, data: results, message: 'data' });

  });

  // return res.send({ success: 'true', data: req.query.id, message: 'data' });

});

app.get('/api/purchase_return_list', async function (req, res) {
  console.log('User Type : ', req.query.type);

  if (req.query.type == 'vendor') {
    const purchase_return_list = await query ('SELECT * FROM inv_purchase_return WHERE status = 1 AND supplierId = '+req.query.id);

    return res.send({data: purchase_return_list, message: 'data' });
  }
  else {
    const purchase_return_list = await query ('SELECT * FROM inv_purchase_return WHERE status = 1');

    return res.send({data: purchase_return_list, message: 'data' });
  }


});

app.get('/api/sales_return_no', (req, res) => {

  dbConnection.query('SELECT COUNT(id) AS count_id FROM sales_return WHERE status = "1" ', function (error, results, fields) {

    if (error) throw error;
    return res.send({ success: true, data: results, message: 'data' });

  });

  // return res.send({ success: 'true', data: req.query.id, message: 'data' });

});

app.get('/api/search_sales_products_bill_no', (req, res) => {

  dbConnection.query('SELECT * FROM sales WHERE sales_bill_no LIKE "%'+ req.query.id +'%" AND status = "1" ', function (error, results, fields) {

    if (error) throw error;
    return res.send({ success: true, data: results, message: 'data' });

  });

});

app.get('/api/search_sales_products', verifyToken, (req, res) => {

  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      res.sendStatus(403);
    }
    else {
      var searchedProducts = [];

      new Promise (function (resolve, reject) {

        dbConnection.query('SELECT id FROM products WHERE product_name LIKE "%'+ req.query.id +'%" OR product_sku LIKE "%'+ req.query.id +'%" ', function (error, results, fields) {
          console.log(results);
          if (error) throw error;
          // return res.send({ data: results, message: 'data' });
          if (results.length > 0) {
            resolve(results);
          }
          else {
            reject('rejected');
          }

        });

      }).then( function (purchaseElements) {
        console.log(purchaseElements);

        async.forEachOf(purchaseElements, function (purchaseElement, i, inner_callback){

          var select_sql = "SELECT products.id AS id, products.product_name AS product_name, products.product_sku AS product_sku FROM products JOIN sales_details ON products.id = sales_details.productId WHERE products.id='"+purchaseElement.id+"' AND sales_details.productId ='"+purchaseElement.id+"' AND sales_details.salesBillId ='"+req.query.bill_no_id+"' ";

          dbConnection.query(select_sql, function(err, results, fields){
            if(!err){
              if (results.length > 0) {
                searchedProducts.push(results);
              }

              inner_callback(null);
            } else {
              console.log("Error while performing Query");
              inner_callback(err);
            };
          });
        }, function(err){
          if(err){
            //handle the error if the query throws an error
            console.log('Error at ASYNC');
            return res.send({ data: [], message: 'data' });
          }else{
            //whatever you wanna do after all the iterations are done
            console.log('Success at ASYNC');
            return res.send({ data: searchedProducts, message: 'data' });
          }
        });

      }).catch(function (reject) {
        console.log('Rejected');
        return res.send({ data: [], message: 'data' });
      })
    }
  });

});

// app.get('/api/feature_name', (req, res) => {
//   dbConnection.query('SELECT * FROM feature_name', function (error, results, fields) {
//     if (error) throw error;
//     return res.send({ error: error, data: results, message: 'category list.' });
//   });
// });

app.get('/api/feature_products_list', (req, res) => {
  dbConnection.query('SELECT feature_products.id AS id, feature_products.feature_id AS feature_id, feature_products.feature_products AS feature_products, feature_name.name AS name, feature_products.status AS status FROM feature_products JOIN feature_name ON feature_products.feature_id=feature_name.id WHERE feature_products.status=1', function (error, results, fields) {
    console.log(results);
    if (error) throw error;
    return res.send({ error: error, data: results, message: 'category list.' });
  });
});

app.get('/api/search_feature_products', verifyToken, (req, res) => {
  console.log('Vendor Values : ', req.query.vendorId);
  console.log('Searched Text : ', req.query.id);
  console.log('categoryList Values : ', req.query.categoryList);

  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      res.sendStatus(403);
    }
    else {
      dbConnection.query('SELECT * FROM products WHERE vendor_id = "'+ req.query.vendorId +'" AND category_id = "'+req.query.categoryList+'" AND product_name LIKE "%'+ req.query.id +'%" OR product_sku LIKE "%'+ req.query.id +'%" ', function (error, results, fields) {

        if (error) throw error;
        return res.send({ data: results, message: 'data' });

      });
    }
  });

  // return res.send({ success: 'true', data: req.query.id, message: 'data' });

});

// app.post('/api/save_feature_products',(req,res)=>{

//   try {
//     var insert_sql_query = "INSERT INTO feature_products (feature_id, feature_products) VALUES ('"+req.body.featureName+"', '"+JSON.stringify(req.body.PurchaseList)+"')";

//     dbConnection.query(insert_sql_query, function (err, result) {

//       if (result) {
//         console.log("1 record inserted to category");
//         return res.send({success: true, server_message: result});
//       }
//       else {
//         console.log('Error to inseret at category : ', err);
//         return res.send({success: false, server_message: err});
//       }

//     });
//   }
//   catch (error) {
//     if (error) return res.send({error: 'Error has occured at the time of inserting data to CATEGORY table', request : req.body});
//   }

//   console.log(req);
// });

app.post('/api/saveFeatureName', verifyToken, (req,res)=>{

  console.log('Request : ', req.body.featureCode);

  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      res.status(403).send({success: false, message: 'jwt expired', status: '403'});
    }
    else {
      try {
          if (req.body.isUpdateClicked == true) {
              var sql_query = "UPDATE feature_name SET code = '"+req.body.featureCode+"', name = '"+req.body.featureName+"' WHERE softDel = 0 AND id = "+req.body.editID;
          }
          else {
              var sql_query = "INSERT INTO feature_name (code, name) VALUES ('"+req.body.featureCode+"', '"+req.body.featureName+"')";
          }

        dbConnection.query(sql_query, function (err, result) {

          if (result) {
            console.log("1 record inserted to category");
            return res.send({success: true, server_message: result});
          }
          else {
            console.log('Error to inseret at category : ', err);
            return res.send({success: false, server_message: err});
          }

        });
      }
      catch (error) {
        if (error) return res.send({error: 'Error has occured at the time of insert data to CATEGORY table', request : req.body});
      }

      console.log(req);
    }
  });

});

app.get('/api/getFeatureNameInfo', async function (req, res) {
    try {
        const sql_query = await query ('SELECT * FROM feature_name WHERE softDel = 0 AND id = '+ req.query.id);

        return res.send({ success: true, data: sql_query });
    } catch (e) {
        console.log('Error : ', e);

        return res.send({ success: false, data: e });
    } finally {

    }

});

app.get('/api/deleteFeatureName', verifyToken, async function (req, res) {
  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if (err) {
      res.status(403).send({success: false, message: 'jwt expired', status: '403'});
    }
    else {
      try {
        // const delete_from_category = await query ('DELETE FROM category WHERE id = '+req.query.id);

        const delete_from_category = await query ('UPDATE feature_name SET softDel = 1 WHERE id = '+req.query.id);

        return res.send({ success: true, message: 'Dleted successfully' });
      } catch (e) {
        console.log('Error at the time of delete from feature_name table',e);

        return res.send({ success: false, message: 'DB Error' });
      }
    }
  });
});

app.get('/api/feature_name', (req, res) => {
  dbConnection.query('SELECT * FROM feature_name WHERE softDel = 0', function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: error, data: results, message: 'category list.' });
  });
});

app.get('/api/getTermsAndCondition', async function (req, res)  {
    console.log('Get Terms & Condition');
    let selected_terms_and_condition = [];
    let selected_condition_type = [];
  try {
      selected_terms_and_condition = await query('SELECT * FROM terms_conditions WHERE softDel = 0 AND status = 1');
      selected_condition_type = await query ('SELECT * FROM terms_conditions_type WHERE softDel = 0 AND status = 1');
      console.log('selected users : ', selected_terms_and_condition);
      return res.send({ data: [selected_terms_and_condition, selected_condition_type] });
  } catch (e) {
      console.log('Exception : ', e);
      return res.send({ data: [selected_terms_and_condition, selected_condition_type] });
  }
});

app.get('/api/getTermsAndConditionInfoForUpdate', async function (req, res)  {
    console.log('id : '+req.query.id+' type_id : '+req.query.typeId);
    const selected_terms_and_condition = await query('SELECT * FROM terms_conditions WHERE softDel = 0 AND status = 1 AND id = '+req.query.id);
    const selected_condition_type = await query ('SELECT * FROM condition_type WHERE softDel = 0 AND status = 1 AND id = '+req.query.typeId);
    console.log('selected users : ', selected_terms_and_condition);
    return res.send({ data: [selected_terms_and_condition, selected_condition_type] });
});

app.post('/api/saveTermsAndCondition', verifyToken, async function (req, res)  {
  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if (err) {
      res.status(403).send({success: false, message: 'jwt expired', status: '403'});
    }
    else {
      try {
          // console.log(req.body);
          console.log('req.body.condition_type : ', req.body.conditionType);

        var terms_and_conditions = '';
        var new_terms_and_conditions = "'"+req.body.termsCondition+"'";

        const selected_terms_and_condition_count = await query('SELECT COUNT(terms_and_conditions) AS terms_and_conditions FROM terms_conditions WHERE softDel = 0 AND status = 1 AND condition_type_id = '+req.body.conditionType);
        console.log('selected_terms_and_condition_count : ', selected_terms_and_condition_count);
        if (selected_terms_and_condition_count[0].terms_and_conditions > 0) {
          return res.send({ success: false, result: [], data: [] });
        }

        const saved_terms_and_condition = await query("INSERT INTO terms_conditions (terms_and_conditions, condition_type_id, softDel, status) VALUES ("+new_terms_and_conditions+","+req.body.conditionType+", 0, 1)");

        const selected_terms_and_condition = await query('SELECT * FROM terms_conditions WHERE softDel = 0 AND status = 1');
        const selected_condition_type = await query ('SELECT * FROM condition_type WHERE softDel = 0 AND status = 1');

        return res.send({ success: true, result: saved_terms_and_condition, data: [selected_terms_and_condition, selected_condition_type] });
      } catch (e) {
          console.log('Error : ', e);
        return res.send({ success: false, result: [], data: [] });
      }

    }
  });

});

app.post('/api/updateTermsAndCondition', verifyToken, async function (req, res)  {
  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if (err) {
      res.status(403).send({success: false, message: 'jwt expired', status: '403'});
    }
    else {
      try {
          console.log('req.body.termsCondition', req.body.termsCondition);
          console.log('req.body.condition_type : ', req.body.conditionType);

        var terms_and_conditions = '';
        var new_terms_and_conditions = "'"+req.body.termsCondition+"'";

        const saved_terms_and_condition = await query("UPDATE terms_conditions SET terms_and_conditions = "+JSON.stringify(req.body.termsCondition)+" WHERE softDel = 0 AND status = 1 AND id = "+req.body.updateId);

        const selected_terms_and_condition = await query('SELECT * FROM terms_conditions WHERE softDel = 0 AND status = 1');
        const selected_condition_type = await query ('SELECT * FROM condition_type WHERE softDel = 0 AND status = 1');

        return res.send({ success: true, result: saved_terms_and_condition, data: [selected_terms_and_condition, selected_condition_type] });
      } catch (e) {
          console.log('Error : ', e);
        return res.send({ success: false, result: [], data: [] });
      }

    }
  });

});

app.get('/api/deleteProductInfo', verifyToken, async function (req, res)  {

  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if (err) {
      res.status(403).send({success: false, message: 'jwt expired', status: '403'});
    }
    else {
      try {

        const product_tmp_sells_table_check = await query('SELECT COUNT(id) FROM temp_sell  WHERE productId = '+ req.query.id); // temp_sell table has changed and item_ids turned int productId
        const product_purchase_details_table_check = await query('SELECT COUNT(id) FROM inv_purchase_details  WHERE productId = '+ req.query.id);
        const product_purchase_return_details_table_check = await query('SELECT COUNT(id) FROM inv_purchase_return_details  WHERE productId = '+ req.query.id);
        const product_sells_details_table_check = await query('SELECT COUNT(id) FROM sales_details  WHERE productId = '+ req.query.id); // sales_details table has changed and product_id turned int productId
        const product_sells_return_details_table_check = await query('SELECT COUNT(id) FROM sales_return_details  WHERE productId = '+ req.query.id);
        if (product_tmp_sells_table_check > 0 || product_purchase_details_table_check > 0 || product_purchase_return_details_table_check > 0 || product_sells_details_table_check > 0 || product_sells_return_details_table_check > 0) {
          console.log('Product delete working', req.query.id);
          return res.send({ success: false, message: 'Product has aasigned somewhere else !' });
        }
        else {
          const product_specification_details = await query('UPDATE products SET SoftDelete = 1 WHERE id = '+ req.query.id);
          console.log('Product delete working', req.query.id);
          return res.send({ success: true, message: 'Product has successfully deleted !' });
        }

      }
      catch (err) {
        console.log(err);

        return res.send({ success: false, message: 'Something is wrong !' });
      }
    }
  });

  // return res.send({ success: true, message: 'Product has successfully deleted !' });
});

app.get('/api/authorizeProductInfo', verifyToken, async function (req, res)  {

  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if (err) {
      res.status(403).send({success: false, message: 'jwt expired', status: '403'});
    }
    else {
      try {
        console.log('Product id for authorization : ', req.query.id);

        console.log('For authorization : ', req.query.clicked);

        if (req.query.clicked == 'Authorize') {
          updateAuthorization = await query('UPDATE  products SET isApprove = 1 WHERE id = '+req.query.id);

          // need to resize the product image
          const getProductsInfo = await query ('SELECT image FROM products WHERE id = '+req.query.id);

          console.log('Image info : ', getProductsInfo);

          let getImages = JSON.parse(getProductsInfo[0].image);

          console.log('Only Images : ', getImages);

          for (let index = 0; index < getImages.length; index++) {

            let INPUT_path_to_your_images = `${__dirname}/../public/upload/product/productImages/${getImages[index].imageName}`;
            console.log('image path & name : ', `${__dirname}/../public/upload/product/productImages/${getImages[index].imageName}`);

            let OUTPUT_path = `${__dirname}/../public/upload/product/compressedProductImages/`;

            compress_images(INPUT_path_to_your_images, OUTPUT_path, { compress_force: false, statistic: true, autoupdate: true }, false,
              { jpg: { engine: "mozjpeg", command: ["-quality", "60"] } },
              { png: { engine: "pngquant", command: ["--quality=20-50"] } },
              { svg: { engine: "svgo", command: "--multipass" } },
              { gif: { engine: "gifsicle", command: ["--colors", "64", "--use-col=web"] } },
              function (error, completed, statistic) {
                console.log("-------------");
                console.log(error);
                console.log(completed);
                console.log(statistic);
                console.log("-------------");
              }
            );


          }

          var message = 'Product Successfully Authorized';
        }
        else {
          updateAuthorization = await query('UPDATE  products SET isApprove = 2 WHERE id = '+req.query.id);

          var message = 'Product Successfully Unauthorized';
        }

        console.log('Authorization Result product table : ', updateAuthorization);

        return res.send({ success: true, clicked: req.query.clicked, message: message });
      }
      catch(err) {
        console.log(err);

        var message = 'Error Occured !';

        return res.send({ success: false, clicked: req.query.clicked, message: message });
      }

    }
  });

});

app.get('/api/allProducts', (req, res) => {
  dbConnection.query('SELECT * FROM products WHERE softDelete = 0 ORDER BY id DESC', function (error, results, fields) {
    console.log(results);
    if (error) throw error;
    return res.send({ error: error, data: results, message: 'product list.' });
  });
});
app.get('/api/product_list', (req, res) => {
  console.log('Session Values : ', req.query.id);
  try {

    dbConnection.query('SELECT employee_id, user_type FROM user WHERE username="'+ req.query.id +'"', function (error, results, fields) {
      console.log('User Type : ', results[0].user_type);
      if (error) throw error;
      if (results[0].user_type == 'vendor') {
        vendor_products (results[0].employee_id, res);
      }
      else {
        admin_products (res);
      }
    });

  } catch (e) {
    return res.send({ error: e, data: [], message: 'Error at parent product list...' });
  }

});
function vendor_products (vendor_id, res) {
  console.log('Inside the vendor_products function & vendor is : ', vendor_id);

  try {

    dbConnection.query('SELECT * FROM products WHERE softDelete = 0 AND vendor_id = "'+ vendor_id +'" ORDER BY id DESC', function (error, results, fields) {
      console.log(results);
      if (error) throw error;
      return res.send({ error: error, data: results, message: 'sepecification name list.' });
    });

  } catch (e) {
    return res.send({ error: e, data: [], message: 'Error at vendor product list function...' });
  }


}
function admin_products (res) {

  try {

    dbConnection.query('SELECT * FROM products WHERE softDelete = 0 ORDER BY id DESC', function (error, results, fields) {
      console.log(results);
      if (error) throw error;
      // return results;
      return res.send({ error: error, data: results, message: 'sepecification name list.' });
    });

  } catch (e) {
    return res.send({ error: e, data: [], message: 'Error admin product list function...' });
  }

}

app.get('/api/deleteSpecificationDelete', verifyToken, async function (req, res)  {
  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if (err) {
      res.status(403).send({success: false, message: 'jwt expired', status: '403'});
    }
    else {
      const product_specification_details = await query('UPDATE product_specification_details SET SoftDel = 1 WHERE id = '+ req.query.id);
      console.log('Specification Details delete working', req.query.id);
      return res.send({ success: true, message: 'sepecification details successfully deleted !' });
    }
  });

});

app.get('/api/specialCategoryListForSpecification', async function(req, res, next) {
    const parentAndChild = [];
    const parentAndChildRelation = [];
    let relationIndex = 0;
    console.log('special Category List For Specification');
    const category_name = await query('SELECT * FROM category');
    for ( const i in category_name ) {
      if (category_name[i].parent_category_id == 0) {
        parentAndChild[category_name[i].id] = category_name[i].category_name;
      }
      for ( const j in parentAndChild ) {
        if (category_name[i].parent_category_id == j) {
          parentAndChild[category_name[i].id] = parentAndChild[j]+'->'+category_name[i].category_name;
          ++relationIndex;
          parentAndChildRelation[relationIndex] = category_name[i].parent_category_id;
        }
      }
    }
    for ( const i in unique(parentAndChildRelation) ) {
      delete parentAndChild[parentAndChildRelation[i]];
    }
    for ( const i in parentAndChild ) {
      console.log('Consoling Chid Category : ','index : '+i+' value : '+parentAndChild[i]);
    }
    return res.send({ data: parentAndChild, message: 'category list.' });
  });
app.get('/api/product_specification_details', async function (req, res)  {
  console.log('Request Type : ', req.query.type);
  if (req.query.type == 'vendor') {
    const product_specification_details = await query('SELECT * FROM product_specification_details WHERE status = 1 AND softDel = 0 AND entry_by = '+req.query.id+' ORDER BY id DESC LIMIT 5');
    const product_specification_details_count = await query('SELECT COUNT(id) AS specification_details_count FROM product_specification_details WHERE status = 1 AND softDel = 0 AND entry_by = '+req.query.id);
    console.log('Product Specification Count is : ', product_specification_details_count[0].specification_details_count);
    return res.send({ data: product_specification_details, specification_details_count: product_specification_details_count[0].specification_details_count, message: 'sepecification name list.' });
  }
  else {
    const product_specification_details = await query('SELECT * FROM product_specification_details WHERE status=1 AND softDel = 0 ORDER BY id DESC LIMIT 5');
    const product_specification_details_count = await query('SELECT COUNT(id) AS specification_details_count FROM product_specification_details WHERE status=1 AND softDel = 0');
    console.log('Product Specification Count is : ', product_specification_details_count[0].specification_details_count);
    return res.send({ data: product_specification_details, specification_details_count: product_specification_details_count[0].specification_details_count, message: 'sepecification name list.' });
  }

});

app.get('/api/product_specification_details_for_product_entry', async function (req, res)  {

  try {

    const product_specification_details = await query('SELECT * FROM product_specification_details WHERE status=1 AND softDel = 0');
    const product_specification_details_count = await query('SELECT COUNT(id) AS specification_details_count FROM product_specification_details WHERE status=1 AND softDel = 0');
    console.log('Product Specification Count is : ', product_specification_details_count[0].specification_details_count);
    return res.send({ data: product_specification_details, specification_details_count: product_specification_details_count[0].specification_details_count, message: 'sepecification name list.' });

  } catch (e) {
    return res.send({ data: [], specification_details_count: [], error: e, message: 'sepecification name list.' });
  }

});

app.get('/api/vendorAuthorization', verifyToken, async function (req, res)  {

  console.log('Vendor id for authorization : ', req.query.id);

  console.log('Vendor clickeing purpose : ', req.query.clicked);

  jwt.verify(req.token, 'secretkey', async function (err, authData) {
        if (err) {
          res.status(403).send({success: false, message: 'jwt expired', status: '403'});
        }
        else {
      try {

        if (req.query.clicked == 'Authorize') {
          updateAuthorization = await query('UPDATE  vendor_details SET step_completed = 4 WHERE vendor_id = '+req.query.id);

          uodateUserTable = await query('UPDATE  user SET user_status = 4 WHERE employee_id = '+req.query.id);

          var message = 'Vendor Successfully Authorized';

          console.log('Authorization Result vendor_details table : ', updateAuthorization);
        }
        else if (req.query.clicked == 'Unauthorize') {
          updateAuthorization = await query('UPDATE  vendor_details SET step_completed = 3 WHERE vendor_id = '+req.query.id);

          uodateUserTable = await query('UPDATE  user SET user_status = 3 WHERE employee_id = '+req.query.id);

          var message = 'Vendor Successfully Unauthorized';

          console.log('Authorization Result vendor_details table : ', updateAuthorization);
        }
        else if (req.query.clicked == 'deleteclicked') {
          updateVendor = await query('UPDATE  vendor SET softDel = 1, status = 2 WHERE id = '+req.query.id);

          updateVendorDetails = await query('UPDATE  vendor_details SET softDel = 1, status = 0 WHERE vendor_id = '+req.query.id);

          updateUser = await query('UPDATE  user SET softDel = 1, status = 2 WHERE employee_id = '+req.query.id);

          var message = 'Vendor Successfully Deleted';
        }

        // console.log('Authorization Result user table : ', uodateUserTable);

        const vendorList = await query('SELECT vendor.id AS id, vendor.name AS name, vendor.email AS email, vendor.website AS website, vendor.address AS address, vendor.status AS status, vendor_details.step_completed AS step_completed FROM vendor JOIN vendor_details ON vendor.id=vendor_details.vendor_id WHERE vendor.status = 1 AND vendor.softDel = 0 AND vendor_details.status = 1 AND vendor_details.softDel = 0 ORDER BY vendor.id DESC');

        console.log('Vendor info list : ', vendorList);

        return res.send({ success: true, data: vendorList, clicked: req.query.clicked, message: message });

      } catch (e) {
        console.log('Error', e);
        return res.send({ success: false, data: [], clicked: req.query.clicked, message: 'Error at the time of authorization' });
      }
    }
  });

});

app.get('/api/details_specification_paginate', async function (req, res)  {
  console.log('Rows Values : ', req.query.rows);
  console.log('Page Number : ', req.query.page_number);
  console.log('Field Name : ', req.query.field_name);
  var offset_value = ((Number(req.query.rows) * Number(req.query.page_number)) - Number(req.query.rows));
  console.log('Offset Values is : ', offset_value);
  if (req.query.field_name == 'search') {
    console.log('Search Value is : ', req.query.search_value)
    const product_specification_details = await query("SELECT product_specification_details.id AS id, product_specification_details.category_id AS category_id, product_specification_details.specification_details_name, product_specification_details.status FROM product_specification_details JOIN category ON product_specification_details.category_id = category.id WHERE product_specification_details.softDel = 0 AND product_specification_details.status='active' AND category.category_name LIKE '%"+req.query.search_value+"%' ORDER BY product_specification_details.id DESC LIMIT "+req.query.rows+" OFFSET "+offset_value);
    const product_specification_details_count = await query('SELECT COUNT(id) AS specification_details_count FROM product_specification_details WHERE softDel = 0 AND status="active"');
    console.log('Product Specification Count is : ', product_specification_details_count[0].specification_details_count);
    console.log('Product Specification details value : ', product_specification_details);
    console.log('Query : ', "SELECT product_specification_details.id AS id, product_specification_details.category_id AS category_id, product_specification_details.specification_details_name, product_specification_details.status FROM product_specification_details JOIN category ON product_specification_details.category_id = category.id WHERE product_specification_details.softDel = 0 AND product_specification_details.status='active' AND category.category_name='%"+req.query.search_value+"%' ORDER BY product_specification_details.id DESC LIMIT "+req.query.rows+" OFFSET "+offset_value);
    return res.send({ data: product_specification_details, specification_details_count: product_specification_details_count[0].specification_details_count, message: 'sepecification name list.' });
  }
  else {
    const product_specification_details = await query("SELECT * FROM product_specification_details WHERE softDel = 0 AND status='active' ORDER BY id DESC LIMIT "+req.query.rows+" OFFSET "+offset_value);
    const product_specification_details_count = await query('SELECT COUNT(id) AS specification_details_count FROM product_specification_details WHERE softDel = 0 AND status="active"');
    console.log('Product Specification Count is : ', product_specification_details_count[0].specification_details_count);
    console.log('Product Specification details value : ', product_specification_details);
    return res.send({ data: product_specification_details, specification_details_count: product_specification_details_count[0].specification_details_count, message: 'sepecification name list.' });
  }
});
app.get('/api/get_individual_specification_details', async function (req, res)  {
  const product_specification_details = await query('SELECT * FROM product_specification_details WHERE SoftDel = 0 AND status="active" AND id ='+req.query.id);
  return res.send({ data: product_specification_details, message: 'sepecification name list.' });
});

app.post('/api/updateSpecificationDetails', verifyToken, async function (req, res)  {
  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if (err) {
      res.status(403).send({success: false, message: 'jwt expired', status: '403'});
    }
    else {
      const product_specification_detail = await query("UPDATE product_specification_details SET specification_details_name = '"+JSON.stringify(req.body.ProductSpecificationValuesArray)+"' WHERE id= '"+req.body.getUpdateID+"'");
      const product_specification_details = await query('SELECT * FROM product_specification_details WHERE status="active" AND softDel = 0 ORDER BY id DESC LIMIT 5');
      const product_specification_details_count = await query('SELECT COUNT(id) AS specification_details_count FROM product_specification_details WHERE status="active"');
      console.log('Product Specification Count is : ', product_specification_details_count[0].specification_details_count);
      console.log('api updateSpecificationDetails working !', JSON.stringify(req.body.ProductSpecificationValuesArray));
      console.log('api updateSpecificationDetails working !', req.body.deleteOrUpdateId);
      return res.send({ success: true, result: product_specification_detail, data: product_specification_details, specification_details_count: product_specification_details_count[0].specification_details_count, message: 'sepecification details updated.' });
    }
  });

});

app.get('/api/delete_feature_products', verifyToken, async function (req, res)  {
  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if (err) {
      res.status(403).send({success: false, message: 'jwt expired', status: '403'});
    }
    else {
      try {
        const delete_feature_products = await query('DELETE FROM feature_products WHERE id='+req.query.id);
        console.log(delete_feature_products);
        console.log(req.query.id);
        return res.send({ success: true, message: delete_feature_products });
      } catch (e) {
        console.log('Error : ', e);
        return res.send({ success: false, message: 'Failed' });
      }

    }
  });

});

app.get('/api/get_feature_products_for_update', (req, res) => {
  dbConnection.query("SELECT * FROM feature_products WHERE id = '"+req.query.id+"'", function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: error, data: results, message: 'category list.' });
  });
});

app.post('/api/update_feature_products', verifyToken, async function (req, res)  {

  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if (err) {
      res.status(403).send({success: false, message: 'jwt expired', status: '403'});
    }
    else {
      try {
        var jsonData = "'"+JSON.stringify(req.body.PurchaseList)+"'";
        console.log(jsonData);
        const product_specification_details = await query('UPDATE feature_products SET feature_products='+jsonData+' WHERE id='+req.body.updateFeatureProducts);
        return res.send({ success: true, message: 'success' });
      } catch (e) {
        return res.send({ success: false, message: 'failed' });
      }

    }
  });

});


app.post('/api/save_feature_products', verifyToken, async function (req,res) {

  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if (err) {
      res.status(403).send({success: false, message: 'jwt expired', status: '403'});
    }
    else {
      try {
        const feature_products_is_exist = await query('SELECT COUNT(id) AS id_count FROM feature_products where feature_id = '+req.body.featureName+' AND status = 1');
        console.log('Feature Products is exist : ', feature_products_is_exist);
        if (feature_products_is_exist[0].id_count > 0) {
          const get_existing_feature_products = await query('SELECT feature_products FROM feature_products where feature_id = '+req.body.featureName+' AND status = 1');
          var newArrayForFeatureProducts = [];
          var parsedFeatureProducts = JSON.parse(get_existing_feature_products[0].feature_products);
          for (var i = 0; i < parsedFeatureProducts.length; i++) {
            newArrayForFeatureProducts.push(parsedFeatureProducts[i]);
          }
          for (var i = 0; i < req.body.PurchaseList.length; i++) {
            newArrayForFeatureProducts.push(req.body.PurchaseList[i]);
            console.log(newArrayForFeatureProducts);
          }
          var put_json_feature_product = "'"+JSON.stringify(newArrayForFeatureProducts)+"'";
          const update_feature_products = await query('UPDATE feature_products SET feature_products='+put_json_feature_product+' WHERE feature_id='+req.body.featureName);
          return res.send({success: true, server_message: update_feature_products});
        }
        else {
          var newArrayForFeatureProducts = [];
          for (var i = 0; i < req.body.PurchaseList.length; i++) {
            newArrayForFeatureProducts.push(req.body.PurchaseList[i]);
            console.log(newArrayForFeatureProducts);
          }
          var put_json_feature_product = "'"+JSON.stringify(newArrayForFeatureProducts)+"'";
          const insert_feature_products = await query('INSERT INTO feature_products (feature_id, feature_products) VALUES ('+req.body.featureName+', '+put_json_feature_product+')');
          return res.send({success: true, server_message: insert_feature_products});
        }
      } catch (e) {
        return res.send({success: false, server_message: 'false'});
      }

    }
  });

  // var insert_feature_products = '';
  // return res.send({success: true, server_message: insert_feature_products});
});


app.post('/api/saveSpecificationDetails', verifyToken, (req,res)=>{
  console.log('User Id : ', req.body.userId);
  console.log('Request Body : ', req.body);

  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      res.status(403).send({success: false, message: 'jwt expired', status: '403'});
    }
    else {
      values = req.body.specification_details_name;
      // var valuesArray = values.split(" ");
      console.log('The Request : ', req.body.ProductSpecificationValuesArray);
      // return res.send({success: true});
      try {
        var insert_sql_query = "INSERT INTO product_specification_details (category_id, specification_details_name, entry_by, status) VALUES ('"+req.body.categoryId+"', '"+JSON.stringify(req.body.ProductSpecificationValuesArray)+"', '"+req.body.userId+"', '1' )";
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
    }
  });

});

// get sales data....
app.get('/api/sales_info', async function (req,res){

    try {
        const get_salaes_info = await query ('SELECT * FROM sales WHERE softDel = 0 AND status = 1');

        console.log('Sales table data : ', get_salaes_info);

        return res.send({success: true, sales: get_salaes_info});

    } catch (e) {
        console.log('Error : ', e);

        return res.send({success: false, message: 'Something went wrong!', error: e});
    }
});

app.get('/api/vendor_sales_info', async function (req,res){

    try {
        const get_salaes_info = await query ('SELECT sales.id AS id, sales.sales_bill_no AS sales_bill_no, sales.sales_type, sales.sales_date AS sales_date, sales_details.sales_product_quantity AS total_sales_quantity, sales_details.total_amount AS total_sales_amount, sales_details.discounts_amount AS discount_amount, sales.isConfirmed AS isConfirmed, sales.isEMI AS isEMI FROM sales JOIN sales_details ON sales.id = sales_details.salesBillId JOIN products ON sales_details.productId = products.id WHERE sales.softDel = 0 AND sales.status = 1 AND sales.isConfirmed = 2 AND products.vendor_id = '+req.query.id+' AND entry_user_type = "vendor"');

        console.log('get_salaes_info : ', get_salaes_info);

        const get_salaes_productid = await query ('SELECT productId FROM sales_details WHERE status = 1');

        // const get_salaes_info = await query ('SELECT * FROM sales WHERE softDel = 0 AND status = 1');
        //
        // console.log('Sales table data : ', get_salaes_info);

        return res.send({success: true, sales: get_salaes_info});

    } catch (e) {
        console.log('Error : ', e);

        return res.send({success: false, message: 'Something went wrong!', error: e});
    }
});

app.get('/api/sales_details_info', async function (req,res){
    try {
        console.log('Sales Id : ', req.query.id);

        var product_info = [];

        var get_salaes_details_info = ''

        const get_salaes_info = await query ('SELECT * FROM sales WHERE softDel = 0 AND status = 1 AND id = '+ req.query.id);

        const get_customer_info = await query ('SELECT * FROM customer WHERE status = 1 AND id = '+get_salaes_info[0].customer_id);

        console.log('req.query.userId : ', req.query.userId);

        if (req.query.userId == 0) {
            get_salaes_details_info = await query ('SELECT * FROM sales_details WHERE status = 1 AND salesBillId = '+ req.query.id);
        }
        else {
            console.log('for vendor ...');
            // WE NEED TO JOIN PRODUCT TABLE TO GET VENDOR WISE INFO
            get_salaes_details_info = await query ('SELECT sales_details.id AS id, sales_details.productId AS productId, sales_details.colorId AS colorId, sales_details.sizeId AS sizeId, sales_details.salesBillId AS salesBillId, sales_details.sales_product_quantity AS sales_product_quantity, sales_details.unitPrice AS unitPrice, sales_details.total_amount AS total_amount, sales_details.customer_payable_amount AS customer_payable_amount, sales_details.deliveryCharge AS deliveryCharge, sales_details.chalan_no AS chalan_no, sales_details.discounts_amount AS discounts_amount, sales_details.isAcceptedByVendor AS isAcceptedByVendor, sales_details.delivery_status AS delivery_status FROM sales_details JOIN products ON sales_details.productId = products.id WHERE sales_details.status = 1 AND sales_details.salesBillId = '+ req.query.id+' AND products.vendor_id = '+req.query.userId);
        }

        console.log('Slaes Details table info : ', get_salaes_details_info);

        for (var i = 0; i < get_salaes_details_info.length; i++) {
            var product_obj = {};

            const get_product_info = await query ('SELECT product_name, brand_name, vendor_id, entry_user_type FROM products WHERE softDelete = 0 AND status = 1 AND id = '+ get_salaes_details_info[i].productId);
            console.log('Product Info : ', get_product_info);

            const get_color_info = await query ('SELECT name FROM color_infos WHERE id = '+ get_salaes_details_info[i].colorId);
            const get_size_info = await query ('SELECT size FROM size_infos WHERE id = '+ get_salaes_details_info[i].sizeId);

            console.log(get_color_info);
            console.log(get_size_info);

            const customer_info = await query ('SELECT name, email, address FROM customer WHERE status = 1 AND id = '+get_salaes_info[0].customer_id)

            product_obj.product_name = get_product_info[0].product_name;
            product_obj.brand = get_product_info[0].brand_name;
            product_obj.user_type = get_product_info[0].entry_user_type;
            product_obj.vendor_id = get_product_info[0].vendor_id;
            product_obj.color = get_color_info.length > 0 ? get_color_info[0].name : '';
            product_obj.size = get_size_info.length > 0 ? get_size_info[0].size : '';
            product_obj.salesId = get_salaes_details_info[i].salesBillId;
            product_obj.salesDetailsId = get_salaes_details_info[i].id;
            product_obj.sales_product_quantity = get_salaes_details_info[i].sales_product_quantity;
            product_obj.unitPrice = get_salaes_details_info[i].unitPrice;
            product_obj.total_amount = get_salaes_details_info[i].total_amount;
            product_obj.customer_payable_amount = get_salaes_details_info[i].customer_payable_amount;
            product_obj.deliveryCharge = get_salaes_details_info[i].deliveryCharge;
            product_obj.chalan_no = get_salaes_details_info[i].chalan_no;
            product_obj.discounts_amount = get_salaes_details_info[i].discounts_amount;
            product_obj.is_accepted = get_salaes_details_info[i].isAcceptedByVendor;
            product_obj.delivery_status = get_salaes_details_info[i].delivery_status;
            product_obj.sales_type = get_salaes_info[0].sales_type;
            product_obj.isEMI = get_salaes_info[0].isEMI;
            product_obj.customer_name = get_salaes_info[0].name;
            product_obj.customer_email = get_salaes_info[0].email;
            product_obj.customer_address = get_salaes_info[0].address;
            product_obj.sales_date = get_salaes_info[0].sales_date;

            product_info.push(product_obj);
        }

        return res.send({success: true, sales_details: get_salaes_details_info, product_info: product_info, sales_info: get_salaes_info[0], customer_info: get_customer_info[0]});
    } catch (e) {
        console.log('Error : ', e);

        return res.send({success: false, message: 'Something went wrong!', error: e});
    }
});

app.post('/api/confirm_sale', async function (req,res){
    try {
        const confirm_sale = await query ('UPDATE sales SET isConfirmed = 2 WHERE id = '+req.body.editID);

        const get_sales_bill_no = await query ('SELECT sales_bill_no FROM sales WHERE softDel = 0 AND status = 1 AND isConfirmed = 2 AND id = '+req.body.editID);

        const get_vendors_unique_id = await query ('SELECT DISTINCT products.vendor_id AS vendor_id FROM sales_details JOIN products ON sales_details.productId = products.id WHERE sales_details.salesBillId = '+req.body.editID);

        console.log('get_vendors_unique_id : ', get_vendors_unique_id);

        for (var i = 0; i < get_vendors_unique_id.length; i++) {

            const get_email = await query ('SELECT email FROM user WHERE employee_id = '+get_vendors_unique_id[i].vendor_id);

            if (get_email.length > 0) {

                try {
                    const cipher = crypto.createCipher('aes192', 'a password');
                    var encrypted = cipher.update(get_email[0].email, 'utf8', 'hex');
                    encrypted += cipher.final('hex');

                    // var url = `http://localhost:3005/resetpassword/${encrypted}`

                    var mailOption = {
                        from : 'info@banijjo.com.bd',
                        to : get_email[0].email,
                        subject : 'Sales',
                        // text : 'Another sale! Please login to admin panel to check the activity.',
                        html: `<strong>Another sale!</strong> Please login to admin panel to check the activity. Current Sales Bill No is : <strong>"${get_sales_bill_no[0].sales_bill_no}"</strong>`
                    }

                    mailBox.sendMail(mailOption, function (error, info) {
                        if (error) {
                            console.log(error);
                        }
                        else {
                            console.log('Email sent : ', info,process);
                        }
                    });
                } catch (e) {
                    console.log('Error at the time sending email : ', e);
                }
            }

        }

        return res.send({success: true});
    } catch (e) {
        console.log('Error : ', e);

        return res.send({success: false, message: 'Something went wrong!', error: e});
    }
});

app.post('/api/accept_sale', async function (req,res){
    try {
        const confirm_sale = await query ('UPDATE sales_details JOIN products ON sales_details.productId = products.id SET sales_details.isAcceptedByVendor = 2 WHERE sales_details.salesBillId = '+req.body.editID+' AND products.vendor_id = '+req.body.employee_id);

        return res.send({success: true});
    } catch (e) {
        console.log('Error : ', e);

        return res.send({success: false, message: 'Something went wrong!', error: e});
    }
});

app.post('/api/accept_sale_by_admin', async function (req,res){
  try {
      const confirm_sale = await query ('UPDATE sales_details JOIN products ON sales_details.productId = products.id SET sales_details.isAcceptedByVendor = 2 WHERE sales_details.salesBillId = '+req.query.editID+' AND products.vendor_id = '+req.query.vendor_id);

      return res.send({success: true});
  } catch (e) {
      console.log('Error : ', e);

      return res.send({success: false, message: 'Something went wrong!', error: e});
  }
});

app.post('/api/processing_sale', async function (req,res){
  try {
      const confirm_sale = await query ('UPDATE sales_details JOIN products ON sales_details.productId = products.id SET sales_details.delivery_status = 2 WHERE sales_details.salesBillId = '+req.query.editID+' AND products.vendor_id = '+req.query.vendor_id);

      return res.send({success: true});
  } catch (e) {
      console.log('Error : ', e);

      return res.send({success: false, message: 'Something went wrong!', error: e});
  }
});

app.post('/api/ready_to_deliver_sale', async function (req,res){
  try {
      const confirm_sale = await query ('UPDATE sales_details JOIN products ON sales_details.productId = products.id SET sales_details.delivery_status = 3 WHERE sales_details.salesBillId = '+req.query.editID+' AND products.vendor_id = '+req.query.vendor_id);

      return res.send({success: true});
  } catch (e) {
      console.log('Error : ', e);

      return res.send({success: false, message: 'Something went wrong!', error: e});
  }
});

app.post('/api/delivered_sale', async function (req,res){
  try {
      const confirm_sale = await query ('UPDATE sales_details JOIN products ON sales_details.productId = products.id SET sales_details.delivery_status = 5 WHERE sales_details.salesBillId = '+req.query.editID+' AND products.vendor_id = '+req.query.vendor_id);

      return res.send({success: true});
  } catch (e) {
      console.log('Error : ', e);

      return res.send({success: false, message: 'Something went wrong!', error: e});
  }
});

app.post('/api/returned_sale', async function (req,res){
  try {
      const confirm_sale = await query ('UPDATE sales_details JOIN products ON sales_details.productId = products.id SET sales_details.delivery_status = 6 WHERE sales_details.salesBillId = '+req.query.editID+' AND products.vendor_id = '+req.query.vendor_id);

      return res.send({success: true});
  } catch (e) {
      console.log('Error : ', e);

      return res.send({success: false, message: 'Something went wrong!', error: e});
  }
});

app.post('/api/on_going_sale', async function (req,res){
  try {
      const confirm_sale = await query ('UPDATE sales_details JOIN products ON sales_details.productId = products.id SET sales_details.delivery_status = 4 WHERE sales_details.salesBillId = '+req.query.editID+' AND products.vendor_id = '+req.query.vendor_id);

      return res.send({success: true});
  } catch (e) {
      console.log('Error : ', e);

      return res.send({success: false, message: 'Something went wrong!', error: e});
  }
});

// GET NOTIFICATIONS...
app.get('/api/notifications', async function (req,res){
    try {
        var total_notification = 0;
        var vendor_notification = 0;

        const count_salaes_info = await query ('SELECT COUNT(id) AS id_count FROM sales WHERE isConfirmed = 1 AND softDel = 0 AND status = 1');
        const count_product_info = await query ('SELECT COUNT(id) AS id_count FROM products WHERE isApprove = 2 AND softDelete = 0 AND status = 1');
        const count_vendor_info = await query ('SELECT COUNT(id) AS id_count FROM vendor_details WHERE step_completed = 3 AND softDel = 0 AND status = 1');

        if (req.query.id != 0) {
            const vendor_notification_info = await query ('SELECT COUNT(sales.id) AS id_count FROM sales JOIN sales_details ON sales.id = sales_details.salesBillId JOIN products ON sales_details.productId = products.id WHERE sales.softDel = 0 AND sales.status = 1 AND sales.isConfirmed = 2 AND sales_details.isAcceptedByVendor = 1 AND products.vendor_id = '+req.query.id);

            vendor_notification = vendor_notification_info[0].id_count;
        }

        total_notification += (count_salaes_info[0].id_count + count_product_info[0].id_count + count_vendor_info[0].id_count);

        return res.send({success: true, total_notification: total_notification, count_salaes: count_salaes_info[0].id_count, count_product: count_product_info[0].id_count, count_vendor: count_vendor_info[0].id_count, vendor_notification: vendor_notification})
    } catch (e) {
        console.log('Error : ', e);

        return res.send({success: false, message: 'Something went wrong!', error: e});
    }

});

// get Dashboard Data....

app.get('/api/dashboard_data', async function (req,res){

  console.log('dashboard request : ', req.query.id);

  try {

    var data = [];

    let sells_data = 0;
    let total_stock = 0;

    // check user type...
    const user_type = await query('SELECT user_type FROM user WHERE status = 1 AND softDel = 0 AND employee_id = '+ req.query.id);

    // purchase data...
    // const purchase_data = await query ('SELECT SUM(totalAmount) AS totalAmount FROM inv_purchase WHERE softDel = 0 AND status = 1');

    let purchase_data = [];

    if (user_type[0].user_type == 'admin' || user_type[0].user_type == 'admin_manager' || user_type[0].user_type == 'super_admin') {
      purchase_data = await query('SELECT SUM(totalAmount) AS totalAmount FROM inv_purchase  WHERE status = 1 AND storedBy = 0');

      purchased_product = await query ('SELECT DISTINCT inv_purchase_details.productId AS productId FROM inv_purchase JOIN inv_purchase_details ON inv_purchase.id = inv_purchase_details.purchaseId WHERE inv_purchase.softDel = 0 AND inv_purchase.status = 1 AND inv_purchase.storedBy = 0');
    }
    else {
      purchase_data = await query('SELECT SUM(totalAmount) AS totalAmount FROM inv_purchase  WHERE status = 1 AND softDel = 0 AND storedBy = '+ req.query.id);

      purchased_product = await query ('SELECT DISTINCT inv_purchase_details.productId AS productId FROM inv_purchase JOIN inv_purchase_details ON inv_purchase.id = inv_purchase_details.purchaseId WHERE inv_purchase.softDel = 0 AND inv_purchase.status = 1 AND inv_purchase.storedBy = '+ req.query.id);
    }

    if (purchase_data[0].totalAmount === null) {
      data.push(0);
    }
    else {
      data.push(purchase_data[0].totalAmount);
    }

    console.log('Purchased PRoducts : ', purchased_product);
    
    for (let index = 0; index < purchased_product.length; index++) {
      // get sells data...
      const sells_data_query = await query ('SELECT SUM(total_amount) AS netAmount FROM sales_details WHERE productId = '+purchased_product[index].productId+' AND status = 1');
      
      if (sells_data_query[0].netAmount === null) {
        sells_data += 0;
      }
      else {
        sells_data += sells_data_query[0].netAmount;
      }

      console.log('sells : ', sells_data);

      // get stock data...
      const total_stock_query = await query ('SELECT SUM(quantity) AS quantity FROM stock WHERE productId = '+purchased_product[index].productId+' AND softDel = 0 AND status = 1');

      if (total_stock_query[0].quantity === null) {
        total_stock += 0;
      }
      else {
        total_stock += total_stock_query[0].quantity
      }

      console.log('stock : ', total_stock);
    }
    data.push(sells_data);
    data.push(total_stock);
    // sells_data = await query ('SELECT SUM(netAmount) AS netAmount FROM sales WHERE softDel = 0 AND status = 1');

    const delivery_charge = await query ('SELECT SUM(delivery_charge) AS delivery_charge FROM delivery WHERE softDel = 0 AND status = 1');

    // if (sells_data[0].netAmount === null) {
    //   data.push(0);
    // }
    // else if (delivery_charge[0].delivery_charge === null) {
    //   data.push(sells_data[0].netAmount);
    // }
    // else {
    //   data.push(sells_data[0].netAmount - delivery_charge[0].delivery_charge);
    // }
    
    // get due data...
    const vendor_payment = await query ('SELECT SUM(amount) AS amount FROM vendor_payment WHERE softDel = 0 AND status = 1');

    data.push(0);

    console.log('Data : ', data);

    return res.send({success: true, data: data, message: 'Data successfully executed!'});

  } catch (e) {
    console.log('Error : ', e);

    return res.send({success: false, error: e, message: 'Got an error at the time of getting data for dashboard_purchase'})
  }

});


// VERIFY TOKEN
function verifyToken (req, res, next) {
  // console.log('Req : ', req.headers);

  // GET AUTH VALUE
  const secretJwtHeader = req.headers['authorization'];
  console.log('Header Value : ', secretJwtHeader);
  console.log('Header Value Type : ', typeof secretJwtHeader);
  console.log('Header Validation Check : ', (typeof secretJwtHeader !== undefined));
  // CHECK secretJwt IS NOT UNDEFINED
  if (typeof secretJwtHeader !== undefined) {
    // SPLIT AT THE SPACE
    const secretJwt = secretJwtHeader.split(' ');

    // GET TOKEN FROM THE ARRAY
    const secretJwtToekn = secretJwt[1];

    // SET THE TOKEN
    req.token = secretJwtToekn;
    // console.log('Toekn is : ', req.token);

    // NEXT MIDDLEWARE
    next();
  }
  else {
    console.log('Error....');
    res.sendStatus(403);
  }
}

app.get('/', async function (req,res){
    console.log('Https request');
    res.send('You find me!');
});

// var apps = https.createServer(credentials, app);

app.listen(3002, () =>
    console.log('Express server is running on localhost:3002')
);
