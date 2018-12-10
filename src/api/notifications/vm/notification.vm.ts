import { ApiModelProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { NotificationTypes } from 'src/api/notifications/notification-types.enum';
import { DocumentVm } from 'src/common/abstract/document.vm';

export class NotificationVm extends DocumentVm {
  @ApiModelProperty()
  @Expose()
  readonly type: NotificationTypes;

  @ApiModelProperty()
  @Expose()
  readonly readAt: Date;

  @ApiModelProperty()
  @Expose()
  readonly title: string;

  @ApiModelProperty()
  @Expose()
  readonly description: string;

  @ApiModelProperty()
  @Expose()
  readonly link: string;

  @ApiModelProperty()
  @Expose()
  readonly data: any;

}