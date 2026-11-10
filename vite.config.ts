/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],

  resolve: {
    // styled-components MUST resolve to a single instance. Two copies in one app
    // means two stylesheets and two theme contexts, and every cake& component
    // silently loses its theme — no error, it just renders unstyled. react and
    // react-dom are here for the same class of failure (duplicate hook
    // dispatchers). This matters as soon as you add a dependency that brings its
    // own copy along, which is why it is set up front rather than after a bug.
    dedupe: ['styled-components', 'react', 'react-dom'],
  },

  // host true → 0.0.0.0 so both localhost and 127.0.0.1 work (Windows IPv6 localhost
  // alone can leave 127.0.0.1 refusing while the Cursor browser prefers IPv4).
  server: { host: true, port: 5174, strictPort: true, open: true },

  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    css: true,
    server: {
      deps: {
        inline: ['@cake-admin/cakeand'],
      },
    },
  },
});
