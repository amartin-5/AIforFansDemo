import { CakeProvider } from '@cake-admin/cakeand';
import { AppShell } from './components/AppShell';
import { GlobalScrollbar } from './styles/GlobalScrollbar';

export default function App() {
  // Must match data-theme on <html> in index.html (dark shell from Figma).
  return (
    <CakeProvider mode="dark.a">
      <GlobalScrollbar />
      <AppShell />
    </CakeProvider>
  );
}
