import * as cheerio from 'cheerio';

async function parse() {
  const resp = await fetch('https://developers.afrigis.co.za/oas3/weather-warnings-api/');
  const html = await resp.text();
  
  const $ = cheerio.load(html);
  $('script').each((i, el) => {
    let scriptContent = $(el).html() || '';
    if (scriptContent.includes('SwaggerUIBundle')) {
        const matches = scriptContent.match(/url:\s*['"]([^'"]+)['"]/);
        console.log("Found URL:", matches ? matches[1] : null);
        console.log("Full swagger bundle:", scriptContent.match(/SwaggerUIBundle\(\{([^}]+)\}/)?.[1]);
    }
  });
}
parse();
