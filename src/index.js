/**
 * Primary file for the API
 */

// Dependencies
const http = require('http');
const url  = require('url');
const { StringDecoder } = require('string_decoder');

// The server should respond to all requests with a string
const server = http.createServer(function(req, res) {
  // Get the url and parse it
  let parsedUrl = url.parse(req.url, true);

  // Get the path
  let path = parsedUrl.pathname;
  let trimmedPath = path.replace(/^\/+|\/+$/g, '');

  // Get the query string as an object
  let queryStringObject = parsedUrl.query;

  // Get the HTTP Method
  let method = req?.method?.toUpperCase();

  // Get the headers as an object
  let headers = req.headers;

  // Get the payload, if any
  // Only the POST request contains a payload, GET request does not have
  let decoder = new StringDecoder('utf-8');
  let buffer = '';
  req.on('data', (data) => {
      buffer += decoder.write(data); // decode the payload data
  });
  req.on('end', () => {
      buffer += decoder.end();
      res.end('Hello Nodejs Restful API!\n');
      console.log('Request received with this payload: ', buffer);
  });

  // Send the response
  // res.end('Hello Nodejs Restful API!\n');

  // Log the request path
  // console.log('Request received on path:', trimmedPath, '; with method', method);
  // console.log(JSON.stringify(queryStringObject, null, 4));
  // console.log('Request received with these headers: ', headers);
});

// Start the server, and have it listen on port 3000
server.listen(3000, function() {
    console.log('The server is listening on port 3000 now');
});
