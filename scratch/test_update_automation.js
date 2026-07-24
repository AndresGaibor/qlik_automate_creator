const fs = require('fs');
const path = require('path');
const https = require('https');

const TENANT_URL = 'https://l676lvg3emfvcq2.us.qlikcloud.com';
const API_KEY = 'eyJhbGciOiJFUzM4NCIsImtpZCI6ImRlZDYwZTdkLWQxZGUtNDgwNS05NWNiLTlmOWM4M2I3YmFlMCIsInR5cCI6IkpXVCJ9.eyJzdWJUeXBlIjoidXNlciIsInRlbmFudElkIjoidkd0b3VwSVVaWWNIcV82UTJNRm41ci1lREN1ZGlua2giLCJqdGkiOiJkZWQ2MGU3ZC1kMWRlLTQ4MDUtOTVjYi05ZjljODNiN2JhZTAiLCJhdWQiOiJxbGlrLmFwaSIsImlzcyI6InFsaWsuYXBpL2FwaS1rZXlzIiwic3ViIjoiNmE1NDM0YjNjMDBmOTg4ZDBmZjQ1M2FhIn0.v-OOIs-wM2tSurLmIkyjSXKl1hObfb5U4SLH4d4sTBv1TdFbhzhM-NY8n2TDMoVpW-dz-6LSWX0y8yHJ1cg8hFhwbPezrUiPQgLEH7PrLZqzMCHrlh4AbPwaJkytho86';

const AUTOMATION_ID = 'cd035fef-2e74-4832-b869-8b73fb027187'; // Duplicated automation created earlier

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

async function testAutomationUpdate() {
  console.log('================================================================');
  console.log('🛠️ TESTING AUTOMATION MODIFICATION, SCHEDULE & VARIABLES');
  console.log(`Automation ID: ${AUTOMATION_ID}`);
  console.log('================================================================\n');

  // 1. GET Current Automation Details & Workspace
  console.log('1. Fetching current automation details (GET /api/v1/automations/{id})...');
  const getRes = await qlikReq('GET', `/api/v1/automations/${AUTOMATION_ID}`);
  console.log(`Status GET: ${getRes.status}`);

  if (getRes.status !== 200) {
    console.error('Failed to fetch automation:', getRes.data || getRes.raw);
    return;
  }

  const currentAuto = getRes.data;
  console.log(`   Name: "${currentAuto.name}"`);
  console.log(`   Description: "${currentAuto.description}"`);
  console.log(`   SpaceId: "${currentAuto.spaceId}"`);
  console.log(`   State: "${currentAuto.state}"`);
  console.log(`   RunMode: "${currentAuto.runMode || 'manual'}"`);

  // 2. Prepare PUT Body with updated Schedule, Description, Name, and Workspace Variables
  console.log('\n2. Updating Automation Name, Description, Schedule & Variables (PUT /api/v1/automations/{id})...');

  const updatedPayload = {
    name: `Automation_Modificada_API_${Date.now()}`,
    description: 'Automatización modificada vía Qlik Cloud REST API (Nombre, Variables y Horario actualizados)',
    spaceId: currentAuto.spaceId || '6a57a14cf89e2c4d4b4d83af',
    runMode: 'scheduled',
    schedules: [
      {
        type: 'interval',
        interval: 120, // Cada 2 horas (120 minutos)
        startAt: '2026-07-25 08:00:00',
        stopAt: '2026-12-31 23:59:59',
        timezone: 'America/Bogota'
      }
    ],
    workspace: currentAuto.workspace || {}
  };

  const putRes = await qlikReq('PUT', `/api/v1/automations/${AUTOMATION_ID}`, updatedPayload);
  console.log(`Status PUT: ${putRes.status}`);

  if (putRes.status === 200) {
    console.log('✅ Automation Definition Updated Successfully!');
    console.log('   New Name:', putRes.data.name);
    console.log('   New Description:', putRes.data.description);
    console.log('   New Schedules:', JSON.stringify(putRes.data.schedules, null, 2));
  } else {
    console.log('Response PUT:', putRes.data || putRes.raw);
  }

  // 3. READ BACK TO CONFIRM MODIFICATIONS
  console.log('\n3. Verifying updated automation details (GET /api/v1/automations/{id})...');
  const verifyRes = await qlikReq('GET', `/api/v1/automations/${AUTOMATION_ID}`);
  console.log(`Status GET: ${verifyRes.status}`);
  if (verifyRes.status === 200) {
    console.log('✅ Verified Full Updated Automation Object:');
    console.log(JSON.stringify(verifyRes.data, null, 2));
  }
}

testAutomationUpdate();
