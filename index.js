#!/usr/bin/env node

'use strict';

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
});

var cnt = 0;
var iDepth = 0;
var iLenBefore;
var iSpacesBefore;
var sOutput;
var bEndDependencyBefore;

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
  for (let i = 0; i < 2; i++) {
    iDepth -= 2;
    s      += cr + ' '.repeat(iDepth) + '}';
  }
  return s;
}

rl.on('line', function(line) {
    let sLine     = line.toString();
    let aS        = sLine.split(' ');
    let sModule   = aS[aS.length - 1];
    let iLen      = Math.floor(sLine.lastIndexOf(sModule) / 2);
    let iSpaces   = 0;
    let sStr      = '';
    let ch        = aS[iLen - 2].slice(0,1);
    let chIndex   = sLine.lastIndexOf(ch);
    let bEndDependency = false;
    let bBoth     = false;
    let bSame     = false;

    sOutput       = '';

    if (ch.charCodeAt(0) === 96) {
      bEndDependency = true;
    }

    bBoth = bEndDependency && bEndDependencyBefore;
    bSame = (iLenBefore === iLen);

    while (sLine.charCodeAt(chIndex - 1) === 32 && iSpaces < 10) {
      iSpaces++;
      chIndex--;
    }

//    sStr += `${sLine} before=${iLenBefore} now=${iLen} ch=${ch} iSpacesBefore=${iSpacesBefore} bBoth = ${bBoth}`;
    sStr += `[${cnt}] - ${sModule} bSame=${bSame} iSpacesBefore=${iSpacesBefore} bBoth = ${bBoth}`;

  if (true) { //cnt < 40) {
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
  }

  iLenBefore = iLen;
  iSpacesBefore = iSpaces;
  bEndDependencyBefore = bEndDependency;
  cnt++;
  process.stdout.write(new Buffer(sOutput));
})
.on('close', function() {
  sOutput  = '';
  while (iDepth > 0) {
    iDepth -= 2;
    sOutput +=  cr + ' '.repeat(iDepth) + '}'; 
  }
  sOutput += cr;
  process.stdout.write(new Buffer(sOutput));
  process.exit(0);
});
