import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "@screens/Login";
import HomeStack from "./HomeStack";
import withMainLayout from "@/hooks/withMainLayout";

export type AppStackScreens = {
    HomeStack: undefined;
    Login: undefined;
}

const _AppStack = createNativeStackNavigator<AppStackScreens>();

const AppStack = () => {
  return (
    <_AppStack.Navigator screenOptions={{ headerShown: false }}>
      <_AppStack.Screen name="Login" component={Login} />
      <_AppStack.Screen name="HomeStack" component={withMainLayout(HomeStack)} />
    </_AppStack.Navigator>
  );
};

export default AppStack;