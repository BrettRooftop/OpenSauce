import fs from 'fs';

let data = fs.readFileSync('saws-warnings.html', 'utf8');
const searchString = '<img';
const matches = [...data.matchAll(new RegExp('.{0,80}' + searchString + '.{0,80}', 'gi'))];
console.log("matches:", matches.length);
console.log(matches.slice(0, 10).map(m => m[0]).join('\n-----\n'));
