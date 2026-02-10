import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useGetAddFundsHistory } from '../../hooks/useQueries';
import { formatCoins } from '../../lib/format';
import { Loader2, TrendingUp, AlertCircle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

export function AddFundsHistoryList() {
  const { data: history, isLoading, error } = useGetAddFundsHistory();

  if (isLoading) {
    return (
      <Card className="glass">
        <CardContent className="py-12 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-electric-blue" />
          <p className="text-sm text-muted-foreground mt-4">Loading transaction history...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="glass border-destructive/50">
        <CardContent className="py-12 text-center space-y-3">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
          <p className="text-sm text-destructive">Failed to load transaction history</p>
        </CardContent>
      </Card>
    );
  }

  if (!history || history.length === 0) {
    return (
      <Card className="glass">
        <CardContent className="py-12 text-center space-y-3">
          <TrendingUp className="w-12 h-12 text-muted-foreground/50 mx-auto" />
          <p className="text-muted-foreground">No add funds transactions yet</p>
          <p className="text-sm text-muted-foreground">
            Your transaction history will appear here after you add funds
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-electric-blue" />
          Add Funds History ({history.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((transaction) => (
                <TableRow key={transaction.transactionId}>
                  <TableCell className="font-mono text-sm">
                    {transaction.transactionId}
                  </TableCell>
                  <TableCell className="text-right font-semibold text-electric-blue">
                    +{formatCoins(Number(transaction.amount))}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
