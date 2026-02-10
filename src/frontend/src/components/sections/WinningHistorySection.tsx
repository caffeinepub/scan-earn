import { Card, CardContent } from '../ui/card';
import { Trophy } from 'lucide-react';

export function WinningHistorySection() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-3">
        <h2 className="text-4xl md:text-5xl font-bold">Winning History</h2>
        <p className="text-muted-foreground text-lg">
          Track your winning transactions
        </p>
      </div>

      <Card className="glass">
        <CardContent className="py-16 text-center space-y-4">
          <Trophy className="w-16 h-16 text-muted-foreground/50 mx-auto" />
          <p className="text-xl text-muted-foreground">No winning history yet</p>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Your winning transactions will appear here once you start trading
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
