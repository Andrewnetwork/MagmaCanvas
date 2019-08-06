#!/usr/bin/env node
var ncp = require('ncp').ncp;
let path = require('path');
let sourcePath = path.join(process.cwd(),"node_modules","magma-canvas","src","dist");
let destPath = path.join(process.cwd(),"dist");

ncp.limit = 16;
 
ncp(sourcePath, destPath, function (err: any) {
    if (err) {
    return console.error(err);
    }
    console.log('Environment folder created at ./dist/');
});