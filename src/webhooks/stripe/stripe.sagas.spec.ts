import { CommandBus, CQRSModule, EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from 'src/core/email/email.service';
import { UsersService } from 'src/users/services/users.service';
import { CommandHandlers } from 'src/webhooks/stripe/commands';
import { SyncCustomerCommand } from 'src/webhooks/stripe/commands/sync-customer.command';
import { StripeEvents } from 'src/webhooks/stripe/stripe-events.enum';
import { StripeEvent } from 'src/webhooks/stripe/stripe.event';
import { StripeSagas } from 'src/webhooks/stripe/stripe.sagas';

jest.mock('src/webhooks/stripe/commands/sync-customer.command');

describe('Stripe Sagas', () => {
  let module: TestingModule;
  let event$: EventBus;
  let sagas: StripeSagas;

  const userServiceMock = {};
  const emailServiceMock = {};

  beforeAll(async () => {

    module = await Test.createTestingModule({
      imports: [CQRSModule],
      providers: [
        StripeSagas,
        ...CommandHandlers,
      ],
    })
      .overrideProvider(UsersService).useValue(userServiceMock)
      .overrideProvider(EmailService).useValue(emailServiceMock)
      .compile();

    await module.init();

    sagas = module.get<StripeSagas>(StripeSagas);

    const cmd$ = module.get<CommandBus>(CommandBus);
    cmd$.setModuleRef(module);
    cmd$.register(CommandHandlers);

    event$ = module.get<EventBus>(EventBus);
    event$.setModuleRef(module);
    event$.combineSagas(sagas.sagas);

  });

  it('should be defined', () => {
    expect(sagas).toBeDefined();
  });

  it('should fire saga functions on stripe events', () => {
    const payload = { object: 'customer' };
    const e = new StripeEvent(StripeEvents.CUSTOMER_UPDATED, payload);
    event$.publish(e);
    expect(SyncCustomerCommand).toHaveBeenCalledTimes(1);
    expect(SyncCustomerCommand).toHaveBeenCalledWith(payload);
  });

});
