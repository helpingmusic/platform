import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOkResponse, ApiOperation, ApiUseTags } from '@nestjs/swagger';
import { UpdateBillingDto } from 'src/users/dto/update-billing.dto';
import { UpdateSubscriptionDto } from 'src/users/dto/update-subscription.dto';
import { IUser } from 'src/users/interfaces/user.interface';
import { UsersBillingService } from 'src/users/services/users-billing.service';
import { InvoiceVm } from 'src/users/vm/invoice.vm';
import { UserSubscriptionVm } from 'src/users/vm/user-subscription.vm';
import { Output } from 'src/common/decorators/output.decorator';
import { User } from 'src/common/decorators/user.decorator';

@ApiUseTags('Users')
@UseGuards(AuthGuard('jwt'))
@Controller('users/me/subscription')
export class SubscriptionController {

  constructor(
    private userBilling: UsersBillingService,
  ) {
  }

  @Get()
  @ApiOperation({ title: 'Get User Subscription' })
  @ApiOkResponse({ type: UserSubscriptionVm })
  @Output(UserSubscriptionVm)
  get(@User() user: IUser) {
    return user.stripe;
  }

  @Put()
  @ApiOperation({ title: 'Update User Subscription' })
  @ApiOkResponse({ type: UserSubscriptionVm })
  @Output(UserSubscriptionVm)
  update(@User() user: IUser, @Body() planUpdates: UpdateSubscriptionDto) {
    return this.userBilling.updateSubscription(user, planUpdates.tier);
  }

  @Put('billing')
  @ApiOperation({ title: 'Update User Card' })
  @ApiOkResponse({ type: UserSubscriptionVm })
  @Output(UserSubscriptionVm)
  updateBilling(@User() user: IUser, @Body() planUpdates: UpdateBillingDto) {
    return this.userBilling.setToken(user, planUpdates.token);
  }

  @Get('invoices')
  @ApiOperation({ title: 'Get User\'s Invoices' })
  @ApiOkResponse({ type: InvoiceVm, isArray: true })
  @Output(InvoiceVm)
  getInvoices(@User() user: IUser) {
    return this.userBilling.getInvoices(user);
  }

  @Post('cancel')
  @ApiOperation({ title: 'Cancel Subscription' })
  @ApiOkResponse({ type: UserSubscriptionVm })
  @Output(UserSubscriptionVm)
  cancelSubscription(@User() user: IUser) {
    return this.userBilling.cancelSubscription(user);
  }

}
