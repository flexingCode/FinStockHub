import { Text, TouchableOpacity } from "react-native";

interface ButtonProps {
    title: string;
    onPress: () => void;
    className?: string;
}

const Button = (props: ButtonProps) => {
    const { title, onPress, className } = props;
    return (
        <TouchableOpacity onPress={onPress} className={`bg-blue-500 rounded-md px-2 py-4 ${className}`}>
            <Text className="text-white text-center font-bold">{title}</Text>
        </TouchableOpacity>
    )
}

export default Button;