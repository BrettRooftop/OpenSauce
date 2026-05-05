import axios from 'axios';
import * as cheerio from 'cheerio';

async function test() {
  const uas = [
     'Mozilla/5.0 (Windows NT 10.0; rv:109.0) Gecko/20100101 Firefox/112.0',
     'curl/7.68.0',
     'Googlebot/2.1 (+http://www.google.com/bot.html)'
  ];
  
  for (const ua of uas) {
      try {
        console.log("UA:", ua);
        const { data } = await axios.get('https://mbasic.facebook.com/WeatherServic?v=timeline', {
          headers: {
            'User-Agent': ua,
            'Accept-Language': 'en-US,en;q=0.5'
          }
        });
        console.log("Success! length:", data.length);
        const $ = cheerio.load(data);
        console.log("Text snippet:", $('body').text().substring(0, 100));
        return;
      } catch(e) {
        console.error(e.response ? e.response.status : e.message);
      }
  }
}
test();
