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

    'pro-mth-1': 2000,
    'pro-mth-2': 2000,
    'pro-yr-1': 2000,
    'pro-yr-2': 2000,
  },

  hours: {
    [mp.PRO]: at.all,
    [mp.ONLINE]: at.businessHours,
    [mp.COMMUNITY_1]: at.businessHours,
    [mp.CREATIVE_1]: at.businessHours,
    [mp.COWRITE_1]: at.businessHours,
    [mp.COWORK_1]: at.businessHours,
    [mp.PRODUCTION_1]: at.all,

    'pro-mth-1': at.all,
    'pro-mth-2': at.all,
    'pro-yr-1': at.all,
    'pro-yr-2': at.all,
  },
};

function forOldOnline(value) {
  return {
    'online-1': value,
    'online-mth-2': value,
    'online-yr-2': value,
  };
}

function forOldCommunity(value) {
  return {
    'community-mth-2': value,
    'community-yr-2': value,
  };
}

function forOldPro(value) {
  return {
    'pro-1': value,
    'pro-mth-1': value,
    'pro-mth-2': value,
    'pro-yr-1': value,
    'pro-yr-2': value,
  };
}

export const Bookables: Array<IBookable> = [
  ...(process.env.NODE_ENV === 'production' ? [] : [testBookable]),

  {
    _id: '5ac570b7438f42d5060e22a7',
    id: 'home-stage',
    name: 'HOME Stage',
    location: 'HOME HQ',
    description: `
      HOME Stage can be used 24/7 for video, photography, recording, 
      or acoustic rehearsal. NO LOUD DRUMS OR FULL PA AMPLIFICATION permitted 
      during business hours (M-F 9a-5p)
    `,
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

      [mp.CREATE_1]: 5000,

      [mp.PRODUCE_1]: 4000,
      [mp.PRO_1]: 4000,
      [mp.TEAM_1]: 4000,

      ...forOldOnline(90),
      ...forOldCommunity(90),
      ...forOldPro(3000),
    },
    hours: {
      [mp.PRO]: at.all,
      [mp.ONLINE]: at.businessHours,
      [mp.COMMUNITY_1]: at.businessHours,
      [mp.CREATIVE_1]: at.all,
      [mp.COWRITE_1]: at.all,
      [mp.COWORK_1]: at.all,
      [mp.PRODUCTION_1]: at.all,

      [mp.CREATE_1]: at.all,
      [mp.PRODUCE_1]: at.all,
      [mp.PRO_1]: at.all,
      [mp.TEAM_1]: at.all,

      ...forOldOnline(at.businessHours),
      ...forOldCommunity(at.businessHours),
      ...forOldPro(at.all),
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

      [mp.CREATE_1]: 2500,
      [mp.PRODUCE_1]: 2000,
      [mp.PRO_1]: 2000,
      [mp.TEAM_1]: 2000,

      ...forOldOnline(4500),
      ...forOldCommunity(4500),
      ...forOldPro(1000),
    },
    hours: {
      [mp.PRO]: at.all,
      [mp.ONLINE]: at.businessHours,
      [mp.COMMUNITY_1]: at.businessHours,
      [mp.CREATIVE_1]: at.all,
      [mp.COWRITE_1]: at.all,
      [mp.COWORK_1]: at.all,
      [mp.PRODUCTION_1]: at.all,

      [mp.CREATE_1]: at.all,
      [mp.PRODUCE_1]: at.all,
      [mp.PRO_1]: at.all,
      [mp.TEAM_1]: at.all,

      ...forOldOnline(at.businessHours),
      ...forOldCommunity(at.businessHours),
      ...forOldPro(at.all),
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

      [mp.PRO_1]: 3000,
      [mp.PRODUCE_1]: 3000,
      [mp.TEAM_1]: 3000,

      ...forOldPro(2000),
    },
    hours: {
      [mp.PRO]: at.all,
      [mp.PRODUCTION_1]: at.all,

      [mp.PRO_1]: at.all,
      [mp.PRODUCE_1]: at.all,
      [mp.TEAM_1]: at.all,

      ...forOldPro(at.all),
    },

  },
  // {
  //   _id: '5ae10d19d9d76e346de8cf9c',
  //   id: 'home-facility',
  //   name: 'HOME Facility',
  //   location: 'HOME HQ',
  //   imageUrl: '/assets/images/studios/HOME_Facility_Layout.png',
  //   description: 'This calendar is meant to populate calendars for all 3 rooms at HOME HQ and facilitate booking the entire space. ',
  //   calendars: [
  //     'evolvemusic.org_g2iv3p769s8ivh3pq8jmdgo968@group.calendar.google.com',
  //     'evolvemusic.org_72bn0f1ogmigau4jlvprel6mlc@group.calendar.google.com',
  //     'evolvemusic.org_lekq9a1appp4717ushpbajj3qs@group.calendar.google.com',
  //   ],
  //   rates: {
  //     [mp.PRO]: 7500,
  //     [mp.ONLINE]: 22000,
  //     [mp.COMMUNITY_1]: 15000,
  //     [mp.CREATIVE_1]: 10000,
  //     [mp.COWRITE_1]: 10000,
  //     [mp.COWORK_1]: 10000,
  //     [mp.PRODUCTION_1]: 7500,
  //     'pro-mth-1': 7500,
  //     'pro-mth-2': 7500,
  //     'pro-yr-1': 7500,
  //     'pro-yr-2': 7500,
  //
  //     ...forOldOnline(22000),
  //     ...forOldCommunity(15000),
  //     ...forOldPro(7500),
  //   },
  //   hours: {
  //     [mp.PRO]: at.all,
  //     [mp.ONLINE]: at.all,
  //     [mp.COMMUNITY_1]: at.all,
  //     [mp.CREATIVE_1]: at.all,
  //     [mp.COWRITE_1]: at.all,
  //     [mp.COWORK_1]: at.all,
  //     [mp.PRODUCTION_1]: at.all,
  //
  //     ...forOldOnline(at.all),
  //     ...forOldCommunity(at.all),
  //     ...forOldPro(at.all),
  //   },
  // },
];