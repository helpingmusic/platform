import { ApiModelProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { IssueTypes } from 'src/api/issue/issue-types.enum';

export class CreateIssueDto {

  @ApiModelProperty({
    description: 'Description of Issue',
    type: String,
  })
  @IsString()
  readonly description: string;

  @ApiModelProperty({
    description: 'Issue Type',
    enum: [IssueTypes.BUG, IssueTypes.SUGGESTION],
    type: String,
  })
  @IsString()
  @IsEnum(IssueTypes)
  readonly type: IssueTypes;

}