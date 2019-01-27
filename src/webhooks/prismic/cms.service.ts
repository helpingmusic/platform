import { Injectable } from '@nestjs/common';
import Prismic from 'prismic-javascript';
import PrismicApiResponse from 'src/webhooks/prismic/documents';

@Injectable()
export class CmsService {

  private getApi() {
    return Prismic.getApi('https://helpingmusic.prismic.io/api/v2');
  }

  async getLatestDocs(): Promise<PrismicApiResponse> {
    const api = await this.getApi();
    const res = await api.query('', {
      orderings: '[document.last_publication_date desc]',
      pageSize: 10,
    });
    return res as PrismicApiResponse;
  }

}
