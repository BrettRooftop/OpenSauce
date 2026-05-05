import fs from 'fs';

let data = fs.readFileSync('saws-warnings.html', 'utf8');
const searchString = 'geojson';
const matches = [...data.matchAll(new RegExp('.{0,250}' + searchString + '.{0,250}', 'gi'))];
console.log(matches.slice(0, 3).map(m => m[0]).join('\n-----\n'));
