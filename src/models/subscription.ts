export interface Subscription {
  current_subscription: number;
  stripe_subscription: number;
  current_subscription_string: string;
  stripe_subscription_string: string;
  payment: string;
  membershipStart: number;
  lastPayment: number;
  upcomingPayment: number;
  inTrial: boolean;
  hasPaymentInfo: boolean;
  hasSubscription: boolean;
  alreadyCancelled: boolean;
  scheduledDowngrade: number;
  usedFreeTrial: boolean;
}

export enum SubscriptionStatus {
  Free = 0,
  ProBasic = 1,
  ProAdvanced = 2,
  ProMax = 3,
}
