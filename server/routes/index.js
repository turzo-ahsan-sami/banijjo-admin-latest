const routes = require('express').Router();
const jwt = require('jsonwebtoken');

routes.get('/', (req, res) => {
  res.status(200).json({ message: 'api call success !!' });
});

routes.get('/check', (req, res) => {
  res.status(200).json({ message: 'api call success 2 !!' });
});


// Add New Purchase

routes.post("/api/saveProductPurchase", async function (req, res) {
  console.log("Product Purchase : ", req.body);
  jwt.verify(req.token, "secretkey", async function (err, authData) {
    if (err) {
      res
        .status(403)
        .send({ success: false, message: "jwt expired", status: "403" });
    } else {
      if (req.body.isUpdateClicked == false) {
        try {
          const insert_at_purchase = await query(
            "INSERT INTO inv_purchase (billNo, chalanNo, supplierId, storedBy, purchaseDate, totalQuantity, totalAmount, status) VALUES ( " +
              JSON.stringify(req.body.currentBillNo) +
              ", " +
              JSON.stringify(req.body.chalanNo) +
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

          console.log("insert_at_purchase : ", insert_at_purchase.insertId);

          for (var i = 0; i < purchaseElements.length; i++) {
            var colorValue = purchaseElements[i].colorValue;
            var sizeValue = purchaseElements[i].sizeValue;

            if (colorValue === undefined) {
              colorValue = null;
            } else {
              colorValue = JSON.stringify(purchaseElements[i].colorValue);
            }

            if (sizeValue === undefined) {
              sizeValue = null;
            } else {
              sizeValue = JSON.stringify(purchaseElements[i].sizeValue);
            }

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

            console.log(
              "insert_at_purchase_details : ",
              insert_at_purchase_details.insertId
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
          var purchase_table_id = 0;
          var purchaseListArray = [];

          const update_at_purchase = await query(
            "UPDATE inv_purchase SET totalQuantity= " +
              JSON.stringify(req.body.grandTotalQuantity) +
              ", totalAmount = " +
              JSON.stringify(req.body.grandTotalPrice) +
              " WHERE softDel = 0 AND status = 1 AND id = " +
              req.body.purchaseId
          );

          purchaseElements = req.body.PurchaseList;

          console.log("insert_at_purchase : ", update_at_purchase);

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

            console.log(
              "select_from_purchase_details : ",
              select_from_purchase_details[0].counter
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
    }
  });
});

// Vendor Vat Reg


module.exports = routes;