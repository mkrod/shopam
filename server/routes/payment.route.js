const express = require("express");
const { payWithPaystack, payWithStripe, paystackCallback, paystackWebhook } = require("../controllers/payment.controller");
const router = express.Router();

router.post("/paystack", payWithPaystack);
router.get("/paystack/webhook", paystackWebhook);
router.get("/paystack/callback", paystackCallback);


router.post("/stripe", payWithStripe);


module.exports = router;