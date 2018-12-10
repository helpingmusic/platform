import { ICommand } from '@nestjs/cqrs';

export class CreateThreadCommand implements ICommand {
  constructor(
    public postId: string,
  ) {
  }
}