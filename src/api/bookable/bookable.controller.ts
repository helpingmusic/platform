import { ClassSerializerInterceptor, Controller, Get, Param, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiImplicitParam, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { BookableService } from 'src/api/bookable/bookable.service';
import { BookableVm } from 'src/api/bookable/bookable.vm';
import { ActiveSubscriptionGuard } from 'src/auth/guards/active-subscription.guard';

import { NotFoundInterceptor } from 'src/common/not-found.interceptor';
import { Output } from 'src/common/output.decorator';

@ApiUseTags('Bookables')
@ApiResponse({ status: 401, description: 'User is not logged in' })
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard('jwt'), ActiveSubscriptionGuard)
@Controller('bookables')
export class BookableController {

  constructor(private bookableService: BookableService) {
  }

  /**
   * Index
   */
  @ApiOperation({ title: 'List Bookables' })
  @ApiOkResponse({
    isArray: true,
    type: BookableVm,
  })
  @Get()
  @Output([BookableVm])
  async index() {
    return this.bookableService.index();
  }

  /**
   * Show Bookable
   * @param id {String}
   */
  @ApiOperation({ title: 'Show Bookable' })
  @ApiOkResponse({ type: BookableVm })
  @ApiImplicitParam({ name: 'Bookable ID' })
  @ApiNotFoundResponse({ description: 'Bookable Not Found' })

  @Get(':id')
  @UseInterceptors(new NotFoundInterceptor('Bookable Not Found'))
  @Output(BookableVm)
  getBookable(@Param('id') id: string) {
    return this.bookableService.findByName(id);
  }

}
