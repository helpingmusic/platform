import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Post, Put, Request, UseGuards, UseInterceptors } from '@nestjs/common';
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
import { UpdateIssueStatusDto } from 'src/api/issue/dto/update-issue-status.dto';
import { ActiveSubscriptionGuard } from 'src/auth/guards/active-subscription.guard';

import { Roles } from 'src/auth/guards/roles.decorator';
import { UserRoles } from 'src/auth/guards/roles.enum';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { NotFoundInterceptor } from 'src/common/interceptors/not-found.interceptor';
import { Output } from 'src/common/decorators/output.decorator';
import { CreateIssueDto } from './dto/create-issue.dto';

import { IIssue } from './issue.interface';
import { IssueService } from './issue.service';
import { IssueVm } from './issue.vm';

@ApiUseTags('issues')
@ApiResponse({ status: 401, description: 'User is not logged in' })
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('issues')
export class IssueController {

  constructor(private readonly issueService: IssueService) {
  }

  /**
   * Index
   */
  @ApiOperation({ title: 'List Issues' })
  @ApiOkResponse({
    isArray: true,
    type: IssueVm,
    description: 'List all Issues',
  })

  @Get()
  @Roles(UserRoles.ADMIN)
  @Output(IssueVm)
  index(): Promise<IIssue[]> {
    return this.issueService.index();
  }

  /**
   * Show
   * @param id {String}
   */
  @ApiOperation({ title: 'Show Issue' })
  @ApiOkResponse({ type: IssueVm })
  @ApiImplicitParam({ name: 'Issue ID' })
  @ApiNotFoundResponse({ description: 'Issue Not Found' })

  @Get(':id')
  @UseInterceptors(new NotFoundInterceptor('Issue Not Found'))
  @Roles(UserRoles.ADMIN)
  @Output(IssueVm)
  async show(@Param('id') id: string): Promise<IIssue> {
    return this.issueService.show(id);
  }

  /**
   * Create
   * @param body {UpdateIssueStatusDto}
   */
  @ApiOperation({ title: 'Create Issue' })
  @ApiImplicitBody({ name: 'Create Issue Input', type: CreateIssueDto })
  @ApiForbiddenResponse({ description: 'Inactive Subscription or not Admin' })
  @ApiUnprocessableEntityResponse({ description: 'Body not valid' })
  @ApiCreatedResponse({ description: 'Create Issue', type: IssueVm })

  @Post()
  @Output(IssueVm)
  create(@Request() req, @Body() body: CreateIssueDto): Promise<IIssue> {
    return this.issueService.create({
      ...body,
      submittedBy: req.user,
    });
  }

  /**
   * Update
   * @param id {String}
   * @param body {UpdateIssueStatusDto}
   */
  @ApiOperation({ title: 'Update Issue' })
  @ApiImplicitBody({ name: 'Update Issue Input', type: UpdateIssueStatusDto })
  @ApiForbiddenResponse({ description: 'Inactive Subscription or not Admin' })
  @ApiUnprocessableEntityResponse({ description: 'Body not valid' })
  @ApiOkResponse({ type: IssueVm })
  @ApiNotFoundResponse({ description: 'Issue Not Found' })

  @Put(':id')
  @UseInterceptors(new NotFoundInterceptor('Issue Not Found'))
  @Roles(UserRoles.ADMIN)
  @Output(IssueVm)
  close(@Param('id') id: string, @Body() body: UpdateIssueStatusDto): Promise<IIssue> {
    return this.issueService.update(id, body);
  }

  /**
   * Delete
   * @param id {String}
   */
  @ApiOperation({ title: 'Delete Issue' })
  @ApiForbiddenResponse({ description: 'Inactive Subscription or not Admin' })
  @ApiNotFoundResponse({ description: 'Issue Not Found' })
  @ApiOkResponse({ description: 'Issue Deleted' })

  @Delete(':id')
  @UseInterceptors(new NotFoundInterceptor('Issue Not Found'))
  @Roles(UserRoles.ADMIN)
  remove(@Param('id') id: string) {
    return this.issueService.delete(id);
  }
}
