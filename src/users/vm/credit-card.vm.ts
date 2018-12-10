import { ApiModelProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CreditCardVm {

  @ApiModelProperty()
  @Expose()
  readonly id: string;

  @ApiModelProperty()
  @Expose()
  readonly last4: string;

  @ApiModelProperty()
  @Expose()
  readonly brand: string;

  @ApiModelProperty()
  @Expose()
  readonly expMonth: number;

  @ApiModelProperty()
  @Expose()
  readonly expYear: number;

}
