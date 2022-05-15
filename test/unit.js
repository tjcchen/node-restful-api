/**
 * Unit Tests
 */

const helpers = require('../lib/helpers');
const assert = require('assert');
const logs = require('../lib/logs');
const exampleDebuggingProblem = require('../lib/exampleDebuggingProblem');

// Holder for tests
let unit = {};

// Assert that the getNumber function is returning a number
unit['helpers.getANumber should return a number'] = (done) => {
    let val = helpers.getANumber();
    assert.equal(typeof val, 'number');
    done();
};

// Assert that the getNumber function is returning a 1
unit['helpers.getANumber should return 1'] = (done) => {
    let val = helpers.getANumber();
    assert.equal(val, 1);
    done();
};

// Assert that the getNumber function is returning a 2
unit['helpers.getANumber should return 2'] = (done) => {
    let val = helpers.getANumber();
    assert.equal(val, 2);
    done();
};

// Export the tests to the runner
module.exports = unit;
