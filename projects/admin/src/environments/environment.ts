
import { Environment } from "projects/common/src/Contracts/Common/environment";

// const SERVER_ADDRESS = 'https://localhost:44344';
// const SERVER_ADDRESS = 'https://php.pdong-vps.tk';
const SERVER_ADDRESS = 'http://192.168.1.99';
export const environment : Environment= {
  production: false,
  REST_API_SERVER : `${SERVER_ADDRESS}/api`,
  FILE_GET_BY_NAME: `${SERVER_ADDRESS}/api/files/`,
  FILE_GET_BY_BLOB_ID: `${SERVER_ADDRESS}/api/blobs/`,
  FILE_DOWNLOAD_BY_NAME: `${SERVER_ADDRESS}/api/file/download/`,
  FILE_DOWNLOAD_BY_BLOB_ID: `${SERVER_ADDRESS}/api/blobs/download/`,
};
