import UserProfile from "@/components/UserProfile";
import MainLayout from "@/layouts/MainLayout";
import { useMemo } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const withMainLayout = (Component: React.ComponentType<any>) => {
    const UserProfileMemo = useMemo(() => <UserProfile />, []);
    
    return (props: any) => (
        <MainLayout>
            <SafeAreaView className="flex-1 bg-white" edges={['top']}>
                {UserProfileMemo}
                <Component {...props} />
            </SafeAreaView>
        </MainLayout>
    )
}

export default withMainLayout