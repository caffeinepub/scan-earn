import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { useAddFunds } from '../../hooks/useQueries';
import { Copy, CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { formatINR, formatCoins } from '../../lib/format';
import { buildUpiUrl, UPI_CONFIG } from '../../config/upi';
import { SiPhonepe, SiPaytm, SiGooglepay } from 'react-icons/si';

interface AddFundsModalProps {
  isOpen: boolean;
  onClose: () => void;
  tier: { inr: number; coins: number };
}

export function AddFundsModal({ isOpen, onClose, tier }: AddFundsModalProps) {
  const [transactionId, setTransactionId] = useState('');
  const [transactionError, setTransactionError] = useState('');
  const addFundsMutation = useAddFunds();

  const handleCopyUpiId = () => {
    navigator.clipboard.writeText(UPI_CONFIG.id);
    toast.success('UPI ID copied to clipboard!');
  };

  const handleUpiAppClick = (appName: string) => {
    const upiUrl = buildUpiUrl(tier.inr);
    window.location.href = upiUrl;
    toast.info(`Opening ${appName}...`);
  };

  const handleSubmit = async () => {
    if (!transactionId.trim()) {
      setTransactionError('Please enter a transaction ID');
      toast.error('Please enter a transaction ID');
      return;
    }

    setTransactionError('');

    try {
      const tierCoins = BigInt(tier.coins);
      const success = await addFundsMutation.mutateAsync({
        transactionId: transactionId.trim(),
        coins: tierCoins,
      });

      if (success) {
        toast.success(`Successfully added ${formatCoins(tier.coins)} to your wallet!`);
        onClose();
        setTransactionId('');
      } else {
        toast.error('Transaction ID already used. Please use a unique transaction ID.');
        setTransactionError('Transaction ID already used');
      }
    } catch (error: any) {
      console.error('Add funds error:', error);
      const errorMsg = error.message || 'Failed to add funds';
      toast.error(errorMsg);
      setTransactionError(errorMsg);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Add Funds</DialogTitle>
          <DialogDescription>
            Complete payment to add {formatCoins(tier.coins)} to your wallet
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Amount Display */}
          <div className="glass rounded-xl p-6 text-center space-y-2">
            <p className="text-sm text-muted-foreground">Amount to Pay</p>
            <p className="text-4xl font-bold text-electric-blue">{formatINR(tier.inr)}</p>
            <p className="text-sm text-muted-foreground">
              You will receive <span className="font-semibold text-foreground">{formatCoins(tier.coins)}</span>
            </p>
          </div>

          {/* QR Code */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Scan QR Code</Label>
            <div className="relative mx-auto w-64 h-64 rounded-xl overflow-hidden border-4 border-border shadow-lg">
              <img
                src="/assets/GooglePay_QR.png"
                alt="Payment QR Code"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* UPI ID */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Or use UPI ID</Label>
            <div className="flex items-center gap-2">
              <Input
                value={UPI_CONFIG.id}
                readOnly
                className="font-mono text-sm"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopyUpiId}
                className="shrink-0"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* UPI App Buttons */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Pay with UPI App</Label>
            <div className="grid grid-cols-3 gap-3">
              <Button
                variant="outline"
                className="flex flex-col items-center gap-2 h-auto py-4"
                onClick={() => handleUpiAppClick('PhonePe')}
              >
                <SiPhonepe className="h-8 w-8 text-purple-600" />
                <span className="text-xs">PhonePe</span>
              </Button>
              <Button
                variant="outline"
                className="flex flex-col items-center gap-2 h-auto py-4"
                onClick={() => handleUpiAppClick('Paytm')}
              >
                <SiPaytm className="h-8 w-8 text-blue-600" />
                <span className="text-xs">Paytm</span>
              </Button>
              <Button
                variant="outline"
                className="flex flex-col items-center gap-2 h-auto py-4"
                onClick={() => handleUpiAppClick('Google Pay')}
              >
                <SiGooglepay className="h-8 w-8 text-blue-500" />
                <span className="text-xs">Google Pay</span>
              </Button>
            </div>
          </div>

          {/* Transaction ID Input */}
          <div className="space-y-3">
            <Label htmlFor="transactionId" className="text-base font-semibold">
              Enter Transaction ID
            </Label>
            <Input
              id="transactionId"
              placeholder="e.g., TXN123456789"
              value={transactionId}
              onChange={(e) => {
                setTransactionId(e.target.value);
                setTransactionError('');
              }}
              className={transactionError ? 'border-destructive' : ''}
            />
            {transactionError && (
              <p className="text-sm text-destructive">{transactionError}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={addFundsMutation.isPending || !transactionId.trim()}
            className="w-full h-12 text-base"
          >
            {addFundsMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CheckCircle2 className="mr-2 h-5 w-5" />
                Confirm Payment
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
