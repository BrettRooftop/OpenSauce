import fs from 'fs';
const data = fs.readFileSync('test-saws-map.js', 'utf8');

const regex = /"properties"\s*:\s*(\{[\s\S]{10,800}\})/g;
const matches = [...data.matchAll(regex)];

console.log("Found properties:", matches.length);
if (matches.length > 0) {
  for(let i=0; i<Math.min(3, matches.length); i++) {
     console.log("----");
     console.log(matches[i][0]);
  }
}
