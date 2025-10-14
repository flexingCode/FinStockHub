import WebSocketProvider from "@/providers/WebSocketProvider"
import { View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

interface MainLayoutProps {
    children: React.ReactNode
}

const MainLayout = ({ children }: MainLayoutProps) => {
    return (
        <SafeAreaView className="flex-1 bg-white">
            <WebSocketProvider>
                <View className="flex-1 pt-4 px-4">
                    {children}
                </View>
            </WebSocketProvider>
        </SafeAreaView>


    )
}

export default MainLayout