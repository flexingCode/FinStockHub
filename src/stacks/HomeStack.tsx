import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "@screens/Home";
import LimitPreference from "@screens/LimitPreference";
import StockGraphs from "@screens/StockGraphs";
import { Feather } from "@react-native-vector-icons/feather";

export type HomeBottomTabStackScreens = {
    Home: undefined;
    LimitPreference: undefined;
    StockGraphs: undefined;
}

const _HomeStack = createBottomTabNavigator<HomeBottomTabStackScreens>();

const HomeStack = () => {
    return (
        <_HomeStack.Navigator screenOptions={{ headerShown: false }}>
            <_HomeStack.Screen name="Home"  component={Home} options={{tabBarIcon: ({ color, size }) => (
                <Feather name="home" color={color} size={size} />
            )}} />
            <_HomeStack.Screen name="LimitPreference" component={LimitPreference} options={{tabBarIcon: ({ color, size }) => (
                <Feather name="settings" color={color} size={size} />
            )}} />
            <_HomeStack.Screen name="StockGraphs" component={StockGraphs} options={{tabBarIcon: ({ color, size }) => (
                <Feather name="bar-chart" color={color} size={size} />
            )}} />
        </_HomeStack.Navigator>
    )
}

export default HomeStack;