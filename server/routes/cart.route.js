const express = require("express");
const { getCart, addToCart, removeFromCart, increaseQty, decreaseQty } = require("../controllers/cart.controller.js");

const router = express.Router();

router.get("/", getCart);
router.post("/add", addToCart);
router.post("/remove", removeFromCart);
router.post("/qty/increase", increaseQty);
router.post("/qty/decrease", decreaseQty);

module.exports = router;
