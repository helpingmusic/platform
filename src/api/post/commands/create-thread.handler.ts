import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateThreadCommand } from 'src/api/post/commands/create-thread.command';
import { ThreadService } from 'src/api/thread/thread.service';

@CommandHandler(CreateThreadCommand)
export class CreateThreadHandler implements ICommandHandler<CreateThreadCommand> {
  constructor(
    private threadService: ThreadService,
  ) {
  }

  async execute(cmd: CreateThreadCommand, resolve: (value?) => void) {
    const { postId } = cmd;

    await this.threadService.create({
      media: { kind: 'Post', item: postId },
    });

    resolve();
  }
}