import { Body, ClassSerializerInterceptor, Controller, Get, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
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
import { ResolveReportDto } from 'src/api/report/dto/resolve-report.dto';
import { Roles } from 'src/auth/guards/roles.decorator';
import { UserRoles } from 'src/auth/guards/roles.enum';
import { RolesGuard } from 'src/auth/guards/roles.guard';

import { IUser } from 'src/users/interfaces/user.interface';
import { Output } from 'src/common/output.decorator';
import { User } from 'src/common/user.decorator';
import { CreateReportDto } from './dto/create-report.dto';

import { IReport } from './interfaces/report.interface';
import { ReportService } from './report.service';
import { ReportVm } from './report.vm';

@ApiUseTags('reports')
@ApiResponse({ status: 401, description: 'User is not logged in' })
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('reports')
export class ReportController {

  constructor(private readonly reportService: ReportService) {
  }

  /**
   * Index
   */
  @ApiOperation({ title: 'List Reports' })
  @ApiOkResponse({
    isArray: true,
    type: ReportVm,
    description: 'List all Reports',
  })

  @Get()
  @Output([ReportVm])
  index(): Promise<IReport[]> {
    return this.reportService.index();
  }

  /**
   * Create
   */
  @ApiOperation({ title: 'Create Report' })
  @ApiImplicitBody({ name: 'Create Report Input', type: CreateReportDto })
  @ApiForbiddenResponse({ description: 'Inactive Subscription or not Admin' })
  @ApiUnprocessableEntityResponse({ description: 'Body not valid' })
  @ApiCreatedResponse({ description: 'Create Report', type: ReportVm })

  @Post()
  @Output(ReportVm)
  create(@User() user: IUser, @Body() body: CreateReportDto): Promise<IReport> {
    return this.reportService.create({
      media: {
        kind: body.mediaType,
        item: body.mediaId,
      },
      reason: body.reason,
      description: body.description,
      reporter: user._id,
    });
  }

  /**
   * Update
   * @param id {String}
   * @param body {CreateReportDto}
   */
  @ApiOperation({ title: 'Resolve Report' })
  @ApiImplicitBody({ name: 'Update Report Input', type: ResolveReportDto })
  @ApiForbiddenResponse({ description: 'Not Admin' })
  @ApiUnprocessableEntityResponse({ description: 'Body not valid' })
  @ApiOkResponse({ type: ReportVm })
  @ApiNotFoundResponse({ description: 'Report Not Found' })

  @Put(':id')
  @Roles(UserRoles.ADMIN)
  @Output(ReportVm)
  resolve(@Param('id') id: string, @Body() body: ResolveReportDto): Promise<IReport> {
    return this.reportService.update(id, body);
  }

}
