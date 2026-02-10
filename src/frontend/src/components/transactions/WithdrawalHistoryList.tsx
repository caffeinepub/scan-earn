import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useGetWithdrawalHistory } from '../../hooks/useQueries';
import { formatCoins } from '../../lib/format';
import { Loader2, ArrowDownToLine, AlertCircle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

export function WithdrawalHistoryList() {
  const { data: history, isLoading, error } = useGetWithdrawalHistory();

  if (isLoading) {
    return (
      <Card className="glass">
        <CardContent className="py-12 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-electric-blue" />
          <p className="text-sm text-muted-foreground mt-4">Loading withdrawal history...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="glass border-destructive/50">
        <CardContent className="py-12 text-center space-y-3">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
          <p className="text-sm text-destructive">Failed to load withdrawal history</p>
        </CardContent>
      </Card>
    );
  }

  if (!history || history.length === 0) {
    return (
      <Card className="glass">
        <CardContent className="py-12 text-center space-y-3">
          <ArrowDownToLine className="w-12 h-12 text-muted-foreground/50 mx-auto" />
          <p className="text-muted-foreground">No withdrawal transactions yet</p>
          <p className="text-sm text-muted-foreground">
            Your withdrawal history will appear here after you make a withdrawal
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowDownToLine className="w-5 h-5 text-electric-blue" />
          Withdrawal History ({history.length})
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
                  <TableCell className="text-right font-semibold text-destructive">
                    -{formatCoins(Number(transaction.amount))}
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
