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
import { SiPhonepe, SiPaytm } from 'react-icons/si';
import { toast } from 'sonner';

interface AddFundsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const UPI_ID = 'turbohacker4-2@okhdfcbank';
const PAYEE_NAME = 'Iqlas Dar';

export function AddFundsModal({ open, onOpenChange }: AddFundsModalProps) {
  const [transactionId, setTransactionId] = useState('');
  const [copiedUPI, setCopiedUPI] = useState(false);
  const addFundsMutation = useAddFunds();
  const { selectedTier } = useFlowStore();

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(UPI_ID);
    setCopiedUPI(true);
    toast.success('UPI ID copied!');
    setTimeout(() => setCopiedUPI(false), 2000);
  };

  const handleUPIPayment = (app: 'bhim' | 'phonepe' | 'paytm') => {
    if (!selectedTier) {
      toast.error('Please select a tier first');
      return;
    }

    const amount = selectedTier.inr;
    const upiUrl = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(PAYEE_NAME)}&am=${amount}&cu=INR`;
    
    window.location.href = upiUrl;
    
    toast.info(`Opening ${app.toUpperCase()}...`, { duration: 2000 });
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
      <DialogContent className="glass-strong max-w-lg max-h-[90vh] overflow-y-auto shadow-premium-xl">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-3xl">Add Funds via UPI</DialogTitle>
          <DialogDescription className="text-base">
            Scan QR code or pay via UPI app, then submit transaction ID
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-7 pt-2">
          {/* Selected Tier Info */}
          {selectedTier ? (
            <div className="glass rounded-xl p-5 text-center space-y-2 shadow-premium-sm">
              <p className="text-sm text-muted-foreground font-medium">Selected Amount</p>
              <p className="text-3xl font-bold text-electric-blue">
                {formatINR(selectedTier.inr)}
              </p>
              <p className="text-base text-gold font-semibold">
                You'll receive {formatCoins(selectedTier.coins)} coins
              </p>
            </div>
          ) : (
            <div className="glass rounded-xl p-5 text-center">
              <p className="text-sm text-destructive font-medium">
                Please select a tier from the Reward Calculator first
              </p>
            </div>
          )}

          {/* QR Code Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-base font-semibold">
              <QrCode className="w-5 h-5" />
              <span>Scan QR Code</span>
            </div>
            
            <div className="relative glass rounded-xl p-5 flex items-center justify-center shadow-premium-sm">
              <img 
                src="/assets/GooglePay_QR.png" 
                alt="UPI QR Code" 
                className="w-full max-w-[300px] h-auto object-contain rounded-lg"
              />
            </div>

            {/* UPI ID Section */}
            <div className="glass rounded-xl p-5 space-y-3">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">UPI ID</p>
              <div className="flex items-center gap-3">
                <code className="flex-1 text-base font-mono font-bold break-all">
                  {UPI_ID}
                </code>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCopyUPI}
                  className="shrink-0 h-9 w-9 p-0"
                >
                  {copiedUPI ? (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* UPI App Buttons */}
          <div className="space-y-4">
            <div className="text-base font-semibold">Or Pay via UPI App</div>
            
            {!selectedTier && (
              <p className="text-xs text-destructive font-medium">
                Select a tier above to enable UPI app payments
              </p>
            )}

            <div className="grid grid-cols-3 gap-4">
              <Button
                variant="outline"
                className="flex flex-col items-center gap-3 h-auto py-5 hover:border-electric-blue/40 transition-all"
                onClick={() => handleUPIPayment('bhim')}
                disabled={!selectedTier}
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-bold text-base">
                  B
                </div>
                <span className="text-sm font-semibold">BHIM</span>
              </Button>

              <Button
                variant="outline"
                className="flex flex-col items-center gap-3 h-auto py-5 hover:border-electric-blue/40 transition-all"
                onClick={() => handleUPIPayment('phonepe')}
                disabled={!selectedTier}
              >
                <SiPhonepe className="w-10 h-10 text-purple-600" />
                <span className="text-sm font-semibold">PhonePe</span>
              </Button>

              <Button
                variant="outline"
                className="flex flex-col items-center gap-3 h-auto py-5 hover:border-electric-blue/40 transition-all"
                onClick={() => handleUPIPayment('paytm')}
                disabled={!selectedTier}
              >
                <SiPaytm className="w-10 h-10 text-blue-600" />
                <span className="text-sm font-semibold">Paytm</span>
              </Button>
            </div>
          </div>

          {/* Transaction ID Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-3">
              <Label htmlFor="transactionId" className="text-base font-semibold">Transaction ID</Label>
              <Input
                id="transactionId"
                placeholder="Enter your transaction ID"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                required
                className="h-12 text-base premium-focus"
              />
              <p className="text-sm text-muted-foreground">
                After completing payment, paste your transaction ID here
              </p>
            </div>

            <Button 
              type="submit"
              className="w-full bg-electric-blue hover:bg-electric-blue/90 h-12 text-base font-semibold shadow-premium-md transition-all hover:shadow-premium-lg"
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
