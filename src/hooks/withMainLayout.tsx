import MainLayout from "@/layouts/MainLayout"

const withMainLayout = (Component: React.ComponentType<any>) => {
    return (props: any) => (
        <MainLayout>
            <Component {...props} />
        </MainLayout>
    )
}

export default withMainLayout