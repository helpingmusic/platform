import { Module } from '@nestjs/common';
import { DiscountModule } from 'src/api/discount/discount.module';
import { NotificationsModule } from 'src/api/notifications/notifications.module';
import { PostModule } from 'src/api/post/post.module';
import { ReportModule } from 'src/api/report/report.module';
import { ReviewModule } from 'src/api/review/review.module';
import { TrackModule } from 'src/api/track/track.module';
import { VideoModule } from 'src/api/video/video.module';
import { AnnouncementModule } from './announcement/announcement.module';
import { BookableModule } from './bookable/bookable.module';
import { BookingModule } from './booking/booking.module';
import { CreditTransactionModule } from './credit-transaction/credit-transaction.module';
import { IssueModule } from './issue/issue.module';
import { PasswordResetModule } from './password-reset/password-reset.module';
import { ThreadModule } from './thread/thread.module';

@Module({
  imports: [
    AnnouncementModule,
    IssueModule,
    DiscountModule,
    BookingModule,
    BookableModule,
    NotificationsModule,
    PasswordResetModule,
    VideoModule,
    ThreadModule,
    CreditTransactionModule,
    TrackModule,
    PostModule,
    ReviewModule,
    ReportModule,
  ],
  providers: [],
})
export class ApiModule {
}
