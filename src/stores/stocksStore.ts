import { GetStockSymbolsResponse } from "@/types/http/res/stock.response";
import { StockSymbolStore } from "@/types/stores/stockSymbols";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

const useStocksStore = create<StockSymbolStore>()(
  persist(
    (set) => ({
      stockSymbols: [],
      setStockSymbols: (stockSymbols: GetStockSymbolsResponse) => set({ stockSymbols }),
    }),
    {
      name: "stocks-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useStocksStore;