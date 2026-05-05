import axios from 'axios';
import * as https from 'https';

async function test() {
  const agent = new https.Agent({ rejectUnauthorized: false });
  const { data } = await axios.get('https://www.weathersa.co.za/home/warnings', { httpsAgent: agent });
  
  const matches = [...data.matchAll(/\.setHTML\('(.*?)'\s*\+\s*"<b>"\s*\+\s*"(.*?)"\s*\+\s*"<\/b>"\s*\+\s*"<br \/>"\s*\+"<b>Headline:<\/b>\s*"\s*\+\s*"(.*?)"\s*\+\s*"<br \/><b>Warning Level:<\/b>\s*"\s*\+\s*"(.*?)"\s*\+\s*"\s*<br \/> <b> Start Time:<\/b>\s*"\s*\+\s*"(.*?)"\s*\+\s*"\s*<br \/> <b> End Time:<\/b>\s*"\s*\+\s*"(.*?)"\s*\+\s*"<br \/> <b>Impact:<\/b>\s*"\s*\+\s*"(.*?)"\s*\+\s*"<br \/> <b>Instruction:<\/b>\s*"\s*\+\s*"(.*?)"\)/g)];

  console.log("Parsed alerts:", matches.length);
  if (matches.length > 0) {
      const alert = {
          area: matches[0][2],
          headline: matches[0][3],
          level: matches[0][4],
          startTime: matches[0][5],
          endTime: matches[0][6],
          impact: matches[0][7],
          instruction: matches[0][8].replace(/&#xD;&#xA;/g, '\n'),
      }
      console.log(alert);
  }
}
test();
