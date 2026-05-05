import fs from 'fs';
import * as cheerio from 'cheerio';

let data = fs.readFileSync('fb-m.html', 'utf8');
const $ = cheerio.load(data);
console.log("Title:", $("title").text());

const posts = [];
$('div.story_body_container').each((i, el) => {
    const text = $(el).text();
    posts.push(text);
});
console.log("posts:", posts.length);
if (posts.length) console.log(posts[0].substring(0, 100));
