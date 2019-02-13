import { Module } from '@nestjs/common';
import { AlogliaClient } from 'src/core/search/algolia.provider';
import { SharedModule } from 'src/shared/shared.module';
import { SearchService } from './search.service';

@Module({
  imports: [SharedModule],
  providers: [
    AlogliaClient,
    SearchService,
  ],
  exports: [SearchService],
})
export class SearchModule {
}
