import axios from 'axios';
import * as cheerio from 'cheerio';
async function test() {
  try {
    const { data } = await axios.get('https://www.facebook.com/WeatherServic', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8'
      }
    });
    console.log("Size:", data.length);
    console.log("Has something?", data.includes('weather'));
  } catch(e) {
    console.error(e.message);
  }
}
test();
