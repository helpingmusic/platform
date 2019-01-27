import { Injectable } from '@nestjs/common';
import { Constructor } from '@nestjs/common/utils/merge-with-values.util';
import { EventObservable, ICommand } from '@nestjs/cqrs';
import { Observable, of } from 'rxjs';
import { filter, map, pluck, share, switchMap } from 'rxjs/operators';
import { CmsService } from 'src/webhooks/prismic/cms.service';
import { ProcessAnnouncementCommand } from 'src/webhooks/prismic/commands/process-announcement.command';
import { DocTypes, IPrismicDoc } from 'src/webhooks/prismic/documents';
import { PrismicEvent } from 'src/webhooks/prismic/prismic.event';

@Injectable()
export class PrismicSagas {

  // cmds: Map<DocTypes, Constructor<ICommand>> = new Map([
  //   [DocTypes.ANNOUNCEMENT, ProcessAnnouncementCommand],
  // ]);

  private webhook$ = (events$: EventObservable<PrismicEvent>): Observable<IPrismicDoc<any>> => (
    events$.ofType(PrismicEvent)
      .pipe(
        switchMap(() => this.cms.getLatestDocs()),
        share(),
        switchMap(({ results }) => of(...results)),
      )
  )

  processAnnouncements$ = (events$: EventObservable<PrismicEvent>): Observable<ICommand> => (
    this.webhook$(events$)
      .pipe(
        filter((doc) => doc.type === DocTypes.ANNOUNCEMENT),
        map(doc => new ProcessAnnouncementCommand(doc)),
      )
  );

  // webhookTriggered$ = (events$: EventObservable<PrismicEvent>): Observable<ICommand> => (
  //   events$.ofType(PrismicEvent)
  //     .pipe(
  //       switchMap(() => this.cms.getLatestDocs()),
  //       pluck('results'),
  //       map((docs: IPrismicDoc<any>[]) => (
  //         docs.reduce((cmds, d) => {
  //           if (this.cmds.has(d.type)) {
  //             const c = this.cmds.get(d.type);
  //             return [...cmds, new c(d)];
  //           }
  //           return cmds;
  //         }, [])
  //       )),
  //       switchMap((cmds) => of(...cmds)),
  //     )
  // );

  sagas = [
    this.processAnnouncements$,
  ];

  constructor(private cms: CmsService) { }

}