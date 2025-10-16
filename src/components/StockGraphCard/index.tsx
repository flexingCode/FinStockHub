import React, { useCallback } from 'react';
import { View, Text } from 'react-native';
import { LineChart } from "react-native-gifted-charts";

interface StockGraphCardProps {
    symbol: string;
    name: string;
    currentPrice: number;
    graphData: { value: number }[]
}

const StockGraphCard = React.memo((props: StockGraphCardProps) => {
    const { symbol, name, graphData, currentPrice } = props;
    
    const getSpacing = useCallback((dataLength: number) => {
        if (dataLength <= 1) return 0;
        if (dataLength === 2) return 140; 
        if (dataLength <= 5) return 140 / (dataLength - 1);
        return 30; 
    }, []);

    const getTransformedData = useCallback(() => {
        if (!graphData || graphData.length < 2) return graphData;
        
        const prices = graphData.map(d => d.value);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        const range = maxPrice - minPrice;

        if (maxPrice === 0) {
            return {
                data: graphData.map(() => ({ value: 0 })),
                chartConfig: {
                    minValue: 0,
                    maxValue: 100
                }
            };
        }

        if (range < maxPrice * 0.01 && range > 0) {
            const margin = range * 0.1; 
            const normalizedMin = 0;
            const normalizedMax = 100;
            
            const transformedData = graphData.map(d => {
                const normalizedValue = ((d.value - (minPrice - margin)) / (range + 2 * margin)) * (normalizedMax - normalizedMin) + normalizedMin;
                return {
                    value: isNaN(normalizedValue) || !isFinite(normalizedValue) ? normalizedMin : normalizedValue
                };
            });
            
            return {
                data: transformedData,
                chartConfig: {
                    minValue: normalizedMin,
                    maxValue: normalizedMax
                }
            };
        }
        
        const margin = range * 0.1;
        return {
            data: graphData,
            chartConfig: {
                minValue: Math.max(0, minPrice - margin),
                maxValue: maxPrice + margin
            }
        };
    }, [graphData, symbol]);

    return (
        <View className="bg-slate-700 p-4 rounded-xl border border-gray-200 mb-3">
            <View className="flex-row justify-between items-center">
                <View className="flex-1">
                    <Text className="text-lg font-bold text-white mb-1" numberOfLines={2}>
                        {name}
                    </Text>
                    <Text className="text-sm text-gray-300 mb-2">{symbol}</Text>
                    
                    <Text className="text-2xl font-bold text-white mb-1">
                        ${currentPrice.toFixed(2)}
                    </Text>
                </View>

                <View className="flex-1 justify-center items-center mt-4">
                    {graphData && graphData.length > 1 ? (() => {
                        const transformed = getTransformedData();
                        
                        const isTransformed = transformed && typeof transformed === 'object' && 'data' in transformed;
                        const chartData = isTransformed ? (transformed as any).data : transformed;
                        const chartConfig = isTransformed ? (transformed as any).chartConfig : {};
                        
                        return (
                            <LineChart
                                width={140}
                                height={80}
                                data={chartData}
                                spacing={getSpacing(chartData.length)}
                                thickness={3}
                                color="#ffffff"
                                curved={chartData.length > 2}
                                isAnimated={false}
                                hideDataPoints={false}
                                dataPointsColor="#ffffff"
                                dataPointsRadius={2}
                                areaChart
                                hideRules={true}
                                yAxisLabelWidth={0}
                                yAxisTextStyle={{ color: 'transparent' }}
                                xAxisLabelTextStyle={{ color: 'transparent' }}
                                yAxisColor="transparent"
                                xAxisColor="transparent"
                            />
                        );
                    })() : graphData && graphData.length === 1 ? (
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
});

export default StockGraphCard;