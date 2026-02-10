import { WithdrawalPanel } from '../scan-earn/WithdrawalPanel';

export function WithdrawalSection() {
  return (
    <div className="max-w-3xl mx-auto space-y-12">
      <div className="text-center space-y-3">
        <h2 className="text-4xl md:text-5xl font-bold">Withdrawal</h2>
        <p className="text-muted-foreground text-lg">
          Withdraw your coins
        </p>
      </div>

      {/* Withdrawal Action Panel */}
      <section>
        <WithdrawalPanel />
      </section>
    </div>
  );
}
