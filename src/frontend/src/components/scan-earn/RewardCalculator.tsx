import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { REWARD_TIERS } from '../../config/rewardTiers';
import { formatINR, formatCoins } from '../../lib/format';
import { useFlowStore } from '../../state/flowStore';
import { TrendingUp, Sparkles } from 'lucide-react';

export function RewardCalculator() {
  const { setSelectedTier } = useFlowStore();

  const handleTierClick = (tier: { inr: number; coins: number }) => {
    setSelectedTier(tier);
  };

  return (
    <div className="space-y-10">
      <div className="text-center space-y-3">
        <h2 className="text-4xl md:text-5xl font-bold flex items-center justify-center gap-3">
          <TrendingUp className="w-10 h-10 text-electric-blue" />
          Choose Your Package
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Select a coin package to add funds to your account
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {REWARD_TIERS.map((tier) => {
          const roi = ((tier.coins - tier.inr) / tier.inr) * 100;
          const isPopular = tier.inr === 500;

          return (
            <Card
              key={tier.inr}
              className={`glass-strong hover:scale-[1.02] transition-all cursor-pointer group relative overflow-hidden ${
                isPopular ? 'border-electric-blue shadow-premium-lg' : ''
              }`}
              onClick={() => handleTierClick(tier)}
            >
              {isPopular && (
                <div className="absolute top-4 right-4 bg-electric-blue text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Popular
                </div>
              )}
              <CardHeader className="text-center space-y-3 pb-4">
                <CardTitle className="text-3xl font-bold text-electric-blue">
                  {formatINR(tier.inr)}
                </CardTitle>
                <CardDescription className="text-base">Investment Amount</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">You Get</p>
                  <p className="text-4xl font-bold">{formatCoins(tier.coins)}</p>
                </div>

                <div className="glass rounded-xl p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">ROI</span>
                    <span className="font-semibold text-green-500">+{roi.toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Profit</span>
                    <span className="font-semibold">{formatCoins(tier.coins - tier.inr)}</span>
                  </div>
                </div>

                <Button
                  className="w-full bg-electric-blue hover:bg-electric-blue/90 h-11 text-base font-semibold shadow-premium-md group-hover:shadow-premium-lg transition-all"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTierClick(tier);
                  }}
                >
                  Add Funds
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
