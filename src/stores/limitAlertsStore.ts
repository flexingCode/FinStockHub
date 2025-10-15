import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { IAlertLimit } from "@/types/ui/alertLimit";

interface LimitAlertsStore {
    limitAlerts: IAlertLimit[];
    addLimitAlert: (limitAlert: IAlertLimit) => void;
    removeLimitAlert: (symbol: string) => void;
}

export const useLimitAlertsStore = create<LimitAlertsStore>()(persist((set) => ({
    limitAlerts: [],
    addLimitAlert: (limitAlert: IAlertLimit) => set((state) => ({ limitAlerts: [...state.limitAlerts, limitAlert] })),
    removeLimitAlert: (symbol: string) => set((state) => ({ limitAlerts: state.limitAlerts.filter((alert) => alert.symbol !== symbol) })),
}),{
    name: 'limit-alerts-storage',
    storage: createJSONStorage(() => AsyncStorage),
    partialize: (state) => ({
        limitAlerts: state.limitAlerts,
    })
}))