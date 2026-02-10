import { create } from 'zustand';

type ActiveSection = 'stocksFunds' | 'withdrawal' | 'support';

interface FlowState {
  selectedTier: { inr: number; coins: number } | null;
  activeSection: ActiveSection;
  setSelectedTier: (tier: { inr: number; coins: number } | null) => void;
  setActiveSection: (section: ActiveSection) => void;
  reset: () => void;
}

export const useFlowStore = create<FlowState>((set) => ({
  selectedTier: null,
  activeSection: 'stocksFunds',
  setSelectedTier: (tier) => set({ selectedTier: tier }),
  setActiveSection: (section) => set({ activeSection: section }),
  reset: () => set({ 
    selectedTier: null, 
    activeSection: 'stocksFunds',
  }),
}));
