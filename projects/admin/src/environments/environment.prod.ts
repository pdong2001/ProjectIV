export const environment = {
  production: true,
  REST_API_SERVER : 'http://php.pdong-vps.tk/api',
  FILE_GET_BY_NAME: () => environment.REST_API_SERVER + '/files/',
  FILE_GET_BY_BLOB_ID: () => environment.REST_API_SERVER + '/blobs/',
  FILE_DOWNLOAD_BY_NAME: () => environment.REST_API_SERVER + '/file/download/',
  FILE_DOWNLOAD_BY_BLOB_ID: () => environment.REST_API_SERVER + '/blobs/download/',
};
