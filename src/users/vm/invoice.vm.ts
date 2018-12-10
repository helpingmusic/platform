import { ApiModelProperty } from '@nestjs/swagger';
import { Expose, Exclude, Type, Transform } from 'class-transformer';

@Expose()
class StripeLineItems {
  @Type(() => InvoiceLine)
  data: InvoiceLine[];
}

class InvoiceLine {
  @Expose()
  amount: number;
  @Expose()
  description: number;
}

export class InvoiceVm {

  @ApiModelProperty()
  @Expose()
  readonly id: string;

  @ApiModelProperty()
  @Expose()
  readonly amount_due: number;

  @ApiModelProperty()
  @Expose()
  readonly amount_paid: number;

  @ApiModelProperty()
  @Expose()
  readonly amount_remaining: number;

  @ApiModelProperty()
  @Expose()
  readonly charge: {
    id: string;
  };

  @ApiModelProperty()
  @Expose()
  readonly date: number;

  @ApiModelProperty()
  @Expose()
  @Type(() => StripeLineItems)
  lines: StripeLineItems;

  @ApiModelProperty()
  @Expose()
  readonly metadata: any;

  @ApiModelProperty()
  @Expose()
  readonly paid: boolean;

  @ApiModelProperty()
  @Expose()
  readonly status: string;

  @ApiModelProperty()
  @Expose()
  readonly subtotal: number;

  @ApiModelProperty()
  @Expose()
  readonly total: number;

}
