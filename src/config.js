/**
 * Create and export configuration variables
 */

// Container for all the environments
let environments = {};

// Staging( default ) environment
environments.staging = {
    port: 3000,
    envName: 'staging'
};

// Production environment
environments.production = {
    port: 5000,
    envName: 'production'
};
