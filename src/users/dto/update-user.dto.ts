import { ApiModelProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsEmail, IsOptional, IsString, ValidateNested } from 'class-validator';
import { MembershipType } from 'src/common/constants';
import { UpdateNotificationSettingsDto } from 'src/users/dto/update-notification-settings.dto';

export class UpdateUserDto {

  @ApiModelProperty()
  @IsString()
  @IsOptional()
  readonly first_name: string;

  @ApiModelProperty()
  @IsString()
  @IsOptional()
  readonly last_name: string;

  @ApiModelProperty()
  @IsEmail()
  @IsOptional()
  readonly email: string;

  @ApiModelProperty()
  @IsString()
  @IsOptional()
  readonly referredBy: string;

  @ApiModelProperty()
  @IsString()
  @IsOptional()
  readonly bio: string;

  @ApiModelProperty()
  @IsString()
  @IsOptional()
  readonly city: string;

  @ApiModelProperty()
  @IsString()
  @IsOptional()
  readonly state: string;

  @ApiModelProperty()
  @IsArray()
  @IsOptional()
  readonly genres: Array<string>;

  @ApiModelProperty()
  @IsArray()
  @IsOptional()
  readonly skills: Array<string>;

  @ApiModelProperty()
  @IsArray()
  @IsOptional()
  readonly resources: Array<string>;

  @ApiModelProperty()
  @IsArray()
  @IsOptional()
  readonly instruments: Array<string>;

  @ApiModelProperty()
  @IsArray()
  @ArrayNotEmpty()
  @IsOptional()
  readonly membership_types: Array<MembershipType>;

  @ApiModelProperty()
  @IsString()
  @IsOptional()
  readonly profession: string;

  @ApiModelProperty({
    description: 'Object of user links to other platforms',
  })
  @IsOptional()
  personal_links: {
    [media: string]: string | null,
  };

}