import axios from 'axios';
import * as cheerio from 'cheerio';

async function test() {
  try {
    const { data } = await axios.get('https://mbasic.facebook.com/WeatherServic', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Mobile Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8'
      }
    });
    console.log("Size:", data.length);
    const $ = cheerio.load(data);
    console.log("Title:", $('title').text());
    // Find posts
    const spans = $('span, p').map((i, el) => $(el).text()).get().filter(t => t.toLowerCase().includes('weather'));
    console.log("Found mentions:", spans.slice(0, 5));
  } catch(e) {
    if (e.response) {
      console.error(e.response.status, e.response.statusText);
    } else {
      console.error(e.message);
    }
  }
}
test();
