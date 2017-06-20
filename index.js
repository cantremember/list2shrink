#!/usr/bin/env node

'use strict';

let versionNumber = parseInt(process.version.substring(1).split('.')[0],10);
let a = [];
if (versionNumber < 5) {
  a = ['-','+'];
}
else {
  a = ['|','m'];
}

process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdin.on('data', function(data) {
    let str = data.toString();
    let str2 = '';
    for (let i = 0; i < str.length; i++) {
      str2 += str[i];
      str2 += '('+str.charCodeAt(i)+')';
    }
    process.stdout.write(new Buffer(str2));
})
.on('finish', function() {
  console.log(JSON.stringify(a,null,2));
  process.exit(0);
});
