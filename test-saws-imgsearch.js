import axios from 'axios';
import * as cheerio from 'cheerio';
import * as https from 'https';

async function test() {
  const agent = new https.Agent({ rejectUnauthorized: false });
  const { data } = await axios.get('https://www.weathersa.co.za/home/warnings', { httpsAgent: agent });
  const $ = cheerio.load(data);
  $('img').each((i, el) => {
     const src = $(el).attr('src');
     if (src && !src.includes('logo') && !src.includes('icon')) {
        console.log(src);
     }
  });
}
test();
