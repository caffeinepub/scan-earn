import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Camera, CheckCircle2, Sparkles } from 'lucide-react';
import { cn } from '../../lib/utils';

export function ScanRewards() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);

  const handleScan = () => {
    setIsScanning(true);
    setScanSuccess(false);

    // Simulate scan process
    setTimeout(() => {
      setIsScanning(false);
      setScanSuccess(true);
      
      // Reset after showing success
      setTimeout(() => {
        setScanSuccess(false);
      }, 3000);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold flex items-center justify-center gap-2">
          <Camera className="w-8 h-8 text-electric-blue" />
          Scan & Earn
        </h2>
        <p className="text-muted-foreground">
          Scan QR codes to earn bonus coins
        </p>
      </div>

      <Card className="glass-strong max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle>Ready to Scan?</CardTitle>
          <CardDescription>
            Tap the button below to start scanning
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Scan Area */}
          <div 
            className={cn(
              'relative aspect-square glass rounded-2xl flex items-center justify-center transition-all',
              isScanning && 'border-electric-blue border-2 animate-pulse',
              scanSuccess && 'border-gold border-2 glow-gold'
            )}
          >
            {scanSuccess ? (
              <div className="text-center space-y-4 animate-in fade-in zoom-in duration-500">
                <CheckCircle2 className="w-24 h-24 text-gold mx-auto" />
                <div>
                  <p className="text-2xl font-bold text-gold">Scan Success!</p>
                  <p className="text-sm text-muted-foreground">Coins will be added soon</p>
                </div>
              </div>
            ) : isScanning ? (
              <div className="text-center space-y-4">
                <div className="relative">
                  <Camera className="w-24 h-24 text-electric-blue animate-pulse" />
                  <div className="absolute inset-0 border-4 border-electric-blue rounded-lg animate-ping" />
                </div>
                <p className="text-lg font-semibold text-electric-blue">Scanning...</p>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <Camera className="w-24 h-24 text-muted-foreground/50" />
                <p className="text-muted-foreground">Camera preview area</p>
              </div>
            )}
          </div>

          {/* Scan Button */}
          <Button
            onClick={handleScan}
            disabled={isScanning || scanSuccess}
            className="w-full bg-electric-blue hover:bg-electric-blue/90"
            size="lg"
          >
            {isScanning ? (
              'Scanning...'
            ) : scanSuccess ? (
              <>
                <CheckCircle2 className="mr-2 h-5 w-5" />
                Success!
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
                Start Scanning
              </>
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Demo mode: Simulated scan for demonstration purposes
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

