import { ApiModelProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { MembershipPlans, MembershipTiers } from 'src/common/constants';
import { CreditCardVm } from 'src/users/vm/credit-card.vm';

export class UserSubscriptionVm {

  @ApiModelProperty()
  @Expose()
  readonly customerId: string;

  @ApiModelProperty()
  @Expose()
  readonly subscriptionId: string;

  @ApiModelProperty()
  @Expose()
  readonly active_until: Date;

  @ApiModelProperty()
  @Expose()
  readonly accountBalance: number;

  @ApiModelProperty()
  @Expose()
  readonly periodEnd: Date;

  @ApiModelProperty({ type: MembershipPlans })
  @Expose()
  readonly plan: MembershipPlans;

  @ApiModelProperty()
  @Expose()
  readonly status: string;

  @ApiModelProperty()
  @Expose()
  readonly trial_end: Date;

  @ApiModelProperty({ type: MembershipTiers })
  @Expose()
  readonly tier: MembershipTiers;

  @ApiModelProperty({ type: CreditCardVm })
  @Expose()
  @Type(() => CreditCardVm)
  readonly card: CreditCardVm;
}