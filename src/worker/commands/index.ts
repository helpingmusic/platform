import { RunCreditAllowancesHandler } from 'src/worker/commands/run-credit-allowances.handler';
import { SyncUserIndexHandler } from 'src/worker/commands/sync-user-index.handler';

export const CommandHandlers = [
  RunCreditAllowancesHandler,
  SyncUserIndexHandler,
];