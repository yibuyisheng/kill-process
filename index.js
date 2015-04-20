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
        var cmd;
        if (process.platform === 'win32') {
            cmd = 'taskkill /pid ' + pid + ' /f';
        } else {
            cmd = 'kill -9 ' + pid;
        }

        exec(cmd, function (error, stdout, stderr) {
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

        var cmd;
        if (process.platform === 'win32') {
            cmd = 'netstat -ano|findstr ' + port;
        } else {
            cmd = 'lsof -i:' + port;
        }

        exec(cmd, function (error, stdout, stderr) {
            if (error || stderr) {
                if (process.platform === 'win32' && error && error.code === 1) {
                    return resolve([]);
                }
                reject(error || new Error(stderr));
            } else {
                if (!utils.base.isString(stdout)) {
                    return resolve([]);
                }

                var stdoutLines = stdout.split(/\n/g), pids = [];
                for (var i = 1, il = stdoutLines.length; i < il; i++) {
                    var pid = process.platform === 'win32'
                        ? (function (str) {return str ? str.slice(str.lastIndexOf(':') + 1) : '';})(stdoutLines[i].split(/\s+/)[2])
                        : stdoutLines[i].split(/\s+/)[1];
                    pid && pids.push(parseInt(pid));
                }

                var pids = utils.arrayHelper.distinctArray(pids, function (pid) {
                    return pid;
                });

                resolve(pids);
            }
        });
    });
}
