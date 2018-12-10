import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { VideoController } from './video.controller';

import { VideoSchema } from './video.schema';
import { VideoService } from './video.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    MongooseModule.forFeature([{ name: 'Video', schema: VideoSchema }]),
  ],
  controllers: [VideoController],
  providers: [
    VideoService,
  ],
})
export class VideoModule {
}
