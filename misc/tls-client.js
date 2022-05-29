/**
 * Example TLS( Transport Layer Security ) Client
 * 
 * Connects to port 6000 and sends the word "ping" to server
 * 
 * The tls module provides an implementation of the Transport Layer Security (TLS) and
 * Secure Socket Layer (SSL) protocols that is built on top of OpenSSL
 * 
 */

// Dependencies
const tls = require('tls');
const fs = require('fs');
const path = require('path');

// Client Options
const options = {
    // Only required because we're using a self-signed certificate
    'ca': fs.readFileSync(path.join(__dirname, '../https/cert.pem'))
};

// Define the message to send
const outboundMessage = 'ping';

// Create the client
const client = tls.connect(6000, options, () => {
    // Send the message
    client.write(outboundMessage);
});

// When the server writes back, log what is says then kill the application
client.on('data', (inboundMessage) => {
    let messageString = inboundMessage.toString();
    console.log(`I wrote ${outboundMessage} and they said ${messageString}`);
    client.end();
});
