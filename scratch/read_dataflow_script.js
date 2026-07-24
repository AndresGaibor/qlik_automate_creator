const fs = require('fs');
const path = require('path');
const https = require('https');

const TENANT_URL = 'https://l676lvg3emfvcq2.us.qlikcloud.com';
const API_KEY = 'eyJhbGciOiJFUzM4NCIsImtpZCI6ImRlZDYwZTdkLWQxZGUtNDgwNS05NWNiLTlmOWM4M2I3YmFlMCIsInR5cCI6IkpXVCJ9.eyJzdWJUeXBlIjoidXNlciIsInRlbmFudElkIjoidkd0b3VwSVVaWWNIcV82UTJNRm41ci1lREN1ZGlua2giLCJqdGkiOiJkZWQ2MGU3ZC1kMWRlLTQ4MDUtOTVjYi05ZjljODNiN2JhZTAiLCJhdWQiOiJxbGlrLmFwaSIsImlzcyI6InFsaWsuYXBpL2FwaS1rZXlzIiwic3ViIjoiNmE1NDM0YjNjMDBmOTg4ZDBmZjQ1M2FhIn0.v-OOIs-wM2tSurLmIkyjSXKl1hObfb5U4SLH4d4sTBv1TdFbhzhM-NY8n2TDMoVpW-dz-6LSWX0y8yHJ1cg8hFhwbPezrUiPQgLEH7PrLZqzMCHrlh4AbPwaJkytho86';

const dataflowAppIds = [
  { name: 'BanColombia_CargaIncremental', id: 'c354be8c-9ed9-4467-ba2f-bfb00f19b4a5' },
  { name: 'BanColombia_Prueba_1', id: 'f16387d7-63af-484f-b267-f3856540dbe6' },
  { name: 'BanCol_Test_API', id: 'd7bbc53c-3087-4c21-a449-e2ca2c62d151' },
  { name: 'Prueba de conexion S3', id: '7f4100b9-90d3-4ca3-b1d5-e249da1cf7de' }
];

function qlikGet(urlOrEndpoint) {
  return new Promise((resolve, reject) => {
    const url = urlOrEndpoint.startsWith('http') ? urlOrEndpoint : `${TENANT_URL}${urlOrEndpoint}`;
    const options = {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Accept': 'application/json'
      }
    };
    https.get(url, options, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return qlikGet(res.headers.location).then(resolve).catch(reject);
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function main() {
  console.log('==================================================');
  console.log('📜 READING DATAFLOW LOAD SCRIPTS VIA QLIK REST API');
  console.log('==================================================\n');

  for (const df of dataflowAppIds) {
    console.log(`\n--------------------------------------------------`);
    console.log(`Dataflow: "${df.name}" (ID: ${df.id})`);
    console.log(`Endpoint: /api/v1/apps/${df.id}/scripts/current`);
    console.log(`--------------------------------------------------`);

    const resCurrent = await qlikGet(`/api/v1/apps/${df.id}/scripts/current`);
    console.log(`Status /scripts/current: ${resCurrent.status}`);

    if (resCurrent.status === 200) {
      const scriptText = resCurrent.data.script || resCurrent.data.scriptText || resCurrent.raw || JSON.stringify(resCurrent.data);
      console.log('\n--- LOAD SCRIPT CONTENT ---');
      console.log(scriptText.substring(0, 1500));
      if (scriptText.length > 1500) console.log('\n... [TRUNCATED] ...');
    } else {
      console.log('Response /scripts/current:', resCurrent.data || resCurrent.raw);
      // Try /api/v1/apps/${df.id}/scripts
      console.log(`Trying /api/v1/apps/${df.id}/scripts...`);
      const resList = await qlikGet(`/api/v1/apps/${df.id}/scripts`);
      console.log(`Status /scripts: ${resList.status}`);
      console.log('Response /scripts:', resList.data || resList.raw);
    }
  }
}

main();
