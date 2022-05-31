/**
 * Async Hooks Example
 * 
 * The async_hooks module provides an API to track asynchronous resources. 
 * 
 */

// Dependencies
const async_hooks = require('async_hooks');
const fs = require('fs'); // write log with fs.writeSync()

// Target execution context
let targetExecutionContext = false;

// Write an arbitrary async function
let whatTimeIsIt = (callback) => {
    setInterval(() => {
        fs.writeSync(1, 'When the setInterval runs, the execution context context is ' + async_hooks.executionAsyncId() + ' \n');
        callback(Date.now());
    }, 1000);
};

// Call that function
whatTimeIsIt((time) => {
    fs.writeSync(1, `The time is ${time} \n`);
});

// Hooks
const hooks = {
    init(asyncId, type, triggerAsyncId, resource) {
        fs.writeSync(1, `Hook init ${asyncId} \n`);
    },
    before(asyncId) {
        fs.writeSync(1, `Hook before ${asyncId} \n`);
    },
    after(asyncId) {
        fs.writeSync(1, `Hook after ${asyncId} \n`);
    },
    destroy(asyncId) {
        fs.writeSync(1, `Hook destroy ${asyncId} \n`);
    },
    promiseResolve(asyncId) {
        fs.writeSync(1, `Hook promiseResolve ${asyncId} \n`);
    }
};

// Create a new AsyncHooks instance
const asyncHook = async_hooks.createHook(hooks);
asyncHook.enable();