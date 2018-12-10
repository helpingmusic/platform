import { ICommand } from '@nestjs/cqrs';

export class RemoveBookingFromCalendarCommand implements ICommand {
  constructor(
    public readonly eventIds: Array<{ gcalId: string; event: string }>,
  ) { }
}