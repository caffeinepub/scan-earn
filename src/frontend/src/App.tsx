import { useRef } from 'react';
import { Hero } from './components/scan-earn/Hero';
import { PhoneConnect } from './components/scan-earn/PhoneConnect';
import { RewardCalculator } from './components/scan-earn/RewardCalculator';
import { Wallet } from './components/scan-earn/Wallet';
import { ScanRewards } from './components/scan-earn/ScanRewards';
import { useFlowStore } from './state/flowStore';
import { Toaster } from './components/ui/sonner';

function App() {
  const phoneConnectRef = useRef<HTMLDivElement>(null);
  const rewardCalculatorRef = useRef<HTMLDivElement>(null);
  const walletRef = useRef<HTMLDivElement>(null);
  const scanRewardsRef = useRef<HTMLDivElement>(null);

  const { isPhoneConnected } = useFlowStore();

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="dark min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <Hero onScanNowClick={() => scrollToSection(scanRewardsRef)} />
      
      <main className="container mx-auto px-4 py-12 space-y-16 max-w-6xl">
        <section ref={phoneConnectRef} id="connect">
          <PhoneConnect onSuccess={() => scrollToSection(rewardCalculatorRef)} />
        </section>

        {isPhoneConnected && (
          <>
            <section ref={rewardCalculatorRef} id="tiers">
              <RewardCalculator />
            </section>

            <section ref={walletRef} id="wallet">
              <Wallet />
            </section>

            <section ref={scanRewardsRef} id="scan">
              <ScanRewards />
            </section>
          </>
        )}
      </main>

      <footer className="border-t border-border/50 mt-24 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            © 2026. Built with <span className="text-red-500">♥</span> using{' '}
            <a 
              href="https://caffeine.ai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-electric-blue hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>

      <Toaster />
    </div>
  );
}

export default App;

