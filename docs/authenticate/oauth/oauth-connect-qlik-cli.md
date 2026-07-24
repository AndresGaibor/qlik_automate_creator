---
source: https://qlik.dev/authenticate/oauth/oauth-connect-qlik-cli/
last_updated: 2025-07-08T16:09:30Z
---

# Authorize qlik-cli using OAuth

## Introduction

In this tutorial, you are going to configure qlik-cli to use a machine-to-machine
OAuth2 client enabled in your Qlik Cloud tenant. After setting up qlik-cli,
you are going to use qlik-cli to issue commands to test the connectivity to
your tenant.

> **Note:** This is a step-by-step introduction intended for beginners.
>
> If you're already familiar with the basics of setting up a context in qlik-cli
> and issuing commands, a how-to guide
> like [Creating and
> deleting apps in bulk with qlik-cli](https://qlik.dev/manage/automate/qlik-cli-snippets-bulk-create-delete) is probably more appropriate.

## Requirements

- A Qlik Cloud tenant
- A machine-to-machine (M2M) OAuth2 client registration on your tenant. You can
  create an OAuth2 client in the [management console](https://qlik.dev/authenticate/oauth/create/create-oauth-client)
- `Client ID` and `Client Secret` values from the (M2M) registration
- Latest version of [qlik-cli](https://qlik.dev/toolkits/qlik-cli/)

## Create a new context in qlik-cli

Open a terminal window, command line, or PowerShell ISE and issue `qlik context init`
command followed by a name to give to the new entry.

```bash
qlik context init <context name>
```

Enter the full tenant URL for your Qlik Cloud tenant. Tenant URLs are in the
form `https://<tenant>.<region>.qlikcloud.com` where the tenant value can be
either the unique hostname or alias name, and the region is the two character
code where the tenant resides.

```text
Acquiring access to Qlik Cloud

Specify your tenant URL, usually in the form: https://<tenant>.<region>.qlikcloud.com
Where <tenant> is the name of the tenant and <region> is eu, us, ap, and so forth.
Enter tenant url:
```

Enter the letter `O` (not zero) to indicate OAuth as the authentication type
for this context.

```text
Specify what type of authentication should be used i.e API-Key (A) or OAuth (O). Default is API-Key (A).
A/O?: O
```

Enter the `Client ID` and press the Enter key. Enter the `Client Secret` and
press the Enter key again.

> **Note:** The `Client Secret` value will not print as you paste or type into the input.
> Make sure if you paste the value, there are no trailing spaces or line break
> characters or the configuration will fail.

```text
To complete this setup, you must have a Client ID and Client Secret for OAuth.
If you're unsure, you can ask your tenant-admin or go to https://qlik.dev/toolkits/qlik-cli.

Client ID: <my-client-id>

Client Secret: <my-client-secret>
```

Upon successful configuration, you can enter a command like `qlik user me` to
retrieve user information for the machine-to-machine client application on
your Qlik tenant.

```bash
qlik user me
```

The response should look something like this JSON snippet.

```json

{
  "assignedGroups": [],
  "assignedRoles": [
    {
      "id": "608050f750afab80bd53586d",
      "level": "admin",
      "name": "TenantAdmin",
      "type": "default"
    }
  ],
  "clientId": "82e0c353eca9a5d849c74d7e98f13f7e",
  "created": "2023-02-13T20:58:00.094Z",
  "createdAt": "2023-02-13T20:58:00.094Z",
  "groups": [],
  "id": "63eaa458f058b73eeb50e0b9",
  "lastUpdated": "2023-02-13T20:58:00.094Z",
  "lastUpdatedAt": "2023-02-13T20:58:00.094Z",
  "name": "qlik-cli m2m",
  "roles": [
    "TenantAdmin"
  ],
  "status": "active",
  "subject": "qlikbot\\82e0c353eca9a5d849c74d7e98f13f7e",
  "tenantId": "7jUtftp6F4cMaxpejxM60DgFj03Z5L_V"
}

```

## Learn more about using qlik-cli to automate your Qlik Cloud workflow with these articles
