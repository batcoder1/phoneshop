  
const express = require('express');
const router = express.Router();
const orders = require('../controller/orders')

router.route('/').get(orders.findAll)
router.route('/create').post(orders.create)
router.route('/check/:id').post(orders.check)

module.exports = router;