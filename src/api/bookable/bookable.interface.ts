import { TimeRange } from 'src/api/bookable/constants';

export interface IBookable {
  _id: string;
  id: string;
  name: string;
  location: string;
  description: string;
  calendars: Array<string>;
  imageUrl: string;
  urlslug?: string;

  rates: {
    [tier: string]: number,
  };

  hours: {
    [tier: string]: {
      [day: string]: Array<TimeRange>,
    },
  };
}