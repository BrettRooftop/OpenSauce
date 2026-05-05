import fs from 'fs';
import * as cheerio from 'cheerio';

const data = fs.readFileSync('fb-touch.html', 'utf8');
const $ = cheerio.load(data);
$('script').each((i, el) => {
  const content = $(el).html();
  if (content && content.includes('require("TimeSliceImpl")')) {
    const matches = content.match(/"text":"(.*?)"/g);
    if(matches) console.log("Found text:", matches.slice(0, 10));
  }
});
