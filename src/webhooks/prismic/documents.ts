import { Document } from 'prismic-javascript/d.ts/documents';
import { RichText } from 'prismic-dom';

export enum DocTypes {
  ANNOUNCEMENT = 'announcement',
}

export default interface PrismicApiResponse {
  page: number;
  results_per_page: number;
  results_size: number;
  total_results_size: number;
  total_pages: number;
  next_page: string;
  prev_page: string;
  results: IPrismicDoc<any>[];
}

export interface IPrismicDoc<T> extends Document {
  type: DocTypes;
  data: T;
}

type RichText = any[];

interface IPrismicAnnouncementData {
  title: RichText;
  body: RichText;
  originally_published?: Date;
}

export type IPrismicAnnouncement = IPrismicDoc<IPrismicAnnouncementData>;
