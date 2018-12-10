import { Injectable } from '@nestjs/common';
import AWS from 'aws-sdk';
import { ManagedUpload } from 'aws-sdk/clients/s3';
import axios from 'axios';
import { ConfigService } from 'src/shared/config/config.service';
import { FileUpload } from 'src/core/storage/file-upload.type';

type StoragePath = Array<string>;

@Injectable()
export class StorageService {
  readonly bucket = 'home-app';
  readonly s3: AWS.S3;

  constructor(
    private config: ConfigService,
  ) {

    AWS.config.update({
      accessKeyId: config.get('AWS_ACCESS_KEY'),
      secretAccessKey: config.get('AWS_SECRET_ACCESS_KEY'),
      region: 'us-east-1',
      signatureVersion: 'v4',
    });

    this.s3 = new AWS.S3({
      signatureVersion: 'v4',
      params: { Bucket: 'home-app' },
    });
  }

  private genKeyFromPath(path: StoragePath) {
    return [this.config.get('NODE_ENV')].concat(path).join('/');
  }

  /**
   * Grab the file from the given url and store it in s3
   * @param url - url to fetch from
   * @param path - path in s3 to store the item
   * @return location {Promise<string>} - the new URL of the uploaded source
   */
  async storeFileByURL(url: string, path: StoragePath): Promise<string> {
    const res = await axios.get(url);
    const ct = res.headers['content-type'];

    const upload = new Buffer(res.data.replace(/^data:image\/\w+;base64,/, ''), 'base64');

    const awsRes = await this.s3.upload({
      Bucket: this.bucket,
      Key: this.genKeyFromPath(path),
      Body: upload,
      ACL: 'private',
      ContentEncoding: 'base64',
      ContentType: ct,
    })
      .promise();

    return awsRes.Location;
  }

  uploadFile(file: FileUpload, path: StoragePath): Promise<ManagedUpload.SendData> {
    return this.s3.upload({
      Bucket: this.bucket,
      Key: this.genKeyFromPath(path),
      Body: file.buffer,
      ACL: 'private',
      ContentEncoding: 'base64',
      ContentType: file.mimetype,
    })
      .promise();
  }

  async remove(key: string) {
    await this.s3.deleteObject({
      Bucket: this.bucket,
      Key: key,
    });
  }

}
