import { AddFundsHistoryList } from '../transactions/AddFundsHistoryList';

export function FundsHistorySection() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-3">
        <h2 className="text-4xl md:text-5xl font-bold">Funds Transaction History</h2>
        <p className="text-muted-foreground text-lg">
          View all your fund additions
        </p>
      </div>

      <AddFundsHistoryList />
    </div>
  );
}
