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
  checkData.url = typeof checkData.url === 'string' && checkData.url.trim().length > 0 ? checkData.url.trim() : false;
  checkData.method = typeof checkData.method === 'string' && ['post', 'get', 'put', 'delete'].indexOf(checkData.method) > -1 ? checkData.method : false;
  checkData.successCodes = typeof checkData.successCodes === 'object' && Array.isArray(checkData.successCodes) ? checkData.successCodes : false;
  checkData.timeoutSeconds = typeof checkData.timeoutSeconds === 'number' && checkData.timeoutSeconds % 1 === 0 && checkData.timeoutSeconds >= 1 && checkData.timeoutSeconds <= 5 ? checkData.timeoutSeconds : false;

  // Set the keys that may not be set ( if the workers have never seen this check before )
  checkData.state = typeof checkData.state === 'string' && ['up', 'down'].indexOf(checkData.state) > -1 ? checkData.state : 'down';
  checkData.lastChecked = typeof checkData.lastChecked === 'number' && checkData.lastChecked > 0 ? checkData.lastChecked : false;

  // If all the checks pass, pass the data along to the next step in the process
  if (
    checkData.id
    && checkData.userPhone
    && checkData.protocol
    && checkData.url
    && checkData.method
    && checkData.successCodes
    && checkData.timeoutSeconds
  ) {
    workers.performCheck(checkData);
  } else {
    console.error('Error: One of the checks is not properly formatted. Skipping it');
  }
};

// Perform the check, send the checkData and the outcome of the check of the check process, to the next step in the process
workers.performCheck = (checkData) => {
  // Prepare the initial check outcome
  let checkOutcome = {
    error: false,
    responseCode: false
  };

  // Mark that the outcome has not been sent yet
  let outcomeSent = false;

  // Parse the hostname and the path out of the original check data
  let parsedUrl = url.parse(checkData.protocol + '://' + checkData.url, true);
  let hostName = parsedUrl.hostname;
  let path = parsedUrl.path; // Using the path and not 'pathname' because we want the query string

  // Construct the request
  let requestDetails = {
    protocol: checkData.protocol + ':',
    hostname: hostName,
    method: checkData.method.toUpperCase(),
    path: path,
    timeout: checkData.timeoutSeconds * 1000
  };

  // Instantiate the request object (using either the http or https module)
  let _moduleToUse = checkData.protocol === 'http' ? http : https;
  let req = _moduleToUse.request(requestDetails, (res) => {
    // Grab the status of the sent request
    let status = res.statusCode;

    // Update the checkOutcome and pass the data along
    checkOutcome.status = status;
    if (!outcomeSent) {
      workers.processCheckOutcome(checkData.checkOutcome);
      outcomeSent = true;
    }
  })

  // Bind to the error event so it doesn't get thrown
  req.on('error', (e) => {
    // Update the checkOutcome and pass the data along
    // @ts-ignore
    checkOutcome.error = {
      error: true,
      value: e
    };
    if (!outcomeSent) {
      workers.processCheckOutcome(checkData, checkOutcome);
      outcomeSent = true;
    }
  });
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