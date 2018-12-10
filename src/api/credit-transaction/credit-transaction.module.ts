import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { CreditTransactionController } from 'src/api/credit-transaction/credit-transaction.controller';
import { AllowanceTransactionSchema } from 'src/api/credit-transaction/schemas/allowance-transaction.schema';
import { CreditTransactionSchema } from 'src/api/credit-transaction/schemas/credit-transaction.schema';
import { SharedModule } from 'src/shared/shared.module';
import { CreditTransactionService } from './credit-transaction.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'CreditTransaction', schema: CreditTransactionSchema },
      { name: 'AllowanceTransaction', schema: AllowanceTransactionSchema },
    ]),
    SharedModule,
  ],
  controllers: [CreditTransactionController],
  providers: [CreditTransactionService],
  exports: [CreditTransactionService],
})
export class CreditTransactionModule {
}
