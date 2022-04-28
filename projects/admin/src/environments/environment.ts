// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  REST_API_SERVER : 'http://localhost:8000/api',
  FILE_GET_BY_NAME: () => environment.REST_API_SERVER + '/files/',
  FILE_GET_BY_BLOB_ID: () => environment.REST_API_SERVER + '/blobs/',
  FILE_DOWNLOAD_BY_NAME: () => environment.REST_API_SERVER + '/file/download/',
  FILE_DOWNLOAD_BY_BLOB_ID: () => environment.REST_API_SERVER + '/blobs/download/',
};
