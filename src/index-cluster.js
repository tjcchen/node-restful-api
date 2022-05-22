/**
 * Primary file for the API
 */

// Dependencies
const server = require('../lib/server');
const workers = require('../lib/workers');
const cli = require('../lib/cli');
// A single instance of Node.js runs in a single thread.
// To take advantage of multi-core systems,
// the user will sometimes want to launch a cluster of Node.js processes to handle the load.
const cluster = require('cluster');
const os = require('os');

// Declare the app
const app = {};

// Init function
// Cmd to check cpu number:
// 1. sysctl -n hw.ncpu       8
// 2. sysctl hw.physicalcpu   4
// 3. sysctl hw.logicalcpu    8
app.init = (callback) => {
    // If we'are on the master thread, start the background workers and the CLI
    if (cluster.isMaster) {
        // Start the workers
        workers.init();

        // Start the CLI, but make sure it starts last
        setTimeout(() => {
            cli.init();
            callback();
        }, 50);

        // [IMPORTANT] Fork the process
        for (let i = 0; i < os.cpus().length; i++) {
            cluster.fork();
        }
    } else {
        // If we are not on the master thread, start the HTTP server
        server.init();
    }
};

// Self invoking only if required directly
// NB: please note this trick
if (require.main === module) {
    app.init(() => {});
}

// Export the app
module.exports = app;
