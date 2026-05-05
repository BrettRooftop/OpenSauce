import fs from 'fs';

let data = fs.readFileSync('saws-warnings.html', 'utf8');
const searchString = 'warning';
const matches = [...data.matchAll(new RegExp('.{0,50}' + searchString + '.{0,50}', 'gi'))];
console.log(matches.slice(0, 10).map(m => m[0]).join('\n-----\n'));
