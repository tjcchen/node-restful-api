/**
 * Library for storing and editing data
 */

// Dependencies
const fs = require('fs');
const path = require('path');
const helpers = require('./helpers');

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
		if (!err && data) {
			let parsedData = helpers.parseJsonToObject(data);
			callback(false, parsedData);
		} else {
			callback(err, data);
		}
	});
};

// Update data inside a file
lib.update = (dir, file, data, callback) => {
	// Open the file for writing
	// Note the open flag: r+, wx
	fs.open(lib.baseDir + dir + '/' + file + '.json', 'r+', (err, fileDescriptor) => {
		if (!err && fileDescriptor) {
			// Convert data to string
			let stringData = JSON.stringify(data);
			// Truncate the file
			fs.ftruncate(fileDescriptor, (err) => {
				if (err) {
					callback('Error truncating file');
					return;
				}
				// Write to the file and close it
				fs.writeFile(fileDescriptor, stringData, (err) => {
					if (err) {
						callback('Error writing to existing file');
						return;
					}
					fs.close(fileDescriptor, (err) => {
						if (!err) {
							callback(false);
						} else {
							callback('Error closing existing file');
						}
					});
				});
			}); 
		} else {
			callback('Could not open the file for updating, it may not exist yet');
		}
	});
};

// Deleting a file
lib.delete = (dir, file, callback) => {
	// Unlink the file
	fs.unlink(lib.baseDir + dir + '/' + file + '.json', (err) => {
		if (!err) {
			callback(false);
		} else {
			callback('Error deleting file');
		}
	});
};

// List all the items in a directory
lib.list = (dir, callback) => {
	fs.readdir(lib.baseDir + dir + '/', (err, data) => {
		if (!err && data && data.length > 0) {
			let trimmedFileNames = [];
			data.forEach((fileName) => {
				trimmedFileNames.push(fileName.replace('.json', ''));
			});
			callback(false, trimmedFileNames);
		} else {
			callback(err, data);
		}
	});
};

// Export the module
module.exports = lib;