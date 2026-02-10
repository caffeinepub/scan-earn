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
import { Copy, CheckCircle2, Loader2, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import { formatINR, formatCoins } from '../../lib/format';
import { buildUpiUrl, UPI_CONFIG } from '../../config/upi';
import { SiPhonepe, SiPaytm, SiGooglepay } from 'react-icons/si';
import { ExternalBlob } from '../../backend';

interface AddFundsModalProps {
  isOpen: boolean;
  onClose: () => void;
  tier: { inr: number; coins: number };
}

export function AddFundsModal({ isOpen, onClose, tier }: AddFundsModalProps) {
  const [step, setStep] = useState<'payment' | 'confirmation'>('payment');
  const [transactionId, setTransactionId] = useState('');
  const [utrId, setUtrId] = useState('');
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errors, setErrors] = useState({
    transactionId: '',
    utrId: '',
    receipt: '',
  });
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      setErrors(prev => ({ ...prev, receipt: 'Please upload a valid image (JPG, PNG, WEBP) or PDF file' }));
      toast.error('Invalid file type. Please upload an image or PDF.');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setErrors(prev => ({ ...prev, receipt: 'File size must be less than 5MB' }));
      toast.error('File too large. Maximum size is 5MB.');
      return;
    }

    setReceiptFile(file);
    setErrors(prev => ({ ...prev, receipt: '' }));
  };

  const handleRemoveFile = () => {
    setReceiptFile(null);
    setUploadProgress(0);
  };

  const handleProceedToConfirmation = () => {
    setStep('confirmation');
  };

  const validateConfirmation = (): boolean => {
    const newErrors = {
      transactionId: '',
      utrId: '',
      receipt: '',
    };

    if (!transactionId.trim()) {
      newErrors.transactionId = 'Transaction ID is required';
    }

    if (!utrId.trim()) {
      newErrors.utrId = 'UTR ID is required';
    } else if (utrId.trim().length < 12) {
      newErrors.utrId = 'UTR ID must be at least 12 characters';
    }

    if (!receiptFile) {
      newErrors.receipt = 'Payment receipt is required';
    }

    setErrors(newErrors);

    if (newErrors.transactionId || newErrors.utrId || newErrors.receipt) {
      toast.error('Please fill in all required fields');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateConfirmation()) return;

    try {
      // Convert file to bytes for ExternalBlob
      const arrayBuffer = await receiptFile!.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      
      // Create ExternalBlob with upload progress tracking
      const receiptBlob = ExternalBlob.fromBytes(bytes).withUploadProgress((percentage) => {
        setUploadProgress(percentage);
      });

      const tierCoins = BigInt(tier.coins);
      const success = await addFundsMutation.mutateAsync({
        transactionId: transactionId.trim(),
        coins: tierCoins,
        utrId: utrId.trim(),
        receipt: receiptBlob,
      });

      if (success) {
        toast.success(`Successfully added ${formatCoins(tier.coins)} to your wallet!`);
        handleClose();
      } else {
        toast.error('Transaction ID already used. Please use a unique transaction ID.');
        setErrors(prev => ({ ...prev, transactionId: 'Transaction ID already used' }));
      }
    } catch (error: any) {
      console.error('Add funds error:', error);
      const errorMsg = error.message || 'Failed to add funds';
      toast.error(errorMsg);
    }
  };

  const handleClose = () => {
    setStep('payment');
    setTransactionId('');
    setUtrId('');
    setReceiptFile(null);
    setUploadProgress(0);
    setErrors({ transactionId: '', utrId: '', receipt: '' });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Add Funds</DialogTitle>
          <DialogDescription>
            {step === 'payment' 
              ? `Pay ${formatINR(tier.inr)} to add ${formatCoins(tier.coins)} to your wallet`
              : 'Confirm your payment details'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {step === 'payment' ? (
            <>
              {/* Amount Display */}
              <div className="text-center p-6 rounded-lg glass space-y-2">
                <p className="text-sm text-muted-foreground">Amount to Pay</p>
                <p className="text-4xl font-bold text-primary">{formatINR(tier.inr)}</p>
                <p className="text-sm text-muted-foreground">
                  You will receive {formatCoins(tier.coins)}
                </p>
              </div>

              {/* UPI ID Section */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Pay via UPI</Label>
                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 border border-border">
                  <code className="flex-1 text-sm font-mono">{UPI_CONFIG.id}</code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleCopyUpiId}
                    className="h-8 w-8 p-0"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Payee: {UPI_CONFIG.payeeName}
                </p>
              </div>

              {/* UPI Apps */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Or pay with UPI app</Label>
                <div className="grid grid-cols-3 gap-3">
                  <Button
                    variant="outline"
                    className="h-20 flex-col gap-2"
                    onClick={() => handleUpiAppClick('PhonePe')}
                  >
                    <SiPhonepe className="h-8 w-8 text-[#5f259f]" />
                    <span className="text-xs">PhonePe</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex-col gap-2"
                    onClick={() => handleUpiAppClick('Google Pay')}
                  >
                    <SiGooglepay className="h-8 w-8" />
                    <span className="text-xs">Google Pay</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex-col gap-2"
                    onClick={() => handleUpiAppClick('Paytm')}
                  >
                    <SiPaytm className="h-8 w-8 text-[#00BAF2]" />
                    <span className="text-xs">Paytm</span>
                  </Button>
                </div>
              </div>

              {/* Instructions */}
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                <p className="text-sm text-muted-foreground">
                  After completing the payment, click "I've Paid" to enter your payment details.
                </p>
              </div>

              {/* Action Button */}
              <Button
                onClick={handleProceedToConfirmation}
                className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90"
              >
                I've Paid
              </Button>
            </>
          ) : (
            <>
              {/* Transaction ID */}
              <div className="space-y-2">
                <Label htmlFor="transactionId">
                  Transaction ID <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="transactionId"
                  value={transactionId}
                  onChange={(e) => {
                    setTransactionId(e.target.value);
                    setErrors(prev => ({ ...prev, transactionId: '' }));
                  }}
                  placeholder="Enter transaction ID"
                  className={errors.transactionId ? 'border-destructive' : ''}
                />
                {errors.transactionId && (
                  <p className="text-xs text-destructive">{errors.transactionId}</p>
                )}
              </div>

              {/* UTR ID */}
              <div className="space-y-2">
                <Label htmlFor="utrId">
                  UTR ID <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="utrId"
                  value={utrId}
                  onChange={(e) => {
                    setUtrId(e.target.value);
                    setErrors(prev => ({ ...prev, utrId: '' }));
                  }}
                  placeholder="Enter 12-digit UTR ID"
                  className={errors.utrId ? 'border-destructive' : ''}
                />
                {errors.utrId && (
                  <p className="text-xs text-destructive">{errors.utrId}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Find UTR ID in your payment app's transaction details
                </p>
              </div>

              {/* Receipt Upload */}
              <div className="space-y-2">
                <Label htmlFor="receipt">
                  Payment Receipt <span className="text-destructive">*</span>
                </Label>
                {!receiptFile ? (
                  <div className="relative">
                    <input
                      id="receipt"
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp,application/pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className={`w-full h-24 border-dashed ${errors.receipt ? 'border-destructive' : ''}`}
                      onClick={() => document.getElementById('receipt')?.click()}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <Upload className="h-6 w-6 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Click to upload receipt
                        </span>
                        <span className="text-xs text-muted-foreground">
                          JPG, PNG, WEBP or PDF (max 5MB)
                        </span>
                      </div>
                    </Button>
                  </div>
                ) : (
                  <div className="p-3 rounded-lg bg-muted/50 border border-border flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />
                      <span className="text-sm truncate">{receiptFile.name}</span>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleRemoveFile}
                      className="h-8 w-8 p-0 flex-shrink-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                {errors.receipt && (
                  <p className="text-xs text-destructive">{errors.receipt}</p>
                )}
              </div>

              {/* Upload Progress */}
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep('payment')}
                  className="flex-1"
                  disabled={addFundsMutation.isPending}
                >
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={addFundsMutation.isPending}
                  className="flex-1 bg-primary hover:bg-primary/90"
                >
                  {addFundsMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Confirming...
                    </>
                  ) : (
                    'Confirm Payment'
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
