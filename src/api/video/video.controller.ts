import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
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
import { UpdateVideoDto } from 'src/api/video/dto/update-video.dto';
import { ActiveSubscriptionGuard } from 'src/auth/guards/active-subscription.guard';

import { Roles } from 'src/auth/guards/roles.decorator';
import { UserRoles } from 'src/auth/guards/roles.enum';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { NotFoundInterceptor } from 'src/common/interceptors/not-found.interceptor';
import { Output } from 'src/common/decorators/output.decorator';
import { CreateVideoDto } from './dto/create-video.dto';

import { IVideo } from './video.interface';
import { VideoService } from './video.service';
import { VideoVm } from './video.vm';

@ApiUseTags('videos')
@ApiResponse({ status: 401, description: 'User is not logged in' })
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard('jwt'), ActiveSubscriptionGuard, RolesGuard)
@Controller('media')
export class VideoController {

  constructor(private readonly videoService: VideoService) {
  }

  /**
   * Index
   */
  @ApiOperation({ title: 'List Videos' })
  @ApiOkResponse({
    isArray: true,
    type: VideoVm,
    description: 'List all Videos',
  })

  @Get()
  @Roles(UserRoles.ADMIN)
  @Output(VideoVm)
  index(): Promise<IVideo[]> {
    return this.videoService.index();
  }

  /**
   * Create
   * @param body {UpdateVideoStatusDto}
   */
  @ApiOperation({ title: 'Create Video' })
  @ApiImplicitBody({ name: 'Create Video Input', type: CreateVideoDto })
  @ApiForbiddenResponse({ description: 'Inactive Subscription or not Admin' })
  @ApiUnprocessableEntityResponse({ description: 'Body not valid' })
  @ApiCreatedResponse({ description: 'Create Video', type: VideoVm })

  @Post()
  @Roles(UserRoles.ADMIN)
  @Output(VideoVm)
  create(@Body() body: CreateVideoDto): Promise<IVideo> {
    return this.videoService.create(body);
  }

  /**
   * Update
   * @param id {String}
   * @param body {CreateVideoDto}
   */
  @ApiOperation({ title: 'Update Video' })
  @ApiImplicitBody({ name: 'Update Video Input', type: UpdateVideoDto })
  @ApiForbiddenResponse({ description: 'Inactive Subscription or not Admin' })
  @ApiUnprocessableEntityResponse({ description: 'Body not valid' })
  @ApiOkResponse({ type: VideoVm })
  @ApiNotFoundResponse({ description: 'Video Not Found' })

  @Put(':id')
  @UseInterceptors(new NotFoundInterceptor('Video Not Found'))
  @Roles(UserRoles.ADMIN)
  @Output(VideoVm)
  update(@Param('id') id: string, @Body() body: UpdateVideoDto): Promise<IVideo> {
    return this.videoService.update(id, body);
  }

  /**
   * Delete
   * @param id {String}
   */
  @ApiOperation({ title: 'Delete Video' })
  @ApiForbiddenResponse({ description: 'Inactive Subscription or not Admin' })
  @ApiNotFoundResponse({ description: 'Video Not Found' })
  @ApiOkResponse({ description: 'Video Deleted' })

  @Delete(':id')
  @UseInterceptors(new NotFoundInterceptor('Video Not Found'))
  @Roles(UserRoles.ADMIN)
  remove(@Param('id') id: string) {
    return this.videoService.delete(id);
  }
}
