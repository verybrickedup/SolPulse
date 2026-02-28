/**
 * Whale Store — Zustand state for tracked wallets
 */
import { create } from 'zustand';
import { WhaleWatch } from '../types/token';

interface WhaleState {
  whales: WhaleWatch[];
  addWhale: (address: string, label: string) => void;
  removeWhale: (address: string) => void;
  updateActivity: (address: string, activity: WhaleWatch['lastActivity']) => void;
  getWhale: (address: string) => WhaleWatch | undefined;
}

export const useWhaleStore = create<WhaleState>((set, get) => ({
  whales: [],

  addWhale: (address, label) => {
    const exists = get().whales.find((w) => w.address === address);
    if (exists) return;
    set((state) => ({
      whales: [...state.whales, { address, label, addedAt: Date.now() }],
    }));
  },

  removeWhale: (address) => {
    set((state) => ({
      whales: state.whales.filter((w) => w.address !== address),
    }));
  },

  updateActivity: (address, activity) => {
    set((state) => ({
      whales: state.whales.map((w) =>
        w.address === address ? { ...w, lastActivity: activity } : w
      ),
    }));
  },

  getWhale: (address) => {
    return get().whales.find((w) => w.address === address);
  },
}));

export default useWhaleStore;
