import axios from 'axios';

async function test() {
  const instances = [
    'https://nitter.d420.de/SAWeatherServic/rss',
    'https://nitter.privacydev.net/SAWeatherServic/rss',
    'https://nitter.esmailelbob.xyz/SAWeatherServic/rss'
  ];
  
  for (const url of instances) {
    try {
      console.log("Trying", url);
      const { data } = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 5000 });
      console.log("Success:", url);
      console.log("Size:", data.length);
      return;
    } catch(e) {
      console.error(e.message);
    }
  }
}
test();
