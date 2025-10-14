import { View, Text } from 'react-native';

interface StockCardProps {
    symbol: string;
    name: string;
    currentPrice: number;      
    previousClose: number;     
}

const StockCard = (props: StockCardProps) => {
    const {symbol, name, currentPrice, previousClose} = props;

    const percentageChange = ((currentPrice - previousClose) / previousClose) * 100;
    const isPositive = percentageChange >= 0;
    
    return (
        <View className="bg-slate-700 p-4 rounded-lg shadow-md border border-gray-200">
            <Text className="text-lg font-bold text-white">{name}</Text>
            <Text className="text-sm text-white mb-2">{symbol}</Text>

            <View className="flex-row justify-between items-center">
                <Text className="text-2xl font-bold text-white">
                    ${currentPrice.toFixed(2)}
                </Text>
                
                <View className={`px-2 py-1 rounded ${isPositive ? 'bg-green-100' : 'bg-red-100'}`}>
                    <Text className={`text-sm font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                        {isPositive ? '+' : ''}{percentageChange.toFixed(2)}%
                    </Text>
                </View>
            </View>
        </View>
    );
};

export default StockCard;