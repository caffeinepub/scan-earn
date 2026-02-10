import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Shield, Loader2, AlertCircle, Users, CreditCard, Flag, MessageSquare, Ban, CheckCircle, XCircle } from 'lucide-react';
import { 
  useAdminGetAllUsers, 
  useAdminGetBlockedUsers, 
  useAdminBlockUser, 
  useAdminUnblockUser,
  useAdminGetAllPaymentRequests,
  useAdminGetFlaggedPayments,
  useAdminApprovePayment,
  useAdminDeclinePayment,
  useAdminGetAllUserMessages,
  useAdminGetUserMessages,
  useAdminReplyToUser
} from '../../hooks/useQueries';
import { formatCoins } from '../../lib/format';
import type { Principal } from '@icp-sdk/core/principal';

const ADMIN_PAC_CODE = '09186114';

export function AdminPanelSection() {
  const [pacCode, setPacCode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const [selectedUser, setSelectedUser] = useState<Principal | null>(null);
  const [replyContent, setReplyContent] = useState('');

  const { data: allUsers, isLoading: usersLoading } = useAdminGetAllUsers(isAuthenticated);
  const { data: blockedUsers, isLoading: blockedLoading } = useAdminGetBlockedUsers(isAuthenticated);
  const { data: allPayments, isLoading: paymentsLoading } = useAdminGetAllPaymentRequests(isAuthenticated);
  const { data: flaggedPayments, isLoading: flaggedLoading } = useAdminGetFlaggedPayments(isAuthenticated);
  const { data: userThreads, isLoading: threadsLoading } = useAdminGetAllUserMessages(isAuthenticated);
  const { data: selectedUserMessages } = useAdminGetUserMessages(selectedUser, isAuthenticated);

  const blockUserMutation = useAdminBlockUser();
  const unblockUserMutation = useAdminUnblockUser();
  const approvePaymentMutation = useAdminApprovePayment();
  const declinePaymentMutation = useAdminDeclinePayment();
  const replyMutation = useAdminReplyToUser();

  const handleLogin = () => {
    if (pacCode === ADMIN_PAC_CODE) {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Invalid PAC code. Access denied.');
    }
  };

  const handleBlockUser = async (user: Principal) => {
    try {
      await blockUserMutation.mutateAsync(user);
    } catch (error) {
      console.error('Failed to block user:', error);
    }
  };

  const handleUnblockUser = async (user: Principal) => {
    try {
      await unblockUserMutation.mutateAsync(user);
    } catch (error) {
      console.error('Failed to unblock user:', error);
    }
  };

  const handleApprovePayment = async (transactionId: string) => {
    try {
      await approvePaymentMutation.mutateAsync(transactionId);
    } catch (error) {
      console.error('Failed to approve payment:', error);
    }
  };

  const handleDeclinePayment = async (transactionId: string) => {
    try {
      await declinePaymentMutation.mutateAsync(transactionId);
    } catch (error) {
      console.error('Failed to decline payment:', error);
    }
  };

  const handleSendReply = async () => {
    if (!selectedUser || !replyContent.trim()) return;
    
    try {
      await replyMutation.mutateAsync({
        user: selectedUser,
        content: replyContent.trim(),
      });
      setReplyContent('');
    } catch (error) {
      console.error('Failed to send reply:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto space-y-8 pt-12">
        <div className="text-center space-y-3">
          <Shield className="w-16 h-16 text-primary mx-auto" />
          <h2 className="text-4xl font-bold">Admin Panel</h2>
          <p className="text-muted-foreground">
            Enter PAC code to access admin features
          </p>
        </div>

        <Card className="glass-strong shadow-premium-lg">
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">PAC Code</label>
              <Input
                type="password"
                value={pacCode}
                onChange={(e) => setPacCode(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                placeholder="Enter PAC code"
                className="h-12"
              />
            </div>

            {authError && (
              <div className="flex items-center gap-2 text-destructive text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{authError}</span>
              </div>
            )}

            <Button
              onClick={handleLogin}
              className="w-full h-12"
              disabled={!pacCode}
            >
              Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isUserBlocked = (user: Principal) => {
    return blockedUsers?.some(blocked => blocked.toString() === user.toString()) || false;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center space-y-3">
        <h2 className="text-4xl md:text-5xl font-bold">Admin Panel</h2>
        <p className="text-muted-foreground text-lg">
          Manage users, payments, and customer queries
        </p>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="users">
            <Users className="w-4 h-4 mr-2" />
            Users
          </TabsTrigger>
          <TabsTrigger value="payments">
            <CreditCard className="w-4 h-4 mr-2" />
            Payments
          </TabsTrigger>
          <TabsTrigger value="flagged">
            <Flag className="w-4 h-4 mr-2" />
            Flagged
          </TabsTrigger>
          <TabsTrigger value="queries">
            <MessageSquare className="w-4 h-4 mr-2" />
            Queries
          </TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <Card className="glass">
            <CardHeader>
              <CardTitle>All Users</CardTitle>
            </CardHeader>
            <CardContent>
              {usersLoading || blockedLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : !allUsers || allUsers.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No users found</p>
              ) : (
                <ScrollArea className="h-[500px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Principal</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allUsers.map((user) => (
                        <TableRow key={user.toString()}>
                          <TableCell className="font-mono text-xs">
                            {user.toString().slice(0, 20)}...
                          </TableCell>
                          <TableCell>
                            {isUserBlocked(user) ? (
                              <Badge variant="destructive">Blocked</Badge>
                            ) : (
                              <Badge variant="outline">Active</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            {isUserBlocked(user) ? (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleUnblockUser(user)}
                                disabled={unblockUserMutation.isPending}
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Unblock
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleBlockUser(user)}
                                disabled={blockUserMutation.isPending}
                              >
                                <Ban className="w-4 h-4 mr-1" />
                                Block
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payments Tab */}
        <TabsContent value="payments" className="space-y-4">
          <Card className="glass">
            <CardHeader>
              <CardTitle>Payment Requests</CardTitle>
            </CardHeader>
            <CardContent>
              {paymentsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : !allPayments || allPayments.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No payment requests</p>
              ) : (
                <ScrollArea className="h-[500px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Transaction ID</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>UTR ID</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allPayments.map((payment) => (
                        <TableRow key={payment.transactionId}>
                          <TableCell className="font-mono text-xs">
                            {payment.transactionId.slice(0, 12)}...
                          </TableCell>
                          <TableCell className="font-mono text-xs">
                            {payment.user.toString().slice(0, 12)}...
                          </TableCell>
                          <TableCell>{formatCoins(Number(payment.amount))}</TableCell>
                          <TableCell className="font-mono text-xs">
                            {payment.utrId || 'N/A'}
                          </TableCell>
                          <TableCell>
                            {payment.status === 'pending' && <Badge variant="outline">Pending</Badge>}
                            {payment.status === 'approved' && <Badge className="bg-green-500">Approved</Badge>}
                            {payment.status === 'declined' && <Badge variant="destructive">Declined</Badge>}
                          </TableCell>
                          <TableCell className="text-right space-x-2">
                            {payment.status === 'pending' && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleApprovePayment(payment.transactionId)}
                                  disabled={approvePaymentMutation.isPending}
                                >
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Accept
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleDeclinePayment(payment.transactionId)}
                                  disabled={declinePaymentMutation.isPending}
                                >
                                  <XCircle className="w-4 h-4 mr-1" />
                                  Decline
                                </Button>
                              </>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Flagged Payments Tab */}
        <TabsContent value="flagged" className="space-y-4">
          <Card className="glass">
            <CardHeader>
              <CardTitle>Flagged Payments</CardTitle>
            </CardHeader>
            <CardContent>
              {flaggedLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : !flaggedPayments || flaggedPayments.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No flagged payments</p>
              ) : (
                <ScrollArea className="h-[500px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Transaction ID</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Flag Reason</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {flaggedPayments.map((payment) => (
                        <TableRow key={payment.transactionId} className="bg-destructive/5">
                          <TableCell className="font-mono text-xs">
                            {payment.transactionId.slice(0, 12)}...
                          </TableCell>
                          <TableCell className="font-mono text-xs">
                            {payment.user.toString().slice(0, 12)}...
                          </TableCell>
                          <TableCell>{formatCoins(Number(payment.amount))}</TableCell>
                          <TableCell className="text-destructive text-sm">
                            {payment.flagReason || 'Suspicious activity'}
                          </TableCell>
                          <TableCell>
                            {payment.status === 'pending' && <Badge variant="outline">Pending</Badge>}
                            {payment.status === 'approved' && <Badge className="bg-green-500">Approved</Badge>}
                            {payment.status === 'declined' && <Badge variant="destructive">Declined</Badge>}
                          </TableCell>
                          <TableCell className="text-right space-x-2">
                            {payment.status === 'pending' && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleApprovePayment(payment.transactionId)}
                                  disabled={approvePaymentMutation.isPending}
                                >
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Accept
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleDeclinePayment(payment.transactionId)}
                                  disabled={declinePaymentMutation.isPending}
                                >
                                  <XCircle className="w-4 h-4 mr-1" />
                                  Decline
                                </Button>
                              </>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Customer Queries Tab */}
        <TabsContent value="queries" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {/* User Threads List */}
            <Card className="glass">
              <CardHeader>
                <CardTitle>User Conversations</CardTitle>
              </CardHeader>
              <CardContent>
                {threadsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : !userThreads || userThreads.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No conversations</p>
                ) : (
                  <ScrollArea className="h-[500px]">
                    <div className="space-y-2">
                      {userThreads.map((thread) => (
                        <Button
                          key={thread.user.toString()}
                          variant={selectedUser?.toString() === thread.user.toString() ? 'default' : 'ghost'}
                          className="w-full justify-start text-left"
                          onClick={() => setSelectedUser(thread.user)}
                        >
                          <div className="flex-1 overflow-hidden">
                            <p className="font-mono text-xs truncate">
                              {thread.user.toString().slice(0, 20)}...
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {thread.messages.length} messages
                            </p>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>

            {/* Selected User Messages */}
            <Card className="glass">
              <CardHeader>
                <CardTitle>
                  {selectedUser ? 'Messages' : 'Select a conversation'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!selectedUser ? (
                  <p className="text-center text-muted-foreground py-12">
                    Select a user to view messages
                  </p>
                ) : (
                  <div className="space-y-4">
                    <ScrollArea className="h-[350px]">
                      <div className="space-y-3">
                        {selectedUserMessages?.map((msg) => (
                          <div
                            key={msg.id.toString()}
                            className={`p-3 rounded-lg ${
                              msg.isAdminReply ? 'bg-primary/10 ml-4' : 'bg-muted mr-4'
                            }`}
                          >
                            <p className="text-sm">{msg.content}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(Number(msg.timestamp) / 1_000_000).toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>

                    <div className="flex gap-2">
                      <Input
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder="Type your reply..."
                        className="flex-1"
                      />
                      <Button
                        onClick={handleSendReply}
                        disabled={!replyContent.trim() || replyMutation.isPending}
                      >
                        {replyMutation.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          'Send'
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
