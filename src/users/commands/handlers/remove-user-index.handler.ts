import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Indices } from 'src/search/indices.enum';
import { SearchService } from 'src/search/search.service';
import { RemoveUserIndexCommand } from 'src/users/commands/impl/remove-user-index.command';

@CommandHandler(RemoveUserIndexCommand)
export class RemoveUserIndexHandler implements ICommandHandler<RemoveUserIndexCommand> {

  constructor(
    private search: SearchService,
  ) {
  }

  async execute(cmd: RemoveUserIndexCommand, resolve: (value?) => void) {
    const { userId } = cmd;

    await this.search.deleteRecords(Indices.USERS, [userId]);

    resolve();
  }

}