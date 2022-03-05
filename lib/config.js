/**
 * Create and export configuration variables
 */

// Container for all the environments
let environments = {};

// Staging( default ) environment
environments.staging = {
    httpPort: 3000,
    httpsPort: 3001,
    envName: 'staging',
    hashingSecret: 'thisIsASecret',
    maxChecks: 5,
    // TODO: create an twilio account from the website
    twilio: {
        accountSid: 'AC8f553d3f7d15f1ef8efc85f26d3a99ee',
        authToken: '43ceeb2dee2c19e5ac7712e53faeefb5',
        fromPhone: '+8618518251024'
    }
};

// Production environment
environments.production = {
    httpPort: 5000,
    httpsPort: 5001,
    envName: 'production',
    hashingSecret: 'thisIsAlsoASecret',
    maxChecks: 5,
    twilio: {
        accountSid: '',
        authToken: '',
        fromPhone: ''
    }
};

// Determine which environment was passed as a command line argument
let currentEnvironment = typeof process.env.NODE_ENV !== 'undefined' ? process.env.NODE_ENV.toLowerCase() : '';

// Check that the current environment is one of the environments above, if not, default to staging
let environmentToExport = typeof environments[currentEnvironment] === 'object' ? environments[currentEnvironment] : environments.staging;

// Export the module
module.exports = environmentToExport;