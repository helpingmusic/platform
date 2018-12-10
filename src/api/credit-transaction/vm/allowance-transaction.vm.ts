import { ApiModelProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { AllowanceStatuses } from 'src/api/credit-transaction/allowance-statuses.enum';
import { DocumentVm } from 'src/common/abstract/document.vm';

export class AllowanceTransactionVm extends DocumentVm {

  @ApiModelProperty()
  @Expose()
  amount: number;

  @ApiModelProperty()
  @Expose()
  status: AllowanceStatuses;

  @ApiModelProperty()
  @Expose()
  runOn: string;

  @ApiModelProperty()
  @Expose()
  created_at: Date;

  @ApiModelProperty()
  @Expose()
  updated_at: Date;

}