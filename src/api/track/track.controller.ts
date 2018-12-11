import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  FileInterceptor,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiImplicitBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiUnprocessableEntityResponse,
  ApiUseTags,
} from '@nestjs/swagger';
import { UpdateTrackDto } from 'src/api/track/dto/update-track.dto';

import { Roles } from 'src/auth/guards/roles.decorator';
import { UserRoles } from 'src/auth/guards/roles.enum';
import { BadDataException } from 'src/common/exceptions/bad-data.exception';
import { IUser } from 'src/users/interfaces/user.interface';
import { NotFoundInterceptor } from 'src/common/not-found.interceptor';
import { Output } from 'src/common/output.decorator';
import { IS3FileUpload } from 'src/core/storage/s3-file-upload.interface';
import { User } from 'src/common/user.decorator';
import { CreateTrackDto } from './dto/create-track.dto';

import { ITrack } from './track.interface';
import { TrackService } from './track.service';
import { TrackVm } from './track.vm';

@ApiUseTags('tracks')
@ApiResponse({ status: 401, description: 'User is not logged in' })
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard('jwt'))
@Controller('songs')
export class TrackController {

  constructor(private readonly trackService: TrackService) {
  }

  /**
   * Index
   */
  @ApiOperation({ title: 'List Tracks for User' })
  @ApiOkResponse({
    isArray: true,
    type: TrackVm,
    description: 'List all Tracks',
  })

  @Get()
  @Output([TrackVm])
  indexUser(@Query() query: { user: string }): Promise<ITrack[]> {
    return this.trackService.indexForUser(query.user);
  }

  /**
   * Show
   */
  @ApiOperation({ title: 'Show a Track' })
  @ApiOkResponse({
    isArray: true,
    type: TrackVm,
  })

  @Get(':id')
  @Output(TrackVm)
  show(@Param('id') id: string): Promise<ITrack> {
    return this.trackService.show(id);
  }

  /**
   * Create
   */
  @ApiOperation({ title: 'Create Track' })
  @ApiImplicitBody({ name: 'Create Track Input', type: CreateTrackDto })
  @ApiForbiddenResponse({ description: 'Inactive Subscription or not Admin' })
  @ApiUnprocessableEntityResponse({ description: 'Body not valid' })
  @ApiCreatedResponse({ description: 'Create Track', type: TrackVm })

  @Post()
  @UseInterceptors(FileInterceptor('track'))
  @Output(TrackVm)
  create(@User() user: IUser, @Body() body: CreateTrackDto, @UploadedFile() trackFile: IS3FileUpload): Promise<ITrack> {
    return this.trackService.create({
      title: body.title,
      duration: +body.duration,
      tags: body.tags.split(','),
      user: user._id,
      filename: trackFile.metadata.filename,
      mediaType: trackFile.contentType,
      byteLength: trackFile.size,
      href: trackFile.location,
      s3: { key: trackFile.key, ETag: trackFile.etag },
    });
  }

  /**
   * Update
   * @param id {String}
   * @param body {CreateTrackDto}
   */
  @ApiOperation({ title: 'Update Track' })
  @ApiImplicitBody({ name: 'Update Track Input', type: UpdateTrackDto })
  @ApiForbiddenResponse({ description: 'Inactive Subscription or not Admin' })
  @ApiUnprocessableEntityResponse({ description: 'Body not valid' })
  @ApiOkResponse({ type: TrackVm })
  @ApiNotFoundResponse({ description: 'Track Not Found' })

  @Put(':id')
  @UseInterceptors(new NotFoundInterceptor('Track Not Found'))
  @Output(TrackVm)
  update(@Param('id') id: string, @Body() body: UpdateTrackDto): Promise<ITrack> {
    return this.trackService.update(id, body);
  }

  /**
   * Delete
   * @param id {String}
   */
  @ApiOperation({ title: 'Delete Track' })
  @ApiNotFoundResponse({ description: 'Track Not Found' })
  @ApiOkResponse({ description: 'Track Deleted' })

  @Delete(':id')
  @Output(TrackVm)
  @UseInterceptors(new NotFoundInterceptor('Track Not Found'))
  remove(@Param('id') id: string) {
    return this.trackService.delete(id);
  }
}
