import fs from 'fs';
const data = fs.readFileSync('fb-plugin.html', 'utf-8');
const searchString = 'weather';
const matches = [...data.matchAll(new RegExp('.{0,80}' + searchString + '.{0,80}', 'gi'))];
console.log(matches.slice(0, 10).map(m => m[0]).join('\n-----\n'));
