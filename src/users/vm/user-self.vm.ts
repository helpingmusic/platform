import { ApiModelProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { UserRoles } from 'src/auth/guards/roles.enum';
import { NotificationSettingsVm } from 'src/users/vm/notification-settings.vm';
import { PushSubscriptionVm } from 'src/users/vm/push-subscription.vm';
import { UserProfileVm } from 'src/users/vm/user-profile.vm';
import { UserSubscriptionVm } from 'src/users/vm/user-subscription.vm';

export class UserSelfVm extends UserProfileVm {
  @ApiModelProperty()
  @Expose()
  readonly role: UserRoles;

  @ApiModelProperty()
  @Expose()
  readonly credits: number;

  @ApiModelProperty()
  @Expose()
  readonly referralCode: string;

  @ApiModelProperty({ type: UserSubscriptionVm })
  @Expose()
  @Type(() => UserSubscriptionVm)
  readonly stripe: UserSubscriptionVm;

  @ApiModelProperty({ type: NotificationSettingsVm })
  @Expose()
  @Type(() => NotificationSettingsVm)
  readonly notifications: NotificationSettingsVm;

  @ApiModelProperty({ type: PushSubscriptionVm, isArray: true })
  @Expose()
  @Type(() => PushSubscriptionVm)
  readonly pushSubscriptions: Array<PushSubscriptionVm>;

  @ApiModelProperty()
  @Expose()
  readonly active_until: Date;

  @ApiModelProperty()
  @Expose()
  readonly hasPassword: boolean;

  @ApiModelProperty()
  @Expose()
  readonly isActive: boolean;
}