import { useEffect, useState } from 'react';
import { hasValidSession } from '../../lib/plkSession';

interface RequirePlkSessionProps {
  children: React.ReactNode;
  fallback: React.ReactNode;
}

export function RequirePlkSession({ children, fallback }: RequirePlkSessionProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => hasValidSession());

  // Check session on mount and periodically
  useEffect(() => {
    const checkSession = () => {
      const valid = hasValidSession();
      setIsAuthenticated(valid);
    };

    // Check immediately
    checkSession();

    // Check every 2 seconds for session changes (e.g., manual localStorage clear)
    const interval = setInterval(checkSession, 2000);

    // Check on window focus
    const handleFocus = () => checkSession();
    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  if (!isAuthenticated) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
