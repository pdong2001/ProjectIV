// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { Environment } from "projects/common/src/Contracts/Common/environment";

// const SERVER_ADDRESS = 'http://192.168.1.99';
const SERVER_ADDRESS = 'https://php.pdong-vps.tk';
export const environment : Environment= {
  production: false,
  REST_API_SERVER : `${SERVER_ADDRESS}/api`,
  FILE_GET_BY_NAME: `${SERVER_ADDRESS}/api/files/`,
  FILE_GET_BY_BLOB_ID: `${SERVER_ADDRESS}/api/blobs/`,
  FILE_DOWNLOAD_BY_NAME: `${SERVER_ADDRESS}/api/file/download/`,
  FILE_DOWNLOAD_BY_BLOB_ID: `${SERVER_ADDRESS}/api/blobs/download/`,
  // REST_API_SERVER: `${SERVER_ADDRESS}/api`,
  // FILE_GET_BY_NAME: `${SERVER_ADDRESS}/api/files/`,
  // FILE_GET_BY_BLOB_ID: `${SERVER_ADDRESS}/api/blobs/`,
  // FILE_DOWNLOAD_BY_NAME: `${SERVER_ADDRESS}/api/file/download/`,
  // FILE_DOWNLOAD_BY_BLOB_ID: `${SERVER_ADDRESS}/api/blobs/download/`,
};
