import { create } from 'zustand';

interface FlowState {
  isCtrConnected: boolean;
  ctrId: string;
  selectedTier: { inr: number; coins: number } | null;
  setCtrConnected: (connected: boolean, ctrId?: string) => void;
  setSelectedTier: (tier: { inr: number; coins: number } | null) => void;
  reset: () => void;
}

export const useFlowStore = create<FlowState>((set) => ({
  isCtrConnected: false,
  ctrId: '',
  selectedTier: null,
  setCtrConnected: (connected, ctrId = '') => 
    set({ isCtrConnected: connected, ctrId }),
  setSelectedTier: (tier) => set({ selectedTier: tier }),
  reset: () => set({ isCtrConnected: false, ctrId: '', selectedTier: null }),
}));
