import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Banknote, AlertCircle } from 'lucide-react';
import { useRequestWithdrawal } from '../../hooks/useQueries';
import { toast } from 'sonner';

interface WithdrawalPanelProps {
  hasBankAccount: boolean;
}

const WITHDRAWAL_AMOUNTS = [
  { amount: 50, label: '₹50', fee: 0 },
  { amount: 109, label: '₹109', fee: 0 },
  { amount: 209, label: '₹209', fee: 0 },
  { amount: 500, label: '₹500', fee: 0 },
  { amount: 1000, label: '₹1K', fee: 0 },
  { amount: 2000, label: '₹2K', fee: 0 },
];

export function WithdrawalPanel({ hasBankAccount }: WithdrawalPanelProps) {
  const requestWithdrawalMutation = useRequestWithdrawal();

  const handleWithdrawal = async (amount: number) => {
    if (!hasBankAccount) {
      toast.error('Please add a bank account first');
      return;
    }

    try {
      await requestWithdrawalMutation.mutateAsync(amount);
      toast.success(`Withdrawal request for ₹${amount} submitted successfully!`);
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to submit withdrawal request';
      toast.error(errorMessage);
    }
  };

  return (
    <Card className="glass-strong shadow-premium-md">
      <CardHeader className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-electric-blue/10 rounded-lg flex items-center justify-center">
            <Banknote className="w-5 h-5 text-electric-blue" />
          </div>
          <CardTitle className="text-xl">Withdraw Funds</CardTitle>
        </div>
        <CardDescription className="text-base">
          Request a withdrawal to your bank account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!hasBankAccount && (
          <div className="flex items-start gap-3 p-4 glass rounded-xl border border-destructive/30">
            <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-semibold text-destructive">Bank Account Required</p>
              <p className="text-sm text-muted-foreground">
                Please add your bank account details before requesting a withdrawal
              </p>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div className="text-sm font-semibold">Quick Withdrawal Amounts</div>
          <div className="grid grid-cols-3 gap-3">
            {WITHDRAWAL_AMOUNTS.map(({ amount, label, fee }) => (
              <Button
                key={amount}
                variant="outline"
                className="flex flex-col items-center gap-2 h-auto py-4 hover:border-electric-blue/40 hover:bg-electric-blue/5 transition-all"
                onClick={() => handleWithdrawal(amount)}
                disabled={!hasBankAccount || requestWithdrawalMutation.isPending}
              >
                <span className="text-lg font-bold">{label}</span>
                <span className="text-xs text-muted-foreground font-medium">
                  {fee === 0 ? 'No charge' : `₹${fee} fee`}
                </span>
              </Button>
            ))}
          </div>
        </div>

        <div className="glass rounded-xl p-5 space-y-3">
          <p className="text-sm font-semibold">Withdrawal Information</p>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-electric-blue mt-0.5">•</span>
              <span>Minimum withdrawal: ₹50</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-electric-blue mt-0.5">•</span>
              <span>No fees on amounts: ₹50, ₹109, ₹209, ₹500, ₹1K, ₹2K</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-electric-blue mt-0.5">•</span>
              <span>₹9 fee for amounts between ₹100-₹200 (excluding ₹109, ₹209)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-electric-blue mt-0.5">•</span>
              <span>Maximum 2 withdrawal requests per day</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
