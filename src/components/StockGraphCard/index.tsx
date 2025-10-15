import { useCallback } from 'react';
import { View, Text } from 'react-native';
import { LineChart } from "react-native-gifted-charts";

interface StockGraphCardProps {
    symbol: string;
    name: string;
    currentPrice: number;
    graphData: { value: number }[]
}

const StockGraphCard = (props: StockGraphCardProps) => {
    const { symbol, name, graphData, currentPrice } = props;
    
    const getSpacing = useCallback((dataLength: number) => {
        if (dataLength <= 1) return 0;
        if (dataLength === 2) return 140; 
        if (dataLength <= 5) return 140 / (dataLength - 1);
        return 30; 
    }, []);

    return (
        <View className="bg-slate-700 p-4 rounded-xl border border-gray-200 mb-3">
            <View className="flex-row justify-between items-center">
                <View className="flex-1">
                    <Text className="text-lg font-bold text-white mb-1" numberOfLines={2}>
                        {name}
                    </Text>
                    <Text className="text-sm text-gray-300 mb-3">{symbol}</Text>

                    <Text className="text-2xl font-bold text-white">
                        ${currentPrice.toFixed(2)}
                    </Text>
                </View>

                <View className="flex-1 justify-center items-center mt-4">
                    {graphData && graphData.length > 1 ? (
                        <LineChart
                            width={140}
                            height={80}
                            areaChart
                            hideDataPoints
                            startFillColor="white"
                            startOpacity={1}
                            endOpacity={0.3}
                            initialSpacing={0}
                            data={graphData}
                            spacing={getSpacing(graphData.length)}
                            thickness={2}
                            hideRules
                            hideYAxisText
                            hideAxesAndRules
                            yAxisColor="#334155"
                            xAxisColor="#334155"
                            color="#334155"
                            curved={graphData.length > 2}
                            isAnimated={false}
                        />
                    ) : graphData && graphData.length === 1 ? (
                        <View className="w-20 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                            <Text className="text-white text-xs font-bold">
                                ${graphData[0].value.toFixed(2)}
                            </Text>
                        </View>
                    ) : (
                        <View className="w-20 h-16 bg-gray-600 rounded flex items-center justify-center">
                            <Text className="text-xs text-gray-400">No data</Text>
                        </View>
                    )}
                </View>
            </View>
        </View>
    )
};

export default StockGraphCard;