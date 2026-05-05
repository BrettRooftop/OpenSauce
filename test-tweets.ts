import axios from 'axios';
import * as cheerio from 'cheerio';
axios.get('https://syndication.twitter.com/srv/timeline-profile/screen-name/SAWeatherServic?showTweets=true&showReplies=false&t='+Date.now()).then(r => {
  const $ = cheerio.load(r.data);
  const nextData = $('script#__NEXT_DATA__').html();
  if (nextData) {
    const json = JSON.parse(nextData);
    const tweets = json?.props?.pageProps?.timeline?.entries || [];
    tweets.forEach((t: any) => {
      const tweetId = t.content?.tweet?.id_str;
      console.log(t.content?.tweet?.created_at, tweetId);
    });
  }
}).catch(e => console.log(e.message));
