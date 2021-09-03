#!/usr/bin/env node

const cpx = require("cpx");
const fs = require('fs');
const path = require('path');
const Transform = require("stream").Transform;

let rawdata = fs.readFileSync(path.join(__dirname, "libs.json"));
let libsdata = JSON.parse(rawdata);

console.log(`Copying ${libsdata.length} file sets...`);

function copyAsync(cmdlist) {
  if(cmdlist.length == 0) return;
  let cmd = cmdlist.shift();
  let replaceInfo = '';
  if(cmd.replace) {
    replaceInfo = '(REPLACE)';
  }
  if (cmd.from.includes('node_modules')) {
    console.log('resolving', cmd.from);
    const paths = cmd.from.split('/').filter(Boolean);
    console.log('paths', paths);
    const idx = paths.indexOf('node_modules');
    let modulename = paths[idx+1];
    let scoped = false;
    if (modulename.startsWith('@')) {
      scoped = true;
      modulename = path.join(modulename, paths[idx+2]);
    }
    console.log('module name', modulename, idx+scoped?2:1);
    const newpath = path.resolve(__dirname + "/../", path.dirname(require.resolve(`${modulename}/package.json`)));
    console.log('newpath', newpath);
    paths.splice(idx, scoped ? 3 : 2, newpath);
    console.log('new paths', paths);
    cmd.from = paths.join('/');
  } else {
    cmd.from = path.resolve(__dirname + "/../" + cmd.from);
  }
  console.log(`  ${cmd.from} -> ${cmd.to} ${replaceInfo}`);
  let from = cmd.from;//path.resolve(__dirname + "/../" + cmd.from);
  let to = path.resolve(__dirname + "/../" + cmd.to);
  let opts = {};

  if(cmd.replace) {
    opts.transform = (filename) => new Transform({
      writableObjectMode: true,
      transform(chunk, encoding, callback) {
        let pattern;
        for(let replace of cmd.replace) {
          patten = new RegExp(replace.pattern);
          if(patten.test(filename)) {
            if(process.env[replace.env] === undefined) {
              console.warn(`Warning: No ENV "${replace.env}" is defined. Replacement for "${replace.match}" in ${filename} cannot be done`);
              continue;
            }
            let text = chunk.toString(encoding);
            pattern = new RegExp(replace.match, 'g');
            text = text.replace(pattern, process.env[replace.env]);
            chunk = Buffer.from(text);
          }
        }
        callback(null, chunk);
      }
    });
  }
  console.log('cpx==>', from, to, opts);
  cpx.copy(from, to, opts, (er) => console.log('er', er) || copyAsync(cmdlist));
}

copyAsync(libsdata);

console.log("Done");
