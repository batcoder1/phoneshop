
const dotenv = require('dotenv');
dotenv.config({path: './env.test'});
const request = require("request");
const assert = require('assert');
const controller = require('../controller/phones');

const Phone = require('../model/Phone')
const nodeIP = process.env.NODE_IP || 'localhost'
const host = `http://${nodeIP}`
const port = process.env.SERVER_PORT || 5555
const hostName = `http://${nodeIP}:${port}`
 
 
const url_base = `${hostName}/phones`;
 
const  phonesList= [ 'xiaomi-A1', 'xiaomi-mi8'];
const options = {
       
    headers: {
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json'
    },
    body: {
         
        name:  'testphone',
        description: 'smartphone fullHD snapdragon 660',
        imageurl:  './assets/images/xiaomi/a1/front.png',
        price: 200
         
    },
    json: true
};

describe("Phones Tests", () => {
    let server
    before(function( ){
        server = require('../server.test');
       
     });
    
    

    it('should return not empty phones array and 200 response ', function(done) {
        let url_base_page = `${url_base}?page=1`
        request.get(url_base_page, function(error, response, body) {
         let _body = JSON.parse(body);
            assert.equal(response.statusCode, 200);
            assert.equal(_body.page, 1)
            assert.equal(_body.total, 12)
            assert.equal(_body.pageCount, 2)
            done();
        });
    });
    
   
 
 
    it('Should create a phone', function (done) {
        let opt = JSON.parse(JSON.stringify(options));
        
        let url = url_base + '/create';
       
        request.post(url, opt, (error, response, body)  => {
            assert.equal(response.statusCode, 200);
            assert.notDeepEqual(body.phone, {});
            done()
           
         });   

    }); 

    it('deleting the previus phone created ', async  () => {
        await Phone.findOneAndDelete({name: options.body.name});
    });


    it('should return 200 response ', function(done) {

        let url_base_page = `${url_base}?page=1`
        request.get(url_base_page, (error, response, body) => {
            
            phoneExpected = {
                name: 'xiaomi-redmi5',
                price: 200,
                imageurl: './assets/images/xiaomi/redmi5/front.png'
            }
            let _body = JSON.parse(body);
            assert.equal(response.statusCode, 200);
            assert.deepEqual(_body.phones[0].name, phoneExpected.name)
            assert.deepEqual(_body.phones[0].price, phoneExpected.price)
            assert.deepEqual(_body.phones[0].imageurl, phoneExpected.imageurl)
            done();
            
        });
    });
    it('should get a prices list phone ', function(done) {

        let url_base_page = `${url_base}/prices`
        let opt = JSON.parse(JSON.stringify(options));
        opt.body = {
            phones: [ 'xiaomi-a1', 'xiaomi-mi8']
        }
       
        request.post(url_base_page, opt, (error, response, body) => {
            let _body = JSON.parse(JSON.stringify(body));
          
            assert.equal(response.statusCode, 200);
            assert.equal(_body.phones[0].name, opt.body.phones[0])
            assert.equal(_body.phones[1].name, opt.body.phones[1])
            assert(_body.phones[0].price > 0)
            assert(_body.phones[1].price > 0)
            done();
            
        });
    });
    it('should not get return info when phone not exist ', function(done) {

        let url_base_page = `${url_base}/prices`
        let opt = JSON.parse(JSON.stringify(options));
        opt.body = {
            phones: [ 'testmobile']
        }
       
        request.post(url_base_page, opt, (error, response, body) => {
            
            let _body = JSON.parse(JSON.stringify(body));
            assert.equal(response.statusCode, 200);
            assert.deepEqual(_body.phones, [])
            done();
            
        });
    });
    it('should get return info about existing phones ', function(done) {

        let url_base_page = `${url_base}/prices`
        let opt = JSON.parse(JSON.stringify(options));
        opt.body = {
            phones: [ 'testmobile', 'xiaomi-a1']
        }
       
        request.post(url_base_page, opt, (error, response, body) => {
            
            let _body = JSON.parse(JSON.stringify(body));
            assert.equal(response.statusCode, 200);
            assert.deepEqual(_body.phones[0].name, opt.body.phones[1])
            done();
            
        });
    });


    
  
});