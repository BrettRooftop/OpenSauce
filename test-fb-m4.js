import fs from 'fs';
import * as cheerio from 'cheerio';

let data = fs.readFileSync('fb-m.html', 'utf8');
const $ = cheerio.load(data);
const script35 = $('script').eq(35).html();
if (script35) {
    const urls = script35.match(/https:\\\/\\\/scontent[^\\]"]+/g);
    console.log("URLs:", urls?.length);
    if(urls) console.log(urls.slice(0, 10));
}
