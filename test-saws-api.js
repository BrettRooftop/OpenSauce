import fs from 'fs';

let data = fs.readFileSync('saws-warnings.html', 'utf8');
const searchString = 'api';
const matches = [...data.matchAll(new RegExp('.{0,80}' + searchString + '.{0,80}', 'gi'))];
console.log(matches.slice(0, 20).map(m => m[0]).join('\n-----\n'));
