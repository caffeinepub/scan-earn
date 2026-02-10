// Single source of truth for reward tiers
// Maps INR investment amounts to coin rewards
export interface RewardTier {
  inr: number;
  coins: number;
}

export const REWARD_TIERS: RewardTier[] = [
  { inr: 10, coins: 15 },
  { inr: 50, coins: 85 },
  { inr: 100, coins: 99 },
  { inr: 150, coins: 240 },
  { inr: 500, coins: 870 },
  { inr: 1000, coins: 1985 },
];
