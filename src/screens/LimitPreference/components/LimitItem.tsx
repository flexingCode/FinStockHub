import Fontisto from "@react-native-vector-icons/fontisto";
import { View, Text, Pressable } from "react-native";

interface LimitItemProps {
    symbol: string;
    limit: number;
    onDelete: () => void;
}

const LimitItem = ({ symbol, limit, onDelete }: LimitItemProps) => {
    return (
        <View className="flex-row justify-between items-center p-4">
            <View>
                <Text>{symbol}</Text>
                <Text>{limit}</Text>
            </View>
            <Pressable onPress={onDelete} className="bg-red-500 rounded-full h-10 w-10 items-center justify-center">
                <Fontisto name="trash" size={24} color="white" />
            </Pressable>
        </View>
    )
}

export default LimitItem;