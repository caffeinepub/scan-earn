import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { LogOut } from 'lucide-react';
import { getSession, clearSession } from '../../lib/plkSession';
import { useFlowStore } from '../../state/flowStore';

interface SecurePanelTopBarProps {
  onLogout: () => void;
}

export function SecurePanelTopBar({ onLogout }: SecurePanelTopBarProps) {
  const uniqueId = getSession();
  const reset = useFlowStore((state) => state.reset);

  const handleLogout = () => {
    clearSession();
    reset();
    onLogout();
  };

  return (
    <div className="flex items-center gap-3">
      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 px-3 py-1.5 text-sm font-mono">
        User ID: {uniqueId}
      </Badge>
      <Button
        onClick={handleLogout}
        variant="outline"
        size="sm"
        className="border-destructive/50 text-destructive hover:bg-destructive/10 hover:text-destructive"
      >
        <LogOut className="w-4 h-4 mr-2" />
        Logout
      </Button>
    </div>
  );
}
