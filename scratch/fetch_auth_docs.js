const fs = require('fs');
const path = require('path');
const https = require('https');

const urls = [
  { url: 'https://qlik.dev/authenticate.md', file: 'docs/authenticate/README.md' },
  { url: 'https://qlik.dev/authenticate/content-security-policy.md', file: 'docs/authenticate/content-security-policy.md' },
  { url: 'https://qlik.dev/authenticate/oauth.md', file: 'docs/authenticate/oauth/index.md' },
  { url: 'https://qlik.dev/authenticate/oauth/scopes.md', file: 'docs/authenticate/oauth/scopes.md' },
  { url: 'https://qlik.dev/authenticate/oauth/getting-started-oauth-m2m.md', file: 'docs/authenticate/oauth/getting-started-oauth-m2m.md' },
  { url: 'https://qlik.dev/authenticate/oauth/guiding-principles-oauth-impersonation.md', file: 'docs/authenticate/oauth/guiding-principles-oauth-impersonation.md' },
  { url: 'https://qlik.dev/authenticate/oauth/oauth-connect-qlik-cli.md', file: 'docs/authenticate/oauth/oauth-connect-qlik-cli.md' },
  { url: 'https://qlik.dev/authenticate/oauth/oauth-connect-python-m2m.md', file: 'docs/authenticate/oauth/oauth-connect-python-m2m.md' },
  { url: 'https://qlik.dev/authenticate/oauth/oauth-clients-api.md', file: 'docs/authenticate/oauth/oauth-clients-api.md' },
  { url: 'https://qlik.dev/authenticate/oauth/manage-oauth-tokens.md', file: 'docs/authenticate/oauth/manage-oauth-tokens.md' },
  { url: 'https://qlik.dev/authenticate/oauth/implement-oauth-impersonation.md', file: 'docs/authenticate/oauth/implement-oauth-impersonation.md' },
  { url: 'https://qlik.dev/authenticate/oauth/oauth-dynamic-client-registration.md', file: 'docs/authenticate/oauth/oauth-dynamic-client-registration.md' },
  { url: 'https://qlik.dev/authenticate/oauth/oauth-private-key-jwt.md', file: 'docs/authenticate/oauth/oauth-private-key-jwt.md' },
  { url: 'https://qlik.dev/authenticate/oauth/oauth-private-key-jwt-reference.md', file: 'docs/authenticate/oauth/oauth-private-key-jwt-reference.md' },
  { url: 'https://qlik.dev/authenticate/oauth/create/create-oauth-client-anonymous.md', file: 'docs/authenticate/oauth/create/create-oauth-client-anonymous.md' },
  { url: 'https://qlik.dev/authenticate/oauth/create/create-oauth-client-spa.md', file: 'docs/authenticate/oauth/create/create-oauth-client-spa.md' },
  { url: 'https://qlik.dev/authenticate/oauth/create/create-oauth-client.md', file: 'docs/authenticate/oauth/create/create-oauth-client.md' },
  { url: 'https://qlik.dev/authenticate/oauth/create/create-oauth-client-m2m-impersonation.md', file: 'docs/authenticate/oauth/create/create-oauth-client-m2m-impersonation.md' },
  { url: 'https://qlik.dev/authenticate/oauth/create/create-organization-level-oauth-client.md', file: 'docs/authenticate/oauth/create/create-organization-level-oauth-client.md' },
  { url: 'https://qlik.dev/authenticate/oauth/create/create-region-oauth-client.md', file: 'docs/authenticate/oauth/create/create-region-oauth-client.md' },
  { url: 'https://qlik.dev/authenticate/jwt/implement-jwt-authorization.md', file: 'docs/authenticate/jwt/implement-jwt-authorization.md' },
  { url: 'https://qlik.dev/authenticate/jwt/create-signed-tokens-for-jwt-authorization.md', file: 'docs/authenticate/jwt/create-signed-tokens-for-jwt-authorization.md' },
  { url: 'https://qlik.dev/authenticate/jwt/jwt-proxy.md', file: 'docs/authenticate/jwt/jwt-proxy.md' },
  { url: 'https://qlik.dev/authenticate/jwt/jwt-proxy/quickstart-qlik-jwt-proxy.md', file: 'docs/authenticate/jwt/jwt-proxy/quickstart-qlik-jwt-proxy.md' },
  { url: 'https://qlik.dev/authenticate/api-key/generate-your-first-api-key.md', file: 'docs/authenticate/api-key/generate-your-first-api-key.md' }
];

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchUrl(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed ${url}: status ${res.statusCode}`));
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function main() {
  const root = path.resolve(__dirname, '..');
  let successCount = 0;
  for (const item of urls) {
    const targetPath = path.join(root, item.file);
    fs.mkdirSync(path.dirname(targetPath), { recursive: true });
    try {
      console.log(`Fetching ${item.url}...`);
      const content = await fetchUrl(item.url);
      fs.writeFileSync(targetPath, content, 'utf8');
      console.log(`Saved -> ${item.file}`);
      successCount++;
    } catch (err) {
      console.error(`Error fetching ${item.url}:`, err.message);
    }
  }
  console.log(`Done! Saved ${successCount}/${urls.length} files.`);
}

main();
