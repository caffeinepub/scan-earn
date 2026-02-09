import { CoinCounter } from './CoinCounter';
import { Button } from '../ui/button';
import { Sparkles } from 'lucide-react';

interface HeroProps {
  onScanNowClick: () => void;
}

export function Hero({ onScanNowClick }: HeroProps) {
  return (
    <section 
      className="relative min-h-[70vh] flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: 'url(/assets/generated/hero-bg.dim_1920x1080.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            Turn Payments into{' '}
            <span className="text-electric-blue">Profits</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Earn rewards with every scan. Start building your coin balance today.
          </p>
        </div>

        <div className="flex flex-col items-center gap-6">
          <CoinCounter />
          
          <Button 
            size="lg" 
            onClick={onScanNowClick}
            className="bg-electric-blue hover:bg-electric-blue/90 text-white px-8 py-6 text-lg font-semibold glow-blue transition-all hover:scale-105"
          >
            <Sparkles className="mr-2 h-5 w-5" />
            Scan Now
          </Button>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}

