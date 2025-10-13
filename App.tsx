import { Text, View } from "react-native";

export default function App() {
  return (
    <View className="flex-1 bg-red-500 justify-center items-center">
      <Text className="text-white text-2xl font-bold mb-4">
        NativeWind v4 Test
      </Text>
      <View className="bg-blue-500 p-4 rounded-lg">
        <Text className="text-white text-lg font-semibold">
          ¡Funciona! 🎉
        </Text>
      </View>
    </View>
  );
}