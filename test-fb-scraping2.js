import fs from 'fs';
import * as cheerio from 'cheerio';

let data = fs.readFileSync('fb-touch.html', 'utf8');
const $ = cheerio.load(data);
console.log("Title:", $("title").text());
