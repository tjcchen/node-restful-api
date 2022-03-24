/**
 * Library for storing and rotating logs
 */

// Dependencies
const fs = require('fs');
const path = require('path');
const zlib = require('zlib'); // compress file

// Container for the module
const lib = {};


// Export the module
module.exports = lib;