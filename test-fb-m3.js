import fs from 'fs';
import * as cheerio from 'cheerio';

let data = fs.readFileSync('fb-m.html', 'utf8');
const $ = cheerio.load(data);
$('script').each((i, el) => {
    let html = $(el).html();
    if (html && html.length > 1000) {
        console.log("Script", i, "length:", html.length);
        console.log(html.substring(0, 100) + '...\n\n');
    }
})
