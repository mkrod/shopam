const express = require("express");
const { editUserData, getOrderList } = require("../controllers/user.controller");
const router = express.Router();


router.post("/edit", editUserData);
router.get("/orders/list", getOrderList)



module.exports = router;