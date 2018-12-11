import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { classToPlain, plainToClass } from 'class-transformer';
import { Indices } from 'src/core/search/indices.enum';
import { SearchService } from 'src/core/search/search.service';
import { UpdateUserIndexCommand } from 'src/users/commands/impl/update-user-index.command';
import { UserIndexVm } from 'src/users/vm/user-index.vm';

@CommandHandler(UpdateUserIndexCommand)
export class UpdateUserIndexHandler implements ICommandHandler<UpdateUserIndexCommand> {

  constructor(
    private search: SearchService,
  ) {
  }

  async execute(cmd: UpdateUserIndexCommand, resolve: (value?) => void) {
    const { user } = cmd;

    // create indexed version
    const indexed = new UserIndexVm(user);
    await this.search.upsertRecords(Indices.USERS, [indexed]);

    resolve();
  }

}