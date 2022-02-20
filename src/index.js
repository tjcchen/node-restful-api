/**
 * Primary file for the API
 */

// Dependencies
const http = require('http');
const https = require('https');
const url  = require('url');
const fs = require('fs');  // file system
const { StringDecoder } = require('string_decoder');
const dataHelper = require('../lib/data');
const handlers = require('../lib/handlers');
const helpers = require('../lib/helpers');
const config = require('../lib/config');

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

// Define a request router
let router = {
    'sample': handlers.sample,
    'ping': handlers.ping,
    'users': handlers.users,
    'tokens': handlers.tokens,
    'checks': handlers.checks 
};

// Instantiate the HTTP server
const httpServer = http.createServer(function(req, res) {
    undefinedServer(req, res);
});

// Start the HTTP server
httpServer.listen(config.httpPort, function() {
    console.log(`The server is listening on port ${config.httpPort}`);
});

// Instantiate the HTTPS server with OpenSSL key and cert
const httpsServerOptions = {
    key: fs.readFileSync('./https/key.pem'),
    cert: fs.readFileSync('./https/cert.pem'),
};

const httpsServer = https.createServer(httpsServerOptions, function(req, res) {
    undefinedServer(req, res);
});

// Start the HTTPS server
httpsServer.listen(config.httpsPort, function() {
    console.log(`The server is listening on port ${config.httpsPort}`);
});

// All the server logic for both the http and https server
let undefinedServer = (req, res) => {
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
        let choseHandler = typeof router[trimmedPath] !== 'undefined' ? router[trimmedPath] : handlers.notFound;

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
            console.log('Returning this response: ', statusCode, payloadStr);
        });
       // res.end('Hello Nodejs Restful API!\n');
       // console.log('Request received with this payload: ', buffer);
    });

    // Send the response
    // res.end('Hello Nodejs Restful API!\n');
    // Log the request path
    // console.log('Request received on path:', trimmedPath, '; with method', method);
    // console.log(JSON.stringify(queryStringObject, null, 4));
    // console.log('Request received with these headers: ', headers);
};
