import { WithdrawalPanel } from '../scan-earn/WithdrawalPanel';
import { WithdrawalHistoryList } from '../transactions/WithdrawalHistoryList';

export function WithdrawalSection() {
  return (
    <div className="max-w-3xl mx-auto space-y-12">
      <div className="text-center space-y-3">
        <h2 className="text-4xl md:text-5xl font-bold">Withdrawal</h2>
        <p className="text-muted-foreground text-lg">
          Withdraw your coins and view withdrawal history
        </p>
      </div>

      {/* Withdrawal Action Panel */}
      <section>
        <WithdrawalPanel />
      </section>

      {/* Withdrawal History */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h3 className="text-2xl md:text-3xl font-bold">Withdrawal History</h3>
          <p className="text-muted-foreground">
            View all your withdrawal transactions
          </p>
        </div>
        <WithdrawalHistoryList />
      </section>
    </div>
  );
}
