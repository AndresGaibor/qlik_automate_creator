---
title: "Rate limiting | Qlik Developer Portal"
source_url: "https://qlik.dev/apis/rest/rate-limiting/"
local_path: "docs/overview/rate-limiting.md"
---

Title: Rate limiting | Qlik Developer Portal


Qlik Cloud platform features and APIs rely on rate limits to help provide a predictably pleasant experience for users.

The details of how and when rate limiting works differs between features. This page gives an overview of the rate limits you’re likely to encounter for Qlik Cloud platform features, and then notes how the limits apply to each feature.

## [](https://qlik.dev/apis/rest/rate-limiting/#overview) Overview

In general, rate limits for published APIs (documented on [qlik.dev](https://qlik.dev/)) are evaluated on a _per tier, per user, per tenant_ basis.

Endpoints not published on [qlik.dev](https://qlik.dev/) are considered private. However, they may share tiers with published endpoints.

| Tier | Limit | Description |
| --- | --- | --- |
| Tier 1 | 1,000 per min | This tier contains the majority of `GET` requests. The limit is evaluated over a 5-minute window to support bursts of requests. |
| Tier 2 | 100 per min | This tier applies to endpoints intended to create, update, and delete resources. The limit is evaluated over a 5-minute window to support bursts of requests. |
| Special | _Varies_ | The rate limit for Special endpoints is published in the relevant API specification. |

## [](https://qlik.dev/apis/rest/rate-limiting/#api-rate-limiting) API rate limiting

Your app’s requests to Qlik Cloud REST APIs are evaluated per tier, per user, per tenant. Rate limit windows are per minute unless documented otherwise.

All Qlik Cloud plans receive the same rate limit configuration. It’s not possible to customize this on a per-customer or per-tenant basis.

The `Facts` section of each endpoint’s reference documentation will indicate its rate limit tier. For an example of a _Special_ endpoint, see the [Reloads](https://qlik.dev/apis/rest/reloads/) API documentation.

Some endpoints may have additional rate limits for error responses.

Each tier’s limits are subject to change.

## [](https://qlik.dev/apis/rest/rate-limiting/#tenant-rate-limit) Tenant rate limit

In addition to the per-user rate limit, there is a tenant rate limit which determines how many users may send requests at the same time. This is determined by:

`tenantRateLimit = (user rate limit) * (number of users in the tenant) * 0.5`

As an example, for a tenant with 100 users, users may in aggregate send `1,000 * 100 * 0.5 = 50,000` requests within the rate limit window.

## [](https://qlik.dev/apis/rest/rate-limiting/#rate-limit-handling-with-toolkits) Rate limit handling with toolkits

Rate limit handling is built into the following toolkits:

*   [qlik-cli](https://qlik.dev/toolkits/qlik-cli/)
*   The Qlik Cloud Services and Qlik Platform Operations connectors in [Qlik Automate](https://qlik.dev/toolkits/no-code/)

## [](https://qlik.dev/apis/rest/rate-limiting/#responding-to-rate-limiting-conditions) Responding to rate limiting conditions

If you exceed a rate limit when using any of Qlik Cloud’s published HTTP-based APIs, you will receive an `HTTP 429 Too Many Requests` error response, and a `Retry-After` HTTP header containing the number of seconds until you can retry.

`< HTTP/1.1 429< content-type: application/json< content-length: 123< retry-after: 13{  "errors": [{    "code": "HTTP-429",    "title": "API rate limit reached.",    "detail": "You need to wait 13 seconds until limit is lifted."  }]}`

This response instructs your solution to wait 13 seconds before attempting another call. Calls to endpoints in the same tier are all blocked in the waiting period. Calls to endpoints in other tiers are not restricted.

For more information about the `Retry-After` HTTP header, consult the [retry-after](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Retry-After) header value for when you can make requests again.

## [](https://qlik.dev/apis/rest/rate-limiting/#handling-rate-limits-in-your-application) Handling rate limits in your application

When integrating with Qlik APIs, it’s important to implement proper error handling for rate limits. You should handle `HTTP 429 Too Many Requests` error responses by pausing your requests and retrying after the specified time.

> Note: Rate limit handling is automatically managed in `qlik-cli` and the Platform Operations connector.

The following code snippets are examples of handling `HTTP 429 Too Many Requests` error responses. These all use the same logic:

*   A function makes an API call.
*   If the response is `HTTP 429 Too Many Requests`, requests are paused during the number of seconds specified in the `retry-after` HTTP header.
*   Then, the function retries requests for 5 times maximum.

### [](https://qlik.dev/apis/rest/rate-limiting/#qlikapi) @qlik/api

The following code example shows you how to handle `HTTP 429 Too Many Requests` error responses using `@qlik/api`. In this example, the [spaces](https://qlik.dev/apis/rest/spaces/) that the current user has access to are retrieved.

@qlik/api code example

`import { auth, spaces } from '@qlik/api';// Configuration for authenticationconst hostConfig = {    authType: 'apikey',    host: 'https://<TENANT_HOSTNAME>.<REGION>.qlikcloud.com', // Replace with values for your Qlik Cloud tenant    apiKey: '<API_KEY>', // Replace with your API key  };// Set the default host configuration for all API requestsauth.setDefaultHostConfig(hostConfig);async function getSpacesWithRetry(maxRetries = 5) {    // Retry logic for handling rate limits    for (let attempt = 1; attempt <= maxRetries; attempt++) {        try {            console.log(`Attempting to retrieve spaces (attempt ${attempt})`);            // Get spaces using the high-level spaces.getSpaces function            const { status, headers, data: mySpaces } = await spaces.getSpaces();            // Check if HTTP 429 Too Many Requests error occurs            if (status === 429) {                if (attempt === maxRetries) {                    throw new Error(`Max retries reached after ${attempt} attempts due to rate limiting`);                }                // Get the number of seconds included in the retry-after header                const retryAfter = headers['retry-after'];                const waitTime = retryAfter ? parseInt(retryAfter, 10) * 1000 : 1000; // Default to 1 second if no retry-after header                console.log(`Rate limit hit. Waiting ${waitTime / 1000} seconds before retrying.`);                // Wait for the retry-after time before retrying                await new Promise(resolve => setTimeout(resolve, waitTime));            } else if (status < 300) {                // Successful response, return spaces                return mySpaces;            } else {                throw new Error(`Request failed with status: ${status}`);            }        } catch (error) {            if (attempt === maxRetries) throw error; // Throw error if max retries are reached            console.error(`Error occurred: ${error.message}. Retrying request (attempt ${attempt})...`);        }    }}// Example usageasync function fetchData() {    try {        const mySpaces = await getSpacesWithRetry();        console.log('Spaces retrieved:', mySpaces);    } catch (error) {        console.error('Failed to retrieve spaces:', error.message);    }}fetchData();`

### [](https://qlik.dev/apis/rest/rate-limiting/#nodejs) Node.js

The following code example shows you how to handle `HTTP 429 Too Many Requests` error responses in Node.js.

Node.js code example

`import fetch from 'node-fetch';// Fetch with retry logic for handling rate limits.async function fetchWithRetry(url, options = {}, maxRetries = 5) {    for (let attempt = 1; attempt <= maxRetries; attempt++) {        try {            console.log(`Attempting request to ${url} (attempt ${attempt})`);            const response = await fetch(url, options);            // Check if HTTP 429 Too Many Requests error occurs            if (response.status === 429) {                if (attempt === maxRetries) {                    throw new Error(`Max retries reached after ${attempt} attempts due to rate limiting.`);                }                // Get the number of seconds included in the retry-after header                const retryAfter = response.headers.get('retry-after');                const waitTime = retryAfter ? parseInt(retryAfter, 10) * 1000 : 1000; // Default to 1 second if no retry-after header                console.log(`Rate limit hit. Waiting ${waitTime / 1000} seconds before retrying.`);                // Wait for the retry-after time before retrying                await new Promise(resolve => setTimeout(resolve, waitTime));            } else if (response.ok) {                return await response.json();  // Return successful response            } else {                throw new Error(`Request failed with status: ${response.status}`);            }        } catch (error) {            if (attempt === maxRetries) throw error;  // Throw error if the max number of retries is reached            console.error(`Error occurred: ${error.message}. Retrying request (attempt ${attempt})...`);        }    }}// Example usageasync function fetchData() {    const url = 'https://<TENANT_HOSTNAME>.<REGION>.qlikcloud.com/api/v1/<RESOURCE>';  // Replace with the API endpoint URL    const options = { method: 'GET', headers: { 'Authorization': 'Bearer <YOUR_ACCESS_TOKEN>' } };  // Replace with your access token    try {        const data = await fetchWithRetry(url, options);        console.log('Data retrieved:', data);    } catch (error) {        console.error('Failed to retrieve data:', error.message);    }}fetchData();`

### [](https://qlik.dev/apis/rest/rate-limiting/#powershell) PowerShell

The following code example shows you how to handle `HTTP 429 Too Many Requests` error responses in PowerShell.

PowerShell code example

`# Fetch with retry logic for handling rate limits.function Invoke-FetchWithRetry {    param (        [string]$Url,                # The API endpoint URL        [string]$Method = 'GET',     # HTTP method (default: GET)        [hashtable]$Headers = @{},   # Headers for the request        [object]$Body = $null,       # Request body (optional)        [int]$MaxRetries = 5         # Maximum number of retries    )    $attempt = 1     # Track the retry attempt    while ($attempt -le $MaxRetries) {        try {            Write-Host "Attempting request to $Url (attempt $attempt)"            # Make the HTTP request            $response = Invoke-RestMethod -Uri $Url -Method $Method -Headers $Headers -Body $Body -ErrorAction Stop -PreserveAuthorizationOnRedirect            return $response  # Return successful response        } catch {            $errorResponse = $_.Exception.Response            # Check if HTTP 429 Too Many Requests error occurs            if ($errorResponse.StatusCode -eq 429) {                if ($attempt -eq $MaxRetries) {                    throw "Max retries reached after $attempt attempts due to rate limiting."                }  # Throw error if the max number of retries is reached                # Get the number of seconds included in the retry-after header                $retryAfter = $errorResponse.Headers['retry-after']                $waitTime = if ($retryAfter) { [int]$retryAfter } else { 1 }  # Default to 1 second if no retry-after header                Write-Host "Rate limit hit. Waiting $waitTime seconds before retrying."                # Wait for the specified time before retrying                Start-Sleep -Seconds $waitTime            } else {                Write-Host "Error occurred: $_. Retrying request (attempt {$attempt})..."                throw $_            }        }        $attempt++    }}# Example usage$Url = "https://<TENANT_HOSTNAME>.<REGION>.qlikcloud.com/api/v1/<RESOURCE>"  # Replace with the API endpoint URL$Headers = @{    "Authorization" = "Bearer <YOUR_ACCESS_TOKEN>"  # Replace with your access token}try {    $data = Invoke-FetchWithRetry -Url $Url -Method 'GET' -Headers $Headers    Write-Host "Data retrieved successfully:" $data} catch {    Write-Host "Failed to retrieve data: $_"}`

### [](https://qlik.dev/apis/rest/rate-limiting/#python) Python

The following code example shows you how to handle `HTTP 429 Too Many Requests` error responses in Python.

Python code example

`import requestsimport timedef fetch_with_retry(url, method='GET', headers=None, data=None, max_retries=5):    # Fetch with retry logic for handling rate limits.    for attempt in range(1, max_retries + 1):        try:            print(f"Attempting request to {url} (attempt {attempt})")            response = requests.request(method, url, headers=headers, json=data)            # Check if HTTP 429 Too Many Requests error occurs            if response.status_code == 429:                if attempt == max_retries:                    raise Exception(f'Max retries reached after {attempt} attempts due to rate limiting.')                # Get the number of seconds included in the retry-after header                retry_after = response.headers.get('retry-after')                wait_time = int(retry_after) if retry_after else 1  # Default to 1 second if no retry-after header                print(f"Rate limit hit. Waiting {wait_time} seconds before retrying.")                # Wait for the specified time before retrying                time.sleep(wait_time)            elif response.ok:                return response.json()  # Return successful response            else:                response.raise_for_status()        except requests.RequestException as e:            if attempt == max_retries:                raise e  # Throw error if the max number of retries is reached            print(f"Error occurred: {e}. Retrying request (attempt {attempt})...")# Example usagedef fetch_data():    url = 'https://<TENANT_HOSTNAME>.<REGION>.qlikcloud.com/api/v1/<RESOURCE>'  # Replace with the API endpoint URL    headers = { 'Authorization': 'Bearer <YOUR_ACCESS_TOKEN>' }  # Replace with your access token    try:        data = fetch_with_retry(url, headers=headers)        print("Data retrieved:", data)    except Exception as e:        print(f"Failed to retrieve data: {e}")fetch_data()`