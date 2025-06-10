const express = require("express");
const { getAllProducts, getDeliveryFees } =  require("../controllers/product.controller.js");
const router = express.Router();

router.get("/", getAllProducts);
router.get("/fees/delivery", getDeliveryFees)

module.exports = router;
