import fs from 'fs';

let data = fs.readFileSync('fb-touch.html', 'utf8');
const jpgMatches = [...data.matchAll(new RegExp('https://[^"&<\\\\]*?\\.jpg', 'gi'))];
console.log("JPGs found:", jpgMatches.length);
console.log(jpgMatches.slice(0, 10).map(m => m[0]).join('\n-----\n'));
