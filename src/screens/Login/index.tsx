import { AppStackScreens } from "@/stacks/AppStack";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Pressable, Text, View } from "react-native";

type AppStackNavigationProp = NativeStackNavigationProp<AppStackScreens>;
const Login = () => {
    const navigation = useNavigation<AppStackNavigationProp>();
    return (
        <View className="flex-1 justify-center items-center">
            <View className="w-full max-w-sm p-6">
                <Text className="text-3xl font-bold text-center mb-8 text-gray-800">
                    Login
                </Text>
                <Pressable 
                    onPress={() => navigation.navigate('HomeStack')} 
                    className="bg-blue-500 p-4 rounded-lg"
                >
                    <Text className="text-white text-center font-semibold text-lg">
                        Iniciar Sesión
                    </Text>
                </Pressable>
            </View>
        </View>
    )
}


export default Login;