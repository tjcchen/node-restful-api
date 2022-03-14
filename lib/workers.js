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

// NB: A sanity check or sanity test is a basic test to quickly evaluate whether a claim or the result of a calculation
// can possibly be true. It is a simple check to see if the produced material is rational (that the material's creator was thinking rationally, applying sanity).
// Sanity-check the check-data
workers.validateCheckData = (checkData) => {
  checkData = typeof checkData === 'object' && checkData != null ? checkData : {};
  checkData.id = typeof checkData.id === 'string' && checkData.id.trim().length === 20 ? checkData.id.trim() : false;
  checkData.userPhone = typeof checkData.userPhone === 'string' && checkData.userPhone.trim().length === 10 ? checkData.userPhone.trim() : false;
  checkData.protocol = typeof checkData.protocol === 'string' && ['http', 'https'].includes(checkData.protocol) ? checkData.protocol : false;

  // TODO: ADD LOGIC FROM HERE

};

// Lookup all checks, get their data, send to a validator
workers.gatherAllChecks = () => {
  // Get all the checks
  _data.list('checks', (err, checks) => {
    if (!err && checks && checks.length > 0) {
      checks.forEach((check) => {
        // Read in the check data
        _data.read('checks', check, (err, origCheckData) => {
          if (!err && origCheckData) {
            // Pass it to the check validator, and let that function continue or log errors as needed
            workers.validateCheckData(origCheckData);
          } else {
            console.log('Error reading one of the check\'s data');
          }
        });
      });
    } else {
      console.log('Error: Could not find any checks to process');
    }
  });
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