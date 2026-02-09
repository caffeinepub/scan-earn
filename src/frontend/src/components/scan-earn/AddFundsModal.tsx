import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useAddFunds } from '../../hooks/useQueries';
import { useFlowStore } from '../../state/flowStore';
import { formatINR, formatCoins } from '../../lib/format';
import { QrCode, Copy, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface AddFundsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PAYMENT_NUMBER = '9541525891';

export function AddFundsModal({ open, onOpenChange }: AddFundsModalProps) {
  const [transactionId, setTransactionId] = useState('');
  const [copied, setCopied] = useState(false);
  const addFundsMutation = useAddFunds();
  const { selectedTier } = useFlowStore();

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(PAYMENT_NUMBER);
    setCopied(true);
    toast.success('Payment number copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedTier) {
      toast.error('Please select a tier first');
      return;
    }

    if (!transactionId.trim()) {
      toast.error('Please enter a transaction ID');
      return;
    }

    try {
      await addFundsMutation.mutateAsync({
        transactionId: transactionId.trim(),
        tierCoins: selectedTier.coins,
      });
      
      toast.success(
        `Payment confirmed! ${formatCoins(selectedTier.coins)} coins added to your balance`,
        { duration: 5000 }
      );
      
      setTransactionId('');
      onOpenChange(false);
    } catch (error: any) {
      if (error.message?.includes('already used')) {
        toast.error('This transaction ID has already been used');
      } else {
        toast.error('Failed to process payment. Please try again.');
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-strong max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">Add Funds via GPay/BHIM</DialogTitle>
          <DialogDescription>
            Complete your payment and submit the transaction ID
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Selected Tier Info */}
          {selectedTier ? (
            <div className="glass rounded-lg p-4 text-center space-y-2">
              <p className="text-sm text-muted-foreground">Selected Amount</p>
              <p className="text-2xl font-bold text-electric-blue">
                {formatINR(selectedTier.inr)}
              </p>
              <p className="text-sm text-gold">
                You'll receive {formatCoins(selectedTier.coins)} coins
              </p>
            </div>
          ) : (
            <div className="glass rounded-lg p-4 text-center">
              <p className="text-sm text-destructive">
                Please select a tier from the Reward Calculator first
              </p>
            </div>
          )}

          {/* QR Code Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <QrCode className="w-4 h-4" />
              <span>Scan QR Code or Use Payment Number</span>
            </div>
            
            <div className="relative glass rounded-lg p-4 flex items-center justify-center">
              <img 
                src="/assets/generated/qr-frame.dim_800x800.png" 
                alt="QR Code" 
                className="w-48 h-48 object-contain"
              />
            </div>

            <div className="glass rounded-lg p-4 space-y-2">
              <p className="text-xs text-muted-foreground">Payment Number</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-lg font-mono font-bold">
                  {PAYMENT_NUMBER}
                </code>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCopyNumber}
                  className="shrink-0"
                >
                  {copied ? (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Transaction ID Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="transactionId">Transaction ID</Label>
              <Input
                id="transactionId"
                placeholder="Enter your transaction ID"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                After completing payment, paste your transaction ID here
              </p>
            </div>

            <Button 
              type="submit"
              className="w-full bg-electric-blue hover:bg-electric-blue/90"
              size="lg"
              disabled={addFundsMutation.isPending || !selectedTier}
            >
              {addFundsMutation.isPending ? 'Verifying...' : 'Verify & Add Funds'}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

