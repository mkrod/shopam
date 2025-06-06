const express = require("express");
const { deployShopAm } = require("../service/deploy");
const router = express.Router();


router.post("/", deployShopAm);

module.exports = router;