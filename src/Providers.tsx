import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const Providers = ({ children }: { children: React.ReactNode }) => {

  const navigationTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: "white",
    },
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-white">
        <NavigationContainer theme={navigationTheme}>
          {children}
        </NavigationContainer>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default Providers;