import { ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class MarkNotificationsReadDto {

  @ApiModelPropertyOptional()
  @IsOptional()
  @IsArray()
  readonly notifications?: string[];

  @ApiModelPropertyOptional()
  @IsString()
  @IsOptional()
  readonly type?: string[];
}