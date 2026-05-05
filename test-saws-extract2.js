import fs from 'fs';
import * as cheerio from 'cheerio';

const data = fs.readFileSync('saws-warnings.html', 'utf8');
const $ = cheerio.load(data);
console.log("Text content of the warnings part or main body:");
console.log($('body').text().split('\n').filter(l => l.trim().length > 10).slice(0, 50).map(l => l.trim()).join('\n'));
