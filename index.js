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
var iSpacesBefore;

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
    let sOutput   = '';
    let sLine     = line.toString();
    let aS        = sLine.split(' ');
    let iLen      = aS.length;
    let sModule   = aS[iLen - 1];
    let iSpaces   = 0;
    let sStr      = '';
    let ch        = aS[iLen - 2].slice(0,1);
    let chIndex   = sLine.lastIndexOf(ch);

    while (sLine.charCodeAt(chIndex - 1) === 32 && iSpaces < 10) {
      iSpaces++;
      chIndex--;
    }

    sStr += `${sLine} before=${iLenBefore} now=${iLen} ch=${ch} iSpacesBefore=${iSpacesBefore}`;

    /*
    if (versionNumber < 5) {
      ch          = aS[iLen - 2].slice(-1);
    }
    */
//      sOutput += `Line(${cnt}) | ${aS.length} | ${ch} | ${ch.charCodeAt(0)} | ${aS[aS.length - 1]}\n`;
  //      let ch = aS[iLen - 2].slice(0, 1);
  //      if (versionNumber < 5) {
  //      }
  //      let sOutput = `Line(${cnt}) | ${aS.length} | ${ch} | ${ch.charCodeAt(0)} | ${aS[aS.length - 1]}\n`;
        
    // ok, Einstein.  Use lastIndexOf.  sModule, then second to last
    // then last.  Then find the spaces.

    
       /*
    if (iLen > 2) {
      let sStr3 = aS[iLen - 3];
      let iLen3 = sLine.lastIndexOf(sStr3);
      let sStr2 = aS[iLen - 2];
      let iLen2 = sLine.lastIndexOf(sStr2);
      let iLen1 = sLine.lastIndexOf(sModule);
      let iLenX = aS[iLen - 3].length;
      let iSpaces = iLen2 - iLen3 + iLenX
      sStr = `${sModule}(${iLen1})  ${sStr2}(${iLen2})  ${sStr3}(${iLen3}) spaces=${iSpaces}`;
    }
   */
    if (true) { //cnt < 40) {
      if (cnt === 0) {
        sOutput += begin(sModule);
      }
      else {
//        sOutput += sStr;
        if (iLen === iLenBefore) {
          sOutput += endModule();
          sOutput += beginModule(sModule);
        }
        else if (iLen > iLenBefore) {
          sOutput += beginDependency(sModule);
        }
        else if (iLen < iLenBefore) {
          for(let i = 0; i < iSpacesBefore; i += 2) {
            sOutput += endDependency();
          }
          sOutput += endModule();
          sOutput += beginModule(sModule);
        }
      }
    }

  iLenBefore = iLen;
  iSpacesBefore = iSpaces;
  cnt++;
  process.stdout.write(new Buffer(sOutput));
})
.on('finish', function() {
  process.exit(0);
});
