import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface PricePoint {
  timestamp: number;
  price: number;
  volume?: number;
}

interface SymbolHistory {
  [symbol: string]: PricePoint[];
}

interface PriceHistoryStore {
  history: SymbolHistory;
  maxPoints: number;
  addPricePoint: (symbol: string, price: number, volume?: number) => void;
  getLatestPrice: (symbol: string) => number | null;
}

export const usePriceHistoryStore = create<PriceHistoryStore>()(
  persist(
    (set, get) => ({
      history: {},
      maxPoints: 50,

      addPricePoint: (symbol: string, price: number, volume?: number) => {
        const timestamp = Date.now();
        const newPoint: PricePoint = { timestamp, price, volume };

        set((state) => {
          const currentHistory = state.history[symbol] || [];          
          const updatedHistory = [...currentHistory, newPoint];          
          const limitedHistory = updatedHistory.length > state.maxPoints 
            ? updatedHistory.slice(-state.maxPoints)
            : updatedHistory;

          return {
            history: {
              ...state.history,
              [symbol]: limitedHistory
            }
          };
        });
      },
      getLatestPrice: (symbol: string) => {
        const state = get();
        const history = state.history[symbol];
        return history && history.length > 0 ? history[history.length - 1].price : null;
      }
    }),
    {
      name: 'price-history-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        history: state.history,
      }),
    }
  )
);
