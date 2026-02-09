import { useRef, useEffect } from 'react';
import { Hero } from './components/scan-earn/Hero';
import { CtrConnect } from './components/scan-earn/CtrConnect';
import { RewardCalculator } from './components/scan-earn/RewardCalculator';
import { Wallet } from './components/scan-earn/Wallet';
import { ScanRewards } from './components/scan-earn/ScanRewards';
import { useFlowStore } from './state/flowStore';
import { useIsUserConnected } from './hooks/useQueries';
import { Toaster } from './components/ui/sonner';

function App() {
  const ctrConnectRef = useRef<HTMLDivElement>(null);
  const rewardCalculatorRef = useRef<HTMLDivElement>(null);
  const walletRef = useRef<HTMLDivElement>(null);
  const scanRewardsRef = useRef<HTMLDivElement>(null);

  const { isCtrConnected, setCtrConnected } = useFlowStore();
  const { data: isConnected, isLoading } = useIsUserConnected();

  // Sync backend connection state with Zustand store on mount/refresh
  useEffect(() => {
    if (!isLoading && isConnected !== undefined) {
      if (isConnected && !isCtrConnected) {
        setCtrConnected(true);
      }
    }
  }, [isConnected, isLoading, isCtrConnected, setCtrConnected]);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="dark min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <Hero onScanNowClick={() => scrollToSection(scanRewardsRef)} />
      
      <main className="container mx-auto px-4 py-20 space-y-24 max-w-6xl">
        <section ref={ctrConnectRef} id="connect" className="animate-slide-up">
          <CtrConnect onSuccess={() => scrollToSection(rewardCalculatorRef)} />
        </section>

        {isCtrConnected && (
          <>
            <section ref={rewardCalculatorRef} id="tiers" className="animate-slide-up">
              <RewardCalculator />
            </section>

            <section ref={walletRef} id="wallet" className="animate-slide-up">
              <Wallet />
            </section>

            <section ref={scanRewardsRef} id="scan" className="animate-slide-up">
              <ScanRewards />
            </section>
          </>
        )}
      </main>

      <footer className="border-t border-border/40 mt-32 py-10 backdrop-blur-sm">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p className="font-medium">
            © 2026. Built with <span className="text-red-500">♥</span> using{' '}
            <a 
              href="https://caffeine.ai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-electric-blue hover:underline transition-colors font-semibold"
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
