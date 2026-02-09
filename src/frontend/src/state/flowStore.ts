import { create } from 'zustand';

interface FlowState {
  isPhoneConnected: boolean;
  phoneNumber: string;
  selectedTier: { inr: number; coins: number } | null;
  setPhoneConnected: (connected: boolean, phone?: string) => void;
  setSelectedTier: (tier: { inr: number; coins: number } | null) => void;
  reset: () => void;
}

export const useFlowStore = create<FlowState>((set) => ({
  isPhoneConnected: false,
  phoneNumber: '',
  selectedTier: null,
  setPhoneConnected: (connected, phone = '') => 
    set({ isPhoneConnected: connected, phoneNumber: phone }),
  setSelectedTier: (tier) => set({ selectedTier: tier }),
  reset: () => set({ isPhoneConnected: false, phoneNumber: '', selectedTier: null }),
}));

