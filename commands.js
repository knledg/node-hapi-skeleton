#!/usr/bin/env node

/* This script loads all the command scripts in /commands and will run a specific command based on command line input */
/* eslint-disable no-console, strict, no-process-exit */
'use strict';
require('babel-register');
require('server/bootstrap');

let glob = require('glob');
let path = require('path');
let program = require('commander');

let files = [];
files.push(...glob.sync(path.join(__dirname, './server/commands/*.js')));
files.forEach((file) => {
  require(file)(program);
});

program.parse(process.argv);

if (! process.argv.slice(2).length) {
  program.outputHelp();
  process.exit(1);
}
