import UserProfile from "@/components/UserProfile"
import MainLayout from "@/layouts/MainLayout"
import { SafeAreaView } from "react-native-safe-area-context"

const withMainLayout = (Component: React.ComponentType<any>) => {
    return (props: any) => (
        <MainLayout>
            <SafeAreaView className="flex-1 bg-white" edges={['top']}>
                <UserProfile />
                <Component {...props} />
            </SafeAreaView>
        </MainLayout>
    )
}

export default withMainLayout