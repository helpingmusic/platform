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

    const [indexed, toDelete] = users
      .reduce((agg, u) => {
        if (u.isActive) agg[0].push(new UserIndexVm(u));
        else agg[1].push(String(u._id));

        return agg;
      }, [[], []]);

    await Promise.all([
      this.search.upsertRecords(Indices.USERS, indexed),
      this.search.deleteRecords(Indices.USERS, toDelete),
    ]);

    resolve();
  }
}