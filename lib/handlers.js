/**
 * Request handlers
 */

// Define the handlers
let handlers = {};

// User handler
handlers.users = (data, callback) => {
    let acceptableMethods = ['post', 'get', 'put', 'delete'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._users[data.method](data, callback);
    } else {
        callback(405);
    }
};

// Container for the users submethods
handlers._users = {};

// Users - post
handlers._users.post = (data, callback) => {

};

// Users - get
handlers._users.get = (data, callback) => {
    
};

// Users - put
handlers._users.put = (data, callback) => {
    
};

// Users - delete
handlers._users.delete = (data, callback) => {
    
};

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