import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AllowanceStatuses } from 'src/api/credit-transaction/allowance-statuses.enum';
import { CreateAllowanceScheduleDto } from 'src/api/credit-transaction/dto/create-allowance-schedule.dto';
import { IAllowanceTransaction } from 'src/api/credit-transaction/interfaces/allowance-transaction.interface';
import { ICreditTransaction } from 'src/api/credit-transaction/interfaces/credit-transaction.interface';
import { EntityService } from 'src/common/abstract/entity.service';
import { moment } from 'src/common/vendor';

@Injectable()
export class CreditTransactionService extends EntityService<ICreditTransaction> {

  constructor(
    @InjectModel('CreditTransaction') private creditModel: Model<ICreditTransaction>,
    @InjectModel('AllowanceTransaction') private allowanceModel: Model<IAllowanceTransaction>,
  ) {
    super(creditModel);
  }

  async indexUser(user: string): Promise<{ transactions: ICreditTransaction[], allowances: IAllowanceTransaction[] }> {
    const [transactions, allowances] = await Promise.all([
      this.creditModel.find({ user })
        .sort('-updated_at')
        .exec(),
      this.allowanceModel.find({ user, status: AllowanceStatuses.PENDING })
        .sort('runOn')
        .exec(),
    ]);

    return { transactions, allowances };
  }

  createAllowanceScheduleFor(userId: string, body: CreateAllowanceScheduleDto) {

    const allowances = Array(body.count).fill(0)
      .map((_, i) => ({
        user: userId,
        amount: body.amount,
        runOn: moment(body.startOn)
          .add(i * body.frequency, 'months')
          .format('YYYY-MM-DD'),
      }));

    return this.allowanceModel.create(allowances);
  }

  async updateAllowance(id: string, changes: Partial<IAllowanceTransaction>) {
    const a = await this.allowanceModel.findById(id);

    if (!a) throw new NotFoundException('Allowance Transaction not found');

    a.set(changes);

    return a.save();
  }

  async findPendingAllowances(): Promise<IAllowanceTransaction[]> {
    const allPending = await this.allowanceModel
      .find({ status: 'pending' })
      .populate('user')
      .exec();

    console.log('allPending', allPending.length); // tslint:disable-line

    // grab transactions that should have run by now
    return allPending.filter(at => moment().isAfter(at.runOn));
  }

  findLastAllowanceForUser(user: string) {
    return this.creditModel
      .findOne({ type: 'allowance', user })
      .select('created_at')
      .sort({ created_at: -1 })
      .exec();
  }

  async removeAllowance(id: string) {
    const a = await  this.allowanceModel.findById(id);
    await a.update({ status: AllowanceStatuses.CANCELLED });
    return a;
  }

}
