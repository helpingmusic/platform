import {
  Body,
  Controller,
  FileFieldsInterceptor,
  FileInterceptor,
  Get,
  Param,
  Post,
  Put,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiUseTags } from '@nestjs/swagger';
import { UpdateUserPasswordDto } from 'src/users/dto/update-user-password.dto';
import { UpdateUserPhotoDto } from 'src/users/dto/update-user-photo.dto';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { IUser } from 'src/users/interfaces/user.interface';
import { UsersAuthService } from 'src/users/services/users-auth.service';
import { Output } from 'src/common/decorators/output.decorator';
import { UsersService } from 'src/users/services/users.service';
import { UserSelfVm } from 'src/users/vm/user-self.vm';
import { IS3FileUpload } from 'src/core/storage/s3-file-upload.interface';
import { User } from 'src/common/decorators/user.decorator';

@ApiUseTags('Users')
@UseGuards(AuthGuard('jwt'))
@Controller('users/me')
export class CurrentUserController {

  constructor(
    private usersService: UsersService,
    private userAuth: UsersAuthService,
  ) {
  }

  @Get()
  @ApiOperation({ title: 'Get Current User' })
  @Output(UserSelfVm)
  me(@User() user: IUser): Promise<IUser> {
    return this.usersService.getById(user._id);
  }

  @Put()
  @ApiOperation({ title: 'Update Current User' })
  @Output(UserSelfVm)
  async update(@User() user: IUser, @Body() userUpdates: UpdateUserDto): Promise<IUser> {
    return this.usersService.update(user, userUpdates);
  }

  @Post('/photos')
  @ApiOperation({ title: 'Add Photo to user' })
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'profile_pic', maxCount: 1 },
    { name: 'banner', maxCount: 1 },
  ]))
  @Output(UserSelfVm)
  addPhoto(@User() user: IUser, @UploadedFiles() photos: { [type: string]: IS3FileUpload[] }): Promise<IUser> {
    const updates = Object.keys(photos)
      .reduce((agg, type) => ({ ...agg, [type]: photos[type][0].location }), {});
    return this.usersService.update(user, updates);
  }

  @Put('password')
  @ApiOperation({ title: 'Update Current User' })
  @Output(UserSelfVm)
  async updatePassword(@User() user: IUser, @Body() passwordUpdate: UpdateUserPasswordDto): Promise<IUser> {
    return this.userAuth.updatePassword(String(user._id), passwordUpdate);
  }

}
