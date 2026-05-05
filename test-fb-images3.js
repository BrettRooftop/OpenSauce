import fs from 'fs';

let data = fs.readFileSync('fb-touch.html', 'utf8');
const searchString = 'https:\\\\/\\\\/scontent';
const matches = [...data.matchAll(new RegExp('.{0,50}scontent.{0,50}', 'gi'))];
console.log("matches:", matches.length);
console.log(matches.slice(0, 10).map(m => m[0]).join('\n-----\n'));
