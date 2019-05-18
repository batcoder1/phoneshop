  
const express = require('express');
const router = express.Router();
const phones = require('../controller/phones')
 

router.route('/').get(phones.findAll)
router.route('/create').post(phones.create)
router.route('/prices').post(phones.getPrices)

module.exports = router;