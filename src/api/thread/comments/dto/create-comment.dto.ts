import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateCommentDto {
  @ApiModelProperty()
  @IsString()
  readonly body: string;

  @ApiModelPropertyOptional()
  @IsString()
  @IsOptional()
  readonly parent: string;
}