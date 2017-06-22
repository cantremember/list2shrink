#!/usr/bin/env node

'use strict';

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
});

const versionNumber = parseInt(process.version.substring(1).split('.')[0],10);
/*
let a = [];
if (versionNumber < 5) {
  a = ['-','+'];
}
else {
  a = ['|','m'];
}
*/
var cnt = 0;
var iDepth = 0;
var iLenBefore;

//const cr = String.fromCharCode(10);
const cr = '\n';

function begin(sModule) {
  let s   = '{';
  iDepth += 2; 
  s      += cr +
            ' '.repeat(iDepth) + "\"dependencies\": {";
  iDepth += 2;
  s += beginModule(sModule);
  return s;
}
function beginDependency(sModule) {
  let s   = ',' + cr +
            ' '.repeat(iDepth) + "\"dependencies\": {";
  iDepth += 2;
  s += beginModule(sModule);
  return s;
}
function beginModule(sModule) {
  let aStr      = sModule.split('@');
  let sName     = aStr[0];
  let sVersion  = aStr[1];

  let s   = cr +
            ' '.repeat(iDepth) + "\"" + sName + "\": {";
  iDepth += 2;
  s      += cr +
            ' '.repeat(iDepth) + "\"version\": \"" + sVersion + "\"," +
            cr +
            ' '.repeat(iDepth) + "\"from\": \""    + sModule + "\"";
  return s;
}
function endModule() {
  iDepth -= 2;
  let s   = cr + ' '.repeat(iDepth) + '},'; 
  return s;
}
function endDependency() {
  let s = '';
  for (let i = 0; i < 3; i++) {
    iDepth -= 2;
    s      += cr + ' '.repeat(iDepth) + '}';
  }
  s += ','
  return s;
}

rl.on('line', function(line) {
    let sOutput   = '';
    let sLine     = line.toString();
    let aS        = sLine.split(' ');
    let iLen      = aS.length;

    if (cnt === 0) {
      sOutput += begin(aS[iLen - 1]);
    }
    else {
//      if (iLen > 1 && cnt < 15) {
      let ch = aS[iLen - 2].slice(0, 1);
  //    let ch = aS[iLen - 2].slice(-1);
//      sOutput += `Line(${cnt}) | ${aS.length} | ${ch} | ${ch.charCodeAt(0)} | ${aS[aS.length - 1]}\n`;
  //      let ch = aS[iLen - 2].slice(0, 1);
  //      if (versionNumber < 5) {
  //      }
  //      let sOutput = `Line(${cnt}) | ${aS.length} | ${ch} | ${ch.charCodeAt(0)} | ${aS[aS.length - 1]}\n`;
        
        if (iLen === iLenBefore) {
          sOutput += endModule();
          sOutput += beginModule(aS[iLen - 1]);
        }
        else if (iLen > iLenBefore) {
          sOutput += beginDependency(aS[iLen - 1]);
        }
        else if (iLen < iLenBefore) {
          sOutput += endDependency();
          sOutput += beginModule(aS[iLen - 1]);
        }
      }
//    }

    iLenBefore = iLen;
    cnt++;
    process.stdout.write(new Buffer(sOutput));
})
.on('finish', function() {
  process.exit(0);
});
