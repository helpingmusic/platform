import { ApiModelProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class PushSubscriptionVm {

  @ApiModelProperty()
  @Expose()
  readonly endpoint: string;

  @ApiModelProperty()
  @Expose()
  readonly keys: {
    p256dh: string;
    auth: string;
  };

}