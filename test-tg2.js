import fs from 'fs';
import axios from 'axios';

async function test() {
  try {
    const { data } = await axios.get('https://t.me/s/afriwx', {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    });
    fs.writeFileSync('tg-afriwx.html', data);
    console.log("Size:", data.length);
  } catch(e) {
    console.error(e.message);
  }
}
test();
