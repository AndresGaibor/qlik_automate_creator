---
title: "Temporary contents REST | Qlik Developer Portal"
source_url: "https://qlik.dev/apis/rest/temp-contents/"
local_path: "docs/endpoints/temp-contents.md"
---

Title: Temporary contents REST | Qlik Developer Portal


Services such as app and data-files which may import or export larger files can opt to leverage the temporary contents service to handle these requests. Acts as a temporary file store.

[Download OpenAPI spec](https://qlik.dev/specs/rest/temp-contents.json)

Upload a file as a temporary content resource. It returns a `201 Created` with a location header that contains the location of the created resource. If filename or TTL is not properly set, a `400 Bad request` is returned. For internal issues, a `500 Internal Server Error` is returned.

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)

### Query Parameters

*   filename string 
The name of the file to upload.

*   ttl integer 
The TTL parameter is used to define the time-to-live for the content resource in seconds. It defaults to one hour (3600) if no input is provided. Max TTL is 259200 (3 days).'

minimum = 1,  maximum = 259200

### Request Body

Required

### Responses

POST /api/v1/temp-contents

`import { createQlikApi } from '@qlik/api'import { readFileSync } from 'node:fs'const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})await qlik.tempContents.uploadTempFile(  {},  new Uint8Array(readFileSync('<file-path>')),)`

`# qlik-cli has not implemented support for POST /api/v1/temp-contents yet.`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/temp-contents" \-X POST \-H "Content-type: application/octet-stream" \-H "Authorization: Bearer <access_token>" \--data-binary' \          '"@/path/to/file"`

This endpoint is used to retrieve a temporary content file. It returns a valid (`200 OK`) in case the file exists and the user is authorized to view the contents. It returns a `410 Gone` if the file has expired and `404 Not Found` if the criteria is not met.

### Facts

Rate limit[Tier 1](https://qlik.dev/apis/rest/rate-limiting/)(1000 requests per minute)

### Header Parameters

*   Range string 
Set to `unit=start-end` (for example, `bytes=0-100`) where `unit` = `bytes` (only supported unit), and start/end is a positive integer, where start <= end. Will also handle `start-` and `-end` as described in [https://tools.ietf.org/html/rfc7233](https://tools.ietf.org/html/rfc7233).

### Query Parameters

*   inline string 
Set to "1" to download the file in inline mode. Useful for displaying a preview of the file in a browser.

### Path Parameters

*   id string

Required  
The temporary contents ID.

### Responses

GET /api/v1/temp-contents/{id}

`import { createQlikApi } from '@qlik/api'const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})await qlik.tempContents.downloadTempFile(  'string',  {},)`

`# qlik-cli has not implemented support for GET /api/v1/temp-contents/{id} yet.`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/temp-contents/{id}" \-H "Authorization: Bearer <access_token>"`

### Example Response

`{}`

Retrieve a summary of the metadata associated with a temporary content resource. It returns a `200 OK` with a model if the temporary resource is valid. It returns a `410 Gone` if the file has expired and `404 Not Found` if the criteria is not met.

### Facts

Rate limit[Tier 1](https://qlik.dev/apis/rest/rate-limiting/)(1000 requests per minute)

### Path Parameters

*   id string

Required  
The temporary contents ID.

### Responses

GET /api/v1/temp-contents/{id}/details

`import { createQlikApi } from '@qlik/api'const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})await qlik.tempContents.getTempFileDetails(  'string',)`

`# qlik-cli has not implemented support for GET /api/v1/temp-contents/{id}/details yet.`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/temp-contents/{id}/details" \-H "Authorization: Bearer <access_token>"`

### Example Response

`{  "ID": "string",  "Name": "string",  "Size": "string",  "Expires": "string",  "CreatedAt": "string",  "CreatorID": "string",  "UpdatedAt": "string",  "TTLSeconds": 42}`

Create a new upload resource (tus protocol `creation` extension POST request). See [tus.io](http://tus.io/) for details.

### Facts

Rate limit[Special](https://qlik.dev/apis/rest/rate-limiting/)(800 requests per minute)

### Header Parameters

*   Tus-Resumable string

Required  
The version of the tus protocol used.

*   Upload-Length integer

Required  
The size of the entire upload in bytes.

minimum = 0,  format = int64

*   Upload-Metadata string 

One or more comma-separated key-value pairs. The key and value must be separated by a space. The key should be ASCII encoded, and the value must be Base64 encoded. All keys must be unique. See [tus.io](http://tus.io/) for details.

The following keys are used; any other keys are ignored.

    *   `filename` - the name of the file.
    *   `ttl` - the time-to-live for the uploaded file in seconds. Note that the time is counted from the _start_ of the upload creation, not when the upload has finished. The server will keep the file available for access for this period of time. The server may then delete it. The time defaults to one hour (3600) if not provided. The maximum value is 259200 (3 days).'

### Responses

POST /api/v1/temp-contents/files

`// qlik-api has not implemented support for `POST /api/v1/temp-contents/files` yet.// In the meantime, you can use fetch like this:const response = await fetch(  '/api/v1/temp-contents/files',  {    method: 'POST',    headers: {      'Content-Type': 'application/json',    },  },)`

`# qlik-cli has not implemented support for POST /api/v1/temp-contents/files yet.`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/temp-contents/files" \-X POST \-H "Tus-Resumable: string" \-H "Upload-Length: 0" \-H "Authorization: Bearer <access_token>"`

Apply bytes contained in the message at a given offset (tus protocol PATCH request). Note that the tus server only accepts that the Content-Type response header is set to `application/offset+octet-stream`. See [tus.io](http://tus.io/) for details.

Note that the server may return `423 Locked` on this request. This happens if the client attempts to perform concurrent access to the resource, for example, if attempting to do a `HEAD` request during an ongoing `PATCH` request. It can also occur in situations where the connection is unexpectedly dropped between the client and the server and the client attempts to make a new request when the server is still busy processing the upload. When this happens, the client shall, after some period of time, try to resume the upload again.

### Facts

Rate limit[Special](https://qlik.dev/apis/rest/rate-limiting/)(800 requests per minute)

### Header Parameters

*   Content-Type string

Required  
Standard HTTP `Content-Type` header.

*   Tus-Resumable string

Required  
The version of the tus protocol used.

*   Upload-Offset integer

Required  
The byte offset within the upload.

minimum = 0,  format = int64

*   Content-Length integer 
Standard HTTP `Content-Length` header.

minimum = 0,  format = int64

### Path Parameters

*   id string

Required  
The ID used to uniquely identify the upload.

### Request Body

Required

### Responses

PATCH /api/v1/temp-contents/files/{id}

`// qlik-api has not implemented support for `PATCH /api/v1/temp-contents/files/{id}` yet.// In the meantime, you can use fetch like this:const response = await fetch(  '/api/v1/temp-contents/files/{id}',  {    method: 'PATCH',    headers: {      'Content-Type': 'application/json',    },  },)`

`# qlik-cli has not implemented support for PATCH /api/v1/temp-contents/files/{id} yet.`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/temp-contents/files/{id}" \-X PATCH \-H "Content-Type: string" \-H "Tus-Resumable: string" \-H "Upload-Offset: 0" \-H "Content-type: application/offset+octet-stream" \-H "Authorization: Bearer <access_token>" \-d '"string"'`