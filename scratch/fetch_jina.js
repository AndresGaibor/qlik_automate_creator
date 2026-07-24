const fs = require('fs');
const path = require('path');
const https = require('https');

const targetUrl = 'https://r.jina.ai/https://qlik.dev/apis/rest/analytics/apps/';
const outputFile = path.resolve(__dirname, '../docs/endpoints/analytics-apps.md');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchUrl(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed status ${res.statusCode}`));
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function main() {
  console.log(`Fetching ${targetUrl}...`);
  try {
    const data = await fetchUrl(targetUrl);
    fs.mkdirSync(path.dirname(outputFile), { recursive: true });
    fs.writeFileSync(outputFile, data, 'utf8');
    console.log(`Successfully saved ${data.length} bytes to ${outputFile}`);
  } catch (err) {
    console.error('Error fetching Jina URL:', err.message);
  }
}

main();
