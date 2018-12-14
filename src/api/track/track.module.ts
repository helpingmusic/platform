import { Module, MulterModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import multerS3 from 'multer-s3';
import { audioFileValidator } from 'src/api/track/audio-file.validator';
import { StorageModule } from 'src/core/storage/storage.module';
import { StorageService } from 'src/core/storage/storage.service';
import { SharedModule } from 'src/shared/shared.module';
import { FileUpload } from 'src/core/storage/file-upload.type';
import { TrackController } from './track.controller';

import { TrackSchema } from './track.schema';
import { TrackService } from './track.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    MongooseModule.forFeature([{ name: 'Track', schema: TrackSchema, collection: 'songs' }]),
    SharedModule,
    MulterModule.registerAsync({
      imports: [StorageModule],
      inject: [StorageService],
      useFactory: (store: StorageService) => ({
        fileFilter: audioFileValidator,
        limits: { files: 1 },
        storage: multerS3({
          s3: store.s3,
          bucket: store.bucket,
          acl: 'public-read',
          contentType: multerS3.AUTO_CONTENT_TYPE,
          metadata(req, file: FileUpload, cb: (err: any, data: any) => void) {
            cb(null, {
              track: req.params.id,
              fieldName: file.fieldname,
              filename: file.originalname,
            });
          },
          key(req, file: FileUpload, cb: (err: any, path: string) => void) {
            const ext = (file.encoding).split('/').pop();
            const hash = Math.random().toString(36).substr(2, 5);
            const fn = `${req.params.id}.${hash}.${ext}`;
            cb(null, ['tracks', fn].join('/'));
          },
        }),
      }),
    }),
  ],
  controllers: [TrackController],
  providers: [
    TrackService,
  ],
})
export class TrackModule {
}
