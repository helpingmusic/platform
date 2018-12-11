import { Exclude, Expose } from 'class-transformer';
import { MembershipType } from 'src/common/constants';
import { SearchRecord } from 'src/core/search/search-record';

/**
 * Representation of user to be indexed for search
 */

@Exclude()
export class UserIndexVm extends SearchRecord {

  @Expose()
  first_name: string;
  @Expose()
  last_name: string;

  @Expose()
  city: string;
  @Expose()
  state: string;
  @Expose()
  profession: string;
  @Expose()
  bio: string;

  @Expose()
  membership_types: Array<MembershipType>;
  @Expose()
  genres: Array<string>;
  @Expose()
  instruments: Array<string>;
  @Expose()
  skills: Array<string>;
  @Expose()
  resources: Array<string>;

  @Expose()
  profile_pic: string;
  @Expose()
  banner: string;

  @Expose()
  created_at: Date;

}
