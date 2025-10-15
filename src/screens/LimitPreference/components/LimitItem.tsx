import Fontisto from "@react-native-vector-icons/fontisto";
import { View, Text, Pressable } from "react-native";
import Feather from "@react-native-vector-icons/feather";

interface LimitItemProps {
    symbol: string;
    limit: number;
    onDelete: () => void;
}

const LimitItem = ({ symbol, limit, onDelete }: LimitItemProps) => {

    const formatLimit = (limit: number) => {
        return `$${limit.toFixed(2)}`;
    }
    return (
        <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
            <View>
                <Text className="text-lg text-gray-400">{symbol}</Text>
                <Text className="text-xl font-bold text-gray-800">{formatLimit(limit)}</Text>
            </View>
            <Pressable onPress={onDelete} className="bg-red-500 rounded-full h-10 w-10 items-center justify-center">
                <Feather name="trash" size={12} color="white" />
            </Pressable>
        </View>
    )
}

export default LimitItem;