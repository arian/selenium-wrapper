"use strict";

var fs = require('fs');
var http = require('http');
var path = require('path');
var url = require('url');
var util = require('util');
var AdmZip = require('adm-zip');

var jarURL = 'http://selenium.googlecode.com/files/selenium-server-standalone-2.39.0.jar';

var chromeDriverURL = 'http://chromedriver.storage.googleapis.com/2.8/chromedriver_';

if (process.platform === 'linux' && process.arch === 'x64') {
	chromeDriverURL += 'linux64.zip';
} else if (process.platform === 'linux') {
	chromeDriverURL += 'linux32.zip';
} else if (process.platform === 'darwin') {
	chromeDriverURL += 'mac32.zip';
} else if (process.platform === 'win32') {
	chromeDriverURL += 'win32.zip';
} else {
	console.log('Unexpected platform or architecture:', process.platform, process.arch);
	process.exit(1);
}

function doThings(things, callback) {
	var results = [], i = 0;
	function doThing() {
		var thing = things[i++];
		if (!thing) return callback(results);
		thing[0].apply(null, thing.slice(1).concat(function(err) {
			if (err) return callback(err);
			results.push(Array.prototype.slice(arguments, 1));
			doThing();
		}));
	}
	doThing();
}

doThings([
	[downloadFile, jarURL],
	[downloadFile, chromeDriverURL],
	[unzip, chromeDriverURL],
	[chmod, 'chromedriver']
], function() {
	console.log('done');
});

function unzip(fileURL, callback) {
	var requestOptions = url.parse(fileURL);
	var filePath = path.basename(requestOptions.path);
	var extractedPath = process.cwd();
	var zip = new AdmZip(filePath);
	zip.extractAllTo(extractedPath, true);
	callback();
}

function chmod(filePath, callback) {
	if (process.platform != 'win32') {
		console.log('chmod', filePath);
		fs.chmod(filePath, '0777', callback);
	} else {
		callback();
	}
}

function downloadFile(fileURL, callback) {
	var requestOptions = url.parse(fileURL);
	var filePath = path.basename(requestOptions.path);

	if (fs.existsSync(filePath)) {
		console.log(filePath + ' already exists');
		callback(null, filePath);
		return;
	}

	console.log('Downloading ' + fileURL + ' to ' + filePath);

	var count = 0;
	var notifiedCount = 0;
	var writePath = filePath + '-download-' + Date.now();
	var outFile = fs.openSync(writePath, 'w');

	var client = http.get(requestOptions, function(response) {
		var status = response.statusCode;

		console.log('Receiving...');

		if (status === 200) {
			response.addListener('data', function(data) {
				fs.writeSync(outFile, data, 0, data.length, null);
				count += data.length;
				if ((count - notifiedCount) > 800000) {
					console.log('Received ' + Math.floor(count / 1024) + 'K...');
					notifiedCount = count;
				}
			});

			response.addListener('end', function() {
				console.log('Received ' + Math.floor(count / 1024) + 'K total.');
				fs.closeSync(outFile);
				fs.renameSync(writePath, filePath);
				callback(null, filePath);
			});

		} else {
			client.abort();
			console.error('Error requesting archive');
			callback(new Error('Error with http request: ' + util.inspect(response.headers)));
		}

	});

}
