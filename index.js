#!/usr/bin/env node

'use strict';

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
  process.exit(0);
});
