import Button from "@/components/Button";
import Dropdown from "@/components/Dropdown";
import Input from "@/components/Input";
import useStocksStore from "@/stores/stocksStore";
import IOption from "@/types/ui/option";
import { useState } from "react";
import { Text, View } from "react-native";

const LimitPreference = () => {

    const [stock, setStock] = useState<IOption | null>(null);
    const [limit, setLimit] = useState<string>("");

    const {stockSymbols} = useStocksStore();
    const stocks: IOption[] = stockSymbols.map((symbol) => ({
        label: symbol.description,
        value: symbol.symbol
    }));

    return (
        <View className="flex-1">
            <Text className="text-4xl font-bold p-4">Limit Preference</Text>
            <View className="flex flex-1 gap-4">
                <Dropdown options={stocks} onSelect={(option) => setStock(option)} value={stock || null} placeholder="Select a stock to track" />
                <Input placeholder="Limit" value={limit} onChangeText={setLimit} />
            </View>
            <Button title="Save" onPress={() => {
                if (stock && limit) {
                    console.log(stock, limit);
                }
            }} />
        </View>
    )
}

export default LimitPreference;