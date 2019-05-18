const path = require('path');
const rootDir = path.resolve(__dirname) 
const result = require('dotenv').config({path: rootDir + '/.env.test' });

 const express = require("express");
 const app = express();
 const router = express.Router();
 const mongoose = require("mongoose");
 const bodyParser = require('body-parser');
 const utils = require('./lib/utils')

 const nodeIP = process.env.NODE_IP || 'localhost'
 const port = 5555
 const hostname = `http://${nodeIP}:${port}`

 const server = require('http').Server(app)

 const MONGO_HOST = 'ds131765.mlab.com'
 const MONGO_PORT = '31765'
 const MONGO_DB = 'phoneservicestest'
 const MONGO_USERNAME = 'user'
 const MONGO_PWD = 'b3827a4aade0b284'
 
 mongoose.set('useCreateIndex', true)
 mongoose.set('useNewUrlParser', true)
 
 
 const MONGO_URL = `mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}`

 mongoose.connect(MONGO_URL, {
   auth: {
     user: MONGO_USERNAME,
     password: utils.decrypt(MONGO_PWD)
   }
 
 })
 // If the connection throws an error
 mongoose.connection.on('error', function (err) {
     console.log('phones: Mongoose default connection error: ' + err)

     // Exit without error in order to restart docker container
     process.exit(0)
 })
 // When the connection is disconnected
 mongoose.connection.on('disconnected', function () {
     console.log('Mongoose default connection disconnected')

     // Exit without error in order to restart docker container
     process.exit(0)
 })
 // If the Node process ends, close the Mongoose connection

 process.on('SIGINT', function () {
     mongoose.connection.close(function () {
         console.log('Mongoose default connection disconnected through app termination')

         // Exit without error in order to restart docker container
         process.exit(0)
     })
 })

 mongoose.connection.once('open', function () {
     console.log('Connected to Phone service mongodb...')
 })
 // parse application/json
 app.use(bodyParser.json())

 require('./routes/index')(router);

 router.route('/').get(function (req, res, next) {
     res.json({
         "message": "phoneservice"
     });
     if (callback) {
         callback();
     }
 });
 app.use('/', router);

 server.listen(port, "0.0.0.0", () => {
     console.log(new Date())
     console.log(`Phone server test started: ${hostname}`)

 });



 exports.server = server;