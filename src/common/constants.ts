export const authTypes = ['facebook', 'google'];
export const userRoles = ['guest', 'user', 'admin'];

export const sessions = {
  minDuration: 1,
  maxDuration: 12,
  increment: 0.5, // hour precision of booking
};

export enum MembershipType {
  PLAYER = 'player',
  PUBLISHER = 'publisher',
  PERFORMER = 'performer',
  PRODUCER = 'producer',
  PATRON = 'producer',
}

export enum MembershipTiers {
  COMMUNITY = 'community',
  CREATIVE = 'creative',
  COWRITE = 'cowrite',
  PRODUCTION = 'production',
  COWORK = 'cowork',
}

export enum MembershipPlans {
  ONLINE = 'online',
  PRO = 'pro',
  COMMUNITY_1 = 'community-1',
  CREATIVE_1 = 'creative-1',
  COWRITE_1 = 'cowrite-1',
  PRODUCTION_1 = 'production-1',
  COWORK_1 = 'cowork-1',
}

export const plans = {
  [MembershipTiers.COMMUNITY]: {
    title: 'Community Membership',
    price: 1000,
    id: MembershipPlans.COMMUNITY_1,
  },
  [MembershipTiers.CREATIVE]: {
    title: 'Creative Membership',
    price: 5000,
    id: MembershipPlans.CREATIVE_1,
  },
  [MembershipTiers.COWRITE]: {
    title: 'Creative Cowriting',
    price: 8000,
    id: MembershipPlans.COWRITE_1,
  },
  [MembershipTiers.PRODUCTION]: {
    title: 'Creative Production',
    price: 10000,
    id: MembershipPlans.PRODUCTION_1,
  },
  [MembershipTiers.COWORK]: {
    title: 'Creative Coworking',
    price: 15000,
    id: MembershipPlans.COWORK_1,
  },
};

export const membershipTiers = [
  'pro', 'community', 'online',
  MembershipTiers.COMMUNITY,
  MembershipTiers.CREATIVE,
  MembershipTiers.COWRITE,
  MembershipTiers.COWORK,
  MembershipTiers.PRODUCTION,
];
