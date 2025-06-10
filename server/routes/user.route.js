const express = require("express");
const { editUserData, getOrderList, getMessages } = require("../controllers/user.controller");
const router = express.Router();


router.post("/edit", editUserData);
router.get("/orders/list", getOrderList);
router.get("/messages", getMessages);



module.exports = router;