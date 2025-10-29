import UserProfile from "@/components/UserProfile";
import MainLayout from "@/layouts/MainLayout";
import { useMemo } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

/**
 * Higher-order component that wraps a component with MainLayout
 * @param Component - The component to wrap
 * @returns A wrapped component with MainLayout
 */
const withMainLayout = <P extends object>(
    Component: React.ComponentType<P>
) => {
    const UserProfileMemo = useMemo(() => <UserProfile />, []);
    
    return (props: P) => (
        <MainLayout>
            <SafeAreaView className="flex-1 bg-white" edges={['top']}>
                {UserProfileMemo}
                <Component {...props} />
            </SafeAreaView>
        </MainLayout>
    );
};

export default withMainLayout;