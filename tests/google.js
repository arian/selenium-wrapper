"use strict";

var expect = require('expect.js');
var wd = require('wd');
var parseArgv = require('../utils/parseArgv');
var takeScreenshot = require('../utils/takeScreenshot');

var args = parseArgv(process.argv.slice(2));
var options = args.options;

describe('symbaloo', function() {

	this.timeout(10e3);

	var browser;

	before(function(done) {
		browser = wd.remote();
		browser.init({
			browserName: options.browser || 'phantomjs'
		}, done);
	});

	it('should open google', function(done) {
		browser.get('http://symbaloo.com', done);
	});

	it('should resize the window', function(done) {
		browser.setWindowSize(1280, 1024, done);
	});

	it('should get a screenshot', function(done) {
		takeScreenshot(browser, 'foo.png', done);
	});

	after(function(done) {
		browser.quit(done);
	});

});
