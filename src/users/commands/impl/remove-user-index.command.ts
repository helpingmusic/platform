import { ICommand } from '@nestjs/cqrs';

export class RemoveUserIndexCommand implements ICommand {
  constructor(public userId: string) {
  }
}