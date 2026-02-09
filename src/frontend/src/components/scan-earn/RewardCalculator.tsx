import { Card, CardContent } from '../ui/card';
import { useRewardTiers } from '../../hooks/useQueries';
import { useFlowStore } from '../../state/flowStore';
import { formatINR, formatCoins } from '../../lib/format';
import { cn } from '../../lib/utils';
import { TrendingUp } from 'lucide-react';

export function RewardCalculator() {
  const { data: tiers } = useRewardTiers();
  const { selectedTier, setSelectedTier } = useFlowStore();

  const handleSelectTier = (inr: number, coins: number) => {
    setSelectedTier({ inr, coins });
  };

  return (
    <div className="space-y-10">
      <div className="text-center space-y-3">
        <h2 className="text-4xl md:text-5xl font-bold flex items-center justify-center gap-3">
          <TrendingUp className="w-10 h-10 text-electric-blue" />
          Reward Calculator
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Select your investment tier and see your coin rewards
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
        {tiers?.map((tier) => {
          const inrNum = tier.inr;
          const coinsNum = tier.coins;
          const isSelected = selectedTier?.inr === inrNum;

          return (
            <Card
              key={inrNum}
              className={cn(
                'glass cursor-pointer transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]',
                isSelected 
                  ? 'border-gold border-2 glow-gold bg-gold/5 shadow-premium-lg' 
                  : 'hover:border-electric-blue/40 hover:shadow-premium-md'
              )}
              onClick={() => handleSelectTier(inrNum, coinsNum)}
            >
              <CardContent className="p-7 text-center space-y-4">
                <div className="text-3xl font-bold text-electric-blue">
                  {formatINR(inrNum)}
                </div>
                <div className="flex items-center justify-center gap-2">
                  <img 
                    src="/assets/generated/coin-icon.dim_256x256.png" 
                    alt="Coin" 
                    className="w-7 h-7"
                  />
                  <span className="text-2xl font-bold text-gold">
                    {formatCoins(coinsNum)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground font-medium">coins</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {selectedTier && (
        <div className="glass-strong rounded-2xl p-6 text-center max-w-md mx-auto shadow-premium-md animate-slide-up">
          <p className="text-sm text-muted-foreground font-medium mb-2">Selected Tier</p>
          <p className="text-3xl font-bold text-electric-blue">
            {formatINR(selectedTier.inr)} = {formatCoins(selectedTier.coins)} coins
          </p>
        </div>
      )}
    </div>
  );
}
