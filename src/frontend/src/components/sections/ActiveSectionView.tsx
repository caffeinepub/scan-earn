import { useFlowStore } from '../../state/flowStore';
import { LandingSection } from './LandingSection';
import { StocksFundsSection } from './StocksFundsSection';
import { WithdrawalSection } from './WithdrawalSection';
import { CustomerSupportSection } from './CustomerSupportSection';
import { FundsHistorySection } from './FundsHistorySection';
import { WithdrawalHistorySection } from './WithdrawalHistorySection';
import { WinningHistorySection } from './WinningHistorySection';
import { AdminPanelSection } from './AdminPanelSection';

export function ActiveSectionView() {
  const { activeSection } = useFlowStore();

  switch (activeSection) {
    case 'home':
      return <LandingSection />;
    case 'stocksFunds':
      return <StocksFundsSection />;
    case 'withdrawal':
      return <WithdrawalSection />;
    case 'support':
      return <CustomerSupportSection />;
    case 'fundsHistory':
      return <FundsHistorySection />;
    case 'withdrawalHistory':
      return <WithdrawalHistorySection />;
    case 'winningHistory':
      return <WinningHistorySection />;
    case 'adminPanel':
      return <AdminPanelSection />;
    default:
      return <LandingSection />;
  }
}
