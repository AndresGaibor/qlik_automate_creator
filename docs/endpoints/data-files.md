---
title: "Data files REST | Qlik Developer Portal"
source_url: "https://qlik.dev/apis/rest/data-files/"
local_path: "docs/endpoints/data-files.md"
---

Title: Data files REST | Qlik Developer Portal


Skip to content
Authenticate
Embed
Extend
Manage
APIs
Toolkits
Changelog
Light
Dark
System
Home
/
APIs
/
REST
Copy page
Data files

Data files represent the flat file storage associated with spaces in your Qlik Cloud tenant. Each space will have a corresponding data files connection, which you can list with data-connections.

Download OpenAPI spec
Endpoints
GET
/api/v1/data-files
POST
/api/v1/data-files
GET
/api/v1/data-files/{id}
PUT
/api/v1/data-files/{id}
DELETE
/api/v1/data-files/{id}
POST
/api/v1/data-files/{id}/actions/change-owner
POST
/api/v1/data-files/{id}/actions/change-space
POST
/api/v1/data-files/actions/change-space
POST
/api/v1/data-files/actions/delete
GET
/api/v1/data-files/connections
GET
/api/v1/data-files/connections/{id}
GET
/api/v1/data-files/quotas
Get descriptive info for the specified data files.
Facts
	Rate limit	Tier 1 (1000 requests per minute)
Query Parameters
allowInternalFiles
boolean

If set to false, do not return data files with internal extensions else return all the data files.

default = false

appId
string

Only return files scoped to the specified app. If this parameter is not specified, only files that are not scoped to any app are returned. "*" implies all app-scoped files are returned.

baseNameWildcard
string

If present, return only items whose base name matches the given wildcard. Wildcards include '*' and '?' characters to allow for multiple matches. The base name is the actual file or folder name without any folder pathing included.

connectionId
string

Return files and folders that reside in the space referenced by the specified DataFiles connection. If this parameter is not specified, the user's personal space is implied.

format = "uuid"

excludeFiles
boolean

If set to true, exclude files in the returned list (IE, only return folders). If false, include files.

default = false

excludeSubFolders
boolean

If set to true, exclude folders and files that reside in sub-folders of the root being searched. If false, include all items in full folder hierarchy that recursively reside under the root. That is, setting to true results in only the direct children of the root being returned.

default = false

folderId
string

If present, return only items which reside under the folder specified by the given ID. If not present, items that live at the root of the space are returned. This property is mutually exclusive with 'folderPath'.

format = "uuid"

folderPath
string

If present, return only items which reside under the specified folder path. If not present, items that live at the root of the space are returned. This property is mutually exclusive with 'folderId'.

includeAllSpaces
boolean

If set to true, and connectionId is not specified, return files and folders from all spaces the given user has access to (including the personal space). If connectionId is specified, this parameter is ignored.

default = false

includeFolders
boolean

If set to true, include folders in the returned list. If false, only return data files.

default = false

includeFolderStats
boolean

If set to true, include computed folder statistics for folders in the returned list. If false, this information is not returned.

default = false

limit
integer

If present, the maximum number of data files to return.

minimum = 1, maximum = 1000, default = 20, format = int32, default = 20

name
string

Filter the list of files returned to the given file name.

notOwnerId
string

If present, fetch the data files whose owner is not the specified owner. If a connectionId is specified in this case, the returned list is constrained to the specified space. If connectionId is not specified, then the returned list is constrained to the calling user's personal space. If includeAllSpaces is set to true, and connectionId is not specified, the returned list is from all spaces the given user has access to (including the personal space).

ownerId
string

If present, fetch the data files for the specified owner. If a connectionId is specified in this case, the returned list is constrained to the specified space. If connectionId is not specified, then all files owned by the specified user are returned regardless of the personal space that a given file resides in.

page
string

If present, the cursor that starts the page of data that is returned.

sort
string

The name of the field used to sort the result. By default, the sort order is ascending. Putting a '+' prefix on the sort field name explicitly indicates ascending sort order. A '-' prefix indicates a descending sort order.

Can be one of: "name""+name""-name""size""+size""-size""modifiedDate""+modifiedDate""-modifiedDate""folder""+folder""-folder""baseName""+baseName""-baseName"

Responses
200

The file list was retrieved.

application/json
object
Show application/json properties
400

Bad Request

application/json
object
Show application/json properties
403

Forbidden

application/json
object
Show application/json properties
GET
/api/v1/data-files
JavaScript
Qlik CLI
cURL
import { createQlikApi } from '@qlik/api'


const qlik = createQlikApi({
  hostConfig: {
    host: 'https://{tenant}.{region}.qlikcloud.com',
    apiKey: '<access-token>',
  },
})


await qlik.dataFiles.getDataFiles({})
Example Response
{
  "data": [
    {
      "id": "ee6a390c-5d33-11e8-9c2d-fa7ae01bbebc",
      "qri": "qri:qdf:space://ooSOGoLLaq7EMaSdSsCiGvLwcd_VAf1oU0mzwSfp_Qs#wME89c8gKu_Tpz8W_a0JKSbKC4hzbNu0NLVgqi2UFS0",
      "name": "some/folder/MyFile.csv",
      "size": 1024,
      "appId": "f34b91a1-0dc3-44ac-a847-51cb84122c84",
      "folder": true,
      "actions": [
        "Read"
      ],
      "ownerId": "lDL4DIINndhL_iJkcbqWyJenuwizP-2D",
      "spaceId": "617979737a9f56e49dea2e6e",
      "baseName": "MyFile.csv",
      "folderId": "ee6a390c-5d33-11e8-9c2d-fa7ae01bbebc",
      "folderPath": "some/folder",
      "createdDate": "2020-07-07T20:52:40.8534780Z",
      "folderStats": {
        "totalFileCount": 50,
        "directFileCount": 50,
        "totalFolderCount": 50,
        "aggregateFileSize": 10000,
        "directFolderCount": 50,
        "totalInternalFileCount": 50,
        "directInternalFileCount": 50,
        "totalAppScopedFileCount": 50,
        "directAppScopedFileCount": 50,
        "aggregateInternalFileSize": 10000,
        "aggregateAppScopedFileSize": 10000
      },
      "modifiedDate": "2020-07-07T20:52:40.8534780Z",
      "contentUpdatedDate": "2020-07-07T20:52:40.8534780Z"
    }
  ],
  "links": {
    "next": {
      "href": "string"
    },
    "prev": {
      "href": "string"
    },
    "self": {
      "href": "string"
    }
  }
}
Upload a new data file or create a new folder.
Facts
	Rate limit	Tier 2 (100 requests per minute)
Request Body
multipart/form-data
object
Show multipart/form-data properties
Responses
201

New file or folder was created.

application/json
object
Show application/json properties
400

Bad Request

application/json
object
Show application/json properties
403

Forbidden

application/json
object
Show application/json properties
409

A file or folder with the same name already exists in the specified user or app scope.

application/json
object
Show application/json properties
413

The file exceeds the user's quota for maximum file size to upload.

application/json
object
Show application/json properties
423

The file is already locked for read or write by another client.

application/json
object
Show application/json properties
501

Not Implemented

application/json
object
Show application/json properties
POST
/api/v1/data-files
JavaScript
Qlik CLI
cURL
import { createQlikApi } from '@qlik/api'
import { readFileSync } from 'node:fs'


const qlik = createQlikApi({
  hostConfig: {
    host: 'https://{tenant}.{region}.qlikcloud.com',
    apiKey: '<access-token>',
  },
})


await qlik.dataFiles.uploadDataFile({
  File: new Uint8Array(
    readFileSync('<file-path>'),
  ),
  Json: {
    appId: 'f34b91a1-0dc3-44ac-a847-51cb84122c84',
    connectionId:
      'ee6a390c-5d33-11e8-9c2d-fa7ae01bbebc',
    folderId:
      'ee6a390c-5d33-11e8-9c2d-fa7ae01bbebc',
    name: 'some/folder/MyFile.csv',
    sourceId:
      'f34b91a1-0dc3-44ac-a847-51cb84122c84',
    tempContentFileId: '624b0f54459f1c00018dade4',
  },
})
Example Response
{
  "id": "ee6a390c-5d33-11e8-9c2d-fa7ae01bbebc",
  "qri": "qri:qdf:space://ooSOGoLLaq7EMaSdSsCiGvLwcd_VAf1oU0mzwSfp_Qs#wME89c8gKu_Tpz8W_a0JKSbKC4hzbNu0NLVgqi2UFS0",
  "name": "some/folder/MyFile.csv",
  "size": 1024,
  "appId": "f34b91a1-0dc3-44ac-a847-51cb84122c84",
  "folder": true,
  "actions": [
    "Read"
  ],
  "ownerId": "lDL4DIINndhL_iJkcbqWyJenuwizP-2D",
  "spaceId": "617979737a9f56e49dea2e6e",
  "baseName": "MyFile.csv",
  "folderId": "ee6a390c-5d33-11e8-9c2d-fa7ae01bbebc",
  "folderPath": "some/folder",
  "createdDate": "2020-07-07T20:52:40.8534780Z",
  "folderStats": {
    "totalFileCount": 50,
    "directFileCount": 50,
    "totalFolderCount": 50,
    "aggregateFileSize": 10000,
    "directFolderCount": 50,
    "totalInternalFileCount": 50,
    "directInternalFileCount": 50,
    "totalAppScopedFileCount": 50,
    "directAppScopedFileCount": 50,
    "aggregateInternalFileSize": 10000,
    "aggregateAppScopedFileSize": 10000
  },
  "modifiedDate": "2020-07-07T20:52:40.8534780Z",
  "contentUpdatedDate": "2020-07-07T20:52:40.8534780Z"
}
Get descriptive info for the specified data file.
Facts
	Rate limit	Tier 1 (1000 requests per minute)
Path Parameters
id
string
Required

The ID of the data file.

format = "uuid"

Responses
200

The file was located.

application/json
object
Show application/json properties
400

Bad Request

application/json
object
Show application/json properties
403

Forbidden

application/json
object
Show application/json properties
404

A data file with the specified ID was not found.

application/json
object
Show application/json properties
GET
/api/v1/data-files/{id}
JavaScript
Qlik CLI
cURL
import { createQlikApi } from '@qlik/api'


const qlik = createQlikApi({
  hostConfig: {
    host: 'https://{tenant}.{region}.qlikcloud.com',
    apiKey: '<access-token>',
  },
})


await qlik.dataFiles.getDataFile(
  'ee6a390c-5d33-11e8-9c2d-fa7ae01bbebc',
)
Example Response
{
  "id": "ee6a390c-5d33-11e8-9c2d-fa7ae01bbebc",
  "qri": "qri:qdf:space://ooSOGoLLaq7EMaSdSsCiGvLwcd_VAf1oU0mzwSfp_Qs#wME89c8gKu_Tpz8W_a0JKSbKC4hzbNu0NLVgqi2UFS0",
  "name": "some/folder/MyFile.csv",
  "size": 1024,
  "appId": "f34b91a1-0dc3-44ac-a847-51cb84122c84",
  "folder": true,
  "actions": [
    "Read"
  ],
  "ownerId": "lDL4DIINndhL_iJkcbqWyJenuwizP-2D",
  "spaceId": "617979737a9f56e49dea2e6e",
  "baseName": "MyFile.csv",
  "folderId": "ee6a390c-5d33-11e8-9c2d-fa7ae01bbebc",
  "folderPath": "some/folder",
  "createdDate": "2020-07-07T20:52:40.8534780Z",
  "folderStats": {
    "totalFileCount": 50,
    "directFileCount": 50,
    "totalFolderCount": 50,
    "aggregateFileSize": 10000,
    "directFolderCount": 50,
    "totalInternalFileCount": 50,
    "directInternalFileCount": 50,
    "totalAppScopedFileCount": 50,
    "directAppScopedFileCount": 50,
    "aggregateInternalFileSize": 10000,
    "aggregateAppScopedFileSize": 10000
  },
  "modifiedDate": "2020-07-07T20:52:40.8534780Z",
  "contentUpdatedDate": "2020-07-07T20:52:40.8534780Z"
}
Re-upload an existing data file or update an existing folder.
Facts
	Rate limit	Special (800 requests per minute)
Path Parameters
id
string
Required

The ID of the data file to update.

format = "uuid"

Request Body
multipart/form-data
object
Show multipart/form-data properties
Responses
201

The file or folder was updated.

application/json
object
Show application/json properties
400

Bad Request

application/json
object
Show application/json properties
403

Forbidden

application/json
object
Show application/json properties
404

A data file or folder with the specified ID was not found.

application/json
object
Show application/json properties
409

If the file or folder was renamed during the update, a file or folder with the new name already exists. Also, if the space that the file or folder resides in was changed as part of the update, a file or folder with the same name already resides in the new space.

application/json
object
Show application/json properties
413

The file exceeds the user's quota for maximum file size to upload.

application/json
object
Show application/json properties
423

The file is already locked for read or write by another client. If a folder is being updated, then if any file or folder in the subfolder hierarchy of this folder is already locked for write.

application/json
object
Show application/json properties
PUT
/api/v1/data-files/{id}
JavaScript
Qlik CLI
cURL
import { createQlikApi } from '@qlik/api'
import { readFileSync } from 'node:fs'


const qlik = createQlikApi({
  hostConfig: {
    host: 'https://{tenant}.{region}.qlikcloud.com',
    apiKey: '<access-token>',
  },
})


await qlik.dataFiles.reuploadDataFile(
  'ee6a390c-5d33-11e8-9c2d-fa7ae01bbebc',
  {
    File: new Uint8Array(
      readFileSync('<file-path>'),
    ),
    Json: {
      appId:
        'f34b91a1-0dc3-44ac-a847-51cb84122c84',
      connectionId:
        'ee6a390c-5d33-11e8-9c2d-fa7ae01bbebc',
      folderId:
        'ee6a390c-5d33-11e8-9c2d-fa7ae01bbebc',
      folderMergeBehavior: 'merge',
      name: 'some/folder/MyFile.csv',
      sourceId:
        'f34b91a1-0dc3-44ac-a847-51cb84122c84',
      tempContentFileId:
        '624b0f54459f1c00018dade4',
    },
  },
)
Example Response
{
  "id": "ee6a390c-5d33-11e8-9c2d-fa7ae01bbebc",
  "qri": "qri:qdf:space://ooSOGoLLaq7EMaSdSsCiGvLwcd_VAf1oU0mzwSfp_Qs#wME89c8gKu_Tpz8W_a0JKSbKC4hzbNu0NLVgqi2UFS0",
  "name": "some/folder/MyFile.csv",
  "size": 1024,
  "appId": "f34b91a1-0dc3-44ac-a847-51cb84122c84",
  "folder": true,
  "actions": [
    "Read"
  ],
  "ownerId": "lDL4DIINndhL_iJkcbqWyJenuwizP-2D",
  "spaceId": "617979737a9f56e49dea2e6e",
  "baseName": "MyFile.csv",
  "folderId": "ee6a390c-5d33-11e8-9c2d-fa7ae01bbebc",
  "folderPath": "some/folder",
  "createdDate": "2020-07-07T20:52:40.8534780Z",
  "folderStats": {
    "totalFileCount": 50,
    "directFileCount": 50,
    "totalFolderCount": 50,
    "aggregateFileSize": 10000,
    "directFolderCount": 50,
    "totalInternalFileCount": 50,
    "directInternalFileCount": 50,
    "totalAppScopedFileCount": 50,
    "directAppScopedFileCount": 50,
    "aggregateInternalFileSize": 10000,
    "aggregateAppScopedFileSize": 10000
  },
  "modifiedDate": "2020-07-07T20:52:40.8534780Z",
  "contentUpdatedDate": "2020-07-07T20:52:40.8534780Z"
}
Delete the specified data file or folder. Deleting a folder will also recursively delete all files and subfolders that reside within the specified folder.
Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
id
string
Required

The ID of the data file or folder to delete.

format = "uuid"

Responses
204

The file or folder was deleted.

400

Bad Request

application/json
object
Show application/json properties
403

Forbidden

application/json
object
Show application/json properties
404

A data file or folder with the specified ID was not found.

application/json
object
Show application/json properties
DELETE
/api/v1/data-files/{id}
JavaScript
Qlik CLI
cURL
import { createQlikApi } from '@qlik/api'


const qlik = createQlikApi({
  hostConfig: {
    host: 'https://{tenant}.{region}.qlikcloud.com',
    apiKey: '<access-token>',
  },
})


await qlik.dataFiles.deleteDataFile(
  'ee6a390c-5d33-11e8-9c2d-fa7ae01bbebc',
)
Change the owner of an existing data file or folder.

This is primarily an admin type of operation. In general, the owner of a data file or folder is implicitly set as part of a create or update operation. For data files or folders that reside in a personal space, changing the owner has the effect of moving the data file to the new owner's personal space. Note that, If a given file or folder is not in the root of a personal space, this operation will not succeed, since the parent folder does not reside in the target owner's personal space. If the owner of a folder in the root of a personal space is changed, the owner of all subfolders and files within those subfolders will also recursively change.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
id
string
Required

The ID of the data file or folder whose owner will be updated.

format = "uuid"

Request Body

The request.

application/json
object
Show application/json properties
Responses
204

The file or folder's owner was changed.

400

An owner with the specified ID does not exist.

application/json
object
Show application/json properties
403

The user does not have permission to modify the specified data file or folder, or if the item does not reside in the root of the space.

application/json
object
Show application/json properties
404

A data file or folder with the specified ID was not found.

application/json
object
Show application/json properties
409

If the file or folder is in a personal space, and the personal space of the new owner already has an item in the space with the same name as the item being moved.

application/json
object
Show application/json properties
423

The file or folder is already locked for write by another client. For folders, any write lock on a subfolder or file underneath this folder implies a lock on the folder.

application/json
object
Show application/json properties
POST
/api/v1/data-files/{id}/actions/change-owner
JavaScript
Qlik CLI
cURL
import { createQlikApi } from '@qlik/api'


const qlik = createQlikApi({
  hostConfig: {
    host: 'https://{tenant}.{region}.qlikcloud.com',
    apiKey: '<access-token>',
  },
})


await qlik.dataFiles.changeDataFileOwner(
  'ee6a390c-5d33-11e8-9c2d-fa7ae01bbebc',
  { ownerId: 'lDL4DIINndhL_iJkcbqWyJenuwizP-2D' },
)
Change the space that an existing data file or folder resides in.

This is to allow for a separate admin type of operation that is more global in terms of access in cases where admin users may not explicitly have been granted full access to a given space within the declared space-level permissions. If the space ID is set to null, then the datafile or folder will end up residing in the personal space of the user who is the owner of the item. Note that, if a given file or folder is not in the root of a given space, this operation will not succeed, since the parent folder does not reside in the target space. If the space of a folder in the root of the source space is changed, all subfolders and files within those subfolders will also recursively be moved to the new space.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
id
string
Required

The ID of the data file or folder whose space will be updated.

format = "uuid"

Request Body

The request.

application/json
object
Show application/json properties
Responses
204

The file or folder's space was changed.

400

A space with the specified ID does not exist.

application/json
object
Show application/json properties
403

The user does not have permission to modify the specified data file or folder, or if the item does not reside in the root of the space.

application/json
object
Show application/json properties
404

A data file or folder with the specified ID was not found.

application/json
object
Show application/json properties
409

If there is a file or folder in the target space with the same name as the item being moved.

application/json
object
Show application/json properties
423

The file is already locked for write by another client. For folders, any write lock on a subfolder or file underneath this folder implies a lock on the folder.

application/json
object
Show application/json properties
POST
/api/v1/data-files/{id}/actions/change-space
JavaScript
Qlik CLI
cURL
import { createQlikApi } from '@qlik/api'


const qlik = createQlikApi({
  hostConfig: {
    host: 'https://{tenant}.{region}.qlikcloud.com',
    apiKey: '<access-token>',
  },
})


await qlik.dataFiles.moveDataFile(
  'ee6a390c-5d33-11e8-9c2d-fa7ae01bbebc',
  { spaceId: '617979737a9f56e49dea2e6e' },
)
Change the spaces that a set of existing data files or folders reside in a a single batch.

This is to allow for a separate admin type of operation that is more global in terms of access in cases where admin users may not explicitly have been granted full access to a given space within the declared space-level permissions. If the space ID is set to null, then the data file or folder will end up residing in the personal space of the user who is the owner of the item.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Request Body

The batch of IDs for each data file in the batch whose space will be changed along with the space IDs for each change.

application/json
object

Specifies the list of data file change space operations in a single batch.

Show application/json properties
Responses
207

The result status of the change space operations on each specified data file.

application/json
object
Show application/json properties
400

Bad Request

application/json
object
Show application/json properties
POST
/api/v1/data-files/actions/change-space
JavaScript
Qlik CLI
cURL
// qlik-api has not implemented support for `POST /api/v1/data-files/actions/change-space` yet.
// In the meantime, you can use fetch like this:


const response = await fetch(
  '/api/v1/data-files/actions/change-space',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      'change-space': [
        {
          id: 'ee6a390c-5d33-11e8-9c2d-fa7ae01bbebc',
          spaceId: '617979737a9f56e49dea2e6e',
        },
      ],
    }),
  },
)
Example Response
{
  "data": [
    {
      "id": "ee6a390c-5d33-11e8-9c2d-fa7ae01bbebc",
      "code": "HTTP-200",
      "title": "Cursor not formatted correctly.",
      "detail": "Invalid encoding of cursor.",
      "status": 400
    }
  ]
}
Delete the specified set of data files and/or folders as a single batch.
Facts
	Rate limit	Tier 2 (100 requests per minute)
Request Body

The specification of the batch of data files and folders to delete.

application/json
object
Show application/json properties
Responses
207

The result status of the delete operations on each specified data file or folder.

application/json
object
Show application/json properties
400

Bad Request

application/json
object
Show application/json properties
POST
/api/v1/data-files/actions/delete
JavaScript
Qlik CLI
cURL
import { createQlikApi } from '@qlik/api'


const qlik = createQlikApi({
  hostConfig: {
    host: 'https://{tenant}.{region}.qlikcloud.com',
    apiKey: '<access-token>',
  },
})


await qlik.dataFiles.deleteDataFiles({
  delete: [
    {
      id: 'ee6a390c-5d33-11e8-9c2d-fa7ae01bbebc',
    },
  ],
  deleteAllBySpace: [
    { id: '617979737a9f56e49dea2e6e' },
  ],
  deleteAllFromPersonalSpace: true,
})
Example Response
{
  "data": [
    {
      "id": "ee6a390c-5d33-11e8-9c2d-fa7ae01bbebc",
      "code": "HTTP-200",
      "title": "Cursor not formatted correctly.",
      "detail": "Invalid encoding of cursor.",
      "status": 400
    }
  ]
}
Get the list of built-in connections used by the engine to load/write data files.

The non-filtered list contains a set of hardcoded connections, along with one connection per team space that the given user has access to.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Query Parameters
appId
string

If present, get connections with connection strings that are scoped to the given app ID.

includeSpaceStats
boolean

If set to true, include computed space-level statistics for the spaces represented by the connections in the returned list. If false, this information is not returned.

default = false

limit
integer

If present, the maximum number of data file connection records to return.

minimum = 1, maximum = 1000, default = 20, format = int32, default = 20

name
string

If present, only return connections with the given name.

page
string

If present, the cursor that starts the page of data that is returned.

personal
boolean

If true, only return the connections that access data in a personal space. Default is false.

default = false

sort
string

The name of the field used to sort the result. By default, the sort is ascending. Putting a '+' prefix on the sort field name explicitly indicates ascending sort order. A '-' prefix indicates a descending sort order.

Can be one of: "spaceId""+spaceId""-spaceId"

spaceId
string

If present, only return the connection that accesses data files in the specified space.

Responses
200

Connection list was returned.

application/json
object
Show application/json properties
400

Bad Request

application/json
object
Show application/json properties
403

Forbidden

application/json
object
Show application/json properties
GET
/api/v1/data-files/connections
JavaScript
Qlik CLI
cURL
import { createQlikApi } from '@qlik/api'


const qlik = createQlikApi({
  hostConfig: {
    host: 'https://{tenant}.{region}.qlikcloud.com',
    apiKey: '<access-token>',
  },
})


await qlik.dataFiles.getDataFilesConnections({})
Example Response
{
  "data": [
    {
      "id": "ee6a390c-5d33-11e8-9c2d-fa7ae01bbebc",
      "name": "DataFiles",
      "type": "qix-datafiles.exe",
      "spaceId": "617979737a9f56e49dea2e6e",
      "spaceStats": {
        "totalFileCount": 50,
        "directFileCount": 50,
        "totalFolderCount": 50,
        "aggregateFileSize": 10000,
        "directFolderCount": 50,
        "totalInternalFileCount": 50,
        "directInternalFileCount": 50,
        "totalAppScopedFileCount": 50,
        "directAppScopedFileCount": 50,
        "aggregateInternalFileSize": 10000,
        "aggregateAppScopedFileSize": 10000
      },
      "connectStatement": "CUSTOM CONNECT TO \\\"provider=qix-datafiles.exe;path=mydatafiles;\\\""
    }
  ],
  "links": {
    "next": {
      "href": "string"
    },
    "prev": {
      "href": "string"
    },
    "self": {
      "href": "string"
    }
  }
}
Get the built-in connection used by the engine to load/write data files given a connection ID.
Facts
	Rate limit	Tier 1 (1000 requests per minute)
Path Parameters
id
string
Required

The ID of the connection.

format = "uuid"

Responses
200

The connection was returned.

application/json
object
Show application/json properties
403

The space referenced by the specified connection was not found, or is not accessible to the current user.

application/json
object
Show application/json properties
404

A connection with the specified ID was not found.

application/json
object
Show application/json properties
GET
/api/v1/data-files/connections/{id}
JavaScript
Qlik CLI
cURL
import { createQlikApi } from '@qlik/api'


const qlik = createQlikApi({
  hostConfig: {
    host: 'https://{tenant}.{region}.qlikcloud.com',
    apiKey: '<access-token>',
  },
})


await qlik.dataFiles.getDataFileConnection(
  'ee6a390c-5d33-11e8-9c2d-fa7ae01bbebc',
)
Example Response
{
  "id": "ee6a390c-5d33-11e8-9c2d-fa7ae01bbebc",
  "name": "DataFiles",
  "type": "qix-datafiles.exe",
  "spaceId": "617979737a9f56e49dea2e6e",
  "spaceStats": {
    "totalFileCount": 50,
    "directFileCount": 50,
    "totalFolderCount": 50,
    "aggregateFileSize": 10000,
    "directFolderCount": 50,
    "totalInternalFileCount": 50,
    "directInternalFileCount": 50,
    "totalAppScopedFileCount": 50,
    "directAppScopedFileCount": 50,
    "aggregateInternalFileSize": 10000,
    "aggregateAppScopedFileSize": 10000
  },
  "connectStatement": "CUSTOM CONNECT TO \\\"provider=qix-datafiles.exe;path=mydatafiles;\\\""
}
Get quota information for the calling user.
Facts
	Rate limit	Tier 1 (1000 requests per minute)
Responses
200

The quota information was retrieved.

application/json
object
Show application/json properties
400

Bad Request

application/json
object
Show application/json properties
403

Forbidden

application/json
object
Show application/json properties
GET
/api/v1/data-files/quotas
JavaScript
Qlik CLI
cURL
import { createQlikApi } from '@qlik/api'


const qlik = createQlikApi({
  hostConfig: {
    host: 'https://{tenant}.{region}.qlikcloud.com',
    apiKey: '<access-token>',
  },
})


await qlik.dataFiles.getDataFilesQuotas()
Example Response
{
  "size": 5000,
  "maxSize": 9223372036854776000,
  "maxFileSize": 524288000,
  "maxLargeFileSize": 6442450944,
  "allowedExtensions": "csv, xlsx, txt, qvd",
  "allowedInternalExtensions": "dxf, gml, qrep"
}
Was this page helpful?
yesno
Qlik Community
Legal Agreements
/
Legal Policies
/
Privacy & Cookie Notice
/
Terms of Use
/
Do Not Share My Info
Copyright © 1993-2026 QlikTech International AB. All rights reserved.