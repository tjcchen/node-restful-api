/**
 * Primary file for the API
 */

// Dependencies
const http = require('http');
const url  = require('url');

// The server should respond to all requests with a string
const server = http.createServer(function(req, res) {
  // 1. Get the url and parse it
  let parsedUrl = url.parse(req.url, true);

  // 2. Get the path
  let path = parsedUrl.pathname;
  let trimmedPath = path.replace(/^\/+|\/+$/g, '');

  // 3. Send the response
  res.end('Hello Nodejs Restful API!\n');

  // 4. Log the request path
  console.log('Request received on path:', trimmedPath);
});

// Start the server, and have it listen on port 3000
server.listen(3000, function() {
  console.log('The server is listening on port 3000 now');
});
