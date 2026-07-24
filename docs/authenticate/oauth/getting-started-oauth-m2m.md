---
source: https://qlik.dev/authenticate/oauth/getting-started-oauth-m2m/
last_updated: 2026-01-19T14:21:00Z
---

# Get started with OAuth machine-to-machine

## Overview

Machine-to-Machine (M2M)-enabled OAuth clients are a powerful and secure way to manage
and automate operations on your Qlik Cloud tenant. They require no user interaction and
have the Tenant Admin role, which gives you complete control over your tenant.

M2M OAuth clients use `Client Credentials Flow` to authenticate with the Qlik Cloud
authorization server. OAuth clients pass the `Client ID` and `Client Secret` fields in the
request body to the `/oauth/token` endpoint. The authorization server validates the
credentials and responds back with an `Access Token`, which the application can use
in making API requests.

In this tutorial, you will learn how to use M2M-enabled OAuth clients with:

- [Qlik-CLI](#using-oauth-clients-with-qlik-cli)
- [Qlik-API](#qlik-api)
- [Using Fetch API](#using-fetch-api)
- [Python SDK](#python)
- [REST calls](#making-rest-calls)

## Prerequisites

- An [OAuth client](https://qlik.dev/authenticate/oauth/create/create-oauth-client) with the M2M flow enabled.
- [Qlik-CLI](https://qlik.dev/toolkits/qlik-cli) installed on your machine.
- [Qlik Typescript API](https://github.com/qlik-oss/qlik-api-ts?tab=readme-ov-file#getting-started).
- [Qlik Python SDK](https://pypi.org/project/qlik-sdk/#description).

## Using OAuth clients with Qlik-CLI

Qlik-CLI allows you to authenticate to your tenant using an OAuth M2M client.

You can initialize a new context using the following command:

```bash
qlik context init <context name>
```

Then, enter your tenant URL.

```text
Acquiring access to Qlik Cloud

Specify your tenant URL, usually in the form: https://<tenant>.<region>.qlikcloud.com
Where <tenant> is the name of the tenant and <region> is eu, us, ap, and so forth.
Enter tenant url:
```

Then, you need to choose OAuth for the authentication type.

```text
Specify what type of authentication should be used i.e API-Key (A) or OAuth (O). Default is API-Key (A).
A/O?: O
```

Then, provide the OAuth Client ID and Client Secret.

To complete this setup, you must have a Client ID and Client Secret for OAuth.
If you're unsure, you can ask your tenant administrator or go
to [Get started with Qlik-CLI](https://qlik.dev/toolkits/qlik-cli).

```text
Client ID: <my-client-id>

Client Secret: <my-client-secret>
```

The context is now ready to use. Start by executing Qlik-CLI commands.

```bash
qlik user me
```

## Qlik API

Install `@qlik/api` using:

```bash
npm i @qlik/api
```

Next, create a JavaScript (`.js`) file and paste the following code in it.
Remember to modify it to include your `host`, `clientId`, and `clientSecret` that you obtained previously.

```javascript
import { auth, spaces } from "@qlik/api";

const hostConfig = {
  host: "your-tenant.region.qlikcloud.com",
  authType: "oauth2",
  clientId: "<client-id>",
  clientSecret: "<client-secret>",
};

auth.setDefaultHostConfig(hostConfig);

async function main() {
  const { data: mySpaces } = await spaces.getSpaces({});
  console.log(mySpaces.data); // the data response (list of spaces)
}

await main();
```

<details>
  <summary>View full example</summary>

  `embed:./snippets/qlik-ts-api-snippets/qlik-api-m2m-oauth-example.js`
</details>

Run the JavaScript file you previously created.
The response will have a JSON object containing the user's information.

## Using Fetch API

You can make calls with Fetch using an M2M OAuth client.
First, you need to obtain an access token.

```javascript
async function getAccessToken() {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    }
    clientId: "<OAUTH_M2M_CLIENT_ID>",
    clientSecret: "<OAUTH_M2M_CLIENT_SECRET>",
    grant_type: "client_credentials",
    scope: "user_default",  // Optional: space delimited list of scopes to grant the access token. Leave blank to inherit from OAuth client.
  }

  const response = await fetch("https://<tenant>.<region>.qlikcloud.com/oauth/token", options);
  if(response?.ok){
    const tokenInfo = await response.json();
    return tokenInfo.access_token;
  }

  console.log("Handle the error");
  return null;
}
```

The `getAccessToken` function will return an access token.
You can now use the access token to call a REST endpoint. In this
example, you're calling the `/api/v1/tenants/me` endpoint, which
will return a JSON object containing the tenant's information.

```javascript
const accessToken = await getAccessToken();

const options = {
  method: "GET",
  headers: {
    "Content-Type": "application/javascript",
    "Authorization": `Bearer ${accessToken}`
  }
}

const response = await fetch("https://<tenant>.<region>.qlikcloud.com/api/v1/tenants/me", options);
if(response?.ok) {
  const data = await response.json();
  return data;
}

console.log("Handle the error");
return null;
```

## Python

Install the SDK using:

```bash
python3 -m pip install --upgrade qlik-sdk
```

Next, create a Python (`.py`) file and paste the following code in it.
Remember to modify it to include your `host`, `clientId`, and `clientSecret` that you obtained previously.

`embed:./snippets/platform-sdk/python/python-sdk-oauth-m2m.py`

Run the Python file you previously created.
The response will have the user's information.

## Making REST Calls

> **Note:** This section uses curl via command line to make calls.

You can make REST calls with the M2M OAuth client.
First, you need to obtain an access token.

```bash
curl -X POST "https://<tenant>.<region>.qlikcloud.com/oauth/token" ^
-H "Accept: application/json" ^
-H "Content-Type: application/json" ^
-d "{
    \"client_id\": \"<OAUTH_M2M_CLIENT_ID>\", 
    \"client_secret\": \"<OAUTH_M2M_CLIENT_SECRET>\", 
    \"grant_type\": \"client_credentials\" 
}"
```

You will get a response similar to the one below,
which contains an `access_token` that you can use
to make REST calls.

```json
{
    "access_token": "eyJhbGciOiJFUzM4NCIsInR...",
    "token_type": "bearer",
    "expires_at": "2022-11-11T01:08:54.000Z",
    "expires_in": 21600
}
```

Next, you can use the token you created to make REST calls.
In this example, you're calling the `/api/v1/tenants/me` endpoint, which will
return a JSON object containing the tenant's information.

```bash
curl -L -X GET 'https://<tenant>.<region>.qlikcloud.com/api/v1/tenants/me' ^
-H 'Authorization: Bearer <ACCESS_TOKEN>'
```
