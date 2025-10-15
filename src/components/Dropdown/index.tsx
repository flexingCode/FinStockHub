import IOption from "@/types/ui/option";
import { Pressable, Text } from "react-native";
import { SheetManager } from "react-native-actions-sheet";

interface DropdownProps {
    placeholder: string;
    options: IOption[];
    onSelect: (option: IOption) => void;
    value: IOption | null;
}

const Dropdown = (props: DropdownProps) => {
    const { options, onSelect, value, placeholder } = props;

    const openActionSheet = () => {
        SheetManager.show("dropdown-sheet", {
            payload: {
                options,
                onSelect
            }
        });
    }

    return (
        <Pressable onPress={openActionSheet} className="border border-gray-300 rounded-md px-4 py-3">
            <Text className="text-gray-500">{value?.label || placeholder}</Text>
        </Pressable>
    )
}

export default Dropdown;