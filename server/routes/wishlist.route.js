const express = require('express');
const { getWishlist, addToWishlist, removeFromWishlist } = require('../controllers/wishlist.controller.js');
const router = express.Router();

// Controller functions

// Routes
router.get('/', getWishlist);
router.post('/add', addToWishlist);
router.post('/remove', removeFromWishlist);

module.exports = router;