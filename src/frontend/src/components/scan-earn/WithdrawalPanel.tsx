import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useWithdraw, useGetCoinBalance } from '../../hooks/useQueries';
import { formatCoins } from '../../lib/format';
import { ArrowDownToLine, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const QUICK_AMOUNTS = [100, 500, 1000, 5000];

export function WithdrawalPanel() {
  const [amount, setAmount] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const withdrawMutation = useWithdraw();
  const { data: balance } = useGetCoinBalance();

  const handleQuickAmount = (value: number) => {
    setAmount(value.toString());
  };

  const handleSubmit = async () => {
    const amountNum = parseInt(amount);

    if (!amount || isNaN(amountNum) || amountNum <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (!transactionId.trim()) {
      toast.error('Please enter a transaction ID');
      return;
    }

    const currentBalance = Number(balance || 0n);
    if (amountNum > currentBalance) {
      toast.error('Insufficient balance');
      return;
    }

    try {
      await withdrawMutation.mutateAsync({
        transactionId: transactionId.trim(),
        amount: BigInt(amountNum),
      });

      toast.success(`Successfully withdrew ${formatCoins(amountNum)}!`);
      setAmount('');
      setTransactionId('');
    } catch (error: any) {
      console.error('Withdrawal error:', error);
      const errorMsg = error.message || 'Failed to process withdrawal';
      toast.error(errorMsg);
    }
  };

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <ArrowDownToLine className="w-6 h-6 text-electric-blue" />
          Withdraw Coins
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Balance */}
        <div className="glass rounded-xl p-6 text-center space-y-2">
          <p className="text-sm text-muted-foreground">Available Balance</p>
          <p className="text-4xl font-bold text-electric-blue">
            {formatCoins(balance || 0n)}
          </p>
        </div>

        {/* Quick Amount Buttons */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">Quick Select</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {QUICK_AMOUNTS.map((value) => (
              <Button
                key={value}
                variant={amount === value.toString() ? 'default' : 'outline'}
                onClick={() => handleQuickAmount(value)}
                className="h-12"
              >
                {formatCoins(value)}
              </Button>
            ))}
          </div>
        </div>

        {/* Custom Amount Input */}
        <div className="space-y-3">
          <Label htmlFor="amount" className="text-base font-semibold">
            Or Enter Custom Amount
          </Label>
          <Input
            id="amount"
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="1"
          />
        </div>

        {/* Transaction ID Input */}
        <div className="space-y-3">
          <Label htmlFor="transactionId" className="text-base font-semibold">
            Transaction ID
          </Label>
          <Input
            id="transactionId"
            placeholder="e.g., WTH123456789"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
          />
        </div>

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={withdrawMutation.isPending || !amount || !transactionId.trim()}
          className="w-full h-12 text-base"
        >
          {withdrawMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <ArrowDownToLine className="mr-2 h-5 w-5" />
              Withdraw
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
