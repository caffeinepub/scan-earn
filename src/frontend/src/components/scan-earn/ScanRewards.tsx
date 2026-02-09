import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { MessageCircle, Sparkles } from 'lucide-react';
import { useIsUserConnected } from '../../hooks/useQueries';
import { getWhatsAppNFCLink } from '../../utils/whatsapp';
import { toast } from 'sonner';

export function ScanRewards() {
  const { data: isConnected, isLoading } = useIsUserConnected();

  const handleScan = () => {
    // Check if user is connected
    if (!isConnected) {
      toast.error('Please connect your CTR first');
      return;
    }

    // Redirect to WhatsApp
    const whatsappLink = getWhatsAppNFCLink();
    window.open(whatsappLink, '_blank');
  };

  return (
    <div className="space-y-10">
      <div className="text-center space-y-3">
        <h2 className="text-4xl md:text-5xl font-bold flex items-center justify-center gap-3">
          <MessageCircle className="w-10 h-10 text-electric-blue" />
          Get NFC Code
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Request your 4-digit NFC code via WhatsApp
        </p>
      </div>

      <Card className="glass-strong max-w-md mx-auto shadow-premium-lg">
        <CardHeader className="text-center space-y-3">
          <CardTitle className="text-2xl">Request NFC Code</CardTitle>
          <CardDescription className="text-base">
            Get your unique 4-digit code to start earning
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-7">
          {/* Info Area */}
          <div className="glass rounded-2xl p-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-electric-blue/15 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <MessageCircle className="w-4 h-4 text-electric-blue" />
              </div>
              <div className="space-y-2 text-sm">
                <p className="font-medium">How it works:</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Click the button below to open WhatsApp</li>
                  <li>• Send the pre-filled message</li>
                  <li>• Receive your 4-digit NFC code</li>
                  <li>• Code works only for CTTH</li>
                  <li>• Only for CTR registered users</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Request Button */}
          <Button
            onClick={handleScan}
            disabled={isLoading}
            className="w-full bg-electric-blue hover:bg-electric-blue/90 h-12 text-base font-semibold shadow-premium-md transition-all hover:shadow-premium-lg"
            size="lg"
          >
            <Sparkles className="mr-2 h-5 w-5" />
            Request NFC Code via WhatsApp
          </Button>

          {!isConnected && !isLoading && (
            <p className="text-xs text-center text-destructive">
              Please connect your CTR ID first to request an NFC code
            </p>
          )}

          <p className="text-xs text-center text-muted-foreground">
            You will be redirected to WhatsApp to complete your request
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
