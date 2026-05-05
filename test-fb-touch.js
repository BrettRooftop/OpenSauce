import axios from 'axios';
import * as cheerio from 'cheerio';

async function test() {
  try {
    const { data } = await axios.get('https://touch.facebook.com/WeatherServic', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html'
      }
    });
    console.log("Size:", data.length);
  } catch(e) {
    console.error(e.response ? e.response.status : e.message);
  }
}
test();
