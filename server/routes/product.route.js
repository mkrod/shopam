const express = require("express");
const { getAllProducts } =  require("../controllers/product.controller.js");
const router = express.Router();

router.get("/", getAllProducts);

module.exports = router;
