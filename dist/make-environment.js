#!/usr/bin/env node
var ncp = require('ncp').ncp;
var path = require('path');
var sourcePath = path.join(process.cwd(), "node_modules", "magma-canvas", "src", "dist");
var destPath = path.join(process.cwd(), "dist");
ncp.limit = 16;
ncp(sourcePath, destPath, function (err) {
    if (err) {
        return console.error(err);
    }
    console.log('Environment folder created at ./dist/');
});
