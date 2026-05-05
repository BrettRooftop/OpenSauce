import fs from 'fs';
const data = fs.readFileSync('fb-posts.html', 'utf-8');
const txt = data.match(/"text":"(.*?)"/g);
if (txt) {
   console.log(txt.join('\n'));
}
