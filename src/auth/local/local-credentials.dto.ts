import { ApiModelProperty } from '@nestjs/swagger';

export class LocalCredentialsDto {
  @ApiModelProperty()
  email: string;

  @ApiModelProperty()
  password: string;
}