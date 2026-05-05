import * as cheerio from 'cheerio';

async function parse() {
  const resp = await fetch('https://developers.afrigis.co.za/oas3/weather-warnings-api/');
  const html = await resp.text();
  
  // print all scripts containing 'url' or 'swagger'
  const $ = cheerio.load(html);
  $('script').each((i, el) => {
    let scriptContent = $(el).html() || '';
    if (scriptContent.toLowerCase().includes('swagger') || scriptContent.toLowerCase().includes('openapi') || scriptContent.includes('.json')) {
      console.log(`\n\n--- Script ${i} ---`);
      console.log(scriptContent.substring(0, 1000));
    }
  });
}
parse();
