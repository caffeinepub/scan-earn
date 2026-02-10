import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { CoinCounter } from './CoinCounter';
import { WithdrawalPanel } from './WithdrawalPanel';
import { useFlowStore } from '../../state/flowStore';
import { Wallet as WalletIcon, Plus } from 'lucide-react';

export function Wallet() {
  const { setActiveSection } = useFlowStore();

  const handleAddFunds = () => {
    setActiveSection('stocksFunds');
  };

  return (
    <Card className="glass-strong shadow-premium-lg">
      <CardHeader className="text-center space-y-4 pb-8">
        <div className="w-20 h-20 bg-electric-blue/10 rounded-full flex items-center justify-center mx-auto">
          <WalletIcon className="w-9 h-9 text-electric-blue" />
        </div>
        <div className="space-y-2">
          <CardTitle className="text-3xl">Your Wallet</CardTitle>
          <CardDescription className="text-base">
            Manage your coins and withdrawals
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Coin Balance */}
        <div className="flex justify-center">
          <CoinCounter />
        </div>

        {/* Add Funds Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleAddFunds}
            size="lg"
            className="bg-electric-blue hover:bg-electric-blue/90 h-12 px-8 text-base font-semibold shadow-premium-md transition-all hover:shadow-premium-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Funds
          </Button>
        </div>

        {/* Withdrawal Panel */}
        <WithdrawalPanel />
      </CardContent>
    </Card>
  );
}
