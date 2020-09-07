const routes = require('express').Router();
const jwt = require('jsonwebtoken');

routes.get('/', (req, res) => {
  res.status(200).json({ message: 'api call success !!' });
});

routes.get('/check', (req, res) => {
  res.status(200).json({ message: 'api call success 2 !!' });
});


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
        var colorValue = (purchaseElements[i].colorValue === undefined) ? null : JSON.stringify(purchaseElements[i].colorValue);
        var sizeValue = (purchaseElements[i].sizeValue === undefined) ? null : JSON.stringify(purchaseElements[i].sizeValue);
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
  }
  else {
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

routes.get('/getPurchaseInfoForUpdate', async function(req, res) {
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