import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiCreatedResponse, ApiImplicitBody, ApiOkResponse, ApiOperation, ApiUnprocessableEntityResponse, ApiUseTags } from '@nestjs/swagger';
import { CreditTransactionService } from 'src/api/credit-transaction/credit-transaction.service';
import { CreateAllowanceScheduleDto } from 'src/api/credit-transaction/dto/create-allowance-schedule.dto';
import { CreateCreditTransactionDto } from 'src/api/credit-transaction/dto/create-credit-transaction.dto';
import { UpdateAllowanceDto } from 'src/api/credit-transaction/dto/update-allowance.dto';
import { IAllowanceTransaction } from 'src/api/credit-transaction/interfaces/allowance-transaction.interface';
import { ICreditTransaction } from 'src/api/credit-transaction/interfaces/credit-transaction.interface';
import { TransactionTypes } from 'src/api/credit-transaction/transaction-types.enum';
import { AllowanceTransactionVm } from 'src/api/credit-transaction/vm/allowance-transaction.vm';
import { CreditTransactionVm } from 'src/api/credit-transaction/vm/credit-transaction.vm';

import { Roles } from 'src/auth/guards/roles.decorator';
import { UserRoles } from 'src/auth/guards/roles.enum';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { IUser } from 'src/users/interfaces/user.interface';
import { Output } from 'src/common/decorators/output.decorator';
import { User } from 'src/common/decorators/user.decorator';

@ApiUseTags('Credit Transactions')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UserRoles.ADMIN)
@Controller('credit-transactions')
export class CreditTransactionController {

  constructor(private creditService: CreditTransactionService) {
  }

  /**
   * Index
   */
  @ApiOperation({ title: 'List Credit Transaction' })
  @ApiOkResponse({
    isArray: true,
    // type: CreditTransactionVm,
    description: 'List all credit transactions and allowance transactions',
  })

  @Get('users/:userId')
  index(@Param('userId') userId: string): Promise<{ transactions: ICreditTransaction[], allowances: IAllowanceTransaction[] }> {
    return this.creditService.indexUser(userId);
  }

  /**
   * Create
   */
  @ApiOperation({ title: 'Create Credit Transaction' })
  @ApiImplicitBody({ name: 'Create Credit Transaction Input', type: CreateCreditTransactionDto })
  @ApiUnprocessableEntityResponse({ description: 'Body not valid' })
  @ApiCreatedResponse({ description: 'Create Credit Transaction', type: CreditTransactionVm })

  @Post()
  @Output(CreditTransactionVm)
  async create(@User() user: IUser, @Body() body: CreateCreditTransactionDto): Promise<ICreditTransaction> {
    return this.creditService.create({
      user: body.user,
      type: TransactionTypes.ADMIN_SET,
      endAmount: body.amount,
      meta: {
        adminId: user._id,
        notes: body.notes,
      },
    });
  }

  /**
   * Create Allowance schedule
   */
  @ApiOperation({ title: 'Create Allowance Transaction schedule' })
  @ApiImplicitBody({ name: 'Create Allowance Transaction schedule Input', type: CreateAllowanceScheduleDto })
  @ApiUnprocessableEntityResponse({ description: 'Body not valid' })
  @ApiCreatedResponse({ description: 'Allowance Transaction Schedule Created', type: AllowanceTransactionVm, isArray: true })

  @Post('allowances')
  @Output(AllowanceTransactionVm)
  createAllowanceSchedule(@User() user: IUser, @Body() body: CreateAllowanceScheduleDto): Promise<IAllowanceTransaction[]> {
    return this.creditService.createAllowanceScheduleFor(body.user, body);
  }

  /**
   * Update allowance transaction
   */
  @ApiOperation({ title: 'Update Allowance Transaction' })
  @ApiImplicitBody({ name: 'Update Allowance Transaction Input', type: UpdateAllowanceDto })
  @ApiUnprocessableEntityResponse({ description: 'Body not valid' })
  @ApiCreatedResponse({ description: 'Allowance Transaction Schedule Created', type: AllowanceTransactionVm })

  @Put('allowances/:id')
  @Output(AllowanceTransactionVm)
  updateAllowanceTransaction(@Param('id') id: string, @Body() body: UpdateAllowanceDto): Promise<IAllowanceTransaction> {
    return this.creditService.updateAllowance(id, body);
  }

  /**
   * Delete allowance transaction
   */
  @ApiOperation({ title: 'Delete Allowance Transaction' })
  @ApiUnprocessableEntityResponse({ description: 'Body not valid' })

  @Delete('allowances/:id')
  deleteAllowanceTransaction(@Param('id') id: string): Promise<any> {
    return this.creditService.removeAllowance(id);
  }

}
