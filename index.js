#!/usr/bin/env node

var exec = require('child_process').exec;
var Promise = require('promise');
var utils = require('utilities');


module.exports = function (port) {
    return getProcessByPort(port)
        .then(function (pids) {
            return killProcesses(pids);
        });
};


// 根据 pid 杀死进程
function killProcesses(pids) {
    utils.arrayHelper.forEach(pids, function (pid) {
        exec('kill -9 ' + pid, function (error, stdout, stderr) {
            if (error || stderr) {
                console.log(error || stderr);
            } else {
                console.log('kill process', pid, 'successfully!');
            }
        });
    });
}
/**
 * 根据端口号获取进程id
 */
function getProcessByPort(port) {
    return new Promise(function (resolve, reject) {
        exec('lsof -i:' + port, function (error, stdout, stderr) {
            if (error || stderr) {
                reject(error || new Error(stderr));
            } else {
                if (!utils.base.isString(stdout)) {
                    return resolve([]);
                }

                var stdoutLines = stdout.split(/\n/g), pids = [];
                for (var i = 1, il = stdoutLines.length; i < il; i++) {
                    var pid = stdoutLines[i].split(/\s/g)[2];
                    pid && pids.push(parseInt(pid));
                }

                resolve(pids);
            }
        });
    });
}
