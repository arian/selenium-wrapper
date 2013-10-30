"use strict";

var fs = require('fs');

function takeScreenshot(browser, file, done) {
	browser.takeScreenshot(function(err, data) {
		if (err) return done(err);
		fs.writeFile(file, data, {encoding: 'base64'}, done);
	});
}

module.exports = takeScreenshot;
