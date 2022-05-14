/**
 * Test runner
 */

const helpers = require('../lib/helpers');
const assert = require('assert');

// Application logic for the test runner
const _app = {};

// Container for the tests
_app.tests = {
    'unit': {}
};

// Assert that the getNumber function is returning a number
_app.tests.unit['helpers.getANumber should return a number'] = (done) => {
    let val = helpers.getANumber();
    assert.equal(typeof val, 'number');
    done();
};

// Assert that the getNumber function is returning a 1
_app.tests.unit['helpers.getANumber should return 1'] = (done) => {
    let val = helpers.getANumber();
    assert.equal(val, 1);
    done();
};

