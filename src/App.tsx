import AppStack from '@/stacks/AppStack';
import Providers from "./Providers";

export default function App() {
  return (
    <Providers>
      <AppStack />
    </Providers>
  );
}