import { Module } from '@nestjs/common';
import { SharedModule } from 'src/shared/shared.module';
import { SearchService } from './search.service';

@Module({
  imports: [SharedModule],
  providers: [SearchService],
  exports: [SearchService],
})
export class SearchModule {
}
