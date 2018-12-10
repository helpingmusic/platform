import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiImplicitBody,
  ApiImplicitParam,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiUnprocessableEntityResponse,
  ApiUseTags,
} from '@nestjs/swagger';
import { ActiveSubscriptionGuard } from 'src/auth/guards/active-subscription.guard';

import { Roles } from 'src/auth/guards/roles.decorator';
import { UserRoles } from 'src/auth/guards/roles.enum';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { NotFoundInterceptor } from 'src/common/not-found.interceptor';
import { Output } from 'src/common/output.decorator';

import { IAnnouncement } from './announcement.interface';
import { AnnouncementService } from './announcement.service';
import { AnnouncementVm } from './announcement.vm';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';

@ApiUseTags('announcements')
@ApiResponse({ status: 401, description: 'User is not logged in' })
@UseGuards(AuthGuard('jwt'), ActiveSubscriptionGuard, RolesGuard)
@Controller('announcements')
export class AnnouncementController {

  constructor(private readonly announcementService: AnnouncementService) {
  }

  /**
   * Index
   */
  @ApiOperation({ title: 'List Announcements' })
  @ApiOkResponse({
    isArray: true,
    type: AnnouncementVm,
    description: 'List all Announcements',
  })

  @Get()
  @Output([AnnouncementVm])
  index(@Query() query: { page: number }): Promise<IAnnouncement[]> {
    return this.announcementService.paginate({}, query.page - 1);
  }

  /**
   * Show
   * @param id {String}
   */
  @ApiOperation({ title: 'Show Announcement' })
  @ApiOkResponse({ type: AnnouncementVm })
  @ApiImplicitParam({ name: 'Announcement ID' })
  @ApiNotFoundResponse({ description: 'Announcement Not Found' })

  @Get(':id')
  @UseInterceptors(new NotFoundInterceptor('Announcement Not Found'))
  @Output(AnnouncementVm)
  async show(@Param('id') id: string): Promise<IAnnouncement> {
    return this.announcementService.show(id);
  }

  /**
   * Create
   * @param body {UpdateAnnouncementDto}
   */
  @ApiOperation({ title: 'Create Announcement' })
  @ApiImplicitBody({ name: 'Create Announcement Input', type: CreateAnnouncementDto })
  @ApiForbiddenResponse({ description: 'Inactive Subscription or not Admin' })
  @ApiUnprocessableEntityResponse({ description: 'Body not valid' })
  @ApiCreatedResponse({ description: 'Create Announcement', type: AnnouncementVm })

  @Post()
  @Roles(UserRoles.ADMIN)
  @Output(AnnouncementVm)
  create(@Body() body: CreateAnnouncementDto): Promise<IAnnouncement> {
    return this.announcementService.create(body);
  }

  /**
   * Update
   * @param id {String}
   * @param body {UpdateAnnouncementDto}
   */
  @ApiOperation({ title: 'Update Announcement' })
  @ApiImplicitBody({ name: 'Update Announcement Input', type: UpdateAnnouncementDto })
  @ApiForbiddenResponse({ description: 'Inactive Subscription or not Admin' })
  @ApiUnprocessableEntityResponse({ description: 'Body not valid' })
  @ApiOkResponse({ type: AnnouncementVm })
  @ApiNotFoundResponse({ description: 'Announcement Not Found' })

  @Put(':id')
  @UseInterceptors(new NotFoundInterceptor('Announcement Not Found'))
  @Roles(UserRoles.ADMIN)
  @Output(AnnouncementVm)
  update(@Param('id') id: string, @Body() body: UpdateAnnouncementDto): Promise<IAnnouncement> {
    return this.announcementService.update(id, body);
  }

  /**
   * Delete
   * @param id {String}
   */
  @ApiOperation({ title: 'Delete Announcement' })
  @ApiForbiddenResponse({ description: 'Inactive Subscription or not Admin' })
  @ApiNotFoundResponse({ description: 'Announcement Not Found' })
  @ApiOkResponse({ description: 'Announcement Deleted' })

  @Delete(':id')
  @UseInterceptors(new NotFoundInterceptor('Announcement Not Found'))
  @Roles(UserRoles.ADMIN)
  remove(@Param('id') id: string) {
    return this.announcementService.delete(id);
  }
}
