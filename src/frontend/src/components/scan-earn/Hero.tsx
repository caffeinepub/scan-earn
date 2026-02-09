import { CoinCounter } from './CoinCounter';
import { Button } from '../ui/button';
import { Sparkles } from 'lucide-react';

interface HeroProps {
  onScanNowClick: () => void;
}

export function Hero({ onScanNowClick }: HeroProps) {
  return (
    <section 
      className="relative min-h-[75vh] flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: 'url(/assets/generated/hero-bg.dim_1920x1080.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Enhanced overlay for premium readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/70 to-background" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center space-y-10 py-20">
        <div className="space-y-6 max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight leading-[1.1]">
            Turn Payments into{' '}
            <span className="text-electric-blue inline-block">Profits</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground/90 max-w-2xl mx-auto leading-relaxed font-medium">
            Earn rewards with every scan. Start building your coin balance today.
          </p>
        </div>

        <div className="flex flex-col items-center gap-8 pt-4">
          <CoinCounter />
          
          <Button 
            size="lg" 
            onClick={onScanNowClick}
            className="bg-electric-blue hover:bg-electric-blue/90 text-white px-10 py-7 text-lg font-semibold glow-blue transition-all hover:scale-[1.02] active:scale-[0.98] shadow-premium-lg"
          >
            <Sparkles className="mr-2 h-5 w-5" />
            Scan Now
          </Button>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
