
const dotenv = require('dotenv');
dotenv.config({path: './env.test'});
const request = require("request");
const Order = require('../model/Order');
const nodeIP = process.env.NODE_IP || 'localhost';
const host = `http://${nodeIP}`;
const port = process.env.SERVER_PORT || 7777;
const hostName = `${host}:${port}`;
const assert = require('assert')
 
const url_base = `${hostName}/orders`;
 

describe("Order Tests", () => {
 

    const options = {
        headers: {
            'Cache-Control': 'no-cache',
            'Content-Type': 'application/json'
        },
        body: {
            customer: {
                name: "pepe",
                surname: "ruiz",
                email: "peruiz@localhost.com",
            },
            phones: [ 'xiaomi-a1', 'xiaomi-mi8']
             
        },
        json: true
    };
 
    let orderId;
    let server;
    before(function( ){
       server = require('../server.test');
       serverPhones = require('../../phones/server.test');
      
    });
  
    it('start clean, deleting orders ', async  () => {
        await Order.deleteMany({});
    });

 
  
    it('should return 200 response ', function(done) {
        request.get(url_base, function(error, response) {
            assert.equal(response.statusCode, 200);
            done();
        });
    });


    it('Should create order and change status to complete ',  (done) => {
       
        let opt = JSON.parse(JSON.stringify(options));
        
        let url = url_base + '/create';
       
        request.post(url, opt, (error, response, body)  => {
            assert.equal(response.statusCode, 200);
            assert.notDeepEqual(body.order, {});

            let order = body.order 
            orderId = order._id
            

           done()
            
         });   


    });

    it('Should return BRP ',  (done) => {
       
       
        let opt = JSON.parse(JSON.stringify(options));
        
        opt.body.customer.name = null;

        let url = url_base + '/create';
       
        request.post(url, opt, (error, response, body)  => {
            assert.equal(response.statusCode, 500);
            assert.equal(body.code, 'BRP');
            assert.equal(body.message, 'Bad request params');
            
           done()
            
         });   


    });

    it('Should check a order ',  (done) => {
       
        let opt = JSON.parse(JSON.stringify(options));
        let url = `${url_base}/check/${orderId}`;
  
        request.post(url, opt, (error, response, body)  => {
              
            assert.equal(response.statusCode, 200);
            done()
         });   

    });
    it('Should return R001, order not found ',  (done) => {
       
        let opt = JSON.parse(JSON.stringify(options));
        let orderNotExist = '5cddc3ff2a2cf92c0e633333';
        let url = `${url_base}/check/${orderNotExist}`;
  
        request.post(url, opt, (error, response, body)  => {
           
            assert.equal(response.statusCode, 500);
            assert.equal(body.code, 'R001');
            assert.equal(body.message, 'order not found');
            done()
         });   

    });
  
});