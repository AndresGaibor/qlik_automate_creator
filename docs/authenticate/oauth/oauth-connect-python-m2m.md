---
source: https://qlik.dev/authenticate/oauth/oauth-connect-python-m2m/
last_updated: 2025-07-08T16:09:30Z
---

# Authorize the Platform SDK using OAuth

## Introduction

In this tutorial, you're going to use Qlik Platform SDK for Python
with a machine-to-machine OAuth2 client enabled in your Qlik Cloud tenant to
perform administrative jobs. After setting up the Python Platform SDK,
you're going to use it to test connectivity to your tenant and access content
metadata.

> **Note:** This is a step-by-step introduction intended for beginners.
>
> If you're already familiar with the basics of using the Platform SDK,
> a how-to guide like [Maintain space access control and content](https://help.qlik.com/en-US/cloud-services/Subsystems/Hub/Content/Sense_Hub/Spaces/Spaces.htm) on Qlik Help
> is probably more appropriate.

## Requirements

- A Qlik Cloud tenant
- A machine-to-machine (M2M) OAuth2 client registration on your tenant. You can
  create an OAuth2 client in
  the [Management console](https://qlik.dev/authenticate/oauth/create/create-oauth-client/).
- `Client ID` and `Client Secret` values from the (M2M) registration
- Python 3.8 or greater
- Latest version of the [Python SDK](https://pypi.org/project/qlik-sdk/)

## Install the latest version of the SDK

From a terminal prompt, use `pip` to install the `qlik-sdk`.

```bash
python3 -m pip install --upgrade qlik-sdk
```

## Write a script to access Qlik Cloud

Create a Python (`.py`) file and open your favorite text editor or IDE to edit it.

Import the `Auth`, `AuthType`, and `Config` modules from `qlik_sdk`.

`embed:./snippets/platform-sdk/python/python-sdk-oauth-m2m.py#L1`

### Create an OAuth2 authorization configuration

Define the client configuration by adding the host name for your Qlik Cloud
tenant along with the `Client ID` and `Client Secret` that you obtained from
the [OAuth2 configuration](https://qlik.dev/authenticate/oauth/create/create-oauth-client/)
you created in the Management Console.

`embed:./snippets/platform-sdk/python/python-sdk-oauth-m2m.py#L5-12`

Authorize the client connection by issuing the `authorize` command.

`embed:./snippets/platform-sdk/python/python-sdk-oauth-m2m.py#L15`

### Test the configuration

Add a request to the `/users/me` endpoint. Print the response to retrieve user
information about the machine-to-machine user.

`embed:./snippets/platform-sdk/python/python-sdk-oauth-m2m.py#L18-19`

The response should look something like this JSON object.

```json
{
  "id": "63f916158e1f6167cecc156d",
  "tenantId": "G5CEeMHq69sddVX0SKmoi3YOn5AvvABj",
  "clientId": "54d8f5d26d57e71328c5bc93e0ad1382",
  "status": "active",
  "subject": "qlikbot\\54d8f5d26d57e71328c5bc93e0ad1382",
  "name": "Python-SDK",
  "roles": ["TenantAdmin"],
  "assignedRoles": [
    {
      "id": "608050f750afab80bd53586d",
      "name": "TenantAdmin",
      "type": "default",
      "level": "admin"
    }
  ],
  "assignedGroups": [],
  "groups": [],
  "createdAt": "2023-02-24T19:55:01.555Z",
  "lastUpdatedAt": "2023-02-24T19:55:01.555Z",
  "created": "2023-02-24T19:55:01.555Z",
  "lastUpdated": "2023-02-24T19:55:01.555Z",
  "links": {
    "self": {
      "href": "https://tenant.region.qlikcloud.com/api/v1/users/63f916158e1f6167cecc156d"
    }
  }
}
```

## Complete code sample

`embed:./snippets/platform-sdk/python/python-sdk-oauth-m2m.py`
