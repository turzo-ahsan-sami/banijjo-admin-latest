const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
var session = require("express-session");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const fileUpload = require("express-fileupload");
var path = require("path");
var unique = require("array-unique");
const app = express();
const util = require("util");
var cookieParser = require("cookie-parser");
var async = require("async");
var cors = require("cors");
const pad = require("pad");
const nodemailer = require("nodemailer");
var isNullOrEmpty = require("is-null-or-empty");
const https = require("https");
const crypto = require("crypto");
const compress_images = require("compress-images");

const routes = require("express").Router();

const dbConnection = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "",
  database: "microfin_ecommerce_3",
  dateStrings: true,
});

dbConnection.getConnection((err) => {
  if (err) {
    throw err;
  }
  console.log("Connected to database...");
});

const query = util.promisify(dbConnection.query).bind(dbConnection);

routes.get("/", (req, res) => {
  res.status(200).json({ message: "api call success 1 !!" });
});

routes.get("/check", (req, res) => {
  res.status(200).json({ message: "api call success - check 1 !!" });
});

/*
 * E-COURIER API | Turzo Ahsan Sami | 20 August 2020
 */

routes.get("/getSaleProductCustomerDetails/:sales_id", async (req, res) => {
  const { sales_id } = req.params;
  try {
    const sales_product_customer_details = await query(`
        SELECT 
        pd.id, pd.product_specification_name, 
        sd.salesBillId, sd.customerId, sd.total_amount, sd.customer_payable_amount, sd.sales_product_quantity, sd.courier_order_code, 
        cust.name, cust.email, cust.phone_number, cust.address, cust.city, cust.thana, cust.area, cust.zipcode
        FROM products as pd
        INNER JOIN sales_details as sd 
        ON pd.id = sd.productId
        INNER JOIN customers_address as cust
        ON cust.id = sd.customerId
        where sd.salesBillId=${sales_id} and sd.status=1;
      `);
    res.json(sales_product_customer_details);
  } catch (e) {
    console.error(e.message);
    res.send("Server Error");
  }
});

routes.get( "/updateSalesDetailsForCourier/:sales_id/:order_id/:courier_partner",
  async (req, res) => {
    const { sales_id, order_id, courier_partner } = req.params;
    console.log("sales_id...", sales_id);
    console.log("order_id...", order_id);
    console.log("courier_partner...", courier_partner);
    try {
      updateSalesDetailsForCourier = await query(`
        UPDATE sales_details 
        SET courier_partner = '${courier_partner}', courier_order_code = '${order_id}'
        WHERE salesBillId = ${sales_id}
      `);
      console.log(updateSalesDetailsForCourier);
      return res.send({ success: true, message: "success" });
    } catch (e) {
      console.error(e.message);
      res.send("Server Error");
    }
  }
);

routes.post("/save_selected_category_order", verifyToken, async function (req, res, next) {
    jwt.verify(req.token, "secretkey", async function (err, authData) {
      if (err) {
        res
          .status(403)
          .send({ success: false, message: "jwt expired", status: "403" });
      } else {
        try {
          console.log("selected category submitted value : ", req.body);
          const category_order_select = await query(
            "SELECT COUNT(id) AS total_category_order_size FROM category_order where status = 1"
          );
          if (category_order_select[0].total_category_order_size > 0) {
            const category_order_delete = await query(
              "DELETE FROM category_order"
            );
          } else {
            console.log(
              "Not Working ! ",
              category_order_select[0].total_category_order_size
            );
          }

          for (const i in req.body.PurchaseList) {
            console.log(req.body.PurchaseList[i].categoryName);

            const category_order_insert = await query(
              "INSERT INTO category_order (category_id, category_name, effectiveDate, status) VALUES ('" +
                req.body.PurchaseList[i].categoryId +
                "', '" +
                req.body.PurchaseList[i].categoryName +
                "', '" +
                req.body.effectiveDate +
                "', '1')"
            );

            let slug = JSON.stringify(slugify(req.body.PurchaseList[i].categoryName, category_order_insert.insertId));
            const update_sql_query = await query(
              "update category_order set slug = '" + slug +"' WHERE id = '" +category_order_insert.insertId +"'"
            );
          }

          return res.send({ success: true, message: "success" });
        } catch (e) {
          console.log("Error : ", e);

          return res.send({ success: false, message: "failed" });
        }
      }
    });
  }
);

routes.post('/save_selected_nav_category_order', verifyToken, async function(req, res, next) {
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
          const category_order_insert = await query("INSERT INTO category_top_navbar (category_id, category_name, effectiveDate, status) VALUES ('"+req.body.PurchaseList[i].categoryId+"', '"+req.body.PurchaseList[i].categoryName+"', '"+req.body.effectiveDate+"', '1')");

          let slug = JSON.stringify(slugify(req.body.PurchaseList[i].categoryName, category_order_insert.insertId));
          const update_sql_query = await query ("update category_top_navbar set slug = '"+slug+"' WHERE id = '"+category_order_insert.insertId+"'");
        }

        

        return res.send({ success: true, message: 'success' });
      } catch (e) {
        console.log('Error : ', e);
        return res.send({ success: false, message: 'Failed' });
      }

    }
  });

});

routes.post('/updateProduct', verifyToken, (req, res) => {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if (err) {
      return res.send({success: false, message: 'jwt expired', status: '403'});
    }
    else {
      try {
        if(req.files!=null){

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
              let slug = JSON.stringify(slugify(req.body.productName, updateId));
              var update_sql_query_for_product = "update products set slug = '"+slug+"' WHERE id = '"+updateId+"'";

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
              let slug = JSON.stringify(slugify(req.body.productName, updateId));
              var update_sql_query_for_product = "update products set slug = '"+slug+"' WHERE id = '"+updateId+"'";

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
              let slug = JSON.stringify(slugify(req.body.productName, updateId));
              var update_sql_query_for_product = "update products set slug = '"+slug+"' WHERE id = '"+updateId+"'";

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


routes.post('/vendor-details-shop', verifyToken, async function (req, res) {

  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if (err) {
      res.status(403).send({success: false, message: 'jwt expired', status: '403'});
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
            let slug = JSON.stringify(slugify(req.body.shopName, req.body.vendorId));
            var update_sql_query = 'update vendor_details set slug = ' + slug +'WHERE vendor_id = '+JSON.parse(req.body.vendorId);

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


routes.post('/saveProduct', verifyToken, (req, res) => {
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
            
            let slug = JSON.stringify(slugify(req.body.productName, insertId));
            var update_sql_query_for_product = "update products set slug = '"+slug+"' WHERE id = '"+insertId+"'";

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


routes.post("/saveCategory", verifyToken, (req, res) => {
  jwt.verify(req.token, "secretkey", (err, authData) => {
    if (err) {
      res
        .status(403)
        .send({ success: false, message: "jwt expired", status: "403" });
    } else {
      try {
        var insertId = "";
        var flag = false;
        var categoryNameForSlug = req.body.categoryName;

        if (req.body.isUpdateClicked == true) {
          var sql_query =
            "UPDATE category SET category_name = '" +
            req.body.categoryName +
            "', description = '" +
            req.body.categoryDescription +
            "', parent_category_id = '" +
            req.body.parentCategory +
            "', status = '" +
            req.body.isActive +
            "' WHERE id = '" +
            req.body.categoryID +
            "'";
        } else {
          var sql_query =
            "INSERT INTO category (category_name, description, parent_category_id, status) VALUES ('" +
            req.body.categoryName +
            "', '" +
            req.body.categoryDescription +
            "', '" +
            req.body.parentCategory +
            "', '" +
            req.body.isActive +
            "')";
        }

        dbConnection.query(sql_query, function (err, result) {
          if (result) {
            console.log("1 operation performed !");
            insertId = result.insertId;
            flag = true;
          } else {
            console.log("Error to inseret at category : ", err);
            return res.send({ success: false, server_message: err });
          }
        });

        if (req.body.isUpdateClicked == true) {
          insertId = req.body.categoryID;
        }

        setTimeout(() => {
          if (flag == true) {
            let slug = JSON.stringify(slugify(categoryNameForSlug, insertId));
            update_sql_query =
              "update category set slug = '" +
              slug +
              "' WHERE id = '" +
              insertId +
              "'";

            dbConnection.query(update_sql_query, function (err, result) {
              if (result) {
                return res.send({
                  success: true,
                  server_message: result,
                  message: "success",
                });
              } else {
                console.log(
                  "Error a the time of category update for slug : ",
                  err
                );

                return res.send({
                  success: false,
                  error:
                    "Error has occured at the time of insert data to CATEGORY table",
                  message: "DB Error",
                });
              }
            });
          } else {
            return res.send({
              success: false,
              error:
                "Error has occured at the time of insert data to CATEGORY table",
              message: "DB Error",
            });
          }
        }, 700);
      } catch (error) {
        if (error)
          return res.send({
            success: false,
            error:
              "Error has occured at the time of insert data to CATEGORY table",
            request: req.body,
          });
      }
    }
  });

  console.log(req);
});

// VERIFY TOKEN
function verifyToken(req, res, next) {
  const secretJwtHeader = req.headers["authorization"]; // GET AUTH VALUE
  // CHECK secretJwt IS NOT UNDEFINED
  if (typeof secretJwtHeader !== undefined) {
    const secretJwt = secretJwtHeader.split(" "); // SPLIT AT THE SPACE
    const secretJwtToekn = secretJwt[1]; // GET TOKEN FROM THE ARRAY
    req.token = secretJwtToekn; // SET THE TOKEN
    next(); // NEXT MIDDLEWARE
  } else {
    res.sendStatus(403);
  }
}

// SLUGIFY
function slugify(str, id) {
  str = str.replace(/^\s+|\s+$/g, ""); // trim
  str = str.toLowerCase();

  // remove accents, swap ñ for n, etc
  var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
  var to = "aaaaeeeeiiiioooouuuunc------";
  for (var i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
  }

  str = str
    .replace(/[^a-z0-9 -]/g, "") // remove invalid chars
    .replace(/\s+/g, "-") // collapse whitespace and replace by -
    .replace(/-+/g, "-"); // collapse dashes

  return str + "-" + id;
}

module.exports = routes;
