import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ConnectionStatus } from 'types/websocket.types';

interface WebSocketStore {
  connectionStatus: ConnectionStatus;
  subscribedSymbols: string[];
  error: string | null;
  
  setConnectionStatus: (status: ConnectionStatus) => void;
  setError: (error: string | null) => void;
  addSubscribedSymbol: (symbol: string) => void;
  removeSubscribedSymbol: (symbol: string) => void;
}

const useWebSocketStore = create<WebSocketStore>()(
  persist(
    (set, get) => ({
      connectionStatus: 'disconnected',
      subscribedSymbols: [],
      stockPrices: {},
      error: null,

      setConnectionStatus: (status: ConnectionStatus) => 
        set({ connectionStatus: status }),

      setError: (error: string | null) => 
        set({ error }),

      addSubscribedSymbol: (symbol: string) => 
        set((state) => ({
          subscribedSymbols: [...state.subscribedSymbols, symbol]
        })),

      removeSubscribedSymbol: (symbol: string) => 
        set((state) => ({
          subscribedSymbols: state.subscribedSymbols.filter(s => s !== symbol)
        })),
    }),
    {
      name: 'websocket-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        subscribedSymbols: state.subscribedSymbols,
      }),
    }
  )
);

export default useWebSocketStore;
