import { ApiModelProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreatePushSubscriptionDto {

  @ApiModelProperty()
  @IsString()
  readonly endpoint: string;

  @ApiModelProperty()
  readonly keys: {
    p256dh: string;
    auth: string;
  };

}