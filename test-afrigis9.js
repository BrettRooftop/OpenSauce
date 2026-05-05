import fs from 'fs';

async function parse() {
  const resp = await fetch('https://afrigis-developers-oas-specs.s3.af-south-1.amazonaws.com/weather/warnings-api.json');
  const openapi = await resp.json();
  
  const okResponse = openapi.paths['/v1/feed']['get'].responses['200'];
  let schema = okResponse.content['application/json'].schema;
  
  console.log(JSON.stringify(schema, null, 2));
  
  if (schema.$ref) {
      const ref = schema.$ref.replace('#/components/schemas/', '');
      console.log('Ref Schema:', JSON.stringify(openapi.components.schemas[ref], null, 2));
  }
}
parse();
