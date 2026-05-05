import fs from 'fs';
import * as cheerio from 'cheerio';

let data = fs.readFileSync('fb-m.html', 'utf8');
const $ = cheerio.load(data);
const script35 = $('script').eq(35).html();
if (script35) {
    const scontent = script35.match(/scontent[a-zA-Z0-9\-\.\/\\]+/g);
    console.log("matches:", scontent?.length);
    if(scontent) console.log(scontent.slice(0, 10));
}
