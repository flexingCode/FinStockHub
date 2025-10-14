import WebSocketProvider from "@/providers/WebSocketProvider"
import { SafeAreaView } from "react-native-safe-area-context"

interface MainLayoutProps {
    children: React.ReactNode
}

const MainLayout = ({ children }: MainLayoutProps) => {
    return (
        <SafeAreaView className="flex-1 bg-white">
            <WebSocketProvider>
                {children}
            </WebSocketProvider>
        </SafeAreaView>


    )
}

export default MainLayout