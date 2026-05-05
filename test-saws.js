import axios from 'axios';
import * as cheerio from 'cheerio';
import * as https from 'https';
import * as fs from 'fs';

async function test() {
  try {
    const agent = new https.Agent({ rejectUnauthorized: false });
    const { data } = await axios.get('https://www.weathersa.co.za/home/warnings', { httpsAgent: agent });
    fs.writeFileSync('saws-warnings.html', data);
    console.log("Written to saws-warnings.html");
  } catch(e) {
    console.error(e.message);
  }
}
test();
