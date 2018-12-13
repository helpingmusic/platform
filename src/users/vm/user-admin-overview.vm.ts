import { ApiModelProperty } from '@nestjs/swagger';
import { Expose, Exclude, Type } from 'class-transformer';
import { DocumentVm } from 'src/common/abstract/document.vm';
import { UserOverviewVm } from 'src/users/vm/user-overview.vm';

/**
 * User overview meant for admin
 */

class BillingOverviewVm {
  @ApiModelProperty()
  @Expose()
  status: string;
  @ApiModelProperty()
  @Expose()
  tier: string;
}

@Exclude()
export class UserAdminOverviewVm extends UserOverviewVm {

  @ApiModelProperty()
  @Expose()
  readonly profileComplete: boolean;

  @ApiModelProperty()
  @Expose()
  @Type(() => BillingOverviewVm)
  stripe: BillingOverviewVm;
}