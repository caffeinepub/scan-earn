import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useBankAccount, useAddBankAccount } from '../../hooks/useQueries';
import { AddFundsModal } from './AddFundsModal';
import { WithdrawalPanel } from './WithdrawalPanel';
import { Wallet as WalletIcon, Building2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export function Wallet() {
  const { data: bankAccount } = useBankAccount();
  const addBankMutation = useAddBankAccount();
  const [showAddFunds, setShowAddFunds] = useState(false);
  
  const [formData, setFormData] = useState({
    accountHolderName: '',
    bankName: '',
    accountNumber: '',
    ifsc: '',
  });

  const handleSubmitBank = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await addBankMutation.mutateAsync(formData);
      toast.success('Bank account added successfully!');
      setFormData({
        accountHolderName: '',
        bankName: '',
        accountNumber: '',
        ifsc: '',
      });
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to add bank account';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="space-y-10">
      <div className="text-center space-y-3">
        <h2 className="text-4xl md:text-5xl font-bold flex items-center justify-center gap-3">
          <WalletIcon className="w-10 h-10 text-electric-blue" />
          My Wallet
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Manage your bank account, add funds, and withdraw
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Bank Account Section */}
        <Card className="glass-strong shadow-premium-md">
          <CardHeader className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-electric-blue/10 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-electric-blue" />
              </div>
              <CardTitle className="text-xl">Bank Account</CardTitle>
            </div>
            <CardDescription className="text-base">
              {bankAccount ? 'Your saved bank details' : 'Add your bank account details'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {bankAccount ? (
              <div className="space-y-4 p-5 glass rounded-xl">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <p className="font-semibold text-lg">{bankAccount.accountHolderName}</p>
                    <p className="text-sm text-muted-foreground font-medium">{bankAccount.bankName}</p>
                    <p className="text-sm font-mono bg-muted/30 px-3 py-1.5 rounded-md inline-block">
                      {bankAccount.accountNumber}
                    </p>
                    <p className="text-xs text-muted-foreground">IFSC: {bankAccount.ifsc}</p>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitBank} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="accountHolderName" className="text-sm font-medium">Account Holder Name</Label>
                  <Input
                    id="accountHolderName"
                    value={formData.accountHolderName}
                    onChange={(e) => setFormData({ ...formData, accountHolderName: e.target.value })}
                    required
                    className="h-11 premium-focus"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bankName" className="text-sm font-medium">Bank Name</Label>
                  <Input
                    id="bankName"
                    value={formData.bankName}
                    onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                    required
                    className="h-11 premium-focus"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountNumber" className="text-sm font-medium">Account Number</Label>
                  <Input
                    id="accountNumber"
                    value={formData.accountNumber}
                    onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                    required
                    className="h-11 premium-focus"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ifsc" className="text-sm font-medium">IFSC Code</Label>
                  <Input
                    id="ifsc"
                    value={formData.ifsc}
                    onChange={(e) => setFormData({ ...formData, ifsc: e.target.value.toUpperCase() })}
                    required
                    className="h-11 premium-focus"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-11 font-semibold shadow-premium-sm"
                  disabled={addBankMutation.isPending}
                >
                  {addBankMutation.isPending ? 'Saving...' : 'Save Bank Account'}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Add Funds Section */}
        <Card className="glass-strong shadow-premium-md">
          <CardHeader className="space-y-3">
            <CardTitle className="text-xl">Add Funds</CardTitle>
            <CardDescription className="text-base">
              Top up your account via GPay/BHIM
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="p-6 glass rounded-xl text-center space-y-3">
              <p className="text-sm text-muted-foreground font-medium">Ready to add funds?</p>
              <p className="text-lg font-semibold">
                Select a tier and complete payment
              </p>
            </div>
            <Button 
              onClick={() => setShowAddFunds(true)}
              className="w-full bg-electric-blue hover:bg-electric-blue/90 h-12 text-base font-semibold shadow-premium-md transition-all hover:shadow-premium-lg"
              size="lg"
            >
              Add Funds
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Withdrawal Section */}
      <WithdrawalPanel hasBankAccount={!!bankAccount} />

      <AddFundsModal 
        open={showAddFunds} 
        onOpenChange={setShowAddFunds}
      />
    </div>
  );
}
