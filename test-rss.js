import axios from 'axios';

async function test() {
  try {
    const { data } = await axios.get('https://rsshub.app/twitter/user/SAWeatherServic');
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
