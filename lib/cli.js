/**
 * CLI-Related Tasks
 */

// Dependencies
const readline = require('readline');
const util = require('util');
const debug = util.debuglog('cli');
const events = require('events');

class _events extends events{};
const e = new _events();

// Instantiate the CLI module object
const cli = {};



// Export the module
module.exports = cli;
