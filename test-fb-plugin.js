import fs from 'fs';
import axios from 'axios';
import * as cheerio from 'cheerio';

async function test() {
  try {
    const { data } = await axios.get('https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FWeatherServic&tabs=timeline&width=500&height=600&small_header=true&adapt_container_width=true&hide_cover=true&show_facepile=false&appId');
    fs.writeFileSync('fb-plugin.html', data);
    const $ = cheerio.load(data);
    
    // Facebook page plugins usually load data via big nested JSON blobs in script tags.
    // Let's try to extract image URLs and text.
    console.log("length:", data.length);
  } catch (e) {
    console.error(e.message);
  }
}
test();
