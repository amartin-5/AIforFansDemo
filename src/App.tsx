import { CakeProvider } from '@cake-admin/cakeand';
import { AppShell } from './components/AppShell';

export default function App() {
  // Must match data-theme on <html> in index.html (dark shell from Figma).
  return (
    <CakeProvider mode="dark.a">
      <AppShell />
    </CakeProvider>
  );
}
