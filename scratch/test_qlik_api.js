const fs = require('fs');
const path = require('path');
const https = require('https');

const TENANT_URL = 'https://l676lvg3emfvcq2.us.qlikcloud.com';
const API_KEY = 'eyJhbGciOiJFUzM4NCIsImtpZCI6ImRlZDYwZTdkLWQxZGUtNDgwNS05NWNiLTlmOWM4M2I3YmFlMCIsInR5cCI6IkpXVCJ9.eyJzdWJUeXBlIjoidXNlciIsInRlbmFudElkIjoidkd0b3VwSVVaWWNIcV82UTJNRm41ci1lREN1ZGlua2giLCJqdGkiOiJkZWQ2MGU3ZC1kMWRlLTQ4MDUtOTVjYi05ZjljODNiN2JhZTAiLCJhdWQiOiJxbGlrLmFwaSIsImlzcyI6InFsaWsuYXBpL2FwaS1rZXlzIiwic3ViIjoiNmE1NDM0YjNjMDBmOTg4ZDBmZjQ1M2FhIn0.v-OOIs-wM2tSurLmIkyjSXKl1hObfb5U4SLH4d4sTBv1TdFbhzhM-NY8n2TDMoVpW-dz-6LSWX0y8yHJ1cg8hFhwbPezrUiPQgLEH7PrLZqzMCHrlh4AbPwaJkytho86';
const TARGET_SPACE_ID = '6a57a14cf89e2c4d4b4d83af';

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

async function runTests() {
  const report = {};
  console.log('==================================================');
  console.log('🚀 TESTING QLIK CLOUD REST API (Controlled / GET)');
  console.log(`Tenant: ${TENANT_URL}`);
  console.log(`Target Space: ${TARGET_SPACE_ID}`);
  console.log('==================================================\n');

  // 1. Current User Info
  console.log('1. Fetching current user info (/api/v1/users/me)...');
  const meRes = await qlikGet('/api/v1/users/me');
  console.log(`Status: ${meRes.status}`);
  if (meRes.status === 200) {
    console.log(`User Name: ${meRes.data.name}, ID: ${meRes.data.id}`);
    report.user = meRes.data;
  } else {
    console.error('Failed to authenticate:', meRes);
    return;
  }

  // 2. Space Info
  console.log(`\n2. Fetching space details (/api/v1/spaces/${TARGET_SPACE_ID})...`);
  const spaceRes = await qlikGet(`/api/v1/spaces/${TARGET_SPACE_ID}`);
  console.log(`Status: ${spaceRes.status}`);
  if (spaceRes.status === 200) {
    console.log(`Space Name: "${spaceRes.data.name}", Type: "${spaceRes.data.type}"`);
    report.space = spaceRes.data;
  } else {
    console.log('Space response:', spaceRes.data || spaceRes.raw);
  }

  // 3. Catalog Items in Space
  console.log(`\n3. Fetching catalog items (/api/v1/items?spaceId=${TARGET_SPACE_ID})...`);
  const itemsRes = await qlikGet(`/api/v1/items?spaceId=${TARGET_SPACE_ID}&limit=100`);
  console.log(`Status: ${itemsRes.status}`);
  if (itemsRes.status === 200 && itemsRes.data.data) {
    console.log(`Found ${itemsRes.data.data.length} items in space:`);
    itemsRes.data.data.forEach(item => {
      console.log(`  - [${item.resourceType}] "${item.name}" (ID: ${item.resourceId || item.id})`);
    });
    report.items = itemsRes.data.data;
  } else {
    console.log('Items response:', itemsRes.data || itemsRes.raw);
  }

  // 4. Automations in Tenant / Space
  console.log(`\n4. Fetching automations (/api/v1/automations)...`);
  const autoRes = await qlikGet(`/api/v1/automations?limit=100`);
  console.log(`Status: ${autoRes.status}`);
  if (autoRes.status === 200) {
    const list = autoRes.data.data || autoRes.data || [];
    const spaceAutomations = list.filter(a => a.spaceId === TARGET_SPACE_ID || a.space_id === TARGET_SPACE_ID);
    console.log(`Total automations in tenant: ${list.length}`);
    console.log(`Automations in target space (${TARGET_SPACE_ID}): ${spaceAutomations.length}`);
    list.forEach(a => {
      console.log(`  - Automation: "${a.name || a.title}" (ID: ${a.id}, SpaceId: ${a.spaceId || a.space_id || 'personal'})`);
    });
    report.automations = { total: list.length, spaceAutomations };
  } else {
    console.log('Automations response:', autoRes.data || autoRes.raw);
  }

  // 5. Workflows Automations
  console.log(`\n5. Fetching workflows automations (/api/v1/workflows/automations)...`);
  const wfRes = await qlikGet(`/api/v1/workflows/automations?limit=100`);
  console.log(`Status: ${wfRes.status}`);
  if (wfRes.status === 200) {
    const list = wfRes.data.data || [];
    console.log(`Total workflows automations: ${list.length}`);
    list.forEach(w => {
      console.log(`  - Workflow: "${w.name}" (ID: ${w.id}, Space: ${w.spaceId || 'personal'})`);
    });
  } else {
    console.log('Workflows response:', wfRes.data || wfRes.raw);
  }

  // 6. Apps in Space
  console.log(`\n6. Fetching apps (/api/v1/apps?spaceId=${TARGET_SPACE_ID})...`);
  const appsRes = await qlikGet(`/api/v1/apps?spaceId=${TARGET_SPACE_ID}`);
  console.log(`Status: ${appsRes.status}`);
  if (appsRes.status === 200 && Array.isArray(appsRes.data)) {
    console.log(`Found ${appsRes.data.length} apps in space:`);
    appsRes.data.forEach(app => {
      console.log(`  - App: "${app.attributes.name}" (ID: ${app.attributes.id})`);
    });
    report.apps = appsRes.data;
  } else {
    console.log('Apps response:', appsRes.data || appsRes.raw);
  }

  // 7. Data Integration / Dataflows
  console.log(`\n7. Fetching Data Integration projects (/api/v1/di-projects)...`);
  const diRes = await qlikGet(`/api/v1/di-projects`);
  console.log(`Status: ${diRes.status}`);
  if (diRes.status === 200) {
    const projects = diRes.data.data || diRes.data || [];
    console.log(`Found ${projects.length} DI projects:`);
    projects.forEach(p => {
      console.log(`  - Project: "${p.name || p.id}" (Space: ${p.spaceId})`);
    });
    report.diProjects = projects;
  } else {
    console.log('DI Projects response:', diRes.data || diRes.raw);
  }

  // 8. Data Connections in Space
  console.log(`\n8. Fetching Data Connections (/api/v1/data-connections?spaceId=${TARGET_SPACE_ID})...`);
  const connRes = await qlikGet(`/api/v1/data-connections?spaceId=${TARGET_SPACE_ID}`);
  console.log(`Status: ${connRes.status}`);
  if (connRes.status === 200) {
    const conns = connRes.data.data || connRes.data || [];
    console.log(`Found ${conns.length} data connections:`);
    conns.forEach(c => {
      console.log(`  - Connection: "${c.qName || c.name}" (ID: ${c.qID || c.id})`);
    });
    report.connections = conns;
  } else {
    console.log('Data connections response:', connRes.data || connRes.raw);
  }

  fs.writeFileSync(path.resolve(__dirname, '../scratch/test_report.json'), JSON.stringify(report, null, 2));
  console.log('\n==================================================');
  console.log('✅ TEST COMPLETE - Report saved to scratch/test_report.json');
  console.log('==================================================');
}

runTests();
