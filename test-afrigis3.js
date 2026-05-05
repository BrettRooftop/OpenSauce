import * as cheerio from 'cheerio';

async function parse() {
  const resp = await fetch('https://developers.afrigis.co.za/oas3/weather-warnings-api/');
  const html = await resp.text();
  
  // extract URLs from html source
  const urls = html.match(/https:\/\/afrigis-developers-oas-specs[^"'\s]+/g);
  console.log(Array.from(new Set(urls)));
}
parse();
