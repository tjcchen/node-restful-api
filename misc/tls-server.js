/**
 * Example TLS( Transport Layer Security ) Server
 * 
 * Listens to port 6000 and sends the word "pong" to client
 * 
 * TLS module is a subset of net module, it guarantees the data packet being transported safely
 * 
 * SSL( Secure Sockets Layer ) ---> TLS( Transport Layer Security )
 * 
 */

// Dependencies
const tls = require('tls');
const fs = require('fs');
const path = require('path');

// Server Options
const options = {
    'key': fs.readFileSync(path.join(__dirname, '../https/key.pem')),
    'cert': fs.readFileSync(path.join(__dirname, '../https/cert.pem')),
};

// Create the server
const server = tls.createServer(options, (connection) => {
    // Send the word "pong"
    let outboundMessage = 'pong';
    connection.write(outboundMessage);

    // When the client writes something, log it out
    connection.on('data', (inboundMessage) => {
        let messageString = inboundMessage.toString();
        console.log(`I wrote ${outboundMessage} and they said ${messageString}`);
    });
});

// Listen
server.listen(6000);
