import { useCoinBalance } from '../../hooks/useQueries';
import { useCountUp } from '../../hooks/useCountUp';
import { formatCoins } from '../../lib/format';
import { Coins } from 'lucide-react';

export function CoinCounter() {
  const { data: balance } = useCoinBalance();
  const targetBalance = Number(balance || BigInt(0));
  const displayBalance = useCountUp(targetBalance, 1200);

  return (
    <div className="glass-strong rounded-2xl px-8 py-6 inline-flex items-center gap-4 glow-gold">
      <img 
        src="/assets/generated/coin-icon.dim_256x256.png" 
        alt="Coin" 
        className="w-12 h-12 animate-pulse"
      />
      <div className="text-left">
        <p className="text-sm text-muted-foreground font-medium">Your Balance</p>
        <p className="text-4xl font-bold text-gold">
          {formatCoins(displayBalance)}
        </p>
        <p className="text-xs text-muted-foreground">coins</p>
      </div>
    </div>
  );
}

