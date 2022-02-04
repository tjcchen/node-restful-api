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
    let method = (data.method || '').toLowerCase();
    if (acceptableMethods.indexOf(method) > -1) {
        handlers._users[method](data, callback);
    } else {
        callback(405); // method is not allowed
    }
};

// Container for the users submethods
handlers._users = {};

// Users - post( create an user object )
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
    let phone = (typeof data.payload.phone == 'string' && data.payload.phone.trim().length >= 10)
        ? data.payload.phone.trim()
        : false;
    let password = (typeof data.payload.password == 'string' && data.payload.password.trim().length > 0)
        ? data.payload.password.trim()
        : false;
    let tosAgreement = (typeof data.payload.tosAgreement == 'boolean' && data.payload.tosAgreement === true) ? true : false;

    if (firstName && lastName && phone && password && tosAgreement) {
        // Make sure that the user doesnt already exist
        _data.read('users', phone, (err, data) => {
            if (err) { // file does not exist, then we create one
                // Hash the password
                var hashedPassword = helpers.hash(password);

                // Create the user object when we have hashedPassword
                if (hashedPassword) {
                    var userObject = {
                        firstName,
                        lastName,
                        phone,
                        hashedPassword,
                        tosAgreement
                    };

                    // Store the user
                    _data.create('users', phone, userObject, (err) => {
                        if (!err) {
                            console.log('Create the user successfully');
                            callback(200);
                        } else {
                            console.log(err);
                            callback(500, {'Error': 'Could not create the new user'});
                        }
                    });
                } else {
                    callback(500, {'Error': 'Could not hash the user\'s password'});
                }
            } else {
                callback(400, {'Error': 'A user with that phone number already exists'});
            }
        });
    } else {
        callback(400, {'Error': 'Missing required fields'});
    }
};

// Users - get( get user object )
// Required data: phone
// Optional data: none
// @TODO Only let an authenticated user access their object. Don't let them access anyone else's
handlers._users.get = (data, callback) => {
    // Check that the phone number is valid
    let phone = (typeof data.queryStringObject.phone === 'string' && data.queryStringObject.phone.length === 10)
        ? data.queryStringObject.phone.trim()
        : false;
    if (phone) {
        // Lookup the user
        _data.read('users', phone, (err, data) => {
            if (!err && data) {
                // Remove the hashed password from the user object before returning it to the requester
                delete data.hashedPassword; // remove property from an object
                callback(200, data);
            } else {
                callback(404);
            }
        });
    } else {
        callback(400, {Error: 'Missing required field'});
    }
};

// Users - put( update )
// Required data: phone
// Optional data: firstName, lastName, password( at least one must be specified )
// @TODO: Only let an authenticated user update their own object. Don't let update anyone else's
handlers._users.put = (data, callback) => {
    // Check for the required field
    let phone = (typeof data.payload.phone === 'string' && data.payload.phone.length === 10)
        ? data.payload.phone.trim()
        : false;
    
    // Check for the optional fields
    let firstName = (typeof data.payload.firstName == 'string' && data.payload.firstName.trim().length > 0)
        ? data.payload.firstName.trim()
        : false;
    let lastName = (typeof data.payload.lastName == 'string' && data.payload.lastName.trim().length > 0)
        ? data.payload.lastName.trim()
        : false;
    let password = (typeof data.payload.password == 'string' && data.payload.password.trim().length > 0)
        ? data.payload.password.trim()
        : false;

    // Error if the phone is invalid
    if (phone) {
        // Error if nothing is sent to update
        if (firstName || lastName || password) {
            // Lookup the user
            _data.read('users', phone, (err, userData) => {
                if (!err && userData) {
                    // update the fields necessary
                    if (firstName) {
                        userData.firstName = firstName;
                    }
                    if (lastName) {
                        userData.lastName = lastName;
                    }
                    if (password) {
                        userData.hashedPassword = helpers.hash(password);
                    }
                    // Store the new updates
                    _data.update('users', phone, userData, (err) => {
                        if (!err) {
                            callback(200);
                        } else {
                            console.log(err);
                            callback(500, {Error: 'Could not update the user'});
                        }
                    });
                } else {
                    callback(400, {Error: 'The specified user does not exist'});
                }
            });
        } else {
            callback(400, {Error: 'Missing fields to update'});
        }
    } else {
        callback(404, {Error: 'Missing required field'});
    }
};

// Users - delete( delete a user object by phone number )
// Required field: phone
// @TODO Only let an authenticated user delete their object. Dont let them delete anyone else
// @TODO Cleanup (delete) any other user data files associated with this user
handlers._users.delete = (data, callback) => {
    // Check that the phone number is valid
    let phone = (typeof data.payload.phone === 'string' && data.payload.phone.length === 10)
        ? data.payload.phone.trim()
        : false;

    if (phone) {
        // Lookup the user
        _data.read('users', phone, (err, data) => {
            if (!err && data) {
                _data.delete('users', phone, (err) => {
                    if (!err) {
                        callback(200);
                    } else {
                        callback(500, {Error: 'Could not delete the specified user'});
                    }
                });
            } else {
                callback(400, {Error: 'Could not find the specified user'});
            }
        });
    } else {
        callback(404, {Error: 'Missing required field'});
    }
};

// Token, users' authentication mechanism
handlers.tokens = (data, callback) => {
    let acceptableMethods = ['get', 'post', 'put', 'delete'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._tokens[data.method](data, callback);
    } else {
        callback(405);
    }
};

// Container for all the token submethods
handlers._tokens = {};

// token get handler
handlers._tokens.get = (data, callback) => {

};

// token post handler
handlers._tokens.post = (data, callback) => {

};

// token put handler
handlers._tokens.put = (data, callback) => {

};

// token delete handler
handlers._tokens.delete = (data, callback) => {

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