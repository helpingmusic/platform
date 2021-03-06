import { ApiModelProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import { MembershipType } from 'src/common/constants';
import { DocumentVm } from 'src/common/abstract/document.vm';

@Expose()
class PersonalLinksVm {
  site: string;
  facebook: string;
  twitter: string;
  linkedin: string;
  youtube: string;
  soundcloud: string;
  instagram: string;
  spotify: string;
}

export class UserProfileVm extends DocumentVm {
  @ApiModelProperty()
  @Expose()
  readonly first_name: string;

  @ApiModelProperty()
  @Expose()
  readonly last_name: string;

  @ApiModelProperty()
  @Expose()
  readonly email: string;

  @ApiModelProperty()
  @Expose()
  readonly provider: string;

  @ApiModelProperty()
  @Expose()
  readonly city: string;

  @ApiModelProperty()
  @Expose()
  readonly state: string;

  @ApiModelProperty()
  @Expose()
  readonly profession: string;

  @ApiModelProperty()
  @Expose()
  readonly bio: string;

  @ApiModelProperty({ type: MembershipType, isArray: true })
  @Expose()
  readonly membership_types: Array<MembershipType>;

  @ApiModelProperty()
  @Expose()
  readonly genres: Array<string>;

  @ApiModelProperty()
  @Expose()
  readonly instruments: Array<string>;

  @ApiModelProperty()
  @Expose()
  readonly skills: Array<string>;

  @ApiModelProperty()
  @Expose()
  readonly resources: Array<string>;

  @ApiModelProperty()
  @Expose()
  readonly profile_pic: string;

  @ApiModelProperty()
  @Expose()
  readonly banner: string;

  @ApiModelProperty()
  @Expose()
  @Type(() => PersonalLinksVm)
  readonly personal_links: PersonalLinksVm;

  @ApiModelProperty()
  @Expose()
  readonly created_at: Date;

  @ApiModelProperty()
  @Expose()
  readonly updated_at: Date;

}
