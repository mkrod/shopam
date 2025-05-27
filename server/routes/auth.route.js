const express = require("express");
const { Auth, createUser, localAuth, userData, logout } = require("../controllers/auth.controller.js");

const router = express.Router();

router.post("/signup", createUser);
router.post("/login", localAuth);
router.get("/data", userData);
router.get("/logout", logout);

module.exports = router;
