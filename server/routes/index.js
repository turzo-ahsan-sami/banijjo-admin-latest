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

routes.get("/", (req, res) => {
  res.status(200).json({ message: "api call success !!" });
});

routes.get("/check", (req, res) => {
  res.status(200).json({ message: "api call success 2 !!" });
});


/*
** START
** Product -> Specificaton -> Weight Type
*/

routes.get("/getWeightType", verifyToken, async function (req, res) {
  jwt.verify(req.token, "secretkey", async function (err, authData) {
    if (err) {
      res
        .status(403)
        .send({ success: false, message: "jwt expired", status: "403" });
    } else {
      try {
        const weightTypes = await query(
          "SELECT * FROM weight_type WHERE softDel = 0 AND status = 1"
        );
        return res.send({ success: true, data: weightTypes });
      } catch (e) {
        console.log(e);
        return res.send({ success: true, data: [] });
      }
    }
  });
});

routes.post("/saveWeightType", verifyToken, async function (req, res) {
  jwt.verify(req.token, "secretkey", async function (err, authData) {
    if (err) {
      res
        .status(403)
        .send({ success: false, message: "jwt expired", status: "403" });
    } else {
      try {
        const insert_into_weight_type = await query(
          "INSERT INTO weight_type (name, softDel, status) VALUES (" +
            JSON.stringify(req.body.name) +
            ", 0, 1)"
        );
        return res.send({ success: true, message: "Inserted successfully !!" });
      } catch (e) {
        console.log("Error : ", e);
        return res.send({
          success: false,
          message: "Could Not Save Weight Type !!",
        });
      }
    }
  });
});

routes.get("/getWeightTypeForUpdate", verifyToken, async function (req, res) {
  jwt.verify(req.token, "secretkey", async function (err, authData) {
    if (err) {
      res
        .status(403)
        .send({ success: false, message: "jwt expired", status: "403" });
    } else {
      try {
        const weightTypes = await query(
          "SELECT name FROM weight_type WHERE softDel = 0 AND status = 1 AND id = " +
            req.query.id
        );
        return res.send({ success: true, data: weightTypes[0].name });
      } catch (e) {
        return res.send({ success: false, data: [], message: "DB Error" });
      }
    }
  });
});

routes.post("/editWeightType", verifyToken, async function (req, res) {
  jwt.verify(req.token, "secretkey", async function (err, authData) {
    if (err) {
      res
        .status(403)
        .send({ success: false, message: "jwt expired", status: "403" });
    } else {
      try {
        const weightTypes = await query(
          "UPDATE weight_type SET name = " +
            JSON.stringify(req.body.name) +
            " WHERE id = " +
            req.body.weightId
        );
        return res.send({
          success: true,
          message: "Data Updated Succesfully !!",
        });
      } catch (e) {
        console.log("Error : ", e);
        return res.send({
          success: false,
          message: "Could Not Save Weight Type !!",
        });
      }
    }
  });
});

routes.get("/deleteWeightType", verifyToken, async function (req, res) {
  jwt.verify(req.token, "secretkey", async function (err, authData) {
    if (err) {
      res
        .status(403)
        .send({ success: false, message: "jwt expired", status: "403" });
    } else {
      try {
        const get_weight_infos = await query ('SELECT * FROM weight_infos WHERE weight_type_id = '+ req.query.id);
        if(get_weight_infos.length == 0){
          const updateWeightTypes = await query(
            "UPDATE weight_type SET softDel = 1, status = 0 WHERE id = " +
              req.query.id
          );
          return res.send({ success: true, message: "Data Deleted Succesfully" });
        }
        else {
          return res.send({ success: false, message: "Can Not Delete. This Weight Already Has Associated Info !!" });
        }
      } catch (e) {
        return res.send({ success: false, message: "Data Deletion Failed" });
      }
    }
  });
});

/*
** END
** Product -> Specificaton -> Weight Type
*/


/*
** START
** Product -> Specificaton -> Weight Info
*/

routes.post('/saveWeightInfo', verifyToken, async function (req, res) {
  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if (err) {
      res.status(403).send({success: false, message: 'jwt expired', status: '403'});
    }
    else {
      try {
        const insert_into_weight_infos = await query ('INSERT INTO weight_infos (weight, weight_type_id, softDel, status) VALUES ('+JSON.stringify(req.body.weight)+', '+JSON.stringify(req.body.weightType)+', 0, 1)');
        return res.send({ success: true, message: 'Inserted successfully' });
      } catch (e) {
        return res.send({ success: false, message: 'DB Error' });
      }
    }
  });
});

routes.get('/getWeightInfos', verifyToken, async function (req, res) {
  try {
    const get_weight_infos = await query ('SELECT weight_infos.id AS id, weight_infos.weight AS weight, weight_infos.weight_type_id AS weight_type_id, weight_type.name FROM weight_infos JOIN weight_type ON weight_infos.weight_type_id = weight_type.id WHERE weight_infos.softDel = 0 AND weight_infos.status = 1 AND weight_type.softDel = 0 AND weight_type.status = 1');
    return res.send({ success: true, data: get_weight_infos });
  } catch (e) {
    return res.send({ success: true, data: [] });
  }
});

routes.get('/getWeightInfoForUpdate', verifyToken, async function (req, res) {
  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if (err) {
      res.sendStatus(403);
    }
    else {
      try {
        const get_weight_infos = await query ('SELECT weight_infos.weight AS weight, weight_type.id AS weight_type_id FROM weight_infos JOIN weight_type ON weight_infos.weight_type_id = weight_type.id WHERE weight_infos.softDel = 0 AND weight_infos.status = 1 AND weight_type.softDel = 0 AND weight_type.status = 1 AND weight_infos.id = '+ req.query.id);
        return res.send({ success: true, data: get_weight_infos[0] });
      } catch (e) {        
        return res.send({ success: false, data: [], message: 'DB Error' });
      }
    }
  });
});

routes.post('/editWeightInfos', verifyToken, async function (req, res) {
  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if (err) {
      res.status(403).send({success: false, message: 'jwt expired', status: '403'});
    }
    else {
      try {
        const update_weight_infos = await query ('UPDATE weight_infos SET weight = '+JSON.stringify(req.body.weight)+', weight_type_id = '+JSON.stringify(req.body.weightType)+' WHERE id = '+ req.body.weightId);
        return res.send({ success: true, message: 'Data Updated Succesfully' });
      } catch (e) {
        return res.send({ success: false, message: 'DB Error' });
      }
    }
  });
});

routes.get('/deleteWeightInfo', verifyToken, async function (req, res) {
  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if (err) {
      res.status(403).send({success: false, message: 'jwt expired', status: '403'});
    }
    else {
      try {
        const update_weight_infos = await query ('UPDATE weight_infos SET softDel = 1, status = 0 WHERE id = '+ req.query.id);
        return res.send({ success: true, message: 'Data Deleted Succesfully' });
      } catch (e) {
        return res.send({ success: false, message: 'Data Deletion Failed' });
      }
    }
  });
});


/*
** END
** Product -> Specificaton -> Weight Info
*/


// Purchase

routes.post("/saveProductPurchase", async function (req, res) {
  console.log("Product Purchase : ", req.body);
  if (req.body.isUpdateClicked == false) {
    try {
      const insert_at_purchase = await query(
        "INSERT INTO inv_purchase (billNo, chalanNo, vat_registration, supplierId, storedBy, purchaseDate, totalQuantity, totalAmount, status) VALUES ( " +
          JSON.stringify(req.body.currentBillNo) +
          ", " +
          JSON.stringify(req.body.chalanNo) +
          ", " +
          JSON.stringify(req.body.vat_registration) +
          ", " +
          JSON.stringify(req.body.vendorId) +
          ", " +
          JSON.stringify(req.body.storedBy) +
          ", " +
          JSON.stringify(req.body.currentDate) +
          ", " +
          JSON.stringify(req.body.grandTotalQuantity) +
          ", " +
          JSON.stringify(req.body.grandTotalPrice) +
          ", 1 )"
      );
      purchaseElements = req.body.PurchaseList;
      for (var i = 0; i < purchaseElements.length; i++) {
        var colorValue =
          purchaseElements[i].colorValue === undefined
            ? null
            : JSON.stringify(purchaseElements[i].colorValue);
        var sizeValue =
          purchaseElements[i].sizeValue === undefined
            ? null
            : JSON.stringify(purchaseElements[i].sizeValue);
        const insert_at_purchase_details = await query(
          "INSERT INTO inv_purchase_details (purchaseId, billNo, productId, colorId, sizeId, quantity, price, totalPrice) VALUES (" +
            JSON.stringify(insert_at_purchase.insertId) +
            ", " +
            JSON.stringify(req.body.currentBillNo) +
            ", " +
            JSON.stringify(purchaseElements[i].id) +
            ", " +
            colorValue +
            ", " +
            sizeValue +
            ", " +
            JSON.stringify(purchaseElements[i].productQuantity) +
            ", " +
            JSON.stringify(purchaseElements[i].productPrice) +
            ", " +
            JSON.stringify(purchaseElements[i].totalPrice) +
            ")"
        );
      }
      return res.send({
        success: true,
        message: "Successfully inserted into inv_purchase_details table",
      });
    } catch (e) {
      console.log("Error : ", e);
      return res.send({ success: false, error: e });
    }
  } else {
    console.log("Update working");
    try {
      const update_at_purchase = await query(
        "UPDATE inv_purchase SET totalQuantity= " +
          JSON.stringify(req.body.grandTotalQuantity) +
          ", totalAmount = " +
          JSON.stringify(req.body.grandTotalPrice) +
          " WHERE softDel = 0 AND status = 1 AND id = " +
          req.body.purchaseId
      );
      purchaseElements = req.body.PurchaseList;
      const update_all_details_to_inactive = await query(
        "UPDATE inv_purchase_details SET status = 0 WHERE purchaseId = " +
          req.body.purchaseId
      );
      for (var i = 0; i < purchaseElements.length; i++) {
        const select_from_purchase_details = await query(
          "SELECT COUNT(id) AS counter FROM inv_purchase_details WHERE purchaseId = " +
            req.body.purchaseId +
            " AND productId = " +
            purchaseElements[i].id +
            " AND colorId = " +
            purchaseElements[i].colorValue +
            " AND sizeId = " +
            purchaseElements[i].sizeValue +
            " AND quantity = " +
            purchaseElements[i].productQuantity +
            " AND price = " +
            purchaseElements[i].productPrice +
            " AND totalPrice = " +
            purchaseElements[i].totalPrice
        );
        if (select_from_purchase_details[0].counter > 0) {
          const update_all_details_to_active = await query(
            "UPDATE inv_purchase_details SET status = 1 WHERE purchaseId = " +
              req.body.purchaseId +
              " AND productId = " +
              purchaseElements[i].id +
              " AND colorId = " +
              purchaseElements[i].colorValue +
              " AND sizeId = " +
              purchaseElements[i].sizeValue +
              " AND quantity = " +
              purchaseElements[i].productQuantity +
              " AND price = " +
              purchaseElements[i].productPrice +
              " AND totalPrice = " +
              purchaseElements[i].totalPrice
          );
        } else {
          const insert_at_purchase_details = await query(
            "INSERT INTO inv_purchase_details (purchaseId, billNo, productId, colorId, sizeId, quantity, price, totalPrice) VALUES (" +
              JSON.stringify(req.body.purchaseId) +
              ", " +
              JSON.stringify(req.body.currentBillNo) +
              ", " +
              JSON.stringify(purchaseElements[i].id) +
              ", " +
              JSON.stringify(purchaseElements[i].colorValue) +
              ", " +
              JSON.stringify(purchaseElements[i].sizeValue) +
              ", " +
              JSON.stringify(purchaseElements[i].productQuantity) +
              ", " +
              JSON.stringify(purchaseElements[i].productPrice) +
              ", " +
              JSON.stringify(purchaseElements[i].totalPrice) +
              ")"
          );
        }
      }
      return res.send({
        success: true,
        message: "Successfully inserted into inv_purchase_details table",
      });
    } catch (e) {
      console.log("Error : ", e);
      return res.send({ success: false, error: e });
    }
  }
});

routes.get("/getPurchaseInfoForUpdate", async function (req, res) {
  try {
    const get_info_from_purchase = await query(
      "SELECT * FROM inv_purchase WHERE softDel = 0 AND id = " + req.query.id
    );
    const get_info_from_purchase_details = await query(
      "SELECT * FROM inv_purchase_details WHERE status = 1 AND purchaseId = " +
        req.query.id
    );
    const get_product = await query(
      "SELECT products.id, products.product_name, products.product_sku, color_infos.name, size_infos.size, inv_purchase_details.colorId, inv_purchase_details.sizeId, inv_purchase_details.quantity, inv_purchase_details.price, inv_purchase_details.totalPrice FROM inv_purchase_details INNER JOIN color_infos ON inv_purchase_details.colorId = color_infos.id INNER JOIN size_infos ON inv_purchase_details.sizeId = size_infos.id INNER JOIN products ON inv_purchase_details.productId = products.id WHERE inv_purchase_details.status = 1 AND inv_purchase_details.purchaseId = " +
        req.query.id
    );
    const supplierName = await query(
      "SELECT name FROM vendor WHERE id = " +
        get_info_from_purchase[0].supplierId
    );

    return res.send({
      success: true,
      data: [
        get_info_from_purchase[0],
        get_info_from_purchase_details,
        supplierName[0].name,
        get_product,
      ],
      message: "data for purchase update",
    });
  } catch (e) {
    console.log("Error at the time fetching data for purchase update....");
    console.log(e);
    return res.send({
      success: false,
      data: [],
      message: "data for purchase update",
    });
  }
});

// Vendor Vat Reg

module.exports = routes;
