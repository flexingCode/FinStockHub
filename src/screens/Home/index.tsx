import { Text, View, FlatList, RefreshControl, ActivityIndicator } from "react-native";
import { useStockQuotes } from "@/hooks/useStockQuotes";
import useStocksStore from "@/stores/stocksStore";
import StockCard from "@/components/StockCard/indext";
import { useCallback } from "react";

const Home = () => {
  const { stockSymbols } = useStocksStore();
  
  //This is just to ensure that Apple (AAPL) always appears first to test the limit alerts
  const appleStock = stockSymbols.find(stock => stock.symbol === 'AAPL');
  const otherStocks = stockSymbols.filter(stock => stock.symbol !== 'AAPL');
  const reorderedSymbols = appleStock ? [appleStock, ...otherStocks] : stockSymbols;
  
  const symbols = reorderedSymbols.map(stock => stock.symbol);

  const {
    quotes,
    loading,
    error,
    loadNextBatch,
    hasMore,
    refresh
  } = useStockQuotes({
    symbols,
    batchSize: 10,
    onBatchLoaded: (quotes) => {
      console.log(`Loaded ${quotes.length} quotes`);
    }
  });

  const loadedSymbols = reorderedSymbols.filter(stock => quotes[stock.symbol]);

  const renderStockCard = ({ item }: { item: any }) => {
    const quote = quotes[item.symbol];

    return (
      <StockCard
        symbol={item.symbol}
        name={item.description}
        currentPrice={quote.c}
        previousClose={quote.pc}
      />
    );
  };

  const handleEndReached = () => {
    if (hasMore && !loading) {
      loadNextBatch();
    }
  };

  const renderFooter = useCallback(() => {
    if (!hasMore) return null;

    return (
      <View className="p-4 items-center justify-center">
        {loading && (
          <View className="flex-row items-center justify-center gap-4">
            <ActivityIndicator size="small" color="#0000ff" />
            <Text className="text-center text-gray-500">Loading</Text>
          </View>
        )}
      </View>
    );
  }, [hasMore, loading]);

  if (error) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <Text className="text-red-500 text-center">{error}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <Text className="text-4xl font-bold p-4">Stock Prices</Text>
      <FlatList
        data={loadedSymbols}
        renderItem={renderStockCard}
        keyExtractor={(item) => item.symbol}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refresh}
            tintColor="#ffffff"
          />
        }
        ItemSeparatorComponent={() => <View className="h-2" />}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default Home;