import fs from 'fs';

async function parse() {
  const resp = await fetch('https://afrigis-developers-oas-specs.s3.af-south-1.amazonaws.com/weather/warnings-api.json');
  const openapi = await resp.json();
  
  console.log('--- Paths ---');
  for (const [path, methods] of Object.entries(openapi.paths)) {
    for (const [method, details] of Object.entries(methods)) {
      console.log(`${method.toUpperCase()} ${path}`);
      console.log(`Summary: ${details.summary || 'N/A'}`);
      console.log(`Description: ${details.description || 'N/A'}`);
      if (details.parameters) {
        console.log(`Parameters: ${details.parameters.map(p => p.name).join(', ')}`);
      }
      console.log('---');
    }
  }
}
parse();
