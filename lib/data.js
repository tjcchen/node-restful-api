/**
 * Library for storing and editing data
 */

// Dependencies
const fs = require('fs');
const path = require('path');

// Container for the module ( to be exported )
const lib = {};

// Base directory of the data folder
lib.baseDir = path.join(__dirname, '/../.data/');

// Write data to a file
lib.create = (dir, file, data, callback) => {
	// Open the file for writing
	// Note: the file cannot be existing when we write it
	fs.open(lib.baseDir + dir + '/' + file + '.json', 'wx', (err, fileDescriptor) => {
		if (!err && fileDescriptor) {
			// Convert the data to string
			let stringData = JSON.stringify(data);
			fs.writeFile(fileDescriptor, stringData, (err) => {
				if (err) {
					callback('Error wrting to new file');
				}
				fs.close(fileDescriptor, (err) => {
					if (err) {
						callback('Error closing new file');
					}
					// Succeed
					callback(false);
				});
			});
		} else {
			callback('Could not create a new file, it may already exist!');
		}
	});
};

// Read data from a file
lib.read = (dir, file, callback) => {
	fs.readFile(lib.baseDir + dir + '/' + file + '.json', 'utf8', (err, data) => {
		callback(err, data);
	});
};

// Export the module
module.exports = lib;