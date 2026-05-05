import fs from 'fs';
const data = fs.readFileSync('test-saws-map.js', 'utf8');

const regex = /\.setHTML\((.*?)\)/g;
const matches = [...data.matchAll(regex)];

console.log("Found setHTML:", matches.length);
if (matches.length > 0) {
  for(let i=0; i<Math.min(10, matches.length); i++) {
     console.log("----");
     console.log(matches[i][1]);
  }
}
