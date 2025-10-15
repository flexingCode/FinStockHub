import StockGraphCard from "@/components/StockGraphCard";
import { usePriceHistoryStore } from "@/stores/priceHistoryStore";
import useStocksStore from "@/stores/stocksStore";
import { FlatList, Text, View } from "react-native";

const StockGraphs = () => {
    const { history, getLatestPrice } = usePriceHistoryStore()
    const { stockSymbols } = useStocksStore()


    return (
        <View className="flex-1">
            <Text className="text-4xl font-bold p-4">My Stock Graphs</Text>
            <FlatList
                data={Object.keys(history)}
                renderItem={({ item }) => (
                    <StockGraphCard
                        symbol={item}
                        name={stockSymbols.find(symbol => symbol.symbol === item)?.description || ''}
                        graphData={history[item].map(point => ({ value: point.price }))}
                        currentPrice={getLatestPrice(item) || 0} />
                )}
            />
        </View>
    )
}

export default StockGraphs;