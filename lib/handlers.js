/**
 * Request handlers
 */

// Define the handlers
let handlers = {};

// Sample handler
handlers.sample = (data, callback) => {
    // callback a http status code, and a payload object
    callback(406, {'name': 'sample handler'});
};

// Ping handler
handlers.ping = (data, callback) => {
    callback(200);
};

// Not found handler
handlers.notFound = (data, callback) => {
    callback(404);
};

module.exports = handlers;