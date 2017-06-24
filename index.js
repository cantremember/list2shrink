#!/usr/bin/env node

'use strict';

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
});

var cnt = 0;
var iDepth = 0;
var iLenBefore;
var sOutput;

const cr = '\n';

function spaces() {
  let s   = '';
  if (iDepth > 0) {
    s = ' '.repeat(iDepth);
  }
  return s;
}
function begin(sModule) {
  let s   = '{';
  iDepth += 2; 
  s      += cr +
            spaces() + "\"dependencies\": {";
  iDepth += 2;
  s += beginModule(sModule);
  return s;
}
function beginDependency(sModule) {
  let s   = ',' + cr +
            spaces() + "\"dependencies\": {";
  iDepth += 2;
  s += beginModule(sModule);
  return s;
}
function beginModule(sModule) {
  let aStr      = sModule.split('@');
  let sName     = aStr[0];
  let sVersion  = aStr[1];

  let s   = cr +
            spaces() + "\"" + sName + "\": {";
  iDepth += 2;
  s      += cr +
            spaces() + "\"version\": \"" + sVersion + "\"," +
            cr +
            spaces() + "\"from\": \""    + sModule + "\"";
  return s;
}
function endModule() {
  iDepth -= 2;
  let s   = cr + spaces() + '},'; 
  return s;
}
function endDependency() {
  let s = '';
  for (let i = 0; i < 2; i++) {
    iDepth -= 2;
    s      += cr + spaces() + '}';
  }
  return s;
}

rl.on('line', function(line) {
  let sLine     = line.toString();
  let aS        = sLine.split(' ');
  let sModule   = aS[aS.length - 1];
  let iLen      = Math.floor(sLine.lastIndexOf(sModule) / 2);
  let fProcess  = true;

  sOutput       = '';

  if (iLen === 0) {
    fProcess = false;
  }
  if (sModule === process.cwd()) {
    fProcess = false;
  }

  if (fProcess) {
    if (cnt === 0) {
      sOutput += begin(sModule);
    }
    else {
      if (iLen === iLenBefore) {
        sOutput += endModule();
        sOutput += beginModule(sModule);
      }
      else if (iLen > iLenBefore) {
        sOutput += beginDependency(sModule);
      }
      else if (iLen < iLenBefore) {
        for(let i = iLen; i < iLenBefore; i++) {
          sOutput += endDependency();
        }
        sOutput += endModule();
        sOutput += beginModule(sModule);
      }
    }

    iLenBefore = iLen;
    cnt++;
  }
  process.stdout.write(new Buffer(sOutput));
})
.on('close', function() {
  sOutput  = '';
  while (iDepth > 0) {
    iDepth -= 2;
    sOutput +=  cr + spaces() + '}'; 
  }
  sOutput += cr;
  process.stdout.write(new Buffer(sOutput));
  process.exit(0);
});
