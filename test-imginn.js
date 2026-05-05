import axios from 'axios';
import * as cheerio from 'cheerio';

async function test() {
  try {
    const { data } = await axios.get('https://imginn.com/saweatherservice/', {
       headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    });
    console.log("Size:", data.length);
    const $ = cheerio.load(data);
    const imgs = [];
    $('.item img').each((i, el) => {
        imgs.push($(el).attr('src'));
    });
    console.log("Found imgs:", imgs.slice(0, 5));
  } catch(e) {
    console.error(e.response ? e.response.status : e.message);
  }
}
test();
