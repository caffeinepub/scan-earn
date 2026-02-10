import { RewardCalculator } from '../scan-earn/RewardCalculator';
import { AddFundsModal } from '../scan-earn/AddFundsModal';
import { useFlowStore } from '../../state/flowStore';

export function StocksFundsSection() {
  const { selectedTier, setSelectedTier } = useFlowStore();

  return (
    <div className="space-y-12">
      <div className="text-center space-y-3">
        <h2 className="text-4xl md:text-5xl font-bold">Stocks & Add Funds</h2>
        <p className="text-muted-foreground text-lg">
          Choose a package and add funds to your account
        </p>
      </div>

      {/* Reward Calculator / Tier Selection */}
      <section>
        <RewardCalculator />
      </section>

      {/* Add Funds Modal */}
      {selectedTier && (
        <AddFundsModal
          isOpen={!!selectedTier}
          onClose={() => setSelectedTier(null)}
          tier={selectedTier}
        />
      )}
    </div>
  );
}
