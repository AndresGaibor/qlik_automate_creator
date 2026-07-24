const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, '../docs/endpoints/analytics-apps.md');
if (fs.existsSync(filePath)) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Remove nav boilerplate if present
  if (content.includes('Markdown Content:')) {
    const parts = content.split('Markdown Content:');
    let body = parts[1];
    
    // remove leading menu text up to "Apps" or "Download OpenAPI spec" or "Endpoints"
    const endNavIndex = body.indexOf('Download OpenAPI spec');
    if (endNavIndex !== -1) {
      body = body.substring(endNavIndex);
    }
    
    const cleanHeader = `---
title: "Apps REST | Qlik Developer Portal"
source_url: "https://qlik.dev/apis/rest/analytics/apps/"
local_path: "docs/endpoints/analytics-apps.md"
---

# Apps REST API

`;
    fs.writeFileSync(filePath, cleanHeader + body.trim(), 'utf8');
    console.log('Cleaned analytics-apps.md');
  }
}
