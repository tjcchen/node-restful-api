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

// Logs.list should callback an array and a false error
unit['logs.list should callback a false error and an array of log names'] = (done) => {
    logs.list(true, (err, logFileNames) => {
        assert.equal(err, false);
        assert.ok(logFileNames instanceof Array);
        assert.ok(logFileNames.length > 1);
        done();
    });
};

// Logs.truncate should not throw if the logId doesn't exist
unit['logs.truncate should not throw if the logId does not exist. It should callback an error instead'] = (done) => {
    assert.doesNotThrow(() => {
        // Gives a wrong logId
        logs.truncate('I do not exist', (err) => {
            assert.ok(err);
            done();
        });
    }, TypeError);
};

// exampleDebuggingProblem.init should not throw( but it does )
unit['exampleDebuggingProblem.init should not throw when called'] = (done) => {
    assert.doesNotThrow(() => {
        exampleDebuggingProblem.init();
        done();
    }, TypeError);
};

// Export the tests to the runner
module.exports = unit;
