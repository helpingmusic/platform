import { Module } from '@nestjs/common';
import { CouponController } from './coupon.controller';

@Module({
  controllers: [CouponController],
})
export class CouponModule {}
