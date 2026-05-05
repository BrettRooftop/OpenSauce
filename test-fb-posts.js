import fs from 'fs';
import axios from 'axios';

async function test() {
  try {
    const { data } = await axios.get('https://www.facebook.com/WeatherServic/posts', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      }
    });
    fs.writeFileSync('fb-posts.html', data);
    console.log("Size:", data.length);
  } catch(e) {
    console.error(e.message);
  }
}
test();
