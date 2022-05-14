import { Environment } from "projects/common/src/Contracts/Common/environment";

export const environment : Environment= {
  production: true,
  REST_API_SERVER : 'https://php.pdong-vps.tk/api',
  FILE_GET_BY_NAME: 'https://php.pdong-vps.tk/api/files/',
  FILE_GET_BY_BLOB_ID: 'https://php.pdong-vps.tk/api/blobs/',
  FILE_DOWNLOAD_BY_NAME: 'https://php.pdong-vps.tk/api/file/download/',
  FILE_DOWNLOAD_BY_BLOB_ID: 'https://php.pdong-vps.tk/api/blobs/download/',
};
