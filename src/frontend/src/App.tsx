import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from './components/ui/sonner';
import { StocksHomePage } from './pages/StocksHomePage';
import { SecureAccessGateway } from './pages/SecureAccessGateway';
import { RequirePlkSession } from './components/securepanel/RequirePlkSession';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleLoginSuccess = () => {
    // Force re-render to show authenticated view
    setRefreshKey((prev) => prev + 1);
  };

  const handleLogout = () => {
    // Clear React Query cache on logout
    queryClient.clear();
    // Force re-render to show login view
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <RequirePlkSession
        key={refreshKey}
        fallback={<SecureAccessGateway onLoginSuccess={handleLoginSuccess} />}
      >
        <StocksHomePage onLogout={handleLogout} />
      </RequirePlkSession>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
