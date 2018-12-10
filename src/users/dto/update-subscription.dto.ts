import { ApiModelProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { MembershipTiers } from 'src/common/constants';

export class UpdateSubscriptionDto {

  @ApiModelProperty()
  @IsString()
  @IsOptional()
  readonly couponCode: string;

  @ApiModelProperty({ type: MembershipTiers })
  @IsString()
  @IsOptional()
  readonly tier: MembershipTiers;

}