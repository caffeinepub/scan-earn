import { StocksFundsSection } from './components/sections/StocksFundsSection';
import { WithdrawalSection } from './components/sections/WithdrawalSection';
import { CustomerSupportSection } from './components/sections/CustomerSupportSection';
import { HamburgerMenu } from './components/nav/HamburgerMenu';
import { HeaderBalanceIndicator } from './components/header/HeaderBalanceIndicator';
import { useFlowStore } from './state/flowStore';

function App() {
  const { activeSection } = useFlowStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="glass border-b border-border/40 sticky top-0 z-40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <HamburgerMenu />
            <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Scan & Earn
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <HeaderBalanceIndicator />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {activeSection === 'stocksFunds' && <StocksFundsSection />}
        {activeSection === 'withdrawal' && <WithdrawalSection />}
        {activeSection === 'support' && <CustomerSupportSection />}
      </main>

      {/* Footer */}
      <footer className="glass border-t border-border/40 mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Scan & Earn. All rights reserved.</p>
            <p>
              Built with ❤️ using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                  typeof window !== 'undefined' ? window.location.hostname : 'scan-earn-app'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors underline"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
