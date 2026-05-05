import fs from 'fs';
import * as cheerio from 'cheerio';

const data = fs.readFileSync('saws-warnings.html', 'utf8');
const $ = cheerio.load(data);
let out = '';
$('script').each((i, el) => {
  const code = $(el).html();
  if (code && code.includes('mapid')) out += code + '\n\n';
});
fs.writeFileSync('test-saws-map.js', out);
console.log("Wrote test-saws-map.js, length:", out.length);
