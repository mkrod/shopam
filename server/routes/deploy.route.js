const express = require("express");
const { deployShopAm } = require("../service/deploy");
const router = express.Router();


app.post("/", deployShopAm);

module.exports = router;