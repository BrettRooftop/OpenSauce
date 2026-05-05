import axios from 'axios';
import * as cheerio from 'cheerio';

async function test() {
      try {
        const { data } = await axios.get('https://mbasic.facebook.com/WeatherServic', {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Symbian/3; Series60/5.2 NokiaN8-00/012.002; Profile/MIDP-2.1 Configuration/CLDC-1.1 ) AppleWebKit/533.4 (KHTML, like Gecko) NokiaBrowser/7.3.0 Mobile Safari/533.4 3gpp-gba',
            'Accept-Language': 'en-US,en;q=0.5'
          }
        });
        console.log("Success! length:", data.length);
        const $ = cheerio.load(data);
        console.log("Text snippet:", $('body').text().substring(0, 500));
        return;
      } catch(e) {
        console.error(e.response ? e.response.status : e.message);
      }
}
test();
