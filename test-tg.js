import axios from 'axios';
import * as cheerio from 'cheerio';

async function test() {
  try {
    const { data } = await axios.get('https://t.me/s/afriwx', {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    });
    const $ = cheerio.load(data);
    $('.tgme_widget_message').each((i, el) => {
      const text = $(el).find('.tgme_widget_message_text').text();
      const photo = $(el).find('.tgme_widget_message_photo_wrap').css('background-image');
      if (text.toLowerCase().includes('warning') || text.toLowerCase().includes('saws') || photo) {
        console.log("Found post:");
        console.log("Text:", text.substring(0, 50));
        console.log("Image:", photo);
        console.log("---");
      }
    });
  } catch(e) {
    console.error(e.message);
  }
}
test();
