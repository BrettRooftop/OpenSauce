import fs from 'fs';

let data = fs.readFileSync('fb-m.html', 'utf8');
let texts = data.match(/"text":"(.*?)"/g);
console.log("Texts:", texts?.length);
if (texts) {
    console.log(texts.slice(0, 10).join('\n'));
}

let uris = data.match(/"uri":"([^"]+)"/g);
console.log("URIs:", uris?.length);
if (uris) {
    console.log(uris.slice(0, 10).join('\n'));
}
