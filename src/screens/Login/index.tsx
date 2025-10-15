import { AppStackScreens } from "@/stacks/AppStack";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Button, Text, View } from "react-native";
import AuthButton from "@/components/AuthButton";
import { useAuthStore } from "@/stores/authStore";
import { useEffect } from "react";

type AppStackNavigationProp = NativeStackNavigationProp<AppStackScreens>;

const Login = () => {
    const navigation = useNavigation<AppStackNavigationProp>();
    const { isAuthenticated } = useAuthStore();

    useEffect(() => {
        if (isAuthenticated) {
            navigation.navigate('HomeStack');
        }
    }, [isAuthenticated, navigation]);

    const handleLoginSuccess = () => {
        navigation.navigate('HomeStack');
    };

    return (
        <View className="flex-1 justify-center items-center bg-white">
            <View className="w-full max-w-sm p-6">
                <Text className="text-3xl font-bold text-center mb-2 text-gray-800">
                    FinStockHub
                </Text>
                <Text className="text-lg text-center mb-8 text-gray-600">
                    Real-time Stock Tracking
                </Text>

                <View className="gap-4">
                    <AuthButton
                        provider="google"
                        onPress={handleLoginSuccess}
                    />
                    <Button title="Continue as guest" onPress={handleLoginSuccess} />
                </View>
            </View>
        </View>
    )
}


export default Login;