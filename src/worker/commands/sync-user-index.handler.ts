import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Indices } from 'src/core/search/indices.enum';
import { SearchService } from 'src/core/search/search.service';
import { UsersService } from 'src/users/services/users.service';
import { UserIndexVm } from 'src/users/vm/user-index.vm';
import { SyncUserIndexCommand } from 'src/worker/commands/sync-user-index.command';

@CommandHandler(SyncUserIndexCommand)
export class SyncUserIndexHandler implements ICommandHandler<SyncUserIndexCommand> {
  constructor(
    private userService: UsersService,
    private search: SearchService,
  ) {
  }

  async execute(cmd: SyncUserIndexCommand, resolve: (value?) => void) {
    const users = await this.userService.find();

    const indexed = users
      .filter(u => u.isActive)
      .map(u => new UserIndexVm(u));

    await this.search.upsertRecords(Indices.USERS, indexed);

    resolve();
  }
}