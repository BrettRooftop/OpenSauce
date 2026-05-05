import fs from 'fs';
const data = fs.readFileSync('test-saws-map.js', 'utf8');

// The geojson or warnings data is likely stored in a javascript variable.
const matches = [...data.matchAll(/var\s+(\w+)\s*=\s*(\{[\s\S]{100,500}\})/g)];
console.log("matches:", matches.length);
if (matches.length > 0) {
  console.log(matches[0][0]);
}

// Check if there is data resembling GeoJSON
const featuresIndex = data.indexOf('"features"');
if (featuresIndex !== -1) {
  console.log("Found features at index:", featuresIndex);
  console.log(data.substring(featuresIndex - 50, featuresIndex + 500));
}
