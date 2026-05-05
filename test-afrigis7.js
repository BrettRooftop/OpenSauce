import * as fs from 'fs';

async function parse() {
  const resp = await fetch('https://afrigis-developers-oas-specs.s3.af-south-1.amazonaws.com/weather/warnings-api.json');
  const json = await resp.text();
  console.log(json.substring(0, 1500));
}
parse();
