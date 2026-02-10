import { useState } from 'react';
import { Menu, X, LayoutDashboard, ArrowDownToLine, History, Shield, Receipt } from 'lucide-react';
import { Button } from '../ui/button';
import { useFlowStore } from '../../state/flowStore';

export function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { activeSection, setActiveSection } = useFlowStore();

  const handleNavigate = (section: 'home' | 'withdrawal' | 'withdrawalHistory' | 'adminPanel' | 'fundsHistory') => {
    setActiveSection(section);
    setIsOpen(false);
  };

  return (
    <>
      {/* Hamburger Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative z-50 hover:bg-primary/10"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Menu Panel */}
      <div
        className={`fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-card border-r border-border shadow-2xl z-40 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-border">
            <h2 className="text-2xl font-bold">Menu</h2>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              <Button
                variant={activeSection === 'home' ? 'default' : 'ghost'}
                className="w-full justify-start gap-3 h-12"
                onClick={() => handleNavigate('home')}
              >
                <LayoutDashboard className="h-5 w-5" />
                <span className="text-base">Dashboard</span>
              </Button>

              <Button
                variant={activeSection === 'withdrawal' ? 'default' : 'ghost'}
                className="w-full justify-start gap-3 h-12"
                onClick={() => handleNavigate('withdrawal')}
              >
                <ArrowDownToLine className="h-5 w-5" />
                <span className="text-base">Withdrawal</span>
              </Button>

              <Button
                variant={activeSection === 'withdrawalHistory' ? 'default' : 'ghost'}
                className="w-full justify-start gap-3 h-12"
                onClick={() => handleNavigate('withdrawalHistory')}
              >
                <History className="h-5 w-5" />
                <span className="text-base">Withdrawal History</span>
              </Button>

              <Button
                variant={activeSection === 'adminPanel' ? 'default' : 'ghost'}
                className="w-full justify-start gap-3 h-12"
                onClick={() => handleNavigate('adminPanel')}
              >
                <Shield className="h-5 w-5" />
                <span className="text-base">Admin Panel</span>
              </Button>

              <Button
                variant={activeSection === 'fundsHistory' ? 'default' : 'ghost'}
                className="w-full justify-start gap-3 h-12"
                onClick={() => handleNavigate('fundsHistory')}
              >
                <Receipt className="h-5 w-5" />
                <span className="text-base">Funds Transaction History</span>
              </Button>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}
