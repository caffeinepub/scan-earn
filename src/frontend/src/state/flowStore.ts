import { create } from 'zustand';

type ActiveSection = 'home' | 'stocksFunds' | 'withdrawal' | 'support' | 'fundsHistory' | 'withdrawalHistory' | 'winningHistory' | 'adminPanel';

interface FlowState {
  selectedTier: { inr: number; coins: number } | null;
  activeSection: ActiveSection;
  setSelectedTier: (tier: { inr: number; coins: number } | null) => void;
  setActiveSection: (section: ActiveSection) => void;
  reset: () => void;
}

// Helper to persist activeSection to sessionStorage
const ACTIVE_SECTION_KEY = 'epikwin_active_section';

const getPersistedSection = (): ActiveSection => {
  if (typeof window === 'undefined') return 'home';
  const stored = sessionStorage.getItem(ACTIVE_SECTION_KEY);
  if (stored && ['home', 'stocksFunds', 'withdrawal', 'support', 'fundsHistory', 'withdrawalHistory', 'winningHistory', 'adminPanel'].includes(stored)) {
    return stored as ActiveSection;
  }
  return 'home'; // Default to home for initial landing
};

const persistSection = (section: ActiveSection) => {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(ACTIVE_SECTION_KEY, section);
  }
};

const clearPersistedSection = () => {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(ACTIVE_SECTION_KEY);
  }
};

export const useFlowStore = create<FlowState>((set) => ({
  selectedTier: null,
  activeSection: getPersistedSection(),
  setSelectedTier: (tier) => set({ selectedTier: tier }),
  setActiveSection: (section) => {
    persistSection(section);
    set({ activeSection: section });
  },
  reset: () => {
    clearPersistedSection();
    set({ 
      selectedTier: null, 
      activeSection: 'home', // Reset to home as default
    });
  },
}));
