import { EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from 'src/shared/logger/logger.module';
import { StripeEvents } from 'src/webhooks/stripe/stripe-events.enum';
import { StripeEvent } from 'src/webhooks/stripe/stripe.event';
import { StripeController } from './stripe.controller';

describe('Stripe Controller', () => {
  let module: TestingModule;
  let ctrl: StripeController;

  const eventBusMock = {
    publish: jest.fn(),
  };

  beforeAll(async () => {

    module = await Test.createTestingModule({
      imports: [LoggerModule],
      controllers: [StripeController],
    })
      .overrideProvider(EventBus)
      .useValue(eventBusMock)
      .compile();

    ctrl = module.get<StripeController>(StripeController);
  });

  it('should be defined', () => {
    expect(ctrl).toBeDefined();
  });

  // it('should emit StripeEvents', function() {
  //
  //   ctrl.event({
  //     object: {},
  //     type: StripeEvents.CUSTOMER_UPDATED,
  //   });
  //
  //   const event = new StripeEvent(StripeEvents.CUSTOMER_UPDATED, {});
  //   expect(eventBusMock.publish).toBeCalledWith(event);
  //
  // });

});
