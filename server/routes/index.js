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
        const get_weight_infos = await query(
          "SELECT * FROM weight_infos WHERE weight_type_id = " + req.query.id
        );
        if (get_weight_infos.length == 0) {
          const updateWeightTypes = await query(
            "UPDATE weight_type SET softDel = 1, status = 0 WHERE id = " +
              req.query.id
          );
          return res.send({
            success: true,
            message: "Data Deleted Succesfully",
          });
        } else {
          return res.send({
            success: false,
            message:
              "Can Not Delete. This Weight Already Has Associated Info !!",
          });
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

routes.post("/saveWeightInfo", verifyToken, async function (req, res) {
  jwt.verify(req.token, "secretkey", async function (err, authData) {
    if (err) {
      res
        .status(403)
        .send({ success: false, message: "jwt expired", status: "403" });
    } else {
      try {
        const insert_into_weight_infos = await query(
          "INSERT INTO weight_infos (weight, weight_type_id, softDel, status) VALUES (" +
            JSON.stringify(req.body.weight) +
            ", " +
            JSON.stringify(req.body.weightType) +
            ", 0, 1)"
        );
        return res.send({ success: true, message: "Inserted successfully" });
      } catch (e) {
        return res.send({ success: false, message: "DB Error" });
      }
    }
  });
});

routes.get("/getWeightInfos", verifyToken, async function (req, res) {
  try {
    const get_weight_infos = await query(
      "SELECT weight_infos.id AS id, weight_infos.weight AS weight, weight_infos.weight_type_id AS weight_type_id, weight_type.name FROM weight_infos JOIN weight_type ON weight_infos.weight_type_id = weight_type.id WHERE weight_infos.softDel = 0 AND weight_infos.status = 1 AND weight_type.softDel = 0 AND weight_type.status = 1"
    );
    return res.send({ success: true, data: get_weight_infos });
  } catch (e) {
    return res.send({ success: true, data: [] });
  }
});

routes.get("/getWeightInfoForUpdate", verifyToken, async function (req, res) {
  jwt.verify(req.token, "secretkey", async function (err, authData) {
    if (err) {
      res.sendStatus(403);
    } else {
      try {
        const get_weight_infos = await query(
          "SELECT weight_infos.weight AS weight, weight_type.id AS weight_type_id FROM weight_infos JOIN weight_type ON weight_infos.weight_type_id = weight_type.id WHERE weight_infos.softDel = 0 AND weight_infos.status = 1 AND weight_type.softDel = 0 AND weight_type.status = 1 AND weight_infos.id = " +
            req.query.id
        );
        return res.send({ success: true, data: get_weight_infos[0] });
      } catch (e) {
        return res.send({ success: false, data: [], message: "DB Error" });
      }
    }
  });
});

routes.post("/editWeightInfos", verifyToken, async function (req, res) {
  jwt.verify(req.token, "secretkey", async function (err, authData) {
    if (err) {
      res
        .status(403)
        .send({ success: false, message: "jwt expired", status: "403" });
    } else {
      try {
        const update_weight_infos = await query(
          "UPDATE weight_infos SET weight = " +
            JSON.stringify(req.body.weight) +
            ", weight_type_id = " +
            JSON.stringify(req.body.weightType) +
            " WHERE id = " +
            req.body.weightId
        );
        return res.send({ success: true, message: "Data Updated Succesfully" });
      } catch (e) {
        return res.send({ success: false, message: "DB Error" });
      }
    }
  });
});

routes.get("/deleteWeightInfo", verifyToken, async function (req, res) {
  jwt.verify(req.token, "secretkey", async function (err, authData) {
    if (err) {
      res
        .status(403)
        .send({ success: false, message: "jwt expired", status: "403" });
    } else {
      try {
        const update_weight_infos = await query(
          "UPDATE weight_infos SET softDel = 1, status = 0 WHERE id = " +
            req.query.id
        );
        return res.send({ success: true, message: "Data Deleted Succesfully" });
      } catch (e) {
        return res.send({ success: false, message: "Data Deletion Failed" });
      }
    }
  });
});

/*
 ** END
 ** Product -> Specificaton -> Weight Info
 */

/*
 ** START
 ** Product -> Specificaton
 */

routes.get("/product_specification_names", (req, res) => {
  dbConnection.query(
    "SELECT product_specification_names.id AS id, product_specification_names.specification_name AS specification_name, product_specification_names.specification_type AS specification_type, product_specification_names.category_id AS category_id, product_specification_names.type AS type, category.category_name AS category_name FROM product_specification_names JOIN category ON product_specification_names.category_id = category.id WHERE product_specification_names.status = 1 AND product_specification_names.softDel = 0 ORDER BY product_specification_names.id DESC",
    function (error, results, fields) {
      console.log(results);
      if (error) throw error;
      return res.send({
        error: error,
        data: results,
        message: "sepecification name list.",
      });
    }
  );
});


routes.post("/saveSpecification", verifyToken, function (req, res) {  
  jwt.verify(req.token, "secretkey", (err, authData) => {
    if (err) {
      res.status(403).send({ success: false, message: "jwt expired", status: "403" });
    } else {
      try {
        let serverResponse;
        if (req.body.isUpdateClicked == true) {   // update          
          if (req.body.specification == "Color") {  // color
            var sql_query ="UPDATE product_specification_names SET specification_name = '" +req.body.specification +"', category_id = '" +req.body.categoryId +"', specification_type = '" +req.body.specification +"', type = 0, status = 1 WHERE id = " +req.body.editID;
            dbConnection.query(sql_query, function (err, result) {
              return result ? res.send({ success: true, server_message: result }) : res.send({ success: false, error: err });
            });
          } else {  // weight or size
            var sql_query = "UPDATE product_specification_names SET specification_name = '" + req.body.specificationName + "', category_id = '" + req.body.categoryId + "', specification_type = '" + req.body.specification + "', type = '" + req.body.specificationType + "', status = 1 WHERE id = " + req.body.editID;
            dbConnection.query(sql_query, function (err, result) {
              return result ? res.send({ success: true, server_message: result }) : res.send({ success: false, error: err });
            });
          }
        } else {    // Insert 
          if (req.body.categoryId == 0) {   // All Category
            const productsActualCategory = JSON.parse(JSON.stringify(req.body.productsActualCategory));
            productsActualCategory.forEach((cat) => {
              if (req.body.specification == "Color") {  // color
                var sql_query = "INSERT INTO product_specification_names (specification_name, category_id, specification_type, type, status) VALUES ('" + req.body.specification + "', '" + cat.id + "', '" + req.body.specification + "', 0, '1' )";
                dbConnection.query(sql_query, function (err, result) {
                  serverResponse = result ? result : err;
                  // result ? console.log(result) : console.log('all cat - color error : ',err);
                  // return result ? res.send({ success: true, server_message: result }) : res.send({ success: false, error: err });
                });
              } else {  // weight or size
                var sql_query = "INSERT INTO product_specification_names (specification_name, category_id, specification_type, type, status) VALUES ('" + req.body.specificationName + "', '" + cat.id + "', '" + req.body.specification + "', '" + req.body.specificationType + "', '1' )";
                dbConnection.query(sql_query, function (err, result) {
                  serverResponse = result ? result : err;
                  // result ? console.log(result) : console.log('all cat - size / weight error : ', err);
                  // return result ? res.send({ success: true, server_message: result }) : res.send({ success: false, error: err });
                });
              }
            });
          } else {  // Multiple Selected Category
            const selectedProductCategoryIds = JSON.parse(JSON.stringify(req.body.selectedProductCategoryIds));
            for(let i = 0; i < selectedProductCategoryIds.length; i++){
              if (req.body.specification == "Color") {  // color
                var sql_query = "INSERT INTO product_specification_names (specification_name, category_id, specification_type, type, status) VALUES ('" + req.body.specification + "', '" + selectedProductCategoryIds[i] + "', '" + req.body.specification + "', 0, '1' )";
                dbConnection.query(sql_query, function (err, result) {
                  serverResponse = result ? result : err;
                  // result ? console.log(result) : console.log('selected cat - color error : ',err);
                  // return result ? res.send({ success: true, server_message: result }) : res.send({ success: false, error: err });
                });
              } else {  // weight or size
                var sql_query = "INSERT INTO product_specification_names (specification_name, category_id, specification_type, type, status) VALUES ('" + req.body.specificationName + "', '" + selectedProductCategoryIds[i] + "', '" + req.body.specification + "', '" + req.body.specificationType + "', '1' )";
                dbConnection.query(sql_query, function (err, result) {
                  serverResponse = result ? result : err;
                  // result ? console.log(result) : console.log('selected cat - size / weight error : ', err);
                  // return result ? res.send({ success: true, server_message: result }) : res.send({ success: false, error: err });
                });
              }
            }            
          }
        }
        res.send({ success: true, server_message: serverResponse })
      }
      catch(error){
        console.log(error);
        return res.send({ success: false, message:"Error has occured at the time of insert data to product_specification_names table", status: "500"});      
      }
    }
  });
});


routes.get("/deleteProductSpecificationName", verifyToken, async function ( req, res) {
  jwt.verify(req.token, "secretkey", async function (err, authData) {
    if (err) {
      res
        .status(403)
        .send({ success: false, message: "jwt expired", status: "403" });
    } else {
      try {
        const delete_product_specification_names = await query(
          'UPDATE product_specification_names SET softDel = 1, status = "deactive" WHERE id = ' +
            req.query.id
        );
        return res.send({ success: true, message: "Data Deleted Succesfully" });
      } catch (e) {
        console.log(e);
        return res.send({ success: false, message: "Data Deletion Failed" });
      }
    }
  });
});

/*
 ** END
 ** Product -> Specificaton
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

// Purchase Return

routes.get('/purchase_return_list', async function (req, res) {
  if (req.query.id == 0) {
    const purchase_return_list = await query ('SELECT * FROM inv_purchase_return WHERE status = 1');
    return res.send({data: purchase_return_list, message: 'data' });
  }
  else {
    const purchase_return_list = await query ('SELECT * FROM inv_purchase_return WHERE status = 1 AND returnedBy = '+req.query.id);
    return res.send({data: purchase_return_list, message: 'data' });
  }
});

routes.post("/saveProductPurchaseReturn", verifyToken, (req, res) => {
  jwt.verify(req.token, "secretkey", (err, authData) => {
    if (err) {
      res
        .status(403)
        .send({ success: false, message: "jwt expired", status: "403" });
    } else {
      var purchase_table_id = 0;
      var purchaseListArray = [];
      promise = new Promise(function (resolve, reject) {
        try {
          var insert_sql_query =
            "INSERT INTO inv_purchase_return (purchaseReturnBillNo, supplierId, returnedBy, purchaseReturnDate, totalQuantity, totalAmount, status) VALUES ('" +
            req.body.purchaseReturnNo +
            "', '" +
            req.body.vendorIdForPurchase +
            "', '" +
            req.body.returnedBy +
            "', '" +
            req.body.purchaseReturnDate +
            "', '" +
            req.body.grandTotalQuantity +
            "', '" +
            req.body.grandTotalPrice +
            "', '1')";
          dbConnection.query(insert_sql_query, function (err, result) {
            if (result) {
              resolve(result.insertId);
            } else {
              console.log("Error to inseret at user : ", err);
              return res.send({ success: false, error: err });
            }
          });
        } catch (error) {
          if (error)
            return res.send({
              success: false,
              error:
                "Error has occured at the time of insert data to PRODUCTS table",
              request: req.body,
            });
        }
      })
        .then(function (resolve) {
          console.log("returned value form previous state : ", resolve);
          console.log(
            "purchase_table_id form previous state : ",
            purchase_table_id
          );
          purchaseElements = req.body.PurchaseList;
          console.log("ASYNC LOOP OUTSIDE");
          async.forEachOf(
            purchaseElements,
            function (purchaseElement, i, inner_callback) {
              console.log("ASYNC LOOP INSIDE", purchaseElement);
              var insert_sql_query =
                "INSERT INTO inv_purchase_return_details (purchaseReturnId, purchaseReturnBillNo, productId, colorId, sizeId, quantity, price, totalPrice, status) VALUES ('" +
                resolve +
                "', '" +
                req.body.purchaseReturnNo +
                "', '" +
                purchaseElement.id +
                "', '" +
                purchaseElement.colorValue +
                "', '" +
                purchaseElement.sizeValue +
                "', '" +
                purchaseElement.productQuantity +
                "', '" +
                purchaseElement.productPrice +
                "', '" +
                purchaseElement.totalPrice +
                "', '1')";
              console.log(insert_sql_query);
              dbConnection.query(insert_sql_query, function (
                err,
                results,
                fields
              ) {
                if (!err) {
                  console.log("Query Results : ", results);
                  inner_callback(null);
                } else {
                  console.log("Error while performing Query");
                  inner_callback(err);
                }
              });
            },
            function (err) {
              if (err) {
                console.log("ASYNC loop error !");
                return res.send({ success: false, error: err });
              } else {
                console.log(
                  "Successfully inserted into inv_purchase_details table"
                );
                return res.send({
                  success: true,
                  message:
                    "Successfully inserted into inv_purchase_details table",
                });
              }
            }
          );
        })
        .catch(function (reject) {
          console.log("Promise rejected", reject);
          return res.send({ success: false, error: err });
        });
    }
  });
});

routes.get('/getPurchaseReturnInfoForUpdate', verifyToken, async function(req, res) {

  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if (err) {
      res.sendStatus(403);
    }
    else {

      try {
        console.log('Requested For : ', req.query.id);

        const get_info_from_purchase = await query ('SELECT * FROM inv_purchase_return WHERE status = 1 AND id = '+req.query.id);

        const get_info_from_purchase_details = await query('SELECT * FROM inv_purchase_return_details WHERE status = 1 AND purchaseReturnId = '+req.query.id);

        const get_product = await query ('SELECT products.id, products.product_name, products.product_sku, color_infos.name, size_infos.size, inv_purchase_return_details.colorId, inv_purchase_return_details.sizeId, inv_purchase_return_details.quantity, inv_purchase_return_details.price, inv_purchase_return_details.totalPrice FROM inv_purchase_return_details INNER JOIN color_infos ON inv_purchase_return_details.colorId = color_infos.id INNER JOIN size_infos ON inv_purchase_return_details.sizeId = size_infos.id INNER JOIN products ON inv_purchase_return_details.productId = products.id WHERE inv_purchase_return_details.status = 1 AND inv_purchase_return_details.purchaseReturnId = '+req.query.id);

        const supplierName = await query('SELECT name FROM vendor WHERE id = '+get_info_from_purchase[0].supplierId);

        console.log('Purchase Update Info : ', get_info_from_purchase[0]);
        console.log('Purchase Update Info : ', get_info_from_purchase_details);
        console.log('Purchase Update Info : ', supplierName[0].name);
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


// ADD PRODUCT


routes.post("/saveProduct", verifyToken, async function (req, res) {
  jwt.verify(req.token, "secretkey", async function (err, authData) {
    if (err) {
      res.status(403).send({ success: false, message: "jwt expired", status: "403" });
    } else {              
      try {
        if (req.files != null) {

          if (!req.body.productFiles) {
            var productFilesArray = [];
            productFilesArray = req.body.productResizedImages;
            if (Array.isArray(productFilesArray)) {
              productFilesArray.map(function (file, index) {                
                var imageName = req.body.fileNameExclude[index] + '.png';
                var productFiles = file;
                var matches = productFiles.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/), response = {};
                response.type = matches[1];
                response.data = Buffer.from(matches[2], 'base64');
                fs.writeFile(`${__dirname}/../../public/upload/product/compressedProductImages/${imageName}`, response.data, (err) => {
                  if (err) throw err;
                });
              })
            }
            else {              
              var imageName = req.body.fileNameExclude + '.png';              
              var productFiles = req.body.productResizedImages;
              var matches = productFiles.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/), response = {};              
              response.type = matches[1];
              response.data = Buffer.from(matches[2], 'base64');
              fs.writeFile(`${__dirname}/../../public/upload/product/compressedProductImages/${imageName}`, response.data, (err) => {
                if (err) throw err;               
              });              
            }
          }

          if (!req.body.productDescriptionFiles) {
            if (req.files.productDescriptionFiles) {
              if (Array.isArray(req.files.productDescriptionFiles)) {
                req.files.productDescriptionFiles.map(function (file, index) {
                  file.mv(`${__dirname}/../../public/upload/product/productDescriptionImages/${file.name}`, err => {
                    if (err) throw err;
                  });
                })
              }
              else {
                let productDescriptionFiles = req.files.productDescriptionFiles;
                productDescriptionFiles.mv(`${__dirname}/../../public/upload/product/productDescriptionImages/${productDescriptionFiles.name}`, err => {
                  if (err) throw err;
                });
              }
            }
          }

          if (!req.body.colorFiles) {
            var productFilesArray = [];
            productFilesArray = req.files.colorFiles;
            if (Array.isArray(productFilesArray)) {
              productFilesArray.map(function (file, index) {
                file.mv(`${__dirname}/../../public/upload/product/compressedProductImages/${file.name}`, err => {
                  if (err) throw err;                  
                });
              })
            }
            else {
              let productFiles = req.files.colorFiles;
              productFiles.mv(`${__dirname}/../../public/upload/product/compressedProductImages/${productFiles.name}`, err => {
                if (err) throw err;                
              });
            }
          }

        }


        var specificationValues = '';
        var specificationKey = '';
        var specificationArray = [];        
        var fullStateData = JSON.parse(req.body.specificationDetailsFullState);
        var specificationBoxFun = JSON.parse(req.body.productSpecificationBoxFun);
        var specificationBoxFun1 = JSON.parse(req.body.productSpecificationBoxFun1);
        var colorImageObjects = JSON.parse(req.body.colorImageObjects);
        var specifiationOBJ = {};

        if (specificationBoxFun1.length > 0 && colorImageObjects.length > 0) {
          specifiationOBJ.color = colorImageObjects;
          // specifiationOBJ.size = specificationBoxFun;
          // specifiationOBJ = { ...specifiationOBJ, ...specificationBoxFun };           
        }
        else if (specificationBoxFun1.length > 0 && colorImageObjects.length == 0) {
          specifiationOBJ.color = specificationBoxFun1;
          // specifiationOBJ.size = specificationBoxFun;
          // specifiationOBJ = { ...specifiationOBJ, ...specificationBoxFun };          
        }
        else if (specificationBoxFun1.length == 0 && colorImageObjects.length > 0) {
          specifiationOBJ.color = colorImageObjects;
          // specifiationOBJ.size = specificationBoxFun;
          // specifiationOBJ = { ...specifiationOBJ, ...specificationBoxFun };          
        }

        const productSpecificationWeight = JSON.parse(req.body.productSpecificationWeight);
        const productSpecificationSize = JSON.parse(req.body.productSpecificationSize);
        const productSpecObj = productSpecificationWeight.concat(productSpecificationSize);
        console.log('productSpecObj : ', productSpecObj);  
        // return;

        // specifiationOBJ = { ...specifiationOBJ, ...specificationBoxFun };
        specifiationOBJ = { ...specifiationOBJ, ...productSpecObj };
        console.log('specifiationOBJ ... : ', specifiationOBJ);  
        // return;
       
        
        if(Object.values(fullStateData).length > 0) {
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
          }
        }

        var metaTags = JSON.parse(req.body.metaTags);
        var tags = [];
        for (var i = 0; i < metaTags.length; i++) {
          tags.push(metaTags[i].displayValue);
        }


        const lastInsertId = await query(`SELECT id FROM products ORDER BY id DESC LIMIT 1`);         
        const productIdForSlug = lastInsertId[0].id + 1;

        let brandName = (req.body.productBrand) ? req.body.productBrand[0] : "";

        const insert_product = await query(
          `INSERT INTO products (
            product_name, category_id, product_sku, productPrice, brand_name, 
            image, home_image, product_full_description, 
            vendor_id, entry_by, entry_user_type, 
            qc_status, status, isApprove,
            product_specification_name,
            product_specification_details_description, 
            metaTags            
          ) 
          VALUES (
            '${req.body.productName}' , '${req.body.categoryIdValue}' , '${req.body.productSKUcode}' , '${req.body.productPrice}' , '${brandName}' ,
            '${req.body.productImagesJson}' , '${req.body.homeImage}' , '${req.body.productDescriptionFull}' ,
            '${req.body.vendor_id}' , '${req.body.entry_by}' , '${req.body.entry_user_type}' ,
            '1' , '1' , '2',
            '${JSON.stringify(specifiationOBJ)}', 
            '${JSON.stringify(specificationArray)}',
            '${JSON.stringify(tags)}'                   
          )`
        );
        console.log(insert_product);

        const update_product_slug = await query(`Update products set slug = slugify(product_name, id) WHERE id = ${productIdForSlug}`);
        console.log(update_product_slug);

        return res.send({success: true, message: 'success'});       
      } catch (error) {
        console.log("ERROR : ", error);
        return res.send({success: false, message: "Error has occured at the time of insert data to PRODUCTS table"});          
      }
    }
  });
});


// STOCK

routes.get('/confirmPurchase', verifyToken, async function (req, res) {
  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if (err) {
      res.status(403).send({success: false, message: 'jwt expired', status: '403'});
    }
    else {
      try {
        const updatePurchase = await query('UPDATE inv_purchase SET isConfirmed = 2 WHERE id = '+req.query.id);

        var currentdate = new Date();
        var datetime = currentdate.getFullYear() + "-" + (currentdate.getMonth()+1)  + "-" + currentdate.getDate();

        var selectFromPurchaseDatails = await query ('SELECT inv_purchase_details.productId, inv_purchase_details.colorId, inv_purchase_details.sizeId, inv_purchase_details.quantity, inv_purchase.supplierId, inv_purchase.storedby FROM inv_purchase_details JOIN inv_purchase ON inv_purchase_details.purchaseId = inv_purchase.id WHERE inv_purchase_details.status = 1 AND inv_purchase_details.purchaseId = '+ req.query.id);

        console.log('Purchase ID : ', req.query.id);

        for (var i = 0; i < selectFromPurchaseDatails.length; i++) {
          console.log('selected products purchase : ', selectFromPurchaseDatails[i]);
          let entry_by = selectFromPurchaseDatails[i].storedby; 
          let entry_user_type = selectFromPurchaseDatails[i].storedby == 0 ? 'admin' : 'vendor';
          const insert_at_stock = await query ('INSERT INTO stock (productId, vendorId, entry_by, entry_user_type, colorId, sizeId, quantity, softDel, status, createdBy, createdAt) VALUES ('+JSON.stringify(selectFromPurchaseDatails[i].productId)+', '+JSON.stringify(selectFromPurchaseDatails[i].supplierId)+', '+JSON.stringify(entry_by)+', '+JSON.stringify(entry_user_type)+', '+selectFromPurchaseDatails[i].colorId+', '+JSON.stringify(selectFromPurchaseDatails[i].sizeId)+', '+JSON.stringify(selectFromPurchaseDatails[i].quantity)+', '+'0'+', '+'1'+', '+req.query.employee_id+', '+datetime+')')
        }

        return res.send({ success: true, data: [], message: 'Purchase confirmed Succesfully !' });

      } catch (e) {
        console.log('Error occured at the time of purchase confirmation', e);
        return res.send({ success: false, data: [], message: 'Purchase Confirmation Failed !' });
      }
    }
  });

});

routes.get('/confirmPurchaseReturn', verifyToken, async function (req, res) {
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

        var selectFromPurchaseDatails = await query ('SELECT inv_purchase_return_details.productId, inv_purchase_return_details.colorId, inv_purchase_return_details.sizeId, inv_purchase_return_details.quantity, inv_purchase_return.supplierId, inv_purchase_return.returnedBy FROM inv_purchase_return_details JOIN inv_purchase_return ON inv_purchase_return_details.purchaseReturnId = inv_purchase_return.id WHERE inv_purchase_return_details.status = 1 AND inv_purchase_return_details.purchaseReturnId = '+ req.query.id);

        console.log('Purchase ID : ', req.query.id);
        console.log('selectedPurchasedProduct : ', selectFromPurchaseDatails );

        for (var i = 0; i < selectFromPurchaseDatails.length; i++) {
          console.log('selected products purchase : ', selectFromPurchaseDatails[i]);
          var quantity = Number(selectFromPurchaseDatails[i].quantity) * Number(-1);
          console.log('Quantity : ', quantity);
          let entry_by = selectFromPurchaseDatails[i].returnedBy; 
          let entry_user_type = selectFromPurchaseDatails[i].returnedBy == 0 ? 'admin' : 'vendor';
          const insert_at_stock = await query ('INSERT INTO stock (productId, vendorId, entry_by, entry_user_type, colorId, sizeId, quantity, softDel, status, createdBy, createdAt) VALUES ('+JSON.stringify(selectFromPurchaseDatails[i].productId)+', '+JSON.stringify(selectFromPurchaseDatails[i].supplierId)+', '+JSON.stringify(entry_by)+', '+JSON.stringify(entry_user_type)+', '+selectFromPurchaseDatails[i].colorId+', '+JSON.stringify(selectFromPurchaseDatails[i].sizeId)+', '+JSON.stringify(quantity)+', '+'0'+', '+'1'+', '+req.query.employee_id+', '+datetime+')')
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


routes.get('/product_specification_names', (req, res) => {
  dbConnection.query('SELECT product_specification_names.id AS id, product_specification_names.specification_name AS specification_name, product_specification_names.category_id AS category_id, product_specification_names.type AS type, product_specification_names.specification_type AS specification_type, category.category_name AS category_name FROM product_specification_names JOIN category ON product_specification_names.category_id = category.id WHERE product_specification_names.status = 1 AND product_specification_names.softDel = 0 ORDER BY product_specification_names.id DESC', function (error, results, fields) {
    console.log(results);
    if (error) throw error;
    return res.send({ error: error, data: results, message: 'sepecification name list.' });
  });
});


// SALES RETURN

routes.post('/saveSalesReturn', verifyToken, (req, res) => {
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
          var insert_sql_query = "INSERT INTO sales_return (salesReturnBillNo, salesBillId, customerId, salesDate, salesReturnDate, totalSalesReturnQuantity, totalSalesReturnAmount, totalSalesPayAmount, salesReturnPayAmount, reason, status) VALUES ('"+req.body.purchaseReturnNo+"', '"+req.body.sales_bill_id+"', '"+req.body.customer_id+"', '"+req.body.sales_date+"', '"+req.body.purchaseReturnDate+"',        '"+req.body.grandTotalQuantity+"', '"+req.body.grandTotalPrice+"', '"+req.body.sales_pay_amount+"', '"+req.body.totalReturnAmount+"', '"+req.body.reason+"', '1')";

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



// SEARCH PRODUCTS FOR PURCHASE

routes.get("/search_products_for_purchase", verifyToken, (req, res) => {
  console.log("Vendor Values : ", req.query.vendorId);
  console.log("Vendor Values : ", req.query.id);

  jwt.verify(req.token, "secretkey", (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      dbConnection.query(
        'SELECT * FROM products WHERE entry_user_type = "' +
          req.query.user_type +
          '" AND vendor_id = "' +
          req.query.vendorId +
          '" AND ( LOWER(product_name) LIKE "%' +
          req.query.id +
          '%" OR  LOWER(product_sku) LIKE "%' +
          req.query.id +
          '%") ',
        function (error, results, fields) {
          if (error) throw error;
          return res.send({ data: results, message: "data" });
        }
      );
    }
  });
});


// PRODUCT WISE SPECIFICATION 

routes.get('/getSpecificationNamesValues', verifyToken, async function (req, res) {
  console.log('Vendor Values : ', req.query.vendorId);
  console.log('Vendor Values : ', req.query.id);

  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if (err) {
      res.sendStatus(403);
    }
    else {
      try {
        const get_specification_list = await query ('SELECT product_specification_name FROM products WHERE id = '+req.query.id);

        let parse_specification_values = JSON.parse(get_specification_list[0].product_specification_name);
        // console.log("parse_specification_values : ", parse_specification_values);

        let colorList = [];
        if (parse_specification_values.hasOwnProperty("color")) {
          let colorListParse = parse_specification_values["color"];
          for (let i = 0; i < colorListParse.length; i++) {
            const color_name = await query(
              "SELECT name FROM color_infos WHERE id = " +
                colorListParse[i].colorId
            );
            let colorOBJ = {};
            colorOBJ.id = colorListParse[i].colorId;
            colorOBJ.name = color_name[0].name;
            colorList.push(colorOBJ);
          }
        }
        console.log('colorList : ', colorList);

        let sizeList = [];
        if (parse_specification_values[0]) {
          sizeList = parse_specification_values[0].hasOwnProperty("Number")
            ? parse_specification_values[0].Number
            : parse_specification_values[0].Roman_Number;
        }      
        console.log('sizeList : ', sizeList);
        
        return res.send({ success : true, data : get_specification_list, colorList : colorList, sizeList : sizeList });
      } catch (e) {
        console.log('Error : ', e);
        return res.send({ success : false, error: e, data : [], colorList : [], sizeList : [] });
      }
    }
  });
});


routes.get("/getSizeInfos", async function (req, res) {
  try {
    const get_size_infos = await query(
      "SELECT size_infos.id AS id, size_infos.size AS size, size_infos.size_type_id AS size_type_id, size_type.name FROM size_infos JOIN size_type ON size_infos.size_type_id = size_type.id WHERE size_infos.softDel = 0 AND size_infos.status = 1 AND size_type.softDel = 0 AND size_type.status = 1"
    );

    return res.send({ success: true, data: get_size_infos });
  } catch (e) {
    console.log("Error : ", e);
    return res.send({ success: true, data: [] });
  }
});

module.exports = routes;
