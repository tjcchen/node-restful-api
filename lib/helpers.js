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
helpers.getTemplate = (tplName, callback) => {
    tplName = typeof tplName === 'string' && tplName.length > 0 ? tplName : false;
    if (tplName) {
        let tplDir = path.join(__dirname, '/../templates/');
        fs.readFile(tplDir + tplName + '.html', 'utf8', (err, str) => {
            if (!err && str && str.length > 0) {
                callback(false, str);
            } else {
                callback('No template could be found');
            }
        });
    } else {
        callback('A valid template name was not specified');
    }
};


// Export the module
module.exports = helpers;