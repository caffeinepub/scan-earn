import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { isAuthorizedPlk } from '../lib/plkAllowlist';
import { generateUniqueId, setSession } from '../lib/plkSession';
import { stripNonDigits } from '../lib/format';
import { Shield, Mail } from 'lucide-react';

interface SecureAccessGatewayProps {
  onLoginSuccess: () => void;
}

export function SecureAccessGateway({ onLoginSuccess }: SecureAccessGatewayProps) {
  const [plkCode, setPlkCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = stripNonDigits(e.target.value);
    // Cap at 6 digits
    const capped = value.slice(0, 6);
    setPlkCode(capped);
    // Clear error when user types
    if (error) setError('');
  };

  const handleLogin = async () => {
    // Validate input
    if (plkCode.length !== 6) {
      setError('Please enter a complete 6-digit PLK code');
      return;
    }

    setIsLoading(true);
    setError('');

    // Simulate brief validation delay for UX
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Check against allowlist
    if (!isAuthorizedPlk(plkCode)) {
      setError('Invalid PLK code. Please check your code and try again.');
      setIsLoading(false);
      return;
    }

    // Generate and store session
    const uniqueId = generateUniqueId();
    setSession(uniqueId);

    // Trigger success callback
    onLoginSuccess();
    setIsLoading(false);
  };

  const handleRequestCode = () => {
    const subject = encodeURIComponent('PLK Code Request');
    const body = encodeURIComponent('Request To Generate PLK Code For login');
    const mailtoUrl = `mailto:99999diamonds@gmail.com?subject=${subject}&body=${body}`;
    window.location.href = mailtoUrl;
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && plkCode.length === 6) {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-md glass border-border/40">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold">Secure Access Gateway</CardTitle>
          <CardDescription className="text-base">
            Enter your 6-digit PLK code to access the platform
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="plk-code">PLK Code</Label>
            <Input
              id="plk-code"
              type="text"
              inputMode="numeric"
              placeholder="Enter 6-digit PLK Code"
              value={plkCode}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              maxLength={6}
              className={`text-center text-2xl tracking-widest font-mono ${
                error ? 'border-destructive focus-visible:ring-destructive' : ''
              }`}
              disabled={isLoading}
            />
            {error && <p className="text-sm text-destructive mt-2">{error}</p>}
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleLogin}
              disabled={isLoading || plkCode.length !== 6}
              className="w-full"
              size="lg"
            >
              {isLoading ? 'Verifying...' : 'Login'}
            </Button>

            <Button
              onClick={handleRequestCode}
              variant="outline"
              className="w-full"
              size="lg"
              type="button"
            >
              <Mail className="w-4 h-4 mr-2" />
              Request PLK Code via Email
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>Don't have a PLK code? Request one using the button above.</p>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 py-4 text-center text-sm text-muted-foreground">
        <p>
          Built with ❤️ using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
              typeof window !== 'undefined' ? window.location.hostname : 'epikwin-app'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors underline"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
