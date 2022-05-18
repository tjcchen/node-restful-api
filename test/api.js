/**
 * API Tests
 */

// Dependencies
const app = require('./index');
const assert = require('assert');
const http = require('http');
const config = require('../lib/config');

// Holder for the tests
const api = {};

// Helpers
const helpers = {};

helpers.makeGetRequest = (path, callback) => {
    // Configure the request details
    let requestDetails = {
        'protocol': 'http',
        'hostname': 'localhost',
        'port': config.httpPort,
        'method': 'GET',
        'path': path,
        'headers': {
            'Content-type': 'application/json'
        }
    };

    // Send the request
    let req = http.request(requestDetails, (res) => {
        callback(res);
    });
    req.end();
};


// Export the tests to the runner
module.exports = api;