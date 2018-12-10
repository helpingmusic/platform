import { ApiModelProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { NotificationTypes as nt } from 'src/api/notifications/notification-types.enum';

export class NotificationSettingVm {
  @ApiModelProperty()
  @Expose()
  browser: boolean;
  @ApiModelProperty()
  @Expose()
  email: boolean;
}

export class NotificationSettingsVm {

  @ApiModelProperty({ type: NotificationSettingVm })
  @Expose()
  @Type(() => NotificationSettingVm)
  readonly [nt.APPLICATION]: NotificationSettingVm;

  @ApiModelProperty({ type: NotificationSettingVm })
  @Expose()
  @Type(() => NotificationSettingVm)
  readonly [nt.ACCOUNT]: NotificationSettingVm;

  @ApiModelProperty({ type: NotificationSettingVm })
  @Expose()
  @Type(() => NotificationSettingVm)
  readonly [nt.DISCOUNT]: NotificationSettingVm;

  @ApiModelProperty({ type: NotificationSettingVm })
  @Expose()
  @Type(() => NotificationSettingVm)
  readonly [nt.EVENT]: NotificationSettingVm;

  @ApiModelProperty({ type: NotificationSettingVm })
  @Expose()
  @Type(() => NotificationSettingVm)
  readonly [nt.POST]: NotificationSettingVm;

  @ApiModelProperty({ type: NotificationSettingVm })
  @Expose()
  @Type(() => NotificationSettingVm)
  readonly [nt.ANNOUNCEMENT]: NotificationSettingVm;

  @ApiModelProperty({ type: NotificationSettingVm })
  @Expose()
  @Type(() => NotificationSettingVm)
  readonly [nt.REVIEW]: NotificationSettingVm;

}