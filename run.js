"use strict";

var spawn = require('child_process').spawn;

spawn('java', [
	'-jar',
	'selenium-server-standalone-2.37.0.jar',
	'-Dwebdriver.chrome.driver=chromedriver'
], {
	stdio: 'inherit',
	cwd: __dirname
});
