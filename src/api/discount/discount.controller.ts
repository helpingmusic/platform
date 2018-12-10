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
import { ActiveSubscriptionGuard } from 'src/auth/guards/active-subscription.guard';

import { Roles } from 'src/auth/guards/roles.decorator';
import { UserRoles } from 'src/auth/guards/roles.enum';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { NotFoundInterceptor } from 'src/common/not-found.interceptor';
import { Output } from 'src/common/output.decorator';

import { IDiscount } from './discount.interface';
import { DiscountService } from './discount.service';
import { DiscountVm } from './discount.vm';
import { CreateDiscountDto } from './dto/create-discount.dto';

@ApiUseTags('discounts')
@ApiResponse({ status: 401, description: 'User is not logged in' })
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard('jwt'), ActiveSubscriptionGuard, RolesGuard)
@Controller('discounts')
export class DiscountController {

  constructor(private readonly discountService: DiscountService) {
  }

  /**
   * Index
   */
  @ApiOperation({ title: 'List Discounts' })
  @ApiOkResponse({
    isArray: true,
    type: DiscountVm,
    description: 'List all Discounts',
  })

  @Get()
  @Roles(UserRoles.ADMIN)
  @Output([DiscountVm])
  index(): Promise<IDiscount[]> {
    return this.discountService.index();
  }

  /**
   * Create
   * @param body {UpdateDiscountStatusDto}
   */
  @ApiOperation({ title: 'Create Discount' })
  @ApiImplicitBody({ name: 'Create Discount Input', type: CreateDiscountDto })
  @ApiForbiddenResponse({ description: 'Inactive Subscription or not Admin' })
  @ApiUnprocessableEntityResponse({ description: 'Body not valid' })
  @ApiCreatedResponse({ description: 'Create Discount', type: DiscountVm })

  @Post()
  @Roles(UserRoles.ADMIN)
  @Output(DiscountVm)
  create(@Body() body: CreateDiscountDto): Promise<IDiscount> {
    return this.discountService.create(body);
  }

  /**
   * Update
   * @param id {String}
   * @param body {CreateDiscountDto}
   */
  @ApiOperation({ title: 'Update Discount' })
  @ApiImplicitBody({ name: 'Update Discount Input', type: CreateDiscountDto })
  @ApiForbiddenResponse({ description: 'Inactive Subscription or not Admin' })
  @ApiUnprocessableEntityResponse({ description: 'Body not valid' })
  @ApiOkResponse({ type: DiscountVm })
  @ApiNotFoundResponse({ description: 'Discount Not Found' })

  @Put(':id')
  @UseInterceptors(new NotFoundInterceptor('Discount Not Found'))
  @Roles(UserRoles.ADMIN)
  @Output(DiscountVm)
  update(@Param('id') id: string, @Body() body: CreateDiscountDto): Promise<IDiscount> {
    return this.discountService.update(id, body);
  }

  /**
   * Delete
   * @param id {String}
   */
  @ApiOperation({ title: 'Delete Discount' })
  @ApiForbiddenResponse({ description: 'Inactive Subscription or not Admin' })
  @ApiNotFoundResponse({ description: 'Discount Not Found' })
  @ApiOkResponse({ description: 'Discount Deleted' })

  @Delete(':id')
  @UseInterceptors(new NotFoundInterceptor('Discount Not Found'))
  @Roles(UserRoles.ADMIN)
  remove(@Param('id') id: string) {
    return this.discountService.delete(id);
  }
}
