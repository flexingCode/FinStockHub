import { Text, View, FlatList, RefreshControl } from "react-native";
import { useStockQuotes } from "@/hooks/useStockQuotes";
import useStocksStore from "@/stores/stocksStore";
import StockCard from "@/components/StockCard/indext";

const Home = () => {
  const { stockSymbols } = useStocksStore();
  const symbols = stockSymbols.map(stock => stock.symbol);
  
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
  
  const loadedSymbols = stockSymbols.filter(stock => quotes[stock.symbol]);

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

  const renderFooter = () => {
    if (!hasMore) return null;
    
    return (
      <View className="p-4">
        <Text className="text-blue-500text-center">
          {loading && 'Loading more...'}
        </Text>
      </View>
    );
  };

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