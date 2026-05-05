import axios from 'axios';
import * as cheerio from 'cheerio';

async function test() {
  const instances = [
    'https://nitter.cz/SAWeatherServic',
    'https://nitter.cz/SAWeatherServic/rss',
    'https://nitter.poast.org/SAWeatherServic',
    'https://nitter.net/SAWeatherServic',
  ];
  
  for (const url of instances) {
    try {
      console.log("Trying", url);
      const { data } = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 5000 });
      console.log("Success:", url);
      console.log("Size:", data.length);
      return;
    } catch(e) {
      console.error(e.message);
    }
  }
}
test();
