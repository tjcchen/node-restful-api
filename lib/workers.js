/**
 * Worker-related tasks
 */

// Dependencies
const http = require('http');
const https = require('https');
const path = require('path');
const fs = require('fs');
const _data = require('./data');
const helpers = require('./helpers');
const url = require('url');

// Instantiate the worker object
let workers = {};

// Lookup all checks, get their data, send to a validator
workers.gatherAllChecks = () => {
  // TODO: add code logic here

};

// Timer to execute the worker-process once per minute
workers.loop = () => {
  setInterval(() => {
    workers.gatherAllChecks();
  }, 1000 * 60);
};

// Init script
workers.init = () => {
  // Execute all the checks immediately
  workers.gatherAllChecks();

  // Call the loop so the checks will execute later on
  workers.loop();
};

// Export the module
module.exports = workers;