import { IBookable } from 'src/api/bookable/bookable.interface';
import { AvailabilityTypes as at } from 'src/api/bookable/constants';
import { MembershipPlans as mp } from 'src/common/constants';

const testBookable = {
  _id: '123',
  id: 'home-test-space',
  name: 'Home Test Space',
  location: 'HOME HQ',
  description: 'Space for testing',
  calendars: ['evolvemusic.org_u2kh7ellvq7hfbqqgv4bquu5mg@group.calendar.google.com'],
  imageUrl: '',

  rates: {
    [mp.PRO]: 1000,
    [mp.ONLINE]: 3000,
    [mp.COMMUNITY_1]: 4000,
    [mp.CREATIVE_1]: 2500,
    [mp.COWRITE_1]: 2500,
    [mp.COWORK_1]: 2500,
    [mp.PRODUCTION_1]: 2000,
  },

  hours: {
    [mp.PRO]: at.all,
    [mp.ONLINE]: at.businessHours,
    [mp.COMMUNITY_1]: at.businessHours,
    [mp.CREATIVE_1]: at.businessHours,
    [mp.COWRITE_1]: at.businessHours,
    [mp.COWORK_1]: at.businessHours,
    [mp.PRODUCTION_1]: at.all,
  },
};

export const Bookables: Array<IBookable> = [
  ...(process.env.NODE_ENV === 'production' ? [] : [testBookable]),

  {
    _id: '5ac570b7438f42d5060e22a7',
    id: 'home-stage',
    name: 'HOME Stage',
    location: 'HOME HQ',
    description: 'HOME Stage can be used during normal office hours (M-F 9-5) for video, photography, or acoustic rehersal only. No drums or loud amplification are permitted during those times. ',
    imageUrl: '/assets/images/studios/HOME_Stage.jpg',
    calendars: ['evolvemusic.org_72bn0f1ogmigau4jlvprel6mlc@group.calendar.google.com'],

    rates: {
      [mp.PRO]: 3000,
      [mp.ONLINE]: 9000,
      [mp.COMMUNITY_1]: 8000,
      [mp.CREATIVE_1]: 5000,
      [mp.COWRITE_1]: 5000,
      [mp.COWORK_1]: 5000,
      [mp.PRODUCTION_1]: 4000,
    },
    hours: {
      [mp.PRO]: at.all,
      [mp.ONLINE]: at.businessHours,
      [mp.COMMUNITY_1]: at.businessHours,
      [mp.CREATIVE_1]: at.businessHours,
      [mp.COWRITE_1]: at.businessHours,
      [mp.COWORK_1]: at.businessHours,
      [mp.PRODUCTION_1]: at.all,
    },

  }, {
    _id: '5a9326028dd8ac01eafae6e4',
    id: 'home-space',
    name: 'HOME Space',
    location: 'HOME HQ',
    description: 'HOME Space can be used 24/7 for band rehearsal, cowrites, meeting space, or a dead tracking room. ',
    imageUrl: '/assets/images/studios/HOME_Space2.jpg',
    calendars: ['evolvemusic.org_g2iv3p769s8ivh3pq8jmdgo968@group.calendar.google.com'],
    rates: {
      [mp.PRO]: 1000,
      [mp.ONLINE]: 3000,
      [mp.COMMUNITY_1]: 4000,
      [mp.CREATIVE_1]: 2500,
      [mp.COWRITE_1]: 2500,
      [mp.COWORK_1]: 2500,
      [mp.PRODUCTION_1]: 2000,
    },
    hours: {
      [mp.PRO]: at.all,
      [mp.ONLINE]: at.businessHours,
      [mp.COMMUNITY_1]: at.businessHours,
      [mp.CREATIVE_1]: at.businessHours,
      [mp.COWRITE_1]: at.businessHours,
      [mp.COWORK_1]: at.businessHours,
      [mp.PRODUCTION_1]: at.all,
    },

  }, {
    _id: '5ac572f2f1b95fd69612eb7c',
    id: 'home-studio',
    name: 'HOME Studio',
    location: 'HOME HQ',
    description: 'HOME Studio can be used 24/7 for recording, editing, mixing/mastering, podcasting, and content creation.',
    imageUrl: '/assets/images/studios/HOME_Studio.jpg',
    calendars: ['evolvemusic.org_lekq9a1appp4717ushpbajj3qs@group.calendar.google.com'],
    rates: {
      [mp.PRO]: 2000,
      [mp.PRODUCTION_1]: 3000,
    },
    hours: {
      [mp.PRO]: at.all,
      [mp.ONLINE]: at.businessHours,
      [mp.COMMUNITY_1]: at.businessHours,
      [mp.CREATIVE_1]: at.businessHours,
      [mp.COWRITE_1]: at.businessHours,
      [mp.COWORK_1]: at.businessHours,
      [mp.PRODUCTION_1]: at.all,
    },

  }, {
    _id: '5ae10d19d9d76e346de8cf9c',
    id: 'home-facility',
    name: 'HOME Facility',
    location: 'HOME HQ',
    imageUrl: '/assets/images/studios/HOME_Facility_Layout.png',
    description: 'This calendar is meant to populate calendars for all 3 rooms at HOME HQ and facilitate booking the entire space. ',
    calendars: [
      'evolvemusic.org_g2iv3p769s8ivh3pq8jmdgo968@group.calendar.google.com',
      'evolvemusic.org_72bn0f1ogmigau4jlvprel6mlc@group.calendar.google.com',
      'evolvemusic.org_lekq9a1appp4717ushpbajj3qs@group.calendar.google.com',
    ],
    rates: {
      [mp.PRO]: 10000,
      [mp.ONLINE]: 22000,
      [mp.COMMUNITY_1]: 15000,
      [mp.CREATIVE_1]: 10000,
      [mp.COWRITE_1]: 10000,
      [mp.COWORK_1]: 10000,
      [mp.PRODUCTION_1]: 7500,
    },
    hours: {
      [mp.PRO]: at.all,
      [mp.ONLINE]: at.all,
      [mp.COMMUNITY_1]: at.all,
      [mp.CREATIVE_1]: at.all,
      [mp.COWRITE_1]: at.all,
      [mp.COWORK_1]: at.all,
      [mp.PRODUCTION_1]: at.all,
    },
  },
];