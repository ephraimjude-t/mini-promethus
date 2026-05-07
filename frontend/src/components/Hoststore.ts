import { create } from 'zustand';

interface HostState {
  selectedHost: string;
  setHost: (host: string) => void;
}

// Make sure 'export' is right here!
export const useHostStore = create<HostState>((set) => ({
  selectedHost: '',
  setHost: (host: string) => set({ selectedHost: host }),
}));