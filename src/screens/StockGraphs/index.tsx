import StockGraphCard from "@/components/StockGraphCard";
import { usePriceHistoryStore } from "@/stores/priceHistoryStore";
import useStocksStore from "@/stores/stocksStore";
import { useCallback } from "react";
import { FlatList, Text, View } from "react-native";

const StockGraphs = () => {
    const { history, getLatestPrice } = usePriceHistoryStore()
    const { stockSymbols } = useStocksStore()
    
    const reorderHistory = Object.keys(history).sort((a, b) => {
        if (a === 'AAPL') return -1;
        if (b === 'AAPL') return 1;
        return 0;
    });

    const renderItem = useCallback(({ item }: { item: string }) => {
        return (
            <StockGraphCard
                symbol={item}
                name={stockSymbols.find(symbol => symbol.symbol === item)?.description || ''}
                graphData={history[item].map(point => ({ value: point.price }))}
                currentPrice={getLatestPrice(item) || 0} />
        )
    }, [history, stockSymbols, getLatestPrice]);
    
    return (
        <View className="flex-1">
            <Text className="text-4xl font-bold p-4">My Stock Graphs</Text>
            <FlatList
                data={reorderHistory}
                renderItem={renderItem}
            />
        </View>
    )
}

export default StockGraphs;