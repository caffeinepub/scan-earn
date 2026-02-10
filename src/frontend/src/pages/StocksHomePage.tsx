import { HamburgerMenu } from '../components/nav/HamburgerMenu';
import { HeaderBalanceIndicator } from '../components/header/HeaderBalanceIndicator';
import { ActiveSectionView } from '../components/sections/ActiveSectionView';
import { SecurePanelTopBar } from '../components/securepanel/SecurePanelTopBar';

interface StocksHomePageProps {
  onLogout: () => void;
}

export function StocksHomePage({ onLogout }: StocksHomePageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="sticky top-0 z-30 glass border-b border-border/40 backdrop-blur-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <HamburgerMenu />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Epik win
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <HeaderBalanceIndicator />
              <SecurePanelTopBar onLogout={onLogout} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <ActiveSectionView />
      </main>

      {/* Footer */}
      <footer className="glass border-t border-border/40 mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Epik win. All rights reserved.</p>
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
          </div>
        </div>
      </footer>
    </div>
  );
}
