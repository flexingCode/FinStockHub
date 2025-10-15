import { TextInput } from "react-native";

interface InputProps {
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
}


const Input = (props: InputProps) => {
    const { placeholder, value, onChangeText } = props;
    return (
        <TextInput
            placeholder={placeholder}
            value={value}
            onChangeText={onChangeText}
            className="border border-gray-300 rounded-md px-2 py-4"
        />
    )
}

export default Input;