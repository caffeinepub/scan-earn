import { useGetCoinBalance } from '../../hooks/useQueries';
import { formatCoins } from '../../lib/format';

export function HeaderBalanceIndicator() {
  const { data: balance, isLoading } = useGetCoinBalance();

  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/20">
      <img 
        src="/assets/generated/coin-icon.dim_256x256.png" 
        alt="Coin" 
        className="w-6 h-6"
      />
      <span className="text-sm font-bold text-foreground">
        {isLoading ? '...' : formatCoins(balance || 0n)}
      </span>
    </div>
  );
}
