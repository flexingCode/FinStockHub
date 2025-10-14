import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { useEffect } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import stockServices from "./services/stock.services";
import useStocksStore from "./stores/stocksStore";

const Providers = ({ children }: { children: React.ReactNode }) => {

  const { setStockSymbols } = useStocksStore();

  useEffect(() => {
    getStockSymbols();
  }, [])

  const getStockSymbols = async () => {
    const response = await stockServices.getStockSymbols("US");
    setStockSymbols(response);
  }

  const navigationTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: "white",
    },
  };

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={navigationTheme}>
          {children}
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default Providers;