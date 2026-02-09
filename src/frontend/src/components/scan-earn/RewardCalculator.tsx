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
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold flex items-center justify-center gap-2">
          <TrendingUp className="w-8 h-8 text-electric-blue" />
          Reward Calculator
        </h2>
        <p className="text-muted-foreground">
          Select your investment tier and see your coin rewards
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {tiers?.map(([inr, coins]) => {
          const inrNum = Number(inr);
          const coinsNum = Number(coins);
          const isSelected = selectedTier?.inr === inrNum;

          return (
            <Card
              key={inrNum}
              className={cn(
                'glass cursor-pointer transition-all hover:scale-105',
                isSelected && 'border-gold border-2 glow-gold bg-gold/5'
              )}
              onClick={() => handleSelectTier(inrNum, coinsNum)}
            >
              <CardContent className="p-6 text-center space-y-3">
                <div className="text-2xl font-bold text-electric-blue">
                  {formatINR(inrNum)}
                </div>
                <div className="flex items-center justify-center gap-2">
                  <img 
                    src="/assets/generated/coin-icon.dim_256x256.png" 
                    alt="Coin" 
                    className="w-6 h-6"
                  />
                  <span className="text-xl font-semibold text-gold">
                    {formatCoins(coinsNum)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">coins</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {selectedTier && (
        <div className="glass-strong rounded-xl p-4 text-center max-w-md mx-auto">
          <p className="text-sm text-muted-foreground">Selected Tier</p>
          <p className="text-2xl font-bold text-electric-blue">
            {formatINR(selectedTier.inr)} = {formatCoins(selectedTier.coins)} coins
          </p>
        </div>
      )}
    </div>
  );
}

