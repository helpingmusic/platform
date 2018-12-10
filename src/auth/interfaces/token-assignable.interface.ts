import { int } from 'aws-sdk/clients/datapipeline';
import { IUser } from 'src/users/interfaces/user.interface';

export interface ITokenAssignable {
  token?: string;
  user: IUser;
}