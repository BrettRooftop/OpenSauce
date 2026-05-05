import fs from 'fs';

async function parse() {
  const resp = await fetch('https://afrigis-developers-oas-specs.s3.af-south-1.amazonaws.com/weather/warnings-api.json');
  const openapi = await resp.json();
  
  console.log(JSON.stringify(openapi.components.schemas['Result'], null, 2));
}
parse();
