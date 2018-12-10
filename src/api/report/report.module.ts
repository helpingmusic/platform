import { Module, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { CommandBus, CQRSModule, EventBus } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { CommandHandlers } from 'src/api/report/commands';
import { ReportEventsModel } from 'src/api/report/events/report-events.model';
import { ReportSagas } from 'src/api/report/report.sagas';
import { SharedModule } from 'src/shared/shared.module';
import { ReportController } from './report.controller';

import { ReportSchema } from './report.schema';
import { ReportService } from './report.service';

@Module({
  imports: [
    CQRSModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    MongooseModule.forFeature([{ name: 'Report', schema: ReportSchema }]),
    SharedModule,
  ],
  controllers: [ReportController],
  providers: [
    ReportService,
    ReportEventsModel,
    ...CommandHandlers,
    ReportSagas,
  ],
})
export class ReportModule implements OnModuleInit {

  constructor(
    private reportEventModel: ReportEventsModel,
    private moduleRef: ModuleRef,
    private cmd$: CommandBus,
    private event$: EventBus,
    private reportSagas: ReportSagas,
  ) {
  }

  onModuleInit() {
    this.cmd$.setModuleRef(this.moduleRef);
    this.event$.setModuleRef(this.moduleRef);

    this.cmd$.register(CommandHandlers);

    this.event$.combineSagas(this.reportSagas.sagas);
  }
}
