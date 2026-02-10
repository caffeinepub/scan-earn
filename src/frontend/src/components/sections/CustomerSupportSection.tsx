import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { useGetMessages, useSendMessage } from '../../hooks/useQueries';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import type { Message as BackendMessage } from '../../backend';

interface DisplayMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function CustomerSupportSection() {
  const { identity } = useInternetIdentity();
  const { data: backendMessages, isLoading: messagesLoading } = useGetMessages();
  const sendMessageMutation = useSendMessage();
  
  const [displayMessages, setDisplayMessages] = useState<DisplayMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Convert backend messages to display format
  useEffect(() => {
    if (!backendMessages) {
      // Show initial greeting
      setDisplayMessages([
        {
          id: 'greeting',
          role: 'assistant',
          content: 'Hello user welcome to epik win please let me know how can I help you today.',
          timestamp: new Date(),
        },
      ]);
      return;
    }

    const converted: DisplayMessage[] = backendMessages.map((msg: BackendMessage) => ({
      id: msg.id.toString(),
      role: msg.isAdminReply ? 'assistant' : 'user',
      content: msg.content,
      timestamp: new Date(Number(msg.timestamp) / 1_000_000),
    }));

    // Add greeting if no messages
    if (converted.length === 0) {
      setDisplayMessages([
        {
          id: 'greeting',
          role: 'assistant',
          content: 'Hello user welcome to epik win please let me know how can I help you today.',
          timestamp: new Date(),
        },
      ]);
    } else {
      setDisplayMessages(converted);
    }
  }, [backendMessages]);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [displayMessages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || sendMessageMutation.isPending || !identity) return;

    const messageContent = inputValue.trim();
    setInputValue('');

    try {
      // Send to backend (receiver is a placeholder, backend uses caller)
      await sendMessageMutation.mutateAsync({
        receiver: identity.getPrincipal(),
        content: messageContent,
      });
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!identity) {
    return (
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <h2 className="text-4xl md:text-5xl font-bold">Customer Support</h2>
          <p className="text-muted-foreground text-lg">
            Please log in to access customer support
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-3">
        <h2 className="text-4xl md:text-5xl font-bold">Customer Support</h2>
        <p className="text-muted-foreground text-lg">
          Get help with your questions
        </p>
      </div>

      <Card className="glass-strong shadow-premium-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="w-6 h-6 text-primary" />
            Support Chat
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Messages Area */}
          <ScrollArea className="h-[500px] pr-4" ref={scrollRef}>
            {messagesLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="space-y-4">
                {displayMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.role === 'assistant' && (
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Bot className="w-5 h-5 text-primary" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'glass'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          message.role === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                        }`}
                      >
                        {message.timestamp.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    {message.role === 'user' && (
                      <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          {/* Input Area */}
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="flex-1 h-12"
              disabled={sendMessageMutation.isPending}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || sendMessageMutation.isPending}
              size="icon"
              className="h-12 w-12 bg-primary hover:bg-primary/90"
            >
              {sendMessageMutation.isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
