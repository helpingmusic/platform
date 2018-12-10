import { ApiModelProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsOptional, ValidateNested } from 'class-validator';

class NotificationDistributionSettings {
  @ApiModelProperty()
  @IsBoolean()
  @IsOptional()
  browser: boolean;

  @ApiModelProperty()
  @IsBoolean()
  @IsOptional()
  email: boolean;
}

export class UpdateNotificationSettingsDto {

  @ApiModelProperty()
  @Type(() => NotificationDistributionSettings)
  @ValidateNested()
  account: NotificationDistributionSettings;

  @ApiModelProperty()
  @Type(() => NotificationDistributionSettings)
  @ValidateNested()
  discount: NotificationDistributionSettings;

  @ApiModelProperty()
  @Type(() => NotificationDistributionSettings)
  @ValidateNested()
  post: NotificationDistributionSettings;

  @ApiModelProperty()
  @Type(() => NotificationDistributionSettings)
  @ValidateNested()
  announcement: NotificationDistributionSettings;

  @ApiModelProperty()
  @Type(() => NotificationDistributionSettings)
  @ValidateNested()
  review: NotificationDistributionSettings;

}