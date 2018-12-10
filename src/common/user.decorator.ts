import { createParamDecorator } from '@nestjs/common';
import { IUser } from 'src/users/interfaces/user.interface';

export const User = createParamDecorator((data, req) => (req.user as IUser));
