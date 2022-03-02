/**
 * Helpers for various tasks
 */

// Dependencies
const crypto = require('crypto');
const config = require('./config');

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

// Send an SMS message via Twilio
helpers.sendTwilioSms = (phone, msg, callback) => {
    // validate parameters
    phone = typeof phone === 'string' && phone.trim().length === 10 ? phone.trim() : false;
    msg = typeof msg === 'string' && msg.trim().length > 0 && msg.trim().length <= 1600 ? msg.trim() : false;
    if (phone && msg) {
        // TODO: Configure the request payload

    } else {
        callback('Given parameters were missing or invalid');
    }
};

// Export the module
module.exports = helpers;