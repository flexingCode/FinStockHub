import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "@screens/Home";
import LimitPreference from "@screens/LimitPreference";
import StockGraphs from "@screens/StockGraphs";

export type HomeBottomTabStackScreens = {
    Home: undefined;
    LimitPreference: undefined;
    StockGraphs: undefined;
}

const _HomeStack = createBottomTabNavigator<HomeBottomTabStackScreens>();

const HomeStack = () => {
    return (
        <_HomeStack.Navigator screenOptions={{ headerShown: false }}>
            <_HomeStack.Screen name="Home" component={Home} />
            <_HomeStack.Screen name="LimitPreference" component={LimitPreference} />
            <_HomeStack.Screen name="StockGraphs" component={StockGraphs} />
        </_HomeStack.Navigator>
    )
}

export default HomeStack;