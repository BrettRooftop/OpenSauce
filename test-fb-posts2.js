import fs from 'fs';
const data = fs.readFileSync('fb-posts.html', 'utf-8');
const searchString = 'scontent';
const matches = [...data.matchAll(new RegExp('.{0,80}' + searchString + '.{0,80}', 'gi'))];
console.log("matches:", matches.length);
if (matches.length > 0) {
   console.log(matches.slice(0, 5).map(m => m[0]).join('\n-----\n'));
}

const txt = data.match(/"text":"(.*?)"/g);
console.log("text:", txt?.length);
