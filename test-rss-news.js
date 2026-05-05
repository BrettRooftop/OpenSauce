import axios from 'axios';
import * as cheerio from 'cheerio';

async function test() {
  try {
    const { data } = await axios.get('https://news.google.com/rss/search?q=%22South+African+Weather+Service%22+warning&hl=en-ZA&gl=ZA&ceid=ZA:en');
    console.log("Size:", data.length);
    console.log(data.substring(0, 500));
  } catch(e) {
    if (e.response) {
      console.error(e.response.status, e.response.statusText);
    } else {
      console.error(e.message);
    }
  }
}
test();
