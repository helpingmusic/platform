// https://www.npmjs.com/package/multer-s3#file-information
export interface IS3FileUpload {
  size: number;
  bucket: string;
  key: string;
  acl: string;
  contentType: string;
  metadata: any;
  location: string;
  etag: string;
  storageClass: string;
  versionId: string;
  contentDisposition: string;
}