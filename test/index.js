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

// Assert that the getNumber function is returning a 2
_app.tests.unit['helpers.getANumber should return 2'] = (done) => {
    let val = helpers.getANumber();
    assert.equal(val, 2);
    done();
};

// Run all the tests, collecting the errors and successes
_app.runTests = () => {
    let error = [];
    let successes = 0;
    let limit = _app.countTests();

    // TODO: start from this place
};

// Run the tests
_app.runTests();
