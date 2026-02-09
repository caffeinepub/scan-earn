import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useBankAccount, useAddBankAccount } from '../../hooks/useQueries';
import { AddFundsModal } from './AddFundsModal';
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
    } catch (error) {
      toast.error('Failed to add bank account');
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold flex items-center justify-center gap-2">
          <WalletIcon className="w-8 h-8 text-electric-blue" />
          My Wallet
        </h2>
        <p className="text-muted-foreground">
          Manage your bank account and add funds
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Bank Account Section */}
        <Card className="glass-strong">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-electric-blue" />
              <CardTitle>Bank Account</CardTitle>
            </div>
            <CardDescription>
              {bankAccount ? 'Your saved bank details' : 'Add your bank account details'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {bankAccount ? (
              <div className="space-y-3 p-4 glass rounded-lg">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                  <div className="flex-1 space-y-1">
                    <p className="font-semibold">{bankAccount.accountHolderName}</p>
                    <p className="text-sm text-muted-foreground">{bankAccount.bankName}</p>
                    <p className="text-sm font-mono">{bankAccount.accountNumber}</p>
                    <p className="text-xs text-muted-foreground">IFSC: {bankAccount.ifsc}</p>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitBank} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="accountHolderName">Account Holder Name</Label>
                  <Input
                    id="accountHolderName"
                    value={formData.accountHolderName}
                    onChange={(e) => setFormData({ ...formData, accountHolderName: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Input
                    id="bankName"
                    value={formData.bankName}
                    onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input
                    id="accountNumber"
                    value={formData.accountNumber}
                    onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ifsc">IFSC Code</Label>
                  <Input
                    id="ifsc"
                    value={formData.ifsc}
                    onChange={(e) => setFormData({ ...formData, ifsc: e.target.value.toUpperCase() })}
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={addBankMutation.isPending}
                >
                  {addBankMutation.isPending ? 'Saving...' : 'Save Bank Account'}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Add Funds Section */}
        <Card className="glass-strong">
          <CardHeader>
            <CardTitle>Add Funds</CardTitle>
            <CardDescription>
              Top up your account via GPay/BHIM
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-6 glass rounded-lg text-center space-y-2">
              <p className="text-sm text-muted-foreground">Ready to add funds?</p>
              <p className="text-lg font-semibold">
                Select a tier and complete payment
              </p>
            </div>
            <Button 
              onClick={() => setShowAddFunds(true)}
              className="w-full bg-electric-blue hover:bg-electric-blue/90"
              size="lg"
            >
              Add Funds
            </Button>
          </CardContent>
        </Card>
      </div>

      <AddFundsModal 
        open={showAddFunds} 
        onOpenChange={setShowAddFunds}
      />
    </div>
  );
}

