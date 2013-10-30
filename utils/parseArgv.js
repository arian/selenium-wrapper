"use strict";

var argv = require('argv');

module.exports = function(args) {

	return argv.option([{
		name: 'browser',
		type: 'string'
	}]).run(args);

};
