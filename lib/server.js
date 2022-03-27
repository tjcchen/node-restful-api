/**
 * Server associated tasks
 */

// Dependencies
const http = require('http');
const https = require('https');
const url  = require('url');
const fs = require('fs');  // file system
const { StringDecoder } = require('string_decoder');
const dataHelper = require('./data');
const handlers = require('./handlers');
const helpers = require('./helpers');
const config = require('./config');
const path = require('path');
const util = require('util');
const debug = util.debuglog('server');

//===============================================================================
// Cmd: NODE_DEBUG=server node src/index.js
// Only print out server' information, and ignore all the other log informations
//===============================================================================

// @TODO Get rid of this
// helpers.sendTwilioSms('+8618518251024', 'Hello!', (err) => {
//     console.log('this was the error: ', err);
// });
// TESTING
// @TODO delete this
// dataHelper.create('test', 'newFile', {name: 'Andy', occupation: 'Software Engineer'}, (err) => {
//     console.log('this was the error', err);
// });
// dataHelper.read('test', 'newFile', (err, data) => {
//     console.log('this was the error', err);
//     console.log('this was the data', data); // {"name":"Andy","occupation":"Software Engineer"}
// });
// dataHelper.update('test', 'newFile', {'name': 'andy'}, (err) => {
//     console.log('this was the error', err);
// });
// dataHelper.delete('test', 'newFile', (err) => {
//     console.log('this was the error', err);
// });

// Instantiate the server module object
let server = {};

// Define a request router
server.router = {
    'sample': handlers.sample,
    'ping': handlers.ping,
    'users': handlers.users,
    'tokens': handlers.tokens,
    'checks': handlers.checks 
};

//============================
// Http server logic
//============================
// Instantiate the HTTP server
server.httpServer = http.createServer(function(req, res) {
    server.undefinedServer(req, res);
});

//============================
// Https server logic
//============================
// Instantiate the HTTPS server with OpenSSL key and cert
// The __dirname in a node script returns the path of the folder where the current JavaScript file resides
server.httpsServerOptions = {
    key: fs.readFileSync(path.join(__dirname, '../https/key.pem')),
    cert: fs.readFileSync(path.join(__dirname, '../https/cert.pem')),
};

server.httpsServer = https.createServer(server.httpsServerOptions, function(req, res) {
    server.undefinedServer(req, res);
});

// All the server logic for both the http and https server
server.undefinedServer = (req, res) => {
    // Get the url and parse it
    let parsedUrl = url.parse(req.url, true);

    // Get the path
    let path = parsedUrl.pathname;
    let trimmedPath = path.replace(/^\/+|\/+$/g, '');

    // Get the query string as an object
    let queryStringObject = parsedUrl.query;

    // Get the HTTP Method
    let method = req?.method?.toUpperCase();

    // Get the headers as an object
    let headers = req.headers;

    // Get the payload, if any
    // Only the POST request contains a payload, GET request does not have
    let decoder = new StringDecoder('utf-8');
    let buffer = '';
    req.on('data', (data) => {
        buffer += decoder.write(data); // decode the payload data
    });
    req.on('end', () => {
        buffer += decoder.end();

        // Choose the handler this request should go to. if one does not found, go to notFound handler
        let choseHandler = typeof server.router[trimmedPath] !== 'undefined' ? server.router[trimmedPath] : handlers.notFound;

        // Construct the data object to send to the handler
        let data = {
            trimmedPath,
            queryStringObject,
            method,
            headers,
            payload: helpers.parseJsonToObject(buffer)
        };

        // Route the request to the handler specified in the router
        choseHandler(data, function(statusCode, payload) {
            // use the status code called back by the handler, or default to 200
            statusCode = typeof statusCode === 'number' ? statusCode : 200;
            // use the payload called back by the handler, or default to an object
            payload = typeof payload === 'object' ? payload : {};

            // convert the payload to a string
            let payloadStr = JSON.stringify(payload);

            // return the response
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadStr);
            debug('Returning this response: ', statusCode, payloadStr);
        });
    });
};

// Init script
server.init = () => {
  // Start the http server
  server.httpServer.listen(config.httpPort, function() {
    console.log('\x1b[36m%s\x1b[0m', `The server is listening on port ${config.httpPort}`);
  });

  // Start the https server
  server.httpsServer.listen(config.httpsPort, function() {
    console.log('\x1b[35m%s\x1b[0m', `The server is listening on port ${config.httpsPort}`);
  });
};

// Export the server module
module.exports = server;