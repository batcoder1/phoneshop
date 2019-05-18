const Order = require('../model/Order');
const axios = require("axios");
require('dotenv').config
const url_base_orders = `${process.env.ORDERS_SERVER}/orders`
const url_base_phones = `${process.env.PHONES_SERVER}/phones`;
console.log(url_base_orders)
console.log(url_base_phones)
/*
 * Create new order
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.findAll = async (req, res) => {
    try {

        const orders = await Order.find({});
        return res.status(200).send({
            orders: orders
        });
    } catch (err) {
        return handler(err, req, res);
    }
}
exports.create = async (req, res) => {
    try {

        if (!req.body.phones ||
            !req.body.phones.length > 0 ||
            !req.body.customer ||
            !req.body.customer.name ||
            !req.body.customer.surname ||
            !req.body.customer.email) {
            throw {
                code: 'BRP',
                message: 'Bad request params'
            }
        }
        const _phones = req.body.phones;
 
        const response = await axios.post(`${url_base_phones}/prices`, {
            phones: _phones
        })
 
        const phoneWithPrice = response.data.phones
        
        let _totalPrice = 0;
        if (phoneWithPrice.length > 1) {
            _totalPrice = phoneWithPrice.reduce((before, current) => before.price + current.price);

        } else { _totalPrice = phoneWithPrice[0].price }
         
        const newOrder = {
            customer: req.body.customer,
            phones: _phones,
            totalPrice: _totalPrice
        }
        const order = new Order(newOrder)
        const orderSaved = await order.save();
        
        const url_orders_check = `${url_base_orders}/check/${order._id}`
        await axios.post(url_orders_check)
        return res.status(200).send({
            order: orderSaved
        })
    } catch (err) {
        console.error(err)
        return handler(err, req, res);
    }
};


exports.check = async (req, res) => {
    try {
        if (!req.params.id) {
            throw {
                code: 'BRP',
                message: 'Bad request params'
            }
        }

        let order = await Order.findById(req.params.id);

        if (!order) {
            throw {
                code: 'R001',
                message: 'order not found'
            }
        }

        await completeOrder(order)
        return res.status(200).send({
            message: "Order succesfull, status: complete"

        });
    } catch (err) {
        return handler(err, req, res);
    }
}

async function completeOrder(order) {
    try {
        const query = {
            '_id': order._id
        }
        const update = {
            status: 'completed'
        }
        await Order.updateOne(query, update);

    } catch (error) {
        return handler(err, req, res);

    }

}


/**
 * Handler
 * Error handler
 * @param {*} err
 * @param {*} res
 * @returns code: err
 */
function handler(err, req, res) {

    if (err) {
        if (err.message) {
            return res.status(500).send({
                code: err.code,
                message: err.message
            });
        } else {
            return res.status(500).send({
                code: err
            });
        }
    }

    return res.status(500).send({
        code: "500",
        message: "Internal Server error"
    });
}