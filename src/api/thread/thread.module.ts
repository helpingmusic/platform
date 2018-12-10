import { Module } from '@nestjs/common';
import { CQRSModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { CommentsModule } from 'src/api/thread/comments/comments.module';
import { ThreadController } from 'src/api/thread/thread.controller';
import { ThreadSchema } from 'src/api/thread/thread.schema';
import { ThreadService } from 'src/api/thread/thread.service';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [
    CQRSModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    MongooseModule.forFeature([{ name: 'Thread', schema: ThreadSchema }]),
    CommentsModule,
    SharedModule,
  ],
  controllers: [ThreadController],
  providers: [
    ThreadService,
  ],
  exports: [ThreadService],
})
export class ThreadModule {
}
