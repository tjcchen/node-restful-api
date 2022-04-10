/**
 * Helpers for various tasks
 */

// Dependencies
const crypto = require('crypto');
const config = require('./config');
const https = require('https');
const querystring = require('querystring');
const path = require('path');
const fs = require('fs');

// Container for all the helpers
let helpers = {};

// Utilize SHA256 to hash a string
helpers.hash = (str) => {
    if (typeof str === 'string' && str.length > 0) {
        let hash = crypto.createHmac('sha256', config.hashingSecret)
                         .update(str)
                         .digest('hex');
        return hash;
    } else {
        return false;
    }
};

// Parse a JSON string to an object in all cases, without throwing
helpers.parseJsonToObject = (str) => {
    try {
        var obj = JSON.parse(str);
        return obj;
    } catch (ex) {
        return {};
    }
};

// Create a string of random alphanumeric characters, of a given length
helpers.createRandomString = (len) => {
    len = (typeof len === 'number' && len > 0) ? len : false;
    if (len) {  
        // Define all the possible characters that could go into a string
        let possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';

        // Start the string as an empty string
        let str = '';
        for (let i = 1; i <= len; i++) {
            // Get a random character from the possibleCharacters string
            let random = possibleCharacters.charAt(
                Math.floor(Math.random() * possibleCharacters.length)
            );
            // Append this character to the final string
            str += random;
        }

        // Return the final string
        return str;
    } else {
        return false;
    }
};

//==============================================================================
// Http and https modules are capable of receiving requests and sending requests
//==============================================================================
// Send an SMS message via Twilio
helpers.sendTwilioSms = (phone, msg, callback) => {
    // validate parameters
    phone = (typeof phone === 'string' && phone.trim().length === 10) ? phone.trim() : false;
    msg = (typeof msg === 'string' && msg.trim().length > 0 && msg.trim().length <= 1600) ? msg.trim() : false;
    if (phone && msg) {
        // Configure the request payload
        let payload = {
            'from': config.twilio.fromPhone,
            'to': '+86' + phone,
            'body': msg
        };

        // Strinify the the payload
        let stringPayload = querystring.stringify(payload);

        // Configure the request details
        let requestDetails = {
            'protocol': 'https:',
            'hostname': 'api.twilio.com',
            'method': 'POST',
            'path': '/2010-04-01/Accounts/' + config.twilio.accountSid + '/Messages.json',
            'auth': config.twilio.accountSid + ':' + config.twilio.authToken,
            'header': {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(stringPayload),
            }
        };

        // Instantiate the request object
        let req = https.request(requestDetails, (res) => {
            // Grab the status of the sent request
            let status = res.statusCode;
            // Callback successfully if the request went through
            if (status === 200 || status === 201) {
                callback(false);
            } else {
                callback('Status code returned was ' + status);
            }
        });

        // Bind to the error event so it doesn't get thrown
        req.on('error', (err) => {
            callback(err)
        });

        // Add the payload
        req.write(stringPayload);

        // End the request
        req.end();
    } else {
        callback('Given parameters were missing or invalid');
    }
};

// Get the string content a template
helpers.getTemplate = (tplName, data, callback) => {
    tplName = typeof tplName === 'string' && tplName.length > 0 ? tplName : false;
    data = typeof data === 'object' && data != null ? data : {};
    if (tplName) {
        let tplDir = path.join(__dirname, '/../templates/');
        fs.readFile(tplDir + tplName + '.html', 'utf8', (err, str) => {
            if (!err && str && str.length > 0) {
                // Do interpolation on the string
                let finalString = helpers.interpolate(str, data);
                callback(false, finalString);
            } else {
                callback('No template could be found');
            }
        });
    } else {
        callback('A valid template name was not specified');
    }
};

// Add the univerisal header and footer to a string, and pass provided data object to the header and footer for interpolation
helpers.addUniversalTemplates = (str, data, callback) => {
    str = typeof str === 'string' && str.length > 0 ? str : '';
    data = typeof data === 'object' && data != null ? data : {};

    // Get the header
    helpers.getTemplate('_header', data, (err, headerString) => {
        if (!err && headerString) {
            // Get the footer
            helpers.getTemplate('_footer', data, (err, footerString) => {
                if (!err && footerString) {
                    // Add them all together
                    let fullString = headerString + str + footerString;
                    callback(false, fullString);
                } else {
                    callback('Could not find the footer template');
                }
            });
        } else {
            callback('Could not find the header template');
        }
    });
};

// Get the contents of a static (public) asset
helpers.getStaticAsset = (fileName, callback) => {
    fileName = typeof fileName == 'string' && fileName.length > 0 ? fileName : false;
    if (fileName) {
        let publicDir = path.join(__dirname, '/../public/');
        fs.readFile(publicDir + fileName, (err, data) => {
            if (!err && data) {
                callback(false, data);
            } else {
                callback('No file could be found');
            }
        });
    } else {
        callback('A valid file name was not specified');
    }
};

// Take a given string and a data object and find/replace all the keys within it
helpers.interpolate = (str, data) => {
    str = typeof str === 'string' && str.length > 0 ? str : '';
    data = typeof data === 'object' && data != null ? data : {};

    // Add the templateGlobals to the data object, prepending their key name with 'global'
    for (let keyName in config.templateGlobals) {
        if (config.templateGlobals.hasOwnProperty(keyName)) {
            data['global.' + keyName] = config.templateGlobals[keyName];
        }
    }

    // For each key in the data object, insert its value into the string at the corresponding placeholder
    for (let key in data) {
        if (data.hasOwnProperty(key) && typeof data[key] === 'string') {
            let replace = data[key];
            let find = '{'+ key +'}';
            str = str.replace(find, replace);
        }
    }

    return str;
};

// Export the module
module.exports = helpers;