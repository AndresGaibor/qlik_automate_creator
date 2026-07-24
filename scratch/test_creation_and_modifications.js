const fs = require('fs');
const path = require('path');
const https = require('https');

const TENANT_URL = 'https://l676lvg3emfvcq2.us.qlikcloud.com';
const API_KEY = 'eyJhbGciOiJFUzM4NCIsImtpZCI6ImRlZDYwZTdkLWQxZGUtNDgwNS05NWNiLTlmOWM4M2I3YmFlMCIsInR5cCI6IkpXVCJ9.eyJzdWJUeXBlIjoidXNlciIsInRlbmFudElkIjoidkd0b3VwSVVaWWNIcV82UTJNRm41ci1lREN1ZGlua2giLCJqdGkiOiJkZWQ2MGU3ZC1kMWRlLTQ4MDUtOTVjYi05ZjljODNiN2JhZTAiLCJhdWQiOiJxbGlrLmFwaSIsImlzcyI6InFsaWsuYXBpL2FwaS1rZXlzIiwic3ViIjoiNmE1NDM0YjNjMDBmOTg4ZDBmZjQ1M2FhIn0.v-OOIs-wM2tSurLmIkyjSXKl1hObfb5U4SLH4d4sTBv1TdFbhzhM-NY8n2TDMoVpW-dz-6LSWX0y8yHJ1cg8hFhwbPezrUiPQgLEH7PrLZqzMCHrlh4AbPwaJkytho86';
const TARGET_SPACE_ID = '6a57a14cf89e2c4d4b4d83af';

const CREATED_APP_ID = '34d272b9-8f60-40d7-93a3-a68c5591bd2d';
const CREATED_AUTOMATION_ID = 'cd035fef-2e74-4832-b869-8b73fb027187';

function qlikReq(method, endpoint, body = null) {
  return new Promise((resolve, reject) => {
    const url = endpoint.startsWith('http') ? endpoint : `${TENANT_URL}${endpoint}`;
    const urlObj = new URL(url);
    const postData = body ? JSON.stringify(body) : null;

    const options = {
      hostname: urlObj.hostname,
      port: 443,
      path: urlObj.pathname + urlObj.search,
      method: method,
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };

    if (postData) {
      options.headers['Content-Length'] = Buffer.byteLength(postData);
    }

    const req = https.request(options, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return qlikReq(method, res.headers.location, body).then(resolve).catch(reject);
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed, headers: res.headers });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data, headers: res.headers });
        }
      });
    });

    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

async function runRefinements() {
  console.log('================================================================');
  console.log('🔧 REFINING SCRIPT UPDATES & AUTOMATION RUNS');
  console.log('================================================================\n');

  // 1. UPDATE SCRIPT (POST /api/v1/apps/{appId}/scripts)
  console.log('1. Testing POST /api/v1/apps/{appId}/scripts...');
  const scriptContent = `///$tab Main
SET ThousandSep=',';
SET DecimalSep='.';
SET DateFormat='YYYY-MM-DD';

///$tab Script_API_Editado
// Modificado vía Qlik REST API
TRACE *** Script de prueba modificado con éxito ***;
LIB CONNECT TO [Bancolombia prueba:Postgres_BanColombia_Prueba];

[ventas_copia]:
NOCONCATENATE
LOAD [id], [fecha], [cliente], [ciudad], [producto], [total]
FROM "public"."ventas";

STORE [ventas_copia] INTO [lib://Bancolombia prueba:SFTP//upload/ventas_copia_api.csv] (txt);
DROP TABLE [ventas_copia];
`;

  const scriptRes = await qlikReq('POST', `/api/v1/apps/${CREATED_APP_ID}/scripts`, {
    script: scriptContent,
    versionMessage: 'Versión editada programáticamente'
  });
  console.log(`Status POST /scripts: ${scriptRes.status}`);
  if (scriptRes.status === 200 || scriptRes.status === 201) {
    console.log('✅ Script Posted Successfully!');
    console.log('Response:', scriptRes.data);
  } else {
    console.log('Response script:', scriptRes.data || scriptRes.raw);
  }

  // 2. READ BACK CURRENT SCRIPT
  console.log('\n2. Verifying script via GET /api/v1/apps/{appId}/scripts/current...');
  const getScriptRes = await qlikReq('GET', `/api/v1/apps/${CREATED_APP_ID}/scripts/current`);
  console.log(`Status GET /scripts/current: ${getScriptRes.status}`);
  if (getScriptRes.status === 200) {
    console.log('✅ Verified Load Script Content:');
    console.log((getScriptRes.data.script || '').substring(0, 500));
  }

  // 3. EXECUTE AUTOMATION WITH CONTEXT
  console.log(`\n3. Executing Automation with context "api" (POST /api/v1/automations/${CREATED_AUTOMATION_ID}/runs)...`);
  const runRes = await qlikReq('POST', `/api/v1/automations/${CREATED_AUTOMATION_ID}/runs`, {
    context: 'api'
  });
  console.log(`Status Run: ${runRes.status}`);
  if (runRes.status === 200 || runRes.status === 201) {
    console.log('✅ Automation Execution Started Successfully!');
    console.log('Execution details:', runRes.data);
  } else {
    console.log('Response run:', runRes.data || runRes.raw);
  }

  // 4. GET AUTOMATION RUNS HISTORY
  console.log(`\n4. Fetching Automation Runs History (GET /api/v1/automations/${CREATED_AUTOMATION_ID}/runs)...`);
  const runsListRes = await qlikReq('GET', `/api/v1/automations/${CREATED_AUTOMATION_ID}/runs`);
  console.log(`Status GET /runs: ${runsListRes.status}`);
  if (runsListRes.status === 200) {
    const runs = runsListRes.data.data || runsListRes.data || [];
    console.log(`Total runs history: ${runs.length}`);
    runs.forEach(r => {
      console.log(`  - Run ID: ${r.id}, Status: ${r.status}, ExecutedBy: ${r.executedById}, Context: ${r.context}`);
    });
  }
}

runRefinements();
