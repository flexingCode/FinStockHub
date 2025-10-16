import { useLimitAlertsStore } from "@/stores/limitAlertsStore";
import { IAlertLimit } from "@/types/ui/alertLimit";
import { FlatList, Modal, Text, View } from "react-native";
import LimitItem from "./components/LimitItem";
import Button from "@/components/Button";
import { useCallback, useMemo, useState } from "react";
import LimitForm from "./components/LimitForm";
import { SafeAreaView } from "react-native-safe-area-context";

const ListEmptyComponent = () => {
    return (
        <View className="flex-1 items-center justify-center min-h-96">
            <Text className="text-center text-gray-500">No limit alerts</Text>
        </View>
    )
}

const LimitPreference = () => {
    const { limitAlerts, addLimitAlert, removeLimitAlert } = useLimitAlertsStore();
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleSave = (stock: string, limit: string) => {
        addLimitAlert({ symbol: stock, limit: parseFloat(limit) });
        setIsModalVisible(false);
    }

    const handleDelete = (symbol: string) => {
        removeLimitAlert(symbol);
    }

    const handleClose = () => {
        setIsModalVisible(false);
    }

    const renderItem = useCallback(({ item }: { item: IAlertLimit }) => {
        return <LimitItem symbol={item.symbol} limit={item.limit} onDelete={() => handleDelete(item.symbol)} />
    }, [handleDelete]);

    const momerizeModal = useMemo(() => (
        <Modal
                animationType="fade"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => setIsModalVisible(false)}
            >
                <View className="flex-1 bg-black/50 justify-center items-center p-4">
                    <View className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-4">
                        <LimitForm onClose={handleClose} onSave={handleSave} />
                    </View>
                </View>
            </Modal >
    ), [isModalVisible, handleClose, handleSave]);

    return (
        <View className="flex-1 mb-4">
            <Text className="text-4xl font-bold p-4">Limit Preference</Text>
            <FlatList
                data={limitAlerts}
                renderItem={renderItem}
                keyExtractor={(item) => item.symbol}
                ListEmptyComponent={ListEmptyComponent}
            />
            {momerizeModal}
            <Button title="Add Limit Alert" onPress={() => setIsModalVisible(true)} />
        </View >
    )
}

export default LimitPreference;