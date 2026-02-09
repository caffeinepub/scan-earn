import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { useConnectPhone, useIsUserConnected } from '../../hooks/useQueries';
import { useFlowStore } from '../../state/flowStore';
import { validatePhoneNumber, normalizePhoneNumber } from '../../lib/format';
import { Phone, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface PhoneConnectProps {
  onSuccess: () => void;
}

export function PhoneConnect({ onSuccess }: PhoneConnectProps) {
  const [phone, setPhone] = useState('');
  const { data: isConnected } = useIsUserConnected();
  const connectMutation = useConnectPhone();
  const { setPhoneConnected } = useFlowStore();

  const handleConnect = async () => {
    if (!validatePhoneNumber(phone)) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    const normalized = normalizePhoneNumber(phone);
    
    try {
      await connectMutation.mutateAsync(normalized);
      setPhoneConnected(true, normalized);
      toast.success('Phone number connected successfully!');
      setTimeout(onSuccess, 500);
    } catch (error: any) {
      if (error.message?.includes('already connected')) {
        setPhoneConnected(true, normalized);
        toast.info('Phone number already connected');
        setTimeout(onSuccess, 500);
      } else {
        toast.error('Failed to connect phone number');
      }
    }
  };

  if (isConnected) {
    return (
      <Card className="glass-strong border-electric-blue/30 max-w-md mx-auto">
        <CardContent className="pt-6 text-center space-y-4">
          <CheckCircle2 className="w-16 h-16 text-electric-blue mx-auto" />
          <div>
            <h3 className="text-xl font-semibold">Connected!</h3>
            <p className="text-muted-foreground">Your account is ready</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-strong max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-electric-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Phone className="w-8 h-8 text-electric-blue" />
        </div>
        <CardTitle className="text-2xl">Connect Your Phone</CardTitle>
        <CardDescription>
          Enter your phone number to get started with Scan & Earn
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="10-digit mobile number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            maxLength={10}
            className="text-lg"
          />
        </div>
        <Button 
          onClick={handleConnect}
          disabled={connectMutation.isPending || !phone}
          className="w-full bg-electric-blue hover:bg-electric-blue/90"
          size="lg"
        >
          {connectMutation.isPending ? 'Connecting...' : 'Connect'}
        </Button>
      </CardContent>
    </Card>
  );
}

