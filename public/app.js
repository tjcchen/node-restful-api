/**
 * Front-end logic for the application
 */

// Container for the front-end application
const app = {};

// Config
app.config = {
  sessionToken: false
};

// Ajax request (for the restful API)
app.client = () => {};

// Interface for making API calls
app.client.request = (headers, path, method, queryStringObject, payload, callback) => {
  // Set defaults
  headers = typeof headers === 'object' && headers != null ? headers : {};
  path = typeof path === 'string' ? path : '/';
  method = typeof method === 'string' && ['GET', 'POST', 'PUT', 'DELETE'].indexOf(method) > -1 ? method.toUpperCase() : 'GET';
  queryStringObject = typeof queryStringObject === 'object' && queryStringObject != null ? queryStringObject : {};
  payload = typeof payload === 'object' && payload != null ? payload : {};
  callback = typeof callback === 'function' ? callback : false;

  // For each query string parameter sent, add it to the path
  let requestUrl = path + '?';
  let count = 0;
  for (let queryKey in queryStringObject) {
    if (queryStringObject.hasOwnProperty(queryKey)) {
      count++;

      // If at least one query string parameter has already been added, prepend new ones with an ampersand
      
    }
  }

};

