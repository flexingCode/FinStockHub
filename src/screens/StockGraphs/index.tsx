import { usePriceHistoryStore } from "@/stores/priceHistoryStore";
import { Text, View } from "react-native";

const StockGraphs = () => {
    const {history} = usePriceHistoryStore()

    console.log(history);

    return (
        <View>
            <Text>Stock Graphs</Text>
        </View>
    )
}

export default StockGraphs;