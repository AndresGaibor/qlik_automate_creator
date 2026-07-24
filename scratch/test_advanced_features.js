const fs = require('fs');
const path = require('path');
const https = require('https');

const TENANT_URL = 'https://l676lvg3emfvcq2.us.qlikcloud.com';
const API_KEY = 'eyJhbGciOiJFUzM4NCIsImtpZCI6ImRlZDYwZTdkLWQxZGUtNDgwNS05NWNiLTlmOWM4M2I3YmFlMCIsInR5cCI6IkpXVCJ9.eyJzdWJUeXBlIjoidXNlciIsInRlbmFudElkIjoidkd0b3VwSVVaWWNIcV82UTJNRm41ci1lREN1ZGlua2giLCJqdGkiOiJkZWQ2MGU3ZC1kMWRlLTQ4MDUtOTVjYi05ZjljODNiN2JhZTAiLCJhdWQiOiJxbGlrLmFwaSIsImlzcyI6InFsaWsuYXBpL2FwaS1rZXlzIiwic3ViIjoiNmE1NDM0YjNjMDBmOTg4ZDBmZjQ1M2FhIn0.v-OOIs-wM2tSurLmIkyjSXKl1hObfb5U4SLH4d4sTBv1TdFbhzhM-NY8n2TDMoVpW-dz-6LSWX0y8yHJ1cg8hFhwbPezrUiPQgLEH7PrLZqzMCHrlh4AbPwaJkytho86';

const TARGET_DATAFLOW_ID = 'f16387d7-63af-484f-b267-f3856540dbe6'; // BanColombia_Prueba_1
const TARGET_AUTOMATION_ID = '17b889aa-0426-44d5-bca8-9b8baa104a41'; // Prueba S3
const TEST_AUTOMATION_ID = 'cd035fef-2e74-4832-b869-8b73fb027187'; // Duplicated automation

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

async function runAdvancedTests() {
  console.log('================================================================');
  console.log('🚀 TESTING ADVANCED FEATURES: 1.C, 2.A & 2.C');
  console.log('================================================================\n');

  const report = {};

  // ================================================================
  // TEST 1.C: APP EVALUATION / PERFORMANCE ANALYSIS
  // ================================================================
  console.log('--- TEST 1.C: App Performance & Memory Evaluation ---');
  console.log(`Endpoint: POST /api/analytics/apps/${TARGET_DATAFLOW_ID}/evaluations`);
  const evalRes = await qlikReq('POST', `/api/analytics/apps/${TARGET_DATAFLOW_ID}/evaluations`, {});
  console.log(`Status: ${evalRes.status}`);

  if (evalRes.status === 200 || evalRes.status === 201) {
    console.log('✅ Evaluation Triggered Successfully!');
    console.log('Evaluation Data:', JSON.stringify(evalRes.data, null, 2));
    report.evaluation = evalRes.data;
  } else {
    console.log('Evaluation Response:', evalRes.data || evalRes.raw);
    // Also test GET evaluations list
    console.log(`Trying GET /api/analytics/apps/${TARGET_DATAFLOW_ID}/evaluations...`);
    const evalListRes = await qlikReq('GET', `/api/analytics/apps/${TARGET_DATAFLOW_ID}/evaluations`);
    console.log(`Status GET evaluations: ${evalListRes.status}`);
    console.log('List Response:', evalListRes.data || evalListRes.raw);
    report.evaluationList = evalListRes.data;
  }

  // ================================================================
  // TEST 2.A: DETAILED LOGS & RUN METRICS FOR AUTOMATIONS
  // ================================================================
  console.log('\n--- TEST 2.A: Detailed Execution Logs & Metrics for Automation ---');
  console.log(`Endpoint: GET /api/v1/automations/${TARGET_AUTOMATION_ID}/runs`);
  const runsRes = await qlikReq('GET', `/api/v1/automations/${TARGET_AUTOMATION_ID}/runs`);
  console.log(`Status GET /runs: ${runsRes.status}`);

  if (runsRes.status === 200) {
    const runsList = runsRes.data.data || runsRes.data || [];
    console.log(`Found ${runsList.length} execution runs for "${TARGET_AUTOMATION_ID}":`);
    runsList.forEach((r, idx) => {
      console.log(`\n  Run #${idx + 1}:`);
      console.log(`    Run ID: ${r.id}`);
      console.log(`    Status: ${r.status}`);
      console.log(`    Context: ${r.context}`);
      console.log(`    Start Time: ${r.startTime}`);
      console.log(`    Stop Time: ${r.stopTime}`);
      if (r.metrics) {
        console.log(`    Network RX/TX: ${r.metrics.network.rxBytes} / ${r.metrics.network.txBytes} bytes`);
        console.log(`    Total API Calls: ${r.metrics.totalApiCalls}`);
        if (r.metrics.blocks) {
          console.log(`    Executed Blocks: ${r.metrics.blocks.length} block(s)`);
          r.metrics.blocks.forEach(b => {
            console.log(`      - [${b.type}] API Calls: ${b.apiCalls || 0}, RX/TX: ${b.rxBytes || 0}/${b.txBytes || 0}`);
          });
        }
      }
    });
    report.runsHistory = runsList;

    // Fetch details for the latest run
    if (runsList.length > 0) {
      const latestRunId = runsList[0].id;
      console.log(`\nFetching specific run details (GET /api/v1/automations/${TARGET_AUTOMATION_ID}/runs/${latestRunId})...`);
      const singleRunRes = await qlikReq('GET', `/api/v1/automations/${TARGET_AUTOMATION_ID}/runs/${latestRunId}`);
      console.log(`Status: ${singleRunRes.status}`);
      report.latestRunDetails = singleRunRes.data;
    }
  } else {
    console.log('Runs response:', runsRes.data || runsRes.raw);
  }

  // ================================================================
  // TEST 2.C: DISABLE, ENABLE & CHANGE OWNER OF AUTOMATION
  // ================================================================
  console.log('\n--- TEST 2.C: Automation Governance (Disable, Enable & Change Owner) ---');

  // 2.C.1: Disable Automation
  console.log(`1. Disabling automation (POST /api/v1/automations/${TEST_AUTOMATION_ID}/actions/disable)...`);
  const disableRes = await qlikReq('POST', `/api/v1/automations/${TEST_AUTOMATION_ID}/actions/disable`, {});
  console.log(`Status Disable: ${disableRes.status}`);
  if (disableRes.status === 200 || disableRes.status === 204) {
    console.log('✅ Automation Disabled Successfully!');
  } else {
    console.log('Disable response:', disableRes.data || disableRes.raw);
  }

  // Verify status is disabled
  const checkDisabled = await qlikReq('GET', `/api/v1/automations/${TEST_AUTOMATION_ID}`);
  console.log(`State after disable: "${checkDisabled.data.state}"`);

  // 2.C.2: Enable Automation
  console.log(`\n2. Re-enabling automation (POST /api/v1/automations/${TEST_AUTOMATION_ID}/actions/enable)...`);
  const enableRes = await qlikReq('POST', `/api/v1/automations/${TEST_AUTOMATION_ID}/actions/enable`, {});
  console.log(`Status Enable: ${enableRes.status}`);
  if (enableRes.status === 200 || enableRes.status === 204) {
    console.log('✅ Automation Enabled Successfully!');
  } else {
    console.log('Enable response:', enableRes.data || enableRes.raw);
  }

  // Verify status is available
  const checkEnabled = await qlikReq('GET', `/api/v1/automations/${TEST_AUTOMATION_ID}`);
  console.log(`State after enable: "${checkEnabled.data.state}"`);

  // 2.C.3: Change Owner
  console.log(`\n3. Testing Change Owner (POST /api/v1/automations/${TEST_AUTOMATION_ID}/actions/change-owner)...`);
  const changeOwnerRes = await qlikReq('POST', `/api/v1/automations/${TEST_AUTOMATION_ID}/actions/change-owner`, {
    ownerId: '6a5434b3c00f988d0ff453aa' // Current user
  });
  console.log(`Status Change Owner: ${changeOwnerRes.status}`);
  if (changeOwnerRes.status === 200 || changeOwnerRes.status === 204) {
    console.log('✅ Change Owner Executed Successfully!');
  } else {
    console.log('Change Owner response:', changeOwnerRes.data || changeOwnerRes.raw);
  }

  fs.writeFileSync(path.resolve(__dirname, '../scratch/advanced_tests_report.json'), JSON.stringify(report, null, 2));
  console.log('\n================================================================');
  console.log('✅ ADVANCED TESTS COMPLETE - Saved report to scratch/advanced_tests_report.json');
  console.log('================================================================');
}

runAdvancedTests();
