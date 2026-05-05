import fs from 'fs';

let data = fs.readFileSync('fb-touch.html', 'utf8');
const matches = [...data.matchAll(new RegExp('https://scontent[^"\\\\]*', 'gi'))];
console.log("Images found:", matches.length);
console.log(matches.slice(0, 10).map(m => m[0]).join('\n-----\n'));
