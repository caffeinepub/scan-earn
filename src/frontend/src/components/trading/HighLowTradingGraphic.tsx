import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { TrendingUp, TrendingDown, ArrowUp, ArrowDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useSimulatedTradingSeries } from '../../hooks/useSimulatedTradingSeries';

export function HighLowTradingGraphic() {
  const data = useSimulatedTradingSeries({
    initialValue: 100,
    maxPoints: 20,
    updateInterval: 1000,
    volatility: 5,
    minValue: 80,
    maxValue: 140,
  });

  const values = data.map(d => d.value);
  const high = Math.max(...values);
  const low = Math.min(...values);
  const current = values[values.length - 1] ?? 100;
  const previous = values[values.length - 2] ?? current;
  
  // Calculate change
  const change = current - previous;
  const percentChange = previous !== 0 ? (change / previous) * 100 : 0;
  const isUp = change > 0;
  const isFlat = change === 0;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Live Trading Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* High/Low Indicators */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-4 rounded-lg bg-success/10 border border-success/20">
            <TrendingUp className="w-8 h-8 text-success" />
            <div>
              <p className="text-sm text-muted-foreground font-medium">High</p>
              <p className="text-2xl font-bold text-success">{high.toFixed(2)}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
            <TrendingDown className="w-8 h-8 text-destructive" />
            <div>
              <p className="text-sm text-muted-foreground font-medium">Low</p>
              <p className="text-2xl font-bold text-destructive">{low.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="time" 
                stroke="hsl(var(--muted-foreground))"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis 
                domain={[Math.floor(low - 5), Math.ceil(high + 5)]}
                stroke="hsl(var(--muted-foreground))"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="hsl(var(--electric-blue))" 
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Current Value with Live Direction */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="text-center p-4 rounded-lg bg-muted/50 border border-border">
            <p className="text-sm text-muted-foreground font-medium mb-1">Current Value</p>
            <p className="text-3xl font-bold text-electric-blue">{current.toFixed(2)}</p>
          </div>

          {/* Live Movement Indicator */}
          <div 
            className={`flex items-center justify-center gap-3 p-4 rounded-lg border ${
              isFlat 
                ? 'bg-muted/50 border-border' 
                : isUp 
                  ? 'bg-success/10 border-success/20' 
                  : 'bg-destructive/10 border-destructive/20'
            }`}
          >
            {!isFlat && (
              <>
                {isUp ? (
                  <ArrowUp className="w-8 h-8 text-success" />
                ) : (
                  <ArrowDown className="w-8 h-8 text-destructive" />
                )}
                <div className="text-center">
                  <p className="text-sm text-muted-foreground font-medium">
                    {isUp ? 'Up' : 'Down'}
                  </p>
                  <p className={`text-2xl font-bold ${isUp ? 'text-success' : 'text-destructive'}`}>
                    {isUp ? '+' : ''}{change.toFixed(2)}
                  </p>
                  <p className={`text-sm font-medium ${isUp ? 'text-success' : 'text-destructive'}`}>
                    ({isUp ? '+' : ''}{percentChange.toFixed(2)}%)
                  </p>
                </div>
              </>
            )}
            {isFlat && (
              <div className="text-center">
                <p className="text-sm text-muted-foreground font-medium">Movement</p>
                <p className="text-2xl font-bold text-muted-foreground">—</p>
                <p className="text-sm font-medium text-muted-foreground">(0.00%)</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
