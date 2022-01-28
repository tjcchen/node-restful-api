/**
 * Helpers for various tasks
 */

// Dependencies
const crypto = require('crypto');
const config = require('../src/config');

// Container for all the helpers
let helpers = {};

// Utilize SHA256 to hash a string
helpers.hash = (str) => {
    if (typeof str === 'string' && str.length > 0) {
        let hash = crypto
            .createHmac('sha256', config.hashingSecret)
            .update(str)
            .digest('hex');
        return hash;
    } else {
        return false;
    }
};

// Export the module
module.exports = helpers;