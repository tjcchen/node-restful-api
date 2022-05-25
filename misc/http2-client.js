/**
 * Example HTTP2 Client
 */

// Dependencies
const http2 = require('http2');

// Create client
const client = http2.connect('http://localhost:6000');

// Create a request
const req = client.request({
    ':path': '/'
});

// When a message is received, and the process of it together until you reach the end
let str = '';
req.on('data', (chunk) => {
    str += chunk;
});

// When the message ends, log it out
req.on('end', () => {
    console.log(str);
});

// End the request
req.end();
