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
  PATRON = 'patron',
}

export enum MembershipTiers {
  COMMUNITY = 'community',
  CREATIVE = 'creative',
  COWRITE = 'cowrite',
  PRODUCTION = 'production',
  COWORK = 'cowork',

  PRO = 'pro',
  TEAM = 'team',
}

export enum MembershipPlans {
  ONLINE = 'online',
  PRO = 'pro',
  COMMUNITY_1 = 'community-1',

  CREATIVE_1 = 'creative-1',
  COWRITE_1 = 'cowrite-1',
  PRODUCTION_1 = 'production-1',
  COWORK_1 = 'cowork-1',

  CREATE_1 = 'create-1',
  PRODUCE_1 = 'producer-1',
  PRO_1 = 'pro-1',
  TEAM_1 = 'team-1',
}

export const plans = {
  // DEPRECATED
  [MembershipTiers.COMMUNITY]: {
    title: 'Community Membership',
    id: MembershipPlans.COMMUNITY_1,
    frequency: 'monthly',
  },

  [MembershipTiers.CREATIVE]: {
    title: 'Connect',
    id: MembershipPlans.CREATIVE_1,
    frequency: 'monthly',
  },
  [MembershipTiers.COWRITE]: {
    title: 'Create',
    id: MembershipPlans.CREATE_1,
    frequency: 'monthly',
  },
  [MembershipTiers.COWORK]: {
    title: 'Collaborate',
    id: MembershipPlans.COWORK_1,
    frequency: 'monthly',
  },

  [MembershipTiers.PRODUCTION]: {
    title: 'Produce',
    id: MembershipPlans.PRODUCE_1,
    frequency: 'yearly',
  },
  [MembershipTiers.PRO]: {
    title: 'Pro',
    id: MembershipPlans.PRO_1,
    frequency: 'yearly',
  },
  [MembershipTiers.TEAM]: {
    title: 'Team',
    id: MembershipPlans.TEAM_1,
    frequency: 'yearly',
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
