#!/usr/bin/env node

var killProcess = require('../index.js');
var utils = require('utilities');

if (process.argv.length > 3) {
    console.log('too many arguments. only support killing process by port currently');
} else if (utils.base.isNumber(process.argv[2]) || process.argv[2] <= 0) {
    console.log('the third argument is not a port number');
} else {
    killProcess(process.argv[2]);
}