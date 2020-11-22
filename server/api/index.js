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

routes.get("/updateSalesDetailsForCourier/:sales_id/:order_id/:courier_partner",
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

module.exports = routes;
