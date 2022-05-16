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


// Export the tests to the runner
module.exports = api;