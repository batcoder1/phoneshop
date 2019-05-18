// phones server
const crypto = require('crypto')
const path = require('path');
const rootDir = path.resolve(__dirname) 
 require('dotenv').config({path: rootDir + '/.env' });
const express = require("express");
const app = express();
const router = express.Router();
const mongoose = require("mongoose");
const bodyParser = require('body-parser'); 
const utils = require('./lib/utils')

const nodeIP = process.env.NODE_IP || 'localhost'
const port = process.env.SERVER_PORT || 5555
const hostname = `http://${nodeIP}:${port}`

const server = require('http').Server(app)
const MONGO_HOST = process.env.MONGO_HOST
const MONGO_PORT = process.env.MONGO_PORT
const MONGO_DB = process.env.MONGO_DB
const MONGO_USERNAME = process.env.MONGO_USERNAME
const MONGO_PWD = process.env.MONGO_PWD

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
  console.log('Mongoose default connection error: ' + err)

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

router.route('/').get(function(req, res, next) {
    res.json({
        "message": "phoneservice"
    });
});
app.use('/', router);

server.listen(port, "0.0.0.0", () => {
  console.log(`Phone server started: ${hostname}`)
});
 
exports.server = server;

