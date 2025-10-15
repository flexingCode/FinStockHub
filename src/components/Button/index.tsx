import { Text, TouchableOpacity } from "react-native";

interface ButtonProps {
    title: string;
    onPress: () => void;
}

const Button = (props: ButtonProps) => {
    const { title, onPress } = props;
    return (
        <TouchableOpacity onPress={onPress} className="bg-blue-500 rounded-md px-2 py-4">
            <Text className="text-white text-center font-bold">{title}</Text>
        </TouchableOpacity>
    )
}

export default Button;