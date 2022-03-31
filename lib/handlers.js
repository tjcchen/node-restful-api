/**
 * Request handlers
 */

// Dependencies
const _data = require('../lib/data');
const helpers = require('../lib/helpers');
const config = require('./config');

// Define the handlers
let handlers = {};

/**
 * =============
 * Html handlers
 * =============
 */

// Index handler
handlers.index = (data, callback) => {
    callback(undefined, undefined, 'html');
};

/**
 * =================
 * JSON API handlers
 * =================
 */
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
handlers._users.get = (data, callback) => {
    // Check that the phone number is valid
    let phone = (typeof data.queryStringObject.phone === 'string' && data.queryStringObject.phone.length === 10)
        ? data.queryStringObject.phone.trim()
        : false;
    if (phone) {
        let token = typeof data.headers.token === 'string' ? data.headers.token : false;

        handlers._tokens.verify(token, phone, (isValidToken) => {
            if (isValidToken) {
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
                callback(403, {Error: 'Missing required token in header, or token is invalid'});
            }
        });
    } else {
        callback(400, {Error: 'Missing required field'});
    }
};

// Users - put( update )
// Required data: phone
// Optional data: firstName, lastName, password( at least one must be specified )
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
            let token = typeof data.headers.token === 'string' ? data.headers.token : false;

            handlers._tokens.verify(token, phone, (isValidToken) => {
                if (isValidToken) {
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
                    callback(403, {Error: 'Missing required token in header, or token is invalid'});
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
handlers._users.delete = (data, callback) => {
    // Check that the phone number is valid
    let phone = (typeof data.payload.phone === 'string' && data.payload.phone.length === 10)
        ? data.payload.phone.trim()
        : false;

    if (phone) {
        let token = typeof data.headers.token === 'string' ? data.headers.token : false;
        handlers._tokens.verify(token, phone, (isValidToken) => {
            if (isValidToken) {
                // Lookup the user
                _data.read('users', phone, (err, userData) => {
                    if (!err && userData) {
                        _data.delete('users', phone, (err) => {
                            if (!err) {
                                // Delete each of the checks associated with the user
                                let userChecks = typeof userData.checks == 'object' && userData.checks instanceof Array ? userData.checks : [];
                                let checksToDelete = userChecks.length;
                                if (checksToDelete > 0) {
                                    let checksDeleted = 0;
                                    let deletionErrors = false;
                                    // Loop through the checks
                                    userChecks.forEach((checkId) => {
                                        // Delete the check
                                        _data.delete('checks', checkId, (err) => {
                                            if (err) {
                                                deletionErrors = true;
                                            }
                                            checksDeleted++;
                                            if (checksDeleted === checksToDelete) {
                                                if (!deletionErrors) {
                                                    callback(200);
                                                } else {
                                                    callback(500, {
                                                        Error: 'Error encountered while attempting to delete all of the user\'s checks. All checks may not have been deleted from the system successfully'
                                                    });
                                                }
                                            }
                                        });
                                    });
                                } else {
                                    callback(200);
                                }
                            } else {
                                callback(500, {Error: 'Could not delete the specified user'});
                            }
                        });
                    } else {
                        callback(400, {Error: 'Could not find the specified user'});
                    }
                });
            } else {
                callback(403, {Error: 'Missing required token in header, or token is invalid'});
            }
        });
    } else {
        callback(404, {Error: 'Missing required field'});
    }
};

// Token, users' authentication mechanism
handlers.tokens = (data, callback) => {
    let acceptableMethods = ['post', 'get', 'put', 'delete'];
    let method = (data.method || '').toLowerCase();
    if (acceptableMethods.indexOf(method) > -1) {
        handlers._tokens[method](data, callback);
    } else {
        callback(405); // method is not allowed
    }
};

// Container for all the token submethods
handlers._tokens = {};

// token post handler
// Required data: phone, password
// Optional data: none
handlers._tokens.post = (data, callback) => {
    let phone = (typeof data.payload.phone == 'string' && data.payload.phone.trim().length >= 10)
        ? data.payload.phone.trim()
        : false;
    let password = (typeof data.payload.password == 'string' && data.payload.password.trim().length > 0)
        ? data.payload.password.trim()
        : false;

    if (phone && password) {
        // Lookup the user who matches that phone number
        _data.read('users', phone, (err, userData) => {
            if (!err && userData) {
                // Hash the password, and compare it to the password stored in the user object
                let hashedPassword = helpers.hash(password);
                if (hashedPassword === userData.hashedPassword) {
                    // If valid, create a new token with random name. Set expiration date 1 hour in the future
                    let tokenId = helpers.createRandomString(20);
                    let expires = Date.now() + 1000 * 60 * 60;
                    let tokenObject = {
                        phone,
                        id: tokenId,
                        expires
                    };
                    // Store the token
                    _data.create('tokens', tokenId, tokenObject, (err) => {
                        if (!err) {
                            callback(200, tokenObject);
                        } else {
                            callback(500, {Error: 'Could not create the new token'});
                        }
                    });
                } else {
                    callback(400, {Error: 'password did not match the specified user\'s stored password'});
                }
            } else {
                callback(400, {Error: 'Could not find the specified user'});
            }
        });
    } else {
        callback(400, {Error: 'Missing required field(s)'});
    }
};

// token get handler
// Required field: id
// Optional data: none
handlers._tokens.get = (data, callback) => {
    // Check that the id is valid
    let id = (typeof data.queryStringObject.id === 'string' && data.queryStringObject.id.length === 20)
        ? data.queryStringObject.id.trim()
        : false;
    if (id) {
        // Lookup the token
        _data.read('tokens', id, (err, tokenData) => {
            if (!err && tokenData) {
                callback(200, tokenData);
            } else {
                callback(404);
            }
        });
    } else {
        callback(400, {Error: 'Missing required field'});
    }
};

// token put handler
// Required data: id, extend
// Optional data: none
handlers._tokens.put = (data, callback) => {
    let id = (typeof data.payload.id === 'string' && data.payload.id.length === 20)
        ? data.payload.id.trim()
        : false;
    // extend must be true if it is valid
    let extend = (typeof data.payload.extend === 'boolean' && data.payload.extend === true) ? true : false;
    if (id && extend) {
        // Lookup the user
        _data.read('tokens', id, (err, tokenData) => {
            if (!err && tokenData) {
                // Check to make sure the token isn't already expired
                if (tokenData.expires > Date.now()) {
                    // Set the expiration an hour from now
                    tokenData.expires = Date.now() + 1000 * 60 * 60;
                    // Store the new updates
                    _data.update('tokens', id, tokenData, (err) => {
                        if (!err) {
                            callback(200);
                        } else {
                            callback(500, {Error: 'Could not update the token\'s expiration'});
                        }
                    });
                } else {
                    callback(400, {Error: 'The token has already expired, and cannot be extended'});
                }
            } else {
                callback(400, {Error: 'Specified token does not exit'});
            }
        });
    } else {
        callback(400, {Error: 'Missing required field(s) or field(s) are invalid'});
    }
};

// token delete handler
// Required data: id
// Optional data: none
handlers._tokens.delete = (data, callback) => {
    // Check that the id is valid
    let id = (typeof data.queryStringObject.id === 'string' && data.queryStringObject.id.length === 20)
        ? data.queryStringObject.id
        : false;
    if (id) {
        // Lookup the token
        _data.read('tokens', id, (err, tokenData) => {
            if (!err && tokenData) {
                _data.delete('tokens', id, (err) => {
                    if (!err) {
                        callback(200);
                    } else {
                        callback(500, {Error: 'Could not delete the specified token'});
                    }
                });
            } else {
                callback(400, {Error: 'Could not find the specified token'});
            }
        });
    } else {
        callback(400, {Error: 'Missing required field'});
    }
};

// Verify if a given token id is currently valid for a given user
handlers._tokens.verify = (id, phone, callback) => {
    // Lookup the token
    _data.read('tokens', id, (err, tokenData) => {
        if (!err && tokenData) {
            // Check that the token is for the given and has not expired
            if (tokenData.phone === phone && tokenData.expires > Date.now()) {
                callback(true);
            } else {
                callback(false);
            }
        } else {
            callback(false);
        }
    });
};

//=============
// Checks
// Note: The usage of checks service is to check a token is valid up to 5 times
//=============
handlers.checks = (data, callback) => {
    let acceptableMethods = ['post', 'get', 'put', 'delete'];
    let method = (data.method || '').toLowerCase();
    if (acceptableMethods.indexOf(method) > -1) {
        handlers._checks[method](data, callback);
    } else {
        callback(405); // method is not allowed
    }
};

// Container for all the checks methods
handlers._checks = {};

// Checks - POST
// Required data: protocol, url, method, successCodes, timeoutSeconds
// Optional data: none
handlers._checks.post = (data, callback) => {
    // validate inputs
    let protocol = (typeof data.payload.protocol == 'string' && ['http', 'https'].indexOf(data.payload.protocol) > -1)
        ? data.payload.protocol
        : false;
    let url = (typeof data.payload.url == 'string' && data.payload.url.trim().length > 0) ? data.payload.url.trim() : false;
    let method = (typeof data.payload.method == 'string' && ['get', 'put', 'post', 'delete'].indexOf(data.payload.method) > -1)
        ? data.payload.method
        : false;
    let successCodes = (typeof data.payload.successCodes == 'object' && Array.isArray(data.payload.successCodes)) ? data.payload.successCodes : false;
    // timeoutSeconds needs to be a whole number
    let timeoutSeconds = (typeof data.payload.timeoutSeconds == 'number' && data.payload.timeoutSeconds % 1 === 0 && data.payload.timeoutSeconds >= 1 && data.payload.timeoutSeconds <= 5)
        ? data.payload.timeoutSeconds
        : false;

    if (protocol && url && method && successCodes && timeoutSeconds) {
        // Get the token from the headers
        let token = typeof data.headers.token === 'string' ? data.headers.token : false;

        // Lookup the user by reading the token
        _data.read('tokens', token, (err, tokenData) => {
            if (!err && tokenData) {
                let userPhone = tokenData.phone;

                // Lookup the user data
                _data.read('users', userPhone, (err, userData) => {
                    if (!err && userData) {
                        let userChecks = typeof userData.checks == 'object' && userData.checks instanceof Array ? userData.checks : [];
                        // Verify that the user has less than the number of max-checks-per-user
                        if (userChecks.length < config.maxChecks) {
                            // Create a random id for the check
                            let checkId = helpers.createRandomString(20);
                            // Create the check object, and include the user's phone
                            let checkObject = {
                                id: checkId,
                                userPhone,
                                protocol,
                                url,
                                method,
                                successCodes,
                                timeoutSeconds
                            };
                            // Save the object
                            _data.create('checks', checkId, checkObject, (err) => {
                                if (!err) {
                                    // Add the check id to the user's object
                                    userData.checks = userChecks;
                                    userData.checks.push(checkId);

                                    // Save the new user data
                                    _data.update('users', userPhone, userData, (err) => {
                                        if (!err) {
                                            // Return the data about the new check
                                            callback(200, checkObject);
                                        } else {
                                            callback(500, {Error: 'Could not update the user with the new check'});
                                        }
                                    });
                                } else {
                                    callback(500, {Error: 'Could not create the new check'});
                                }
                            });
                        } else {
                            callback(400, {Error: 'The user already has the maximum number of checks('+ config.maxChecks +')'});
                        }
                    } else {
                        callback(403);
                    }
                });
            } else {
                callback(403);
            }
        });
    } else {
        callback(400, {Error: 'Missing required inputs, or inputs are invalid'});
    }
};

// Checks - get
// Required data: id - check id, retrieved from /checks post method
// Optional data: none
handlers._checks.get = (data, callback) => {
    // Check that id number is valid
    let id = (typeof data.queryStringObject.id === 'string' && data.queryStringObject.id.length === 20)
        ? data.queryStringObject.id.trim()
        : false;
    if (id) {
        // Lookup the checks
        _data.read('checks', id, (err, checkData) => {
            if (!err && checkData) {
                let token = typeof data.headers.token === 'string' ? data.headers.token : false;

                // Verify that the given token is valid and belongs to the user who created the user
                handlers._tokens.verify(token, checkData.userPhone, (isValidToken) => {
                    if (isValidToken) {
                        // Return the check data
                        callback(200, checkData);
                    } else {
                        callback(403);
                    }
                });
            } else {
                callback(404);
            }
        });
    } else {
        callback(400, {Error: 'Missing required field'});
    }
};

// Checks - put
// Required data: id
// Optional data: protocol, url, method, successCodes, timeoutSeconds ( one must be sent )
handlers._checks.put = (data, callback) => {
    // Check for the required field
    let id = (typeof data.payload.id === 'string' && data.payload.id.length === 20)
        ? data.payload.id.trim()
        : false;
    // Check for the optional fields
    let protocol = (typeof data.payload.protocol == 'string' && ['http', 'https'].indexOf(data.payload.protocol) > -1)
        ? data.payload.protocol
        : false;
    let url = (typeof data.payload.url == 'string' && data.payload.url.trim().length > 0) ? data.payload.url.trim() : false;
    let method = (typeof data.payload.method == 'string' && ['get', 'put', 'post', 'delete'].indexOf(data.payload.method) > -1)
        ? data.payload.method
        : false;
    let successCodes = (typeof data.payload.successCodes == 'object' && Array.isArray(data.payload.successCodes)) ? data.payload.successCodes : false;
    let timeoutSeconds = (typeof data.payload.timeoutSeconds == 'number' && data.payload.timeoutSeconds % 1 === 0 && data.payload.timeoutSeconds >= 1 && data.payload.timeoutSeconds <= 5)
        ? data.payload.timeoutSeconds
        : false;

    // Check to make sure id is valid
    if (id) {
        // Check to make sure one or more optional fields has been sent
        if (protocol || url || method || successCodes || timeoutSeconds) {
            // Lookup the check
            _data.read('checks', id, (err, checkData) => {
                if (!err && checkData) {
                    let token = typeof data.headers.token === 'string' ? data.headers.token : false;

                    // Verify that the given token is valid and belongs to the user who created the user
                    handlers._tokens.verify(token, checkData.userPhone, (isValidToken) => {
                        if (isValidToken) {
                            // Update the check where necessary
                            if (protocol) {
                                checkData.protocol = protocol;
                            }
                            if (url) {
                                checkData.url = url;
                            }
                            if (method) {
                                checkData.method = method;
                            }
                            if (successCodes) {
                                checkData.successCodes = successCodes;
                            }
                            if (timeoutSeconds) {
                                checkData.timeoutSeconds = timeoutSeconds;
                            }

                            // Store the new updates
                            _data.update('checks', id, checkData, (err) => {
                                if (!err) {
                                    callback(200);
                                } else {
                                    callback(500, {Error: 'Could not update the check'});
                                }
                            });
                        } else {
                            callback(403);
                        }
                });
                } else {
                    callback(400, {Error: 'Check ID did not exist'});
                }
            });
        } else {
            callback(400, {Error: 'Missing fields to update'});
        }
    } else {
        callback(400, {Error: 'Missing required field'});
    }
};

// Checks - delete
// Required data: id
// Optional data: none
handlers._checks.delete = (data, callback) => {
    // Check that the id is valid
    let id = (typeof data.queryStringObject.id === 'string' && data.queryStringObject.id.length === 20)
        ? data.queryStringObject.id.trim()
        : false;

    if (id) {
        // Lookup the checks
        _data.read('checks', id, (err, checkData) => {
            if (!err && checkData) {
                // Get the token from headers
                let token = typeof data.headers.token === 'string' ? data.headers.token : false;

                handlers._tokens.verify(token, checkData.userPhone, (isValidToken) => {
                    if (isValidToken) {
                        // Delete the check data
                        _data.delete('checks', id, (err) => {
                            if (!err) {
                                // Lookup the user
                                _data.read('users', checkData.userPhone, (err, userData) => {
                                    if (!err && userData) {
                                        let userChecks = typeof userData.checks == 'object' && userData.checks instanceof Array ? userData.checks : [];

                                        // Remove the delete check from their list of checks
                                        let checkPosition = userChecks.indexOf(id);

                                        if (checkPosition > -1) {
                                            // remove the current check
                                            userChecks.splice(checkPosition, 1);
                                            // Resave the user's data
                                            _data.update('users', checkData.userPhone, userData, (err) => {
                                                if (!err) {
                                                    callback(200);
                                                } else {
                                                    callback(500, {Error: 'Could not update the user'});
                                                }
                                            });
                                        } else {
                                            callback(500, {'Error': 'Could not find the check on the users object, so could not remove it'});
                                        }
                                    } else {
                                        callback(500, {Error: 'Could not find the user who created the check, so could not remove the check from the list of checks on the user object'});
                                    }
                                });
                            } else {
                                callback(500, {Error: 'Could not delete the check data'});
                            }
                        });
                    } else {
                        callback(403);
                    }
                });
            } else {
                callback(400, {Error: 'The specified check ID does not exist'});
            }
        });
    } else {
        callback(404, {Error: 'Missing required field'});
    }
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