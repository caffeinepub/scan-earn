import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { useConnectCtrId, useIsUserConnected } from '../../hooks/useQueries';
import { useFlowStore } from '../../state/flowStore';
import { validateCtrId } from '../../lib/format';
import { CreditCard, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface CtrConnectProps {
  onSuccess: () => void;
}

export function CtrConnect({ onSuccess }: CtrConnectProps) {
  const [ctrId, setCtrId] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [ctrError, setCtrError] = useState('');
  const [accessCodeError, setAccessCodeError] = useState('');
  const { data: isConnected } = useIsUserConnected();
  const connectMutation = useConnectCtrId();
  const { setCtrConnected } = useFlowStore();

  const REQUIRED_ACCESS_CODE = 'IQL0918';

  const validateAccessCode = (code: string): boolean => {
    return code.toUpperCase() === REQUIRED_ACCESS_CODE;
  };

  const isFormValid = (): boolean => {
    const ctrValidation = validateCtrId(ctrId);
    const accessCodeValid = validateAccessCode(accessCode);
    return ctrValidation.valid && accessCodeValid;
  };

  const handleConnect = async () => {
    setCtrError('');
    setAccessCodeError('');
    
    // Validate CTR ID
    const ctrValidation = validateCtrId(ctrId);
    if (!ctrValidation.valid) {
      setCtrError(ctrValidation.error || 'Invalid CTR ID');
      toast.error(ctrValidation.error || 'Invalid CTR ID');
      return;
    }

    // Validate access code
    if (!validateAccessCode(accessCode)) {
      setAccessCodeError('Invalid access code');
      toast.error('Invalid access code');
      return;
    }
    
    try {
      await connectMutation.mutateAsync(ctrId);
      setCtrConnected(true, ctrId);
      toast.success('CTR ID connected successfully!');
      setTimeout(onSuccess, 500);
    } catch (error: any) {
      if (error.message?.includes('already registered')) {
        setCtrConnected(true, ctrId);
        toast.info('CTR ID already connected');
        setTimeout(onSuccess, 500);
      } else {
        const errorMsg = error.message || 'Failed to connect CTR ID';
        setCtrError(errorMsg);
        toast.error(errorMsg);
      }
    }
  };

  if (isConnected) {
    return (
      <Card className="glass-strong border-electric-blue/40 max-w-md mx-auto shadow-premium-lg">
        <CardContent className="pt-10 pb-10 text-center space-y-6">
          <div className="w-20 h-20 bg-electric-blue/15 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10 text-electric-blue" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold">Connected!</h3>
            <p className="text-muted-foreground text-base">Your account is ready to earn</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-strong max-w-md mx-auto shadow-premium-lg">
      <CardHeader className="text-center space-y-4 pb-6">
        <div className="w-20 h-20 bg-electric-blue/10 rounded-full flex items-center justify-center mx-auto">
          <CreditCard className="w-9 h-9 text-electric-blue" />
        </div>
        <div className="space-y-2">
          <CardTitle className="text-3xl">Connect Your CTR ID</CardTitle>
          <CardDescription className="text-base">
            Enter your 7-digit CTR ID and access code to get started
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-2">
        <div className="space-y-3">
          <Label htmlFor="ctrId" className="text-base font-medium">CTR ID</Label>
          <Input
            id="ctrId"
            type="text"
            placeholder="Enter 7 digits (e.g., 1234567)"
            value={ctrId}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '');
              setCtrId(value);
              setCtrError('');
            }}
            maxLength={7}
            className={`text-lg h-12 premium-focus ${ctrError ? 'border-destructive' : ''}`}
          />
          {ctrError && (
            <p className="text-sm text-destructive">{ctrError}</p>
          )}
          <p className="text-xs text-muted-foreground">
            Enter exactly 7 digits
          </p>
        </div>

        <div className="space-y-3">
          <Label htmlFor="accessCode" className="text-base font-medium">Access Code</Label>
          <Input
            id="accessCode"
            type="text"
            placeholder="Enter access code"
            value={accessCode}
            onChange={(e) => {
              setAccessCode(e.target.value.toUpperCase());
              setAccessCodeError('');
            }}
            className={`text-lg h-12 premium-focus ${accessCodeError ? 'border-destructive' : ''}`}
          />
          {accessCodeError && (
            <p className="text-sm text-destructive">{accessCodeError}</p>
          )}
          <p className="text-xs text-muted-foreground">
            Required to connect your CTR ID
          </p>
        </div>

        <Button 
          onClick={handleConnect}
          disabled={connectMutation.isPending || !isFormValid()}
          className="w-full bg-electric-blue hover:bg-electric-blue/90 h-12 text-base font-semibold shadow-premium-md transition-all hover:shadow-premium-lg"
          size="lg"
        >
          {connectMutation.isPending ? 'Connecting...' : 'Connect'}
        </Button>
      </CardContent>
    </Card>
  );
}
