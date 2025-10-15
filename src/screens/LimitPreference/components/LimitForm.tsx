import Button from "@/components/Button";
import ModalDropdown from "@/components/ModalDropdown";
import Input from "@/components/Input";
import useStocksStore from "@/stores/stocksStore";
import IOption from "@/types/ui/option";
import { useState } from "react";
import { View, Text, Pressable } from "react-native";
import Feather from "@react-native-vector-icons/feather";

interface LimitFormProps {
    onClose: () => void;
    onSave: (stock: string, limit: string) => void;
}

const LimitForm = (props: LimitFormProps) => {
    const { onClose, onSave } = props;
    const [stock, setStock] = useState<IOption | null>(null);
    const [limit, setLimit] = useState<string>("");

    const { stockSymbols } = useStocksStore();
    const stocks: IOption[] = stockSymbols.map((symbol) => ({
        label: symbol.description,
        value: symbol.symbol
    }));

    const handleSave = () => {
        if (stock && limit) {
            onSave(stock.value, limit);
        }
    }

    return (
        <View className="gap-6" >
            <View>
                <Text className="text-2xl font-bold">Add Limit Alert</Text>
                <Pressable onPress={onClose} className="absolute top-0 right-0">
                    <Feather name="x" size={24} color="black" />
                </Pressable>
            </View>
             <ModalDropdown 
                 options={stocks} 
                 onSelect={(option) => setStock(option)} 
                 value={stock?.label || ''} 
                 placeholder="Select a stock to track" 
             />
            <Input placeholder="Limit" value={limit} onChangeText={setLimit} />
            <Button title="Save" onPress={handleSave} />
        </View>
    )
}

export default LimitForm;