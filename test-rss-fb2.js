import axios from 'axios';

async function test() {
  const instances = [
    'https://rsshub.rssforever.com/facebook/page/WeatherServic',
    'https://hub.slarker.me/facebook/page/WeatherServic',
    'https://rsshub.app/facebook/page/WeatherServic',
    'https://feed.inoreader.com/feed/https://www.facebook.com/WeatherServic'  
  ];
  
  for (const url of instances) {
    try {
      console.log("Trying", url);
      const { data } = await axios.get(url, { timeout: 5000 });
      console.log("Success:", url);
      console.log(data.substring(0, 500));
      return;
    } catch(e) {
      console.error(e.message);
    }
  }
}
test();
