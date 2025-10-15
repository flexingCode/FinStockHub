import AppStack from '@/stacks/AppStack';
import Providers from "./Providers";
import '@/sheets'; // Registrar todos los ActionSheets

export default function App() {
  return (
    <Providers>
      <AppStack />
    </Providers>
  );
}