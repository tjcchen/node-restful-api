/**
 * Library for storing and rotating logs
 */

// Dependencies
const fs = require('fs');
const path = require('path');
const zlib = require('zlib'); // compress file

// Container for the module
const lib = {};

// Base directory of the logs folder
lib.baseDir = path.join(__dirname, '/../.logs/');

// Append a string to a file. Create the file if it does not exist.
lib.append = (file, str, callback) => {
  // Open the file for appending
  fs.open(lib.baseDir + file + '.log', 'a', (err, fileDescriptor) => {
    if (!err) {
      // Append to the file and close it
      fs.appendFile(fileDescriptor, str + '\n', (err) => {
        if (!err) {
          fs.close(fileDescriptor, (err) => {
            if (!err) {
              callback(false);
            } else {
              callback('Error closing file that was being appended');
            }
          });
        } else {
          callback('Error appending to a file');
        }
      });
    } else {
      callback('Could not open file for appending');
    }
  });
};

// List all the logs, and optionally include the compressed logs
lib.list = (includeCompressedLogs, callback) => {
  fs.readdir(lib.baseDir, (err, data) => {
    if (!err && data && data.length > 0) {
      let trimmedFileNames = [];
      data.forEach((fileName) => {
        // Add the .log files
        if (fileName.indexOf('.log') > -1) {
          trimmedFileNames.push(fileName.replace('.log', ''));
        }

        // Add on the .gz files
        if (fileName.indexOf('.gz.b64') > -1 && includeCompressedLogs) {
          trimmedFileNames.push(fileName.replace('.gz.b64', ''));
        }
      });
      callback(false, trimmedFileNames);
    } else {
      callback(err, data);
    }
  });
};

// Export the module
module.exports = lib;