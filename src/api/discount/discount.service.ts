import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IDiscount } from 'src/api/discount/discount.interface';
import { EntityService } from 'src/common/abstract/entity.service';

@Injectable()
export class DiscountService extends EntityService<IDiscount> {

  constructor(@InjectModel('Discount') model: Model<IDiscount>) {
    super(model);
  }

}
