import fetch from 'node-fetch';

async function testSpecs() {
  const possibilities = [
    'https://afrigis-developers-oas-specs.s3.af-south-1.amazonaws.com/weather-warnings-api.json',
    'https://afrigis-developers-oas-specs.s3.af-south-1.amazonaws.com/weather-warnings.json',
    'https://afrigis-developers-oas-specs.s3.af-south-1.amazonaws.com/weather.json',
    'https://developers.afrigis.co.za/wp-content/uploads/oas/weather-warnings-api.json'
  ];
  
  for (const url of possibilities) {
    const res = await globalThis.fetch(url);
    console.log(url, res.status);
    if(res.status === 200) {
        console.log((await res.text()).substring(0, 500));
    }
  }
}
testSpecs();
