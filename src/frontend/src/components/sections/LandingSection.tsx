import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { HighLowTradingGraphic } from '../trading/HighLowTradingGraphic';
import { useFlowStore } from '../../state/flowStore';

export function LandingSection() {
  const { setActiveSection } = useFlowStore();

  const handleGetStarted = () => {
    setActiveSection('stocksFunds');
  };

  const handleChatWithUs = () => {
    setActiveSection('support');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6 pt-8">
        <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
          Welcome to Trading
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
          Experience professional trading with real-time market insights and seamless fund management
        </p>
      </div>

      {/* Live Trading Graphic */}
      <div className="w-full">
        <HighLowTradingGraphic />
      </div>

      {/* CTA Section */}
      <Card className="glass-strong border-primary/20 shadow-premium-lg">
        <CardContent className="py-12 text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            Ready to Start Trading?
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Access stocks, manage funds, and track your portfolio with our intuitive platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              onClick={handleGetStarted}
              className="h-14 px-8 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-premium-lg hover:shadow-premium-lg hover:scale-105 transition-all duration-200"
            >
              Let's Go
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={handleChatWithUs}
              className="h-14 px-8 text-lg font-semibold border-2 hover:bg-primary/10 transition-all duration-200"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Chat with us
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-6 pb-8">
        <Card className="glass text-center">
          <CardContent className="pt-6 space-y-3">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl">📈</span>
            </div>
            <h3 className="text-xl font-bold">Live Trading</h3>
            <p className="text-sm text-muted-foreground">
              Real-time market data and trading insights
            </p>
          </CardContent>
        </Card>

        <Card className="glass text-center">
          <CardContent className="pt-6 space-y-3">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl">💰</span>
            </div>
            <h3 className="text-xl font-bold">Easy Funding</h3>
            <p className="text-sm text-muted-foreground">
              Quick and secure fund deposits via UPI
            </p>
          </CardContent>
        </Card>

        <Card className="glass text-center">
          <CardContent className="pt-6 space-y-3">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl">🔒</span>
            </div>
            <h3 className="text-xl font-bold">Secure Platform</h3>
            <p className="text-sm text-muted-foreground">
              Your funds and data are always protected
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
