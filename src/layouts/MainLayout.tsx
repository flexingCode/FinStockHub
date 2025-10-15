import WebSocketProvider from "@/providers/WebSocketProvider"
import { View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import UserProfile from "@/components/UserProfile"

interface MainLayoutProps {
    children: React.ReactNode
}

const MainLayout = ({ children }: MainLayoutProps) => {
    return (
        <WebSocketProvider>
            <View className="flex-1">
                <View className="flex-1 pt-4 px-4">
                    {children}
                </View>
            </View>
        </WebSocketProvider>
    )
}

export default MainLayout