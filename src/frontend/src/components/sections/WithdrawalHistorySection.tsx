import { WithdrawalHistoryList } from '../transactions/WithdrawalHistoryList';

export function WithdrawalHistorySection() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-3">
        <h2 className="text-4xl md:text-5xl font-bold">Withdrawal History</h2>
        <p className="text-muted-foreground text-lg">
          View all your withdrawal transactions
        </p>
      </div>

      <WithdrawalHistoryList />
    </div>
  );
}
