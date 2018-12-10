import { ApiModelProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { TransactionTypes } from 'src/api/credit-transaction/transaction-types.enum';
import { DocumentVm } from 'src/common/abstract/document.vm';

export class CreditTransactionVm extends DocumentVm {
  @ApiModelProperty()
  @Expose()
  user: string;

  @ApiModelProperty()
  @Expose()
  startAmount: number;

  @ApiModelProperty()
  @Expose()
  endAmount: number;

  @ApiModelProperty()
  @Expose()
  type: TransactionTypes;

  @ApiModelProperty()
  @Expose()
  meta: any;
}