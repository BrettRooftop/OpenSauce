import fs from 'fs';
import axios from 'axios';

async function test() {
  try {
    const { data } = await axios.get('https://m.facebook.com/WeatherServic', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      }
    });
    fs.writeFileSync('fb-m.html', data);
    console.log("Size:", data.length);
  } catch(e) {
    console.error(e.response ? e.response.status : e.message);
  }
}
test();
