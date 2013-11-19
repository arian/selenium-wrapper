#!/usr/bin/env node

"use strict";

var spawn = require('child_process').spawn;

var args = [
	'-jar',
	__dirname + '/selenium-server-standalone-2.37.0.jar',
	'-Dwebdriver.chrome.driver=chromedriver'
];

var argv = process.argv;
for (var i = 2; i < argv.length; i++) {
	args.push(argv[i]);
}

spawn('java', args, {
	stdio: 'inherit',
	cwd: __dirname
});
