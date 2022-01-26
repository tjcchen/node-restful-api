/**
 * Request handlers
 */

// Dependencies
const _data = require('../lib/data');
const helpers = require('../lib/helpers');

// Define the handlers
let handlers = {};

// User handler
handlers.users = (data, callback) => {
    let acceptableMethods = ['post', 'get', 'put', 'delete'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._users[data.method](data, callback);
    } else {
        callback(405); // method is not allowed
    }
};

// Container for the users submethods
handlers._users = {};

// Users - post
// Required data: firstName, lastName, phone, password, tosAgreement
// Optional data: none
handlers._users.post = (data, callback) => {
    // Check that all required fields are filled out
    let firstName = (typeof data.payload.firstName == 'string' && data.payload.firstName.trim().length > 0)
        ? data.payload.firstName.trim()
        : false;
    let lastName = (typeof data.payload.lastName == 'string' && data.payload.lastName.trim().length > 0)
        ? data.payload.lastName.trim()
        : false;
    let phone = (typeof data.payload.phone == 'string' && data.payload.phone.trim().length > 10)
        ? data.payload.phone.trim()
        : false;
    let password = (typeof data.payload.password == 'string' && data.payload.password.trim().length > 0)
        ? data.payload.password.trim()
        : false;
    let tosAgreement = (typeof data.payload.tosAgreement == 'boolean' && data.payload.tosAgreement === true) ? true : false;

    if (firstName && lastName && phone && password && tosAgreement) {
        // Make sure that the user doesnt already exist
        _data.read('users', phone, (err, data) => {
            if (err) {
                // Hash the password
                var hashedPassword = helpers.hash(password);
            } else {
                callback(400, {'Error': 'A user with that phone number already exists'});
            }
        });
    } else {
        callback(400, {'Error': 'Missing required fields'});
    }
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