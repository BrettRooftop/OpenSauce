import * as cheerio from 'cheerio';
import fs from 'fs';

async function parse() {
  const resp = await fetch('https://developers.afrigis.co.za/oas3/weather-warnings-api/');
  const html = await resp.text();
  const $ = cheerio.load(html);
  
  // extract all text from main content area
  let content = $('body').text().replace(/\s+/g, ' ').trim();
  console.log(content.substring(0, 2000));
}
parse();
