const express = require('express');
const router = express.Router();
const { fetchPricing } = require('../controller/pricingController.js');

router.post('/', fetchPricing);

module.exports = router;
