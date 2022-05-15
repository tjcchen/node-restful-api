/**
 * Test runner
 */

const helpers = require('../lib/helpers');
const assert = require('assert');
const { count } = require('console');

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
    let counter = 0;

    // loop through all the tests
    for (let key in _app.tests) {
        if (_app.tests.hasOwnProperty(key)) {
            let subTests = _app.tests[key];
            for (let testName in subTests) {
                if (subTests.hasOwnProperty(testName)) {
                    (function() {
                        let tmpTestName = testName;
                        let testValue = subTests[testName];

                        // Call the test
                        try {
                            testValue(() => {
                                // If it calls back without throwing, then it succeeded, so log it in green
                                console.log('\x1b[32m%s\x1b[0m', tmpTestName);
                                counter++;
                                successes++;
                                if (counter === limit) {
                                    _app.produceTestReport(limit, successes, errors);
                                }
                            });
                        } catch(ex) {
                            // if it throws, then it failed, so capture the error thrown and log it in red
                            errors.push({
                                'name': testName,
                                'error': ex
                            });
                            counter++;
                            if (counter === limit) {
                                _app.produceTestReport(limit, successes, errors);
                            }
                        }
                    })();
                }
            }
        }
    }
};

// Run the tests
_app.runTests();
