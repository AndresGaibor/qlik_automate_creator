---
title: "Encryption REST | Qlik Developer Portal"
source_url: "https://qlik.dev/apis/rest/encryption/"
local_path: "docs/endpoints/encryption.md"
---

Title: Encryption REST | Qlik Developer Portal


[Skip to content](https://qlik.dev/apis/rest/encryption/#start-of-content)[![Image 1: Qlik logo](https://qlik.dev/logo.svg)](https://qlik.dev/)

*   [Authenticate](https://qlik.dev/authenticate/)
*   [Embed](https://qlik.dev/embed/)
*   [Extend](https://qlik.dev/extend/)
*   [Manage](https://qlik.dev/manage/)

*   [APIs](https://qlik.dev/apis/)
*   [Toolkits](https://qlik.dev/toolkits/)
*   [Changelog](https://qlik.dev/changelog/)

*   [Authenticate](https://qlik.dev/authenticate/)
*   [Embed](https://qlik.dev/embed/)
*   [Extend](https://qlik.dev/extend/)
*   [Manage](https://qlik.dev/manage/)

* * *

*   [APIs](https://qlik.dev/apis/)
*   [Toolkits](https://qlik.dev/toolkits/)
*   [Changelog](https://qlik.dev/changelog/)

## Encryption

*   [List AWS key providers registered for the tenant.](https://qlik.dev/apis/rest/encryption/#get-api-v1-encryption-keyproviders "List AWS key providers registered for the tenant.")
*   [Register a new multi-region AWS-KMS key.](https://qlik.dev/apis/rest/encryption/#post-api-v1-encryption-keyproviders "Register a new multi-region AWS-KMS key.")
*   [Retrieve key for a given ARN fingerprint.](https://qlik.dev/apis/rest/encryption/#get-api-v1-encryption-keyproviders-arnFingerPrint "Retrieve key for a given ARN fingerprint.")
*   [Patches Name & Description of a given key provider.](https://qlik.dev/apis/rest/encryption/#patch-api-v1-encryption-keyproviders-arnFingerPrint "Patches Name & Description of a given key provider.")
*   [Deletes the given key from the tenant.](https://qlik.dev/apis/rest/encryption/#delete-api-v1-encryption-keyproviders-arnFingerPrint "Deletes the given key from the tenant.")
*   [Migrate existing cipherkeys from current key provider to requested key provider.](https://qlik.dev/apis/rest/encryption/#post-api-v1-encryption-keyproviders-arnFingerPrint-actions-migrate "Migrate existing cipherkeys from current key provider to requested key provider.")
*   [Validate AWS-KMS key access.](https://qlik.dev/apis/rest/encryption/#post-api-v1-encryption-keyproviders-arnFingerPrint-actions-test "Validate AWS-KMS key access.")
*   [Lists all key providers registered for the tenant.](https://qlik.dev/apis/rest/encryption/#get-api-v1-encryption-keyproviders-actions-list "Lists all key providers registered for the tenant.")
*   [Reset tenant key provider to default Qlik managed provider.](https://qlik.dev/apis/rest/encryption/#post-api-v1-encryption-keyproviders-actions-reset-to-default-provider "Reset tenant key provider to default Qlik managed provider.")
*   [Retrieve most recent migration details.](https://qlik.dev/apis/rest/encryption/#get-api-v1-encryption-keyproviders-migration-actions-details "Retrieve most recent migration details.")

1.   [Home](https://qlik.dev/)
2.    / 
3.   [APIs](https://qlik.dev/apis/)
4.    / 
5.   [REST](https://qlik.dev/apis/rest/)

Copy page Copied!

[View as Markdown](https://qlik.dev/apis/rest/encryption.md)

* * *

 Open in Claude  Open in ChatGPT  Open in Perplexity  Open in VS Code Copilot 

# Encryption

Tenants in Qlik Cloud can be encrypted with a key you provide via a supported KMS. This API allows you to configure and manage encryption keys.

[Download OpenAPI spec](https://qlik.dev/specs/rest/encryption.json)

## Endpoints

*   [GET /api/v1/encryption/keyproviders](https://qlik.dev/apis/rest/encryption/#get-api-v1-encryption-keyproviders)
*   [POST /api/v1/encryption/keyproviders](https://qlik.dev/apis/rest/encryption/#post-api-v1-encryption-keyproviders)
*   [GET /api/v1/encryption/keyproviders/{arnFingerPrint}](https://qlik.dev/apis/rest/encryption/#get-api-v1-encryption-keyproviders-arnFingerPrint)
*   [PATCH /api/v1/encryption/keyproviders/{arnFingerPrint}](https://qlik.dev/apis/rest/encryption/#patch-api-v1-encryption-keyproviders-arnFingerPrint)
*   [DELETE /api/v1/encryption/keyproviders/{arnFingerPrint}](https://qlik.dev/apis/rest/encryption/#delete-api-v1-encryption-keyproviders-arnFingerPrint)
*   [POST /api/v1/encryption/keyproviders/{arnFingerPrint}/actions/migrate](https://qlik.dev/apis/rest/encryption/#post-api-v1-encryption-keyproviders-arnFingerPrint-actions-migrate)
*   [POST /api/v1/encryption/keyproviders/{arnFingerPrint}/actions/test](https://qlik.dev/apis/rest/encryption/#post-api-v1-encryption-keyproviders-arnFingerPrint-actions-test)
*   [GET /api/v1/encryption/keyproviders/actions/list](https://qlik.dev/apis/rest/encryption/#get-api-v1-encryption-keyproviders-actions-list)
*   [POST /api/v1/encryption/keyproviders/actions/reset-to-default-provider](https://qlik.dev/apis/rest/encryption/#post-api-v1-encryption-keyproviders-actions-reset-to-default-provider)
*   [GET /api/v1/encryption/keyproviders/migration/actions/details](https://qlik.dev/apis/rest/encryption/#get-api-v1-encryption-keyproviders-migration-actions-details)

## [](https://qlik.dev/apis/rest/encryption/#get-api-v1-encryption-keyproviders)List AWS key providers registered for the tenant.

Returns a list of AWS key providers in the tenant. Use /actions/list to return all key providers.

### Facts

Rate limit[Tier 1](https://qlik.dev/apis/rest/rate-limiting/)(1000 requests per minute)

### Header Parameters

*   Authorization string Required   The JWT used for authentication. Send the JWT in the request header using the Bearer schema. 

### Responses

#### 200

Successfully retrieved list of key providers

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   arn string Required   The provider resource notation for the key. 
        *   name string Required   Name of key provider entry. 
        *   current boolean   Indicates whether the key is being used to encrypt/decrypt secrets. 
        *   tenantId string   Tenant ID. 
        *   createdAt string   When key entry was created. 
format = "date-time"

        *   description string   Description of key provider entry. 
        *   keyprovider string Required   Key Provider type. 
Can be one of: "AWS-KMS"

        *   multiRegion boolean   Indicates whether the key has multi-region configurations and has replica key in qcs secondary region. 
        *   replicaKeys array of objects   

Show replicaKeys properties 

            *   arn string   Replica key keeps list of backup keys from the supported qcs secondary region. 
            *   region string   Region indicates the backup qcs-region link to the primary region. 

        *   arnFingerPrint string   The ARN fingerprint. 
        *   promotedToCurrentAt string   When the key was promoted to being the current active one. 
format = "date-time"

        *   demotedFromCurrentAt string   When the key was demoted from being current to non active. 
format = "date-time"

#### 400

Bad Request

*   application/json object   

Show application/json properties 

    *   errors array of objects Required   

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional error object metadata. 
        *   title string Required   Description of the error. 
        *   detail string   Extra information about the error. 

#### 417

Failed to load list of key providers

*   application/json object   

Show application/json properties 

    *   errors array of objects Required   

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional error object metadata. 
        *   title string Required   Description of the error. 
        *   detail string   Extra information about the error. 

 GET /api/v1/encryption/keyproviders

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.encryption.getEncryptionKeyproviders()
```

`qlik encryption keyprovider ls`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/encryption/keyproviders" \-H "Authorization: Bearer <access_token>"`

### Example Response

`[  {    "arn": "arn:aws:kms:eu-west-1:111222334455:key/mrk-1237c011a37erft67ei987c7612q456",    "name": "test name",    "current": true,    "description": "test description",    "drCompliant": true,    "keyprovider": "AWS-KMS",    "multiRegion": true,    "replicaKeys": [      {        "arn": "arn:aws:kms:eu-west-3:111222334455:key/mrk-1237c011a37erft67ei987c7612q456",        "region": "eu-west-3"      }    ],    "complianceError": {      "code": "",      "region": "",      "message": ""    }  }]`

## [](https://qlik.dev/apis/rest/encryption/#post-api-v1-encryption-keyproviders)Register a new multi-region AWS-KMS key.

The AWS-KMS key configuration must match the Qlik Cloud region configuration requirements. Most regions should have a key deployed to the same AWS region as the Qlik Cloud tenant, with a replica key in the relevant Qlik Cloud DR region. Consult the documentation for DR region mappings.

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)

### Header Parameters

*   Authorization string Required   The JWT used for authentication. Send the JWT in the request header using the Bearer schema. 

### Request Body

*   application/json object   

Show application/json properties 

    *   arn string Required   The provider resource notation for the key. 
    *   name string Required   Name of key provider entry. 
    *   description string   Description of key provider entry. 
    *   keyprovider string Required   Key Provider type. 
Can be one of: "AWS-KMS"

### Responses

#### 201

Successfully registered the provided AWS-KMS key

*   application/json object   

Show application/json properties 

    *   arn string Required   The provider resource notation for the key. 
    *   name string Required   Name of key provider entry. 
    *   current boolean   Indicates whether the key is being used to encrypt/decrypt secrets. 
    *   tenantId string   Tenant ID. 
    *   createdAt string   When key entry was created. 
format = "date-time"

    *   description string   Description of key provider entry. 
    *   keyprovider string Required   Key Provider type. 
Can be one of: "AWS-KMS"

    *   multiRegion boolean   Indicates whether the key has multi-region configurations and has replica key in qcs secondary region. 
    *   replicaKeys array of objects   

Show replicaKeys properties 

        *   arn string   Replica key keeps list of backup keys from the supported qcs secondary region. 
        *   region string   Region indicates the backup qcs-region link to the primary region. 

    *   arnFingerPrint string   The ARN fingerprint. 
    *   promotedToCurrentAt string   When the key was promoted to being the current active one. 
format = "date-time"

    *   demotedFromCurrentAt string   When the key was demoted from being current to non active. 
format = "date-time"

#### 400

Bad Request

*   application/json object   

Show application/json properties 

    *   errors array of objects Required   

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional error object metadata. 
        *   title string Required   Description of the error. 
        *   detail string   Extra information about the error. 

#### 401

Unauthorized, invalid JWT

*   application/json object   

Show application/json properties 

    *   errors array of objects Required   

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional error object metadata. 
        *   title string Required   Description of the error. 
        *   detail string   Extra information about the error. 

#### 403

Unable to access the provided AWS-KMS key, access is forbidden. Check if AWS key policy allows access from Qlik Cloud.

*   application/json object   

Show application/json properties 

    *   errors array of objects Required   

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional error object metadata. 
        *   title string Required   Description of the error. 
        *   detail string   Extra information about the error. 

#### 406

Failed to register the provided AWS-KMS key

*   application/json object   

Show application/json properties 

    *   errors array of objects Required   

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional error object metadata. 
        *   title string Required   Description of the error. 
        *   detail string   Extra information about the error. 

#### 408

Failed to return a response within the timeout window. The key provider (QlikVault, AWS-KMS) might be unavailable.

*   application/json object   

Show application/json properties 

    *   errors array of objects Required   

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional error object metadata. 
        *   title string Required   Description of the error. 
        *   detail string   Extra information about the error. 

#### 409

The provided key is already registered

*   application/json object   

Show application/json properties 

    *   errors array of objects Required   

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional error object metadata. 
        *   title string Required   Description of the error. 
        *   detail string   Extra information about the error. 

#### 417

Failed to validate AWS-KMS ARN structure

*   application/json object   

Show application/json properties 

    *   errors array of objects Required   

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional error object metadata. 
        *   title string Required   Description of the error. 
        *   detail string   Extra information about the error. 

 POST /api/v1/encryption/keyproviders

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.encryption.createEncryptionKeyprovider(  {    arn: 'arn:aws:kms:eu-west-1:111222334455:key/mrk-1237c011a37erft67ei987c7612q456',    description: 'test description',    multiRegion: true,    name: 'test name',    replicaKeys: [      {        arn: 'arn:aws:kms:eu-west-3:111222334455:key/mrk-1237c011a37erft67ei987c7612q456',        region: 'eu-west-3',      },    ],  },)
```

`qlik encryption keyprovider create \  --arn 'arn:aws:kms:eu-west-1:111222334455:key/mrk-1237c011a37erft67ei987c7612q456' \  --keyprovider 'AWS-KMS' \  --name 'test name'`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/encryption/keyproviders" \-X POST \-H "Authorization: Bearer <access_token>" \-H "Content-type: application/json" \-d '{"arn":"arn:aws:kms:eu-west-1:111222334455:key/mrk-1237c011a37erft67ei987c7612q456","name":"test name","current":false,"description":"test description","drCompliant":true,"keyprovider":"AWS-KMS","multiRegion":true,"replicaKeys":[{"arn":"arn:aws:kms:eu-west-3:111222334455:key/mrk-1237c011a37erft67ei987c7612q456","region":"eu-west-3"}],"complianceError":[{"code":"","region":"","message":""}]}'`

### Example Response

`{  "arn": "arn:aws:kms:eu-west-1:111222334455:key/mrk-1237c011a37erft67ei987c7612q456",  "name": "test name",  "current": false,  "description": "test description",  "drCompliant": true,  "keyprovider": "AWS-KMS",  "multiRegion": true,  "replicaKeys": [    {      "arn": "arn:aws:kms:eu-west-3:111222334455:key/mrk-1237c011a37erft67ei987c7612q456",      "region": "eu-west-3"    }  ],  "complianceError": [    {      "code": "",      "region": "",      "message": ""    }  ]}`

## [](https://qlik.dev/apis/rest/encryption/#get-api-v1-encryption-keyproviders-arnFingerPrint)Retrieve key for a given ARN fingerprint.

Retrieve key provider detail by passing the ARN fingerprint as parameter.

### Facts

Rate limit[Tier 1](https://qlik.dev/apis/rest/rate-limiting/)(1000 requests per minute)

### Header Parameters

*   Authorization string Required   The JWT used for authentication. Send the JWT in the request header using the Bearer schema. 

### Path Parameters

*   arnFingerPrint string Required   The fingerprint of the requested provider key. 

### Responses

#### 200

Successfully fetched key provider information

*   application/json object   

Show application/json properties 

    *   arn string Required   The provider resource notation for the key. 
    *   name string Required   Name of key provider entry. 
    *   current boolean   Indicates whether the key is being used to encrypt/decrypt secrets. 
    *   tenantId string   Tenant ID. 
    *   createdAt string   When key entry was created. 
format = "date-time"

    *   description string   Description of key provider entry. 
    *   keyprovider string Required   Key Provider type. 
Can be one of: "AWS-KMS"

    *   multiRegion boolean   Indicates whether the key has multi-region configurations and has replica key in qcs secondary region. 
    *   replicaKeys array of objects   

Show replicaKeys properties 

        *   arn string   Replica key keeps list of backup keys from the supported qcs secondary region. 
        *   region string   Region indicates the backup qcs-region link to the primary region. 

    *   arnFingerPrint string   The ARN fingerprint. 
    *   promotedToCurrentAt string   When the key was promoted to being the current active one. 
format = "date-time"

    *   demotedFromCurrentAt string   When the key was demoted from being current to non active. 
format = "date-time"

#### 400

Bad Request

*   application/json object   

Show application/json properties 

    *   errors array of objects Required   

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional error object metadata. 
        *   title string Required   Description of the error. 
        *   detail string   Extra information about the error. 

#### 404

No entry match for the fingerprint was found

*   application/json object   

Show application/json properties 

    *   errors array of objects Required   

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional error object metadata. 
        *   title string Required   Description of the error. 
        *   detail string   Extra information about the error. 

#### 414

Requested fingerprint length is too large

*   application/json object   

Show application/json properties 

    *   errors array of objects Required   

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional error object metadata. 
        *   title string Required   Description of the error. 
        *   detail string   Extra information about the error. 

 GET /api/v1/encryption/keyproviders/{arnFingerPrint}

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.encryption.getEncryptionKeyprovider(  'string',)
```

`qlik encryption keyprovider get 'string'`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/encryption/keyproviders/{arnFingerPrint}" \-H "Authorization: Bearer <access_token>"`

### Example Response

`{  "arn": "arn:aws:kms:eu-west-1:111222334455:key/mrk-1237c011a37erft67ei987c7612q456",  "name": "test name",  "current": false,  "description": "test description",  "drCompliant": true,  "keyprovider": "AWS-KMS",  "multiRegion": true,  "replicaKeys": [    {      "arn": "arn:aws:kms:eu-west-3:111222334455:key/mrk-1237c011a37erft67ei987c7612q456",      "region": "eu-west-3"    }  ],  "complianceError": [    {      "code": "",      "region": "",      "message": ""    }  ]}`

## [](https://qlik.dev/apis/rest/encryption/#patch-api-v1-encryption-keyproviders-arnFingerPrint)Patches Name & Description of a given key provider.

Update the name and/or description of a key provider.

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)

### Header Parameters

*   Authorization string Required   The JWT used for authentication. Send the JWT in the request header using the Bearer schema. 

### Path Parameters

*   arnFingerPrint string Required   The ARN fingerprint of an existing key provider key. 

### Request Body

Required

*   application/json array of objects   A JSON Patch document as defined in [https://datatracker.ietf.org/doc/html/rfc6902](https://datatracker.ietf.org/doc/html/rfc6902). 

Show application/json properties 

    *   op string Required   The operation to be performed. 
Can be one of: "replace"

    *   path string Required   The property path. 
    *   value string Required   The value to be used for this operation. 

### Responses

#### 204

Successfully patched key provider information

#### 400

Failed to decode key provider patch request payload

*   application/json object   

Show application/json properties 

    *   errors array of objects Required   

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional error object metadata. 
        *   title string Required   Description of the error. 
        *   detail string   Extra information about the error. 

#### 401

Unauthorized, invalid JWT

*   application/json object   

Show application/json properties 

    *   errors array of objects Required   

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional error object metadata. 
        *   title string Required   Description of the error. 
        *   detail string   Extra information about the error. 

#### 404

No entry match for the fingerprint was found

*   application/json object   

Show application/json properties 

    *   errors array of objects Required   

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional error object metadata. 
        *   title string Required   Description of the error. 
        *   detail string   Extra information about the error. 

#### 417

Failed to patch key provider information

*   application/json object   

Show application/json properties 

    *   errors array of objects Required   

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional error object metadata. 
        *   title string Required   Description of the error. 
        *   detail string   Extra information about the error. 

 PATCH /api/v1/encryption/keyproviders/{arnFingerPrint}

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.encryption.patchEncryptionKeyprovider(  'string',  [    {      op: 'replace',      path: '/name',      value: 'New Encryption Key',    },  ],)
```

`qlik encryption keyprovider patch 'string' \  --op 'replace' \  --path '/name' \  --value 'New Encryption Key'`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/encryption/keyproviders/{arnFingerPrint}" \-X PATCH \-H "Authorization: Bearer <access_token>" \-H "Content-type: application/json" \-d '[{"op":"replace","path":"/name","value":"New Encryption Key"}]'`

## [](https://qlik.dev/apis/rest/encryption/#delete-api-v1-encryption-keyproviders-arnFingerPrint)Deletes the given key from the tenant.

Delete a key configuration from the tenant. Not supported for the default Qlik managed key provider. Key must not be in use.

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)

### Header Parameters

*   Authorization string Required   The JWT used for authentication. Send the JWT in the request header using the Bearer schema. 

### Path Parameters

*   arnFingerPrint string Required   The fingerprint of the key provider you wish to delete. 

### Responses

#### 204

Successfully deleted key

*   application/json object   

Show application/json properties 

    *   response string   Successful response message. 
format = "text"

#### 400

Bad Request

*   application/json object   

Show application/json properties 

    *   errors array of objects Required   

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional error object metadata. 
        *   title string Required   Description of the error. 
        *   detail string   Extra information about the error. 

#### 404

No entry match for the fingerprint was found

*   application/json object   

Show application/json properties 

    *   errors array of objects Required   

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional error object metadata. 
        *   title string Required   Description of the error. 
        *   detail string   Extra information about the error. 

#### 417

Failed to delete key provider information

*   application/json object   

Show application/json properties 

    *   errors array of objects Required   

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional error object metadata. 
        *   title string Required   Description of the error. 
        *   detail string   Extra information about the error. 

#### 424

The requested key is being used and cannot be deleted

*   application/json object   

Show application/json properties 

    *   errors array of objects Required   

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional error object metadata. 
        *   title string Required   Description of the error. 
        *   detail string   Extra information about the error. 

 DELETE /api/v1/encryption/keyproviders/{arnFingerPrint}

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.encryption.deleteEncryptionKeyprovider(  'string',)
```

`qlik encryption keyprovider rm 'string'`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/encryption/keyproviders/{arnFingerPrint}" \-X DELETE \-H "Authorization: Bearer <access_token>"`

### Example Response

`{  "message": "Key provider metadata deleted successfully"}`

## [](https://qlik.dev/apis/rest/encryption/#post-api-v1-encryption-keyproviders-arnFingerPrint-actions-migrate)Migrate existing cipherkeys from current key provider to requested key provider.

Migrate the active key from one provider to another. The migration process may take some time to complete, however this process will not impact users, and the tenant will continue to function normally during the migration. Use the migration details endpoint to monitor migration progress.

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)

### Header Parameters

*   Authorization string Required   The JWT used for authentication. Send the JWT in the request header using the Bearer schema. 

### Path Parameters

*   arnFingerPrint string Required   The fingerprint of an existing key provider key. 

### Responses

#### 200

Successfully initiated cipherkeys migration

*   application/json object   

Show application/json properties 

    *   id string   Migration operation ID. 
format = "uid"

    *   state string   Migration operation state. 
Can be one of: "New""InProgress""Completed"

    *   progress number   Progress in percentage. 
    *   tenantId string   Tenant ID. 
format = "uid"

    *   completedAt string   
format = "date-time"

    *   initiatedAt string   
format = "date-time"

    *   migratingTo string   The new key ARN that keys should be migrated to. 
    *   migratingFrom string   The key ARN being migrated from (in case of QlikVault, could be a short name only). 
    *   migratingToPrefix string   The new key prefix (to help services know which prefix should NOT be migrated). 
    *   migratingToFingerprint string   The new key ARN fingerprint. 

#### 400

Bad Request

*   application/json object   

Show application/json properties 

    *   errors array of objects Required   

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional error object metadata. 
        *   title string Required   Description of the error. 
        *   detail string   Extra information about the error. 

#### 401

Unauthorized, invalid JWT

*   application/json object   

Show application/json properties 

    *   errors array of objects Required   

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional error object metadata. 
        *   title string Required   Description of the error. 
        *   detail string   Extra information about the error. 

#### 404

No entry match for the fingerprint was found

*   application/json object   

Show application/json properties 

    *   errors array of objects Required   

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional error object metadata. 
        *   title string Required   Description of the error. 
        *   detail string   Extra information about the error. 

#### 412

Failed to initiate migration

*   application/json object   

Show application/json properties 

    *   errors array of objects Required   

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional error object metadata. 
        *   title string Required   Description of the error. 
        *   detail string   Extra information about the error. 

#### 424

Failed to prepare migration

*   application/json object   

Show application/json properties 

    *   errors array of objects Required   

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional error object metadata. 
        *   title string Required   Description of the error. 
        *   detail string   Extra information about the error. 

#### 428

There is already an ongoing migration for the tenant

*   application/json object   

Show application/json properties 

    *   errors array of objects Required   

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional error object metadata. 
        *   title string Required   Description of the error. 
        *   detail string   Extra information about the error. 

 POST /api/v1/encryption/keyproviders/{arnFingerPrint}/actions/migrate

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.encryption.migrateEncryptionKeyprovider(  'string',)
```

`qlik encryption keyprovider migrate 'string'`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/encryption/keyproviders/{arnFingerPrint}/actions/migrate" \-X POST \-H "Authorization: Bearer <access_token>"`

### Example Response

`{  "id": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",  "state": "New",  "progress": 42,  "tenantId": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",  "completedAt": "2018-10-30T07:06:22Z",  "initiatedAt": "2018-10-30T07:06:22Z",  "migratingTo": "string",  "migratingFrom": "string",  "migratingToPrefix": "string",  "migratingToFingerprint": "string"}`

## [](https://qlik.dev/apis/rest/encryption/#post-api-v1-encryption-keyproviders-arnFingerPrint-actions-test)Validate AWS-KMS key access.

Validate a key to check if Qlik Cloud has required access to your AWS account and key policy, and the key configuration. If the key policy or configuration are changed from the required configuration, this may impact your ability to access your tenant.

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)

### Header Parameters

*   Authorization string Required   The JWT used for authentication. Send the JWT in the request header using the Bearer schema. 

### Path Parameters

*   arnFingerPrint string Required   The fingerprint of an existing key provider key. 

### Responses

#### 201

Successfully validated key

*   application/json object   

Show application/json properties 

    *   arn string Required   The provider resource notation for the key. 
    *   name string Required   Name of key provider entry. 
    *   current boolean   Indicates whether the key is being used to encrypt/decrypt secrets. 
    *   tenantId string   Tenant ID. 
    *   createdAt string   When key entry was created. 
format = "date-time"

    *   description string   Description of key provider entry. 
    *   keyprovider string Required   Key Provider type. 
Can be one of: "AWS-KMS"

    *   multiRegion boolean   Indicates whether the key has multi-region configurations and has replica key in qcs secondary region. 
    *   replicaKeys array of objects   

Show replicaKeys properties 

        *   arn string   Replica key keeps list of backup keys from the supported qcs secondary region. 
        *   region string   Region indicates the backup qcs-region link to the primary region. 

    *   arnFingerPrint string   The ARN fingerprint. 
    *   promotedToCurrentAt string   When the key was promoted to being the current active one. 
format = "date-time"

    *   demotedFromCurrentAt string   When the key was demoted from being current to non active. 
format = "date-time"

#### 400

Bad Request

*   application/json object   

Show application/json properties 

    *   errors array of objects Required   

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional error object metadata. 
        *   title string Required   Description of the error. 
        *   detail string   Extra information about the error. 

#### 401

Unauthorized, invalid JWT

*   application/json object   

Show application/json properties 

    *   errors array of objects Required   

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional error object metadata. 
        *   title string Required   Description of the error. 
        *   detail string   Extra information about the error. 

#### 404

No entry match for the fingerprint was found

*   application/json object   

Show application/json properties 

    *   errors array of objects Required   

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional error object metadata. 
        *   title string Required   Description of the error. 
        *   detail string   Extra information about the error. 

#### 408

Failed to return a response within the timeout window. The key provider (QlikVault, AWS-KMS) might be unavailable.

*   application/json object   

Show application/json properties 

    *   errors array of objects Required   

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional error object metadata. 
        *   title string Required   Description of the error. 
        *   detail string   Extra information about the error. 

 POST /api/v1/encryption/keyproviders/{arnFingerPrint}/actions/test

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.encryption.testEncryptionKeyprovider(  'string',)
```

`qlik encryption keyprovider test 'string'`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/encryption/keyproviders/{arnFingerPrint}/actions/test" \-X POST \-H "Authorization: Bearer <access_token>"`

### Example Response

`{  "arn": "arn:aws:kms:eu-west-1:111222334455:key/mrk-1237c011a37erft67ei987c7612q456",  "name": "test name",  "current": false,  "description": "test description",  "drCompliant": true,  "keyprovider": "AWS-KMS",  "multiRegion": true,  "replicaKeys": [    {      "arn": "arn:aws:kms:eu-west-3:111222334455:key/mrk-1237c011a37erft67ei987c7612q456",      "region": "eu-west-3"    }  ],  "complianceError": [    {      "code": "",      "region": "",      "message": ""    }  ]}`

## [](https://qlik.dev/apis/rest/encryption/#get-api-v1-encryption-keyproviders-actions-list)Lists all key providers registered for the tenant.

Returns a list of all key providers in the tenant, including the default Qlik key provider.

### Facts

Rate limit[Tier 1](https://qlik.dev/apis/rest/rate-limiting/)(1000 requests per minute)

### Header Parameters

*   Authorization string Required   The JWT used for authentication. Send the JWT in the request header using the Bearer schema. 

### Responses

#### 200

Successfully retrieved list of key providers

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   arn string Required   The provider resource notation for the key. 
        *   name string Required   Name of key provider entry. 
        *   current boolean   Indicates whether the key is being used to encrypt/decrypt secrets. 
        *   tenantId string   Tenant ID. 
        *   createdAt string   When key entry was created. 
format = "date-time"

        *   description string   Description of key provider entry. 
        *   keyprovider string Required   Key Provider type. 
Can be one of: "AWS-KMS"

        *   multiRegion boolean   Indicates whether the key has multi-region configurations and has replica key in qcs secondary region. 
        *   replicaKeys array of objects   

Show replicaKeys properties 

            *   arn string   Replica key keeps list of backup keys from the supported qcs secondary region. 
            *   region string   Region indicates the backup qcs-region link to the primary region. 

        *   arnFingerPrint string   The ARN fingerprint. 
        *   promotedToCurrentAt string   When the key was promoted to being the current active one. 
format = "date-time"

        *   demotedFromCurrentAt string   When the key was demoted from being current to non active. 
format = "date-time"

#### 400

Bad Request

*   application/json object   

Show application/json properties 

    *   errors array of objects Required   

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional error object metadata. 
        *   title string Required   Description of the error. 
        *   detail string   Extra information about the error. 

#### 417

Failed to load list of key providers

*   application/json object   

Show application/json properties 

    *   errors array of objects Required   

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional error object metadata. 
        *   title string Required   Description of the error. 
        *   detail string   Extra information about the error. 

 GET /api/v1/encryption/keyproviders/actions/list

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.encryption.listEncryptionKeyproviders()
```

`qlik encryption keyprovider list`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/encryption/keyproviders/actions/list" \-H "Authorization: Bearer <access_token>"`

### Example Response

`[  {    "arn": "#QLIK_MANAGED_KEY_PROVIDER#",    "name": "Qlik Internal Kms",    "tenantId": "ImTRa-bkJTD-NZRYjNBa_rDhwSVA6Qo8",    "createdAt": "Qlik managed",    "description": "Default key management service",    "keyprovider": "Qlik",    "arnFingerPrint": "ImTRa-bkJTD-NZRYjNBa_rDhwSVA6Qo8",    "promotedToCurrentAt": "2023-06-21T18:45:57Z",    "demotedFromCurrentAt": "0001-01-01T00:00:00Z"  },  {    "arn": "arn:aws:kms:eu-west-1:111222334455:key/mrk-1237c011a37erft67ei987c7612q456",    "name": "CMK - 01",    "tenantId": "ImTRa-bkJTD-NZRYjNBa_rDhwSVA6Qo8",    "createdAt": "2023-06-21T18:43:49Z",    "drCompliant": true,    "keyprovider": "AWS-KMS",    "multiRegion": true,    "replicaKeys": [      {        "arn": "arn:aws:kms:eu-west-3:111222334455:key/mrk-1237c011a37erft67ei987c7612q456",        "region": "eu-west-3"      }    ],    "arnFingerPrint": "9f352c5a9c1618485051892cb57467e4",    "complianceError": {      "code": "",      "region": "",      "message": ""    },    "promotedToCurrentAt": "2023-06-21T18:43:54Z",    "demotedFromCurrentAt": "2023-06-21T18:45:57Z"  },  {    "arn": "arn:aws:kms:eu-west-1:111222334455:key/mrk-2678f8123w236c3123469387dc2ce561",    "name": "CMK - 02",    "current": true,    "tenantId": "ImTRa-bkJTD-NZRYjNBa_rDhwSVA6Qo8",    "createdAt": "2023-06-21T18:59:17Z",    "description": "CMK migration test",    "drCompliant": false,    "keyprovider": "AWS-KMS",    "multiRegion": true,    "replicaKeys": [      {        "arn": "arn:aws:kms:eu-west-3:111222334455:key/mrk-2678f8123w236c3123469387dc2ce561",        "region": "eu-west-3"      }    ],    "arnFingerPrint": "12342c83b25f9e36543bca28f69e4210",    "complianceError": {      "code": "Encryption-88",      "region": "eu-west-3",      "message": "The policy of the provided key does not allow the required action [eu-west-3] [GenerateDataKey]."    },    "promotedToCurrentAt": "2023-06-21T18:59:18Z",    "demotedFromCurrentAt": "0001-01-01T00:00:00Z"  }]`

## [](https://qlik.dev/apis/rest/encryption/#post-api-v1-encryption-keyproviders-actions-reset-to-default-provider)Reset tenant key provider to default Qlik managed provider.

Reset the encryption key back to the default Qlik managed provider. No action will be taken if tenant is already using the Qlik provider.

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)

### Header Parameters

*   Authorization string Required   The JWT used for authentication. Send the JWT in the request header using the Bearer schema. 

### Responses

#### 200

Tenant is already using Qlik Managed provider, no action taken

*   application/json object   

Show application/json properties 

    *   message string   Tenant is already using Qlik KMS, no migration is required. 

#### 205

Successfully initiated key migration to Qlik managed provider

*   application/json object   

Show application/json properties 

    *   id string   Migration operation ID. 
format = "uid"

    *   state string   Migration operation state. 
Can be one of: "New""InProgress""Completed"

    *   progress number   Progress in percentage. 
    *   tenantId string   Tenant ID. 
format = "uid"

    *   completedAt string   
format = "date-time"

    *   initiatedAt string   
format = "date-time"

    *   migratingTo string   The new key ARN that keys should be migrated to. 
    *   migratingFrom string   The key ARN being migrated from (in case of QlikVault, could be a short name only). 
    *   migratingToPrefix string   The new key prefix (to help services know which prefix should NOT be migrated). 
    *   migratingToFingerprint string   The new key ARN fingerprint. 

#### 401

Unauthorized, invalid JWT

*   application/json object   

Show application/json properties 

    *   errors array of objects Required   

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional error object metadata. 
        *   title string Required   Description of the error. 
        *   detail string   Extra information about the error. 

#### 406

There is already an ongoing migration in progress for this tenant, this must complete before a new migration can be started

*   application/json object   

Show application/json properties 

    *   errors array of objects Required   

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional error object metadata. 
        *   title string Required   Description of the error. 
        *   detail string   Extra information about the error. 

#### 412

Failed to initiate migration to Qlik managed provider

*   application/json object   

Show application/json properties 

    *   errors array of objects Required   

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional error object metadata. 
        *   title string Required   Description of the error. 
        *   detail string   Extra information about the error. 

#### 424

Tenant is already using Qlik Managed provider

*   application/json object   

Show application/json properties 

    *   errors array of objects Required   

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional error object metadata. 
        *   title string Required   Description of the error. 
        *   detail string   Extra information about the error. 

 POST /api/v1/encryption/keyproviders/actions/reset-to-default-provider

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.encryption.resetEncryptionKeyproviders()
```

`qlik encryption keyprovider reset-to-default-provider`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/encryption/keyproviders/actions/reset-to-default-provider" \-X POST \-H "Authorization: Bearer <access_token>"`

### Example Response

`{  "message": "Tenant is already using Qlik KMS, no migration is required."}`

## [](https://qlik.dev/apis/rest/encryption/#get-api-v1-encryption-keyproviders-migration-actions-details)Retrieve most recent migration details.

Retrieve details for the ongoing or last completed migration for the tenant.

### Facts

Rate limit[Tier 1](https://qlik.dev/apis/rest/rate-limiting/)(1000 requests per minute)

### Header Parameters

*   Authorization string Required   The JWT used for authentication. Send the JWT in the request header using the Bearer schema. 

### Responses

#### 200

Successfully fetched migration information

*   application/json object   

Show application/json properties 

    *   id string   Migration operation ID. 
format = "uid"

    *   state string   Migration operation state. 
Can be one of: "New""InProgress""Completed"

    *   progress number   Progress in percentage. 
    *   tenantId string   Tenant ID. 
format = "uid"

    *   completedAt string   
format = "date-time"

    *   initiatedAt string   
format = "date-time"

    *   migratingTo string   The new key ARN that keys should be migrated to. 
    *   migratingFrom string   The key ARN being migrated from (in case of QlikVault, could be a short name only). 
    *   migratingToPrefix string   The new key prefix (to help services know which prefix should NOT be migrated). 
    *   migratingToFingerprint string   The new key ARN fingerprint. 

#### 400

Bad Request

*   application/json object   

Show application/json properties 

    *   errors array of objects Required   

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional error object metadata. 
        *   title string Required   Description of the error. 
        *   detail string   Extra information about the error. 

#### 401

Unauthorized, invalid JWT

*   application/json object   

Show application/json properties 

    *   errors array of objects Required   

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional error object metadata. 
        *   title string Required   Description of the error. 
        *   detail string   Extra information about the error. 

#### 404

There is no ongoing migration for this tenant

*   application/json object   

Show application/json properties 

    *   errors array of objects Required   

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional error object metadata. 
        *   title string Required   Description of the error. 
        *   detail string   Extra information about the error. 

#### 417

Failed to get ongoing migration information

*   application/json object   

Show application/json properties 

    *   errors array of objects Required   

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional error object metadata. 
        *   title string Required   Description of the error. 
        *   detail string   Extra information about the error. 

 GET /api/v1/encryption/keyproviders/migration/actions/details

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.encryption.getEncryptionKeyprovidersMigrationDetails()
```

`qlik encryption keyprovider migration-details`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/encryption/keyproviders/migration/actions/details" \-H "Authorization: Bearer <access_token>"`

### Example Response

`{  "id": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",  "state": "New",  "progress": 42,  "tenantId": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",  "completedAt": "2018-10-30T07:06:22Z",  "initiatedAt": "2018-10-30T07:06:22Z",  "migratingTo": "string",  "migratingFrom": "string",  "migratingToPrefix": "string",  "migratingToFingerprint": "string"}`

Was this page helpful?
*   yes 
*   no 

![Image 2: Qlik logo](https://qlik.dev/logo-footer.svg)

[Qlik Community](https://community.qlik.com/)

[](https://join.slack.com/t/qlikdeveloper/shared_invite/zt-3wrdlkhog-Dcq9LuCbjNQVN2XaPlgGqQ)[](https://www.facebook.com/qlik)[](https://www.linkedin.com/company/qlik)[](https://x.com/qlikdeveloper)

[Legal Agreements](https://www.qlik.com/us/legal/legal-agreements) / [Legal Policies](https://www.qlik.com/us/legal/legal-policies) / [Privacy & Cookie Notice](https://www.qlik.com/us/legal/privacy-and-cookie-notice) / [Terms of Use](https://qlik.dev/qlik-developer-portal-terms-of-use.pdf) / Do Not Share My Info

 Copyright © 1993-2026 QlikTech International AB. All rights reserved.